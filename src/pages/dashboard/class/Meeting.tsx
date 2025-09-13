import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
    Box,
    Avatar,
    Badge,
    IconButton,
    Typography,
    Paper,
    Divider,
    TextField,
    Button,
    Tooltip,
    Chip,
    Collapse,
    Fab,
} from "@mui/material";
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
    ScreenShare as ScreenShareIcon,
    PresentToAll as PresentIcon,
    PanTool as HandIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
    CallEnd as CallEndIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import TeacherApiService from "../teacher/teacherApiService";
import { useProfileData } from "../../../context/profileDataContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export type Participant = {
    id: string;
    name: string;
    role: "Teacher" | "Student";
    isLocal?: boolean;
    muted?: boolean;
    videoOn?: boolean;
    raisedHand?: boolean;
    avatarColor?: string;
    isSpeaking?: boolean;
    stream?: MediaStream;
};

type SignalingMessage = {
    type: string;
    from: string;
    to?: string;
    payload?: any;
    roomId?: string;
};

// WebRTC Configuration
const rtcConfig: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.stunprotocol.org:3478' },
        { urls: 'stun:stun.voiparound.com' },
        { urls: 'stun:stun.voipbuster.com' },
        {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject',
        },
    ],
};

const MeetingRoom: React.FC = () => {
    // User and room configuration (you should get these from props/context/auth)
    const { name, email, userType } = useProfileData();
    const userId: string = email ?? `guest_${Math.random().toString(36).substring(2, 9)}`;
    const userName: string = name ?? "Guest";
    const userRole: "Teacher" | "Student" = userType === "Teacher" ? "Teacher" : "Student";
    const { classId } = useParams();
    const roomId = classId as string;
    const location = useLocation();
    const passedClass = location.state?.classData;
    const navigate = useNavigate();

    // UI state (keeping all your original state)
    const [participants, setParticipants] = useState<Participant[]>([]);
    const localStreamRef = useRef<MediaStream | null>(null);
    const [sharedStream, setSharedStream] = useState<MediaStream | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [videoOn, setVideoOn] = useState<boolean>(true);
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [participantsOpen, setParticipantsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Array<{ fromId: string; text: string; ts: number }>>([]);

    const messageRef = useRef<HTMLInputElement | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);   // âœ… Correct type
    const sharedVideoRef = useRef<HTMLVideoElement | null>(null);

    // WebRTC and PubSub state
    const pubSubClientRef = useRef<WebPubSubClient | null>(null);
    const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

    const setPubSubClientWithLogging = useCallback((client: WebPubSubClient | null) => {
        console.log("ðŸ”„ setPubSubClient called with:", client ? "CLIENT" : "NULL");
        console.trace("ðŸ“ setPubSubClient stack trace:");
        pubSubClientRef.current = client;
    }, []);

    // User and room configuration (you should get these from props/context/auth)

    // Should come from auth/user context

    const localParticipant = useMemo(() => {
        console.log("ðŸ”„ Recalculating localParticipant memo with participants:", participants);
        const local = participants.find((p) => p.isLocal);
        console.log("ðŸŽ¯ Found local participant:", local);
        return local;
    }, [participants]);

    // Initialize Azure Web PubSub connection
    useEffect(() => {
        console.log("console log 1");
        const initializePubSub = async () => {
            if (!pubSubClientRef.current) {
                try {
                    const response = await TeacherApiService.getMeetingToken();
                    const client = new WebPubSubClient(response.url);

                    client.on("connected", async (e) => {
                        console.log("ðŸŸ¢ Connected to Azure Web PubSub", e);

                        // Join the room
                        await client.joinGroup(roomId);
                        console.log("ðŸ  Joined room:", roomId);

                        // Send user-joined message directly using the client instance
                        const joinMessage = {
                            type: "user-joined",
                            from: userId,
                            payload: {
                                name: userName,
                                role: userRole,
                                muted: isMuted,
                                videoOn: videoOn,
                                raisedHand: false,
                            },
                            roomId,
                        };

                        try {
                            console.log("ðŸ“¤ Sending user-joined message:", joinMessage);
                            await client.sendToGroup(roomId, JSON.stringify(joinMessage), "text");
                            console.log("âœ… User-joined message sent successfully");

                            setTimeout(async () => {
                                const discoveryMessage = {
                                    type: "request-participant-list",
                                    from: userId,
                                    roomId,
                                };
                                await client.sendToGroup(roomId, JSON.stringify(discoveryMessage), "text");
                                console.log("ðŸ“‹ Requested participant list");
                            }, 500); // Small delay to let join message propagate first
                        } catch (error) {
                            console.error("âŒ Failed to send user-joined message:", error);
                        }
                    });

                    client.on("disconnected", (e) => {
                        console.log("ðŸ”´ Disconnected:", e);

                        // The client might become invalid after disconnect
                        // Add auto-reconnect logic
                        setTimeout(() => {
                            console.log("ðŸ”„ Attempting to reconnect...");
                            // Re-initialize the connection
                        }, 1000);
                    })

                    client.on("group-message", (e) => {
                        if (e.message.dataType === "text") {
                            const parsedMessage = JSON.parse(e.message.data as string);
                            handleSignalingMessage(parsedMessage);
                        }
                    });

                    client.on("stopped", (e) => {
                        console.log("ðŸ›‘ Client stopped:", e);
                    });

                    console.log("ðŸš€ Starting PubSub client...");
                    await client.start();
                    console.log("âœ… PubSub client started");

                    setPubSubClientWithLogging(client);
                } catch (error) {
                    console.error("âŒ Failed to initialize PubSub:", error);
                    setPubSubClientWithLogging(null);
                }
            }
        };

        initializePubSub();

        return () => {
            if (pubSubClientRef.current) {
                console.log("ðŸ§¹ Cleaning up PubSub client");
                pubSubClientRef.current.stop();
            }
        };
    }, [userId, userName, userRole, roomId]); // Add dependencies

    useEffect(() => {
        console.log("ðŸ“Š pubSubClient state changed:", {
            hasClient: !!pubSubClientRef.current,
            client: pubSubClientRef.current,
            timestamp: Date.now()
        });
    }, [pubSubClientRef.current]);


    // Initialize local media stream
    useEffect(() => {
        console.log("console log 2");
        let cancelled = false;

        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                localStreamRef.current = stream;
                console.log("ðŸŽ¬ LocalStream set in ref:", !!localStreamRef.current);

                // Add local participant
                setParticipants(prev => {
                    const newParticipants = [
                        ...prev.filter(p => !p.isLocal),
                        {
                            id: userId,
                            name: userName,
                            role: userRole,
                            isLocal: true,
                            muted: isMuted,
                            videoOn: videoOn,
                            raisedHand: false,
                            avatarColor: "#1976d2",
                            isSpeaking: false,
                            stream: stream,
                        }
                    ];

                    console.log("ðŸ†• Adding local participant:");
                    console.log("Previous participants:", prev);
                    console.log("New participants:", newParticipants);
                    console.log("Local participant in new array:", newParticipants.find(p => p.isLocal));

                    return newParticipants;
                });
            } catch (err) {
                console.warn("getUserMedia failed:", err);
            }
        };

        initializeMedia();

        return () => {
            cancelled = true;
        };
    }, []);

    // Attach local stream to video element
    useEffect(() => {
        console.log("console log 4");
        if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    }, [localStreamRef.current]);

    // Attach shared stream to video element
    useEffect(() => {
        console.log("console log 5");
        if (sharedVideoRef.current && sharedStream) {
            sharedVideoRef.current.srcObject = sharedStream;
        }
    }, [sharedStream]);

    // Update local participant state when muted/videoOn changes
    useEffect(() => {
        console.log("console log 6");
        setParticipants((prev) =>
            prev.map((p) => (p.isLocal ? { ...p, muted: isMuted, videoOn: videoOn } : p))
        );

        // Update media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
            localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = videoOn));
        }

        // Broadcast state changes
        if (pubSubClientRef.current) {
            sendSignalingMessage({
                type: "user-state-update",
                from: userId,
                payload: { muted: isMuted, videoOn: videoOn },
                roomId,
            });
        }
    }, [isMuted, videoOn, localStreamRef.current, pubSubClientRef.current]);

    // Add this useEffect to handle localStream changes



    // Send signaling message via PubSub
    const sendSignalingMessage = async (message: SignalingMessage) => {
        console.log("ðŸ”„ sendSignalingMessage called with:", message.type);
        console.log("ðŸ” pubSubClient exists?", !!pubSubClientRef.current);
        console.log("ðŸ” pubSubClient:", pubSubClientRef.current);

        if (!pubSubClientRef.current) {
            console.log("âŒ Cannot send message - client not ready");
            console.log("- pubSubClient:", !!pubSubClientRef.current);
            return;
        }

        try {
            console.log("ðŸ“¤ Sending message to PubSub:", message);
            await pubSubClientRef.current.sendToGroup(roomId, JSON.stringify(message), "text");
            console.log("âœ… Message sent successfully");
        } catch (error) {
            console.error("âŒ Failed to send signaling message:", error);
        }
    };

    // Handle incoming signaling messages
    const handleSignalingMessage = async (message: SignalingMessage) => {
        console.log("ðŸ“¨ Handling message type:", message.type, "from:", message.from);
        if (message.from === userId) return; // Ignore own messages

        switch (message.type) {
            case "user-joined":
                await handleUserJoined(message);
                break;
            case "user-left":
                handleUserLeft(message);
                break;
            case "user-state-update":
                handleUserStateUpdate(message);
                break;
            case "offer":
                await handleOffer(message);
                break;
            case "answer":
                await handleAnswer(message);
                break;
            case "ice-candidate":
                await handleIceCandidate(message);
                break;
            case "chat-message":
                handleChatMessage(message);
                break;
            case "screen-share-start":
                handleScreenShareStart(message);
                break;
            case "screen-share-stop":
                handleScreenShareStop(message);
                break;
            // ðŸ†• NEW: Handle discovery request
            case "request-participant-list":
                // Only respond if we're not the requester and we're fully initialized
                console.log(message, "im in requesting");
                console.log(userId, "im in requesting 1");
                console.log(localParticipant, "im in requesting 2");
                if (message.from !== userId) {
                    console.log("ðŸ“¤ Responding to participant list request from:", message.from);
                    await sendSignalingMessage({
                        type: "participant-info",
                        from: userId,
                        to: message.from, // Direct response
                        payload: {
                            name: userName,
                            role: userRole,
                            muted: isMuted,
                            videoOn: videoOn,
                            raisedHand: localParticipant?.raisedHand || false,
                        },
                        roomId,
                    });
                }
                break;

            // ðŸ†• NEW: Handle participant info response
            case "participant-info":
                // Only process if it's directed to us
                console.log(message, "im in accepting");
                console.log(userId, "im in accepting 1");
                if (message.to === userId) {
                    console.log("ðŸ“¥ Received participant info:", message);
                    const { name, role, muted, videoOn, raisedHand } = message.payload;

                    setParticipants(prev => {
                        if (prev.some(p => p.id === message.from)) return prev;
                        return [...prev, {
                            id: message.from,
                            name,
                            role,
                            muted,
                            videoOn,
                            raisedHand,
                            avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                            isSpeaking: false,
                            isLocal: false,
                        }];
                    });
                }
                break;
            default:
                console.log("Unknown message type:", message.type);
        }
    };

    // WebRTC Peer Connection Management
    const createPeerConnection = async (peerId: string, mediaStream: MediaStream | null): Promise<RTCPeerConnection> => {
        const peerConnection = new RTCPeerConnection(rtcConfig);

        console.log("ðŸŽ¬ Creating peer connection for", peerId);
        console.log("ðŸŽ¬ MediaStream available:", !!mediaStream);
        console.log("ðŸŽ¬ MediaStream tracks:", mediaStream?.getTracks().length || 0);

        // Add tracks if stream is available
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => {
                console.log("âž• Adding track:", track.kind, track.label);
                peerConnection.addTrack(track, mediaStream);
            });
        } else {
            console.log("âš ï¸ No media stream - joining without tracks (will add later if available)");
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            console.log("ðŸ§Š ICE candidate generated for", peerId, event.candidate);
            if (event.candidate) {
                sendSignalingMessage({
                    type: "ice-candidate",
                    from: userId,
                    to: peerId,
                    payload: event.candidate,
                    roomId,
                });
            } else {
                console.log("ðŸ ICE gathering complete for", peerId);
            }
        };

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            console.log("ðŸ“º Received remote track:", remoteStream.getTracks().length, "tracks");
            updateParticipantStream(peerId, remoteStream);
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log(`ðŸ§Š ICE connection state with ${peerId}:`, peerConnection.iceConnectionState);
        };

        peerConnection.onicegatheringstatechange = () => {
            console.log(`ðŸ“¡ ICE gathering state with ${peerId}:`, peerConnection.iceGatheringState);
        };

        peersRef.current.set(peerId, peerConnection);
        return peerConnection;
    };


    // Handle user joined
    const handleUserJoined = async (message: SignalingMessage) => {
        const { name, role, muted, videoOn, raisedHand } = message.payload;
        console.log("ðŸ‘¥ participant joined:", message);

        // Add participant to list
        setParticipants(prev => {
            if (prev.some(p => p.id === message.from)) return prev;
            return [...prev, {
                id: message.from,
                name,
                role,
                muted,
                videoOn,
                raisedHand,
                avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                isSpeaking: false,
            }];
        });

        // Create peer connection with current localStream (could be null)
        console.log("ðŸ”— Creating WebRTC connection for:", message.from, "with stream:", !!localStreamRef.current);
        const peerConnection = await createPeerConnection(message.from, localStreamRef.current);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        sendSignalingMessage({
            type: "offer",
            from: userId,
            to: message.from,
            payload: offer,
            roomId,
        });
    };
    const addTracksToExistingConnections = useCallback((stream: MediaStream) => {
        console.log("🔄 Adding tracks to existing peer connections");

        peersRef.current.forEach((peerConnection, peerId) => {
            console.log("➕ Adding tracks to connection with", peerId);

            // Remove any existing tracks first - FIXED: Cache track before removal
            peerConnection.getSenders().forEach(sender => {
                if (sender.track) {
                    const track = sender.track; // Cache the track before removal
                    peerConnection.removeTrack(sender);
                    console.log("➖ Removed old track:", track.kind); // Use cached track
                }
            });

            // Add new tracks
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
                console.log("➕ Added new track:", track.kind);
            });

            // Create new offer with the updated tracks
            peerConnection.createOffer().then(offer => {
                peerConnection.setLocalDescription(offer);
                sendSignalingMessage({
                    type: "offer",
                    from: userId,
                    to: peerId,
                    payload: offer,
                    roomId,
                });
            }).catch(error => {
                console.error("❌ Failed to create offer:", error);
            });
        });
    }, [userId, roomId]);


    useEffect(() => {
        if (localStreamRef.current) {
            console.log("ðŸŽ¬ LocalStream became available, updating existing connections");
            addTracksToExistingConnections(localStreamRef.current);
        }
    }, [localStreamRef.current, addTracksToExistingConnections]);


    const handleOffer = async (message: SignalingMessage) => {
        const peerId = message.from;

        // Ensure participant exists before creating peer connection
        setParticipants(prev => {
            if (prev.some(p => p.id === peerId)) return prev;

            console.log("ðŸŽ¬ Adding participant from offer:", peerId);
            return [...prev, {
                id: peerId,
                name: peerId.split('@')[0] || "Unknown",
                role: "Student" as const,
                muted: false,
                videoOn: true,
                raisedHand: false,
                avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                isSpeaking: false,
                isLocal: false,
            }];
        });

        let peerConnection = peersRef.current.get(peerId);

        if (!peerConnection) {
            peerConnection = await createPeerConnection(peerId, localStreamRef.current);
        }

        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        sendSignalingMessage({
            type: "answer",
            from: userId,
            to: peerId,
            payload: answer,
            roomId,
        });
    };



    // Handle user left
    const handleUserLeft = (message: SignalingMessage) => {
        const peerId = message.from;

        // Remove participant
        setParticipants(prev => prev.filter(p => p.id !== peerId));

        // Close peer connection
        const peerConnection = peersRef.current.get(peerId);
        if (peerConnection) {
            peerConnection.close();
            peersRef.current.delete(peerId);
        }

        // Remove video element
        remoteVideosRef.current.delete(peerId);
    };

    // Handle user state update
    const handleUserStateUpdate = (message: SignalingMessage) => {
        const { muted, videoOn, raisedHand } = message.payload;

        setParticipants(prev =>
            prev.map(p =>
                p.id === message.from
                    ? { ...p, muted, videoOn, raisedHand }
                    : p
            )
        );
    };


    // Handle WebRTC answer
    const handleAnswer = async (message: SignalingMessage) => {
        console.log("in answer", message);
        const peerConnection = peersRef.current.get(message.from);
        console.log("in answer got connection", peerConnection);
        if (peerConnection) {
            console.log("in answer in connection", peerConnection);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
        }
    };

    // Handle ICE candidate
    const handleIceCandidate = async (message: SignalingMessage) => {
        console.log("ðŸ§Š Received ICE candidate from", message.from, message.payload);
        const peerConnection = peersRef.current.get(message.from);
        if (peerConnection) {
            console.log("ðŸ”— Peer connection state:", peerConnection.signalingState);
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(message.payload));
                console.log("âœ… ICE candidate added successfully");
            } catch (error) {
                console.error("âŒ Error adding received ice candidate:", error);
            }
        } else {
            console.log("âŒ No peer connection found for ICE candidate from", message.from);
        }
    };

    // Handle chat message
    const handleChatMessage = (message: SignalingMessage) => {
        setMessages(prev => [...prev, {
            fromId: message.from,
            text: message.payload.text,
            ts: message.payload.timestamp,
        }]);
    };

    // Handle screen share start
    const handleScreenShareStart = (message: SignalingMessage) => {
        setParticipants(prev =>
            prev.map(p =>
                p.id === message.from ? { ...p, isSharing: true } : p
            )
        );
    };

    // Handle screen share stop
    const handleScreenShareStop = (message: SignalingMessage) => {
        setParticipants(prev =>
            prev.map(p =>
                p.id === message.from ? { ...p, isSharing: false } : p
            )
        );
    };

    // Update participant stream
    const updateParticipantStream = (peerId: string, stream: MediaStream) => {
        console.log("🎬 Updating participant stream for", peerId);
        console.log("🎬 Stream tracks:", stream.getTracks().map(t => `${t.kind}: ${t.label}`));
        console.log("🎬 Stream active:", stream.active);

        setParticipants(prev => {
            console.log("🎬 Current participants before update:", prev.map(p => ({ id: p.id, name: p.name, hasStream: !!p.stream })));

            const updated = prev.map(p => {
                if (p.id === peerId) {
                    console.log("🎬 Found participant to update:", p.name, "assigning stream");
                    return { ...p, stream };
                }
                return p;
            });

            // If participant doesn't exist, add them
            if (!updated.some(p => p.id === peerId)) {
                console.log("🎬 Participant not found, adding them with stream");
                updated.push({
                    id: peerId,
                    name: peerId.split('@')[0] || "Unknown",
                    role: "Student" as const,
                    muted: false,
                    videoOn: true,
                    raisedHand: false,
                    avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                    isSpeaking: false,
                    isLocal: false,
                    stream: stream,
                });
            }

            console.log("🎬 Participants after update:", updated.map(p => ({ id: p.id, name: p.name, hasStream: !!p.stream })));
            return updated;
        });
    };

    // Add this effect to force re-render when streams are updated
    useEffect(() => {
        console.log("🎬 Participants changed, current streams:", participants.map(p => ({
            name: p.name,
            hasStream: !!p.stream,
            streamId: p.stream?.id
        })));
    }, [participants]);



    // UI Action Handlers (keeping all your original logic)
    const toggleMute = () => {
        setIsMuted(v => !v);
    };

    const toggleVideo = async () => {
        if (videoOn) {
            localStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
            setVideoOn(false);
        } else {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                const audioTracks = localStreamRef.current?.getAudioTracks() ?? [];
                const combinedStream = new MediaStream([...newStream.getVideoTracks(), ...audioTracks]);
                localStreamRef.current = combinedStream;
                setVideoOn(true);
            } catch (err) {
                console.error("Error restarting video:", err);
            }
        }
    };

    const toggleChat = () => setChatOpen((s) => !s);

    const toggleParticipants = () => setParticipantsOpen((s) => !s);

    const toggleHandRaise = () => {
        const newRaisedHand = !localParticipant?.raisedHand;

        setParticipants((prev) =>
            prev.map((p) => (p.isLocal ? { ...p, raisedHand: newRaisedHand } : p))
        );

        if (pubSubClientRef.current) {
            sendSignalingMessage({
                type: "user-state-update",
                from: userId,
                payload: { raisedHand: newRaisedHand },
                roomId,
            });
        }
    };

    const sendMessage = (text?: string) => {
        const value = text ?? messageRef.current?.value ?? "";
        if (!value.trim()) return;

        const message = {
            fromId: userId,
            text: value.trim(),
            ts: Date.now(),
        };

        setMessages((m) => [...m, message]);

        if (pubSubClientRef.current) {
            sendSignalingMessage({
                type: "chat-message",
                from: userId,
                payload: {
                    text: value.trim(),
                    timestamp: Date.now(),
                },
                roomId,
            });
        }

        if (messageRef.current) messageRef.current.value = "";
    };

    const toggleScreenShare = async () => {
        if (isSharing) {
            stopSharing();
        } else {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                setSharedStream(displayStream);
                setIsSharing(true);

                // Replace video track in all peer connections
                const videoTrack = displayStream.getVideoTracks()[0];
                peersRef.current.forEach((pc) => {
                    const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                });
                console.log("screen sharing");
                // Broadcast screen share start
                if (pubSubClientRef.current) {
                    console.log("in pubsub screen sharing");
                    sendSignalingMessage({
                        type: "screen-share-start",
                        from: userId,
                        roomId,
                    });
                }

                const stopHandler = () => stopSharing();
                displayStream.getVideoTracks()[0].addEventListener("ended", stopHandler);
            } catch (err) {
                console.warn("Screen share cancelled or failed:", err);
            }
        }
    };

    const stopSharing = () => {
        if (sharedStream) {
            sharedStream.getTracks().forEach((t) => t.stop());
        }
        setSharedStream(null);
        setIsSharing(false);

        // Restore original video track
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            peersRef.current.forEach((pc) => {
                const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });
        }

        // Broadcast screen share stop
        if (pubSubClientRef.current) {
            sendSignalingMessage({
                type: "screen-share-stop",
                from: userId,
                roomId,
            });
        }
    };

    const sortedParticipants = useMemo(() => {
        const local = participants.filter((p) => p.isLocal);
        const teachers = participants.filter((p) => p.role === "Teacher" && !p.isLocal);
        const others = participants.filter((p) => p.role !== "Teacher" && !p.isLocal);
        return [...local, ...teachers, ...others];
    }, [participants]);

    // ParticipantTile component (keeping all your original UI)
    const ParticipantTile: React.FC<{ p: Participant; compact?: boolean }> = ({ p, compact = false }) => {
        const isLocal = p.isLocal === true;
        const teacher = p.role === "Teacher";

        console.log("🎬 Rendering participant:", p.name, "isLocal:", isLocal, "hasStream:", !!p.stream, "videoOn:", p.videoOn);

        return (
            <Paper
                elevation={4}
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    height: compact ? 160 : 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: p.videoOn ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.03))" : undefined,
                    border: teacher ? `3px solid #00bfa5` : p.isSpeaking ? `3px solid #4caf50` : undefined,
                    transition: "all 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 6,
                    },
                }}
            >
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isLocal && localStreamRef.current && p.videoOn ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : !isLocal && p.stream && p.videoOn ? (
                        <video
                            autoPlay
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onLoadedMetadata={() => console.log("🎥 Remote video loaded for", p.name)}
                            onError={(e) => console.error("🚨 Remote video error for", p.name, e)}
                            ref={(el) => {
                                if (el && p.stream) {
                                    console.log("🔗 Attaching stream to video element for", p.name);
                                    console.log("🔗 Stream tracks:", p.stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
                                    console.log("🔗 Video element:", el);

                                    el.srcObject = p.stream;

                                    // Force play
                                    el.play().catch(e => console.error("🚨 Video play failed:", e));
                                }
                            }}
                        />
                    ) : p.videoOn ? (
                        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: p.avatarColor ?? "#1976d2", width: compact ? 56 : 72, height: compact ? 56 : 72, fontSize: compact ? 16 : 20 }}>
                                    {initials(p.name)}
                                </Avatar>
                                {!compact && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>{p.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">Connecting...</Typography>
                                        <Chip size="small" label={teacher ? "Teacher" : "Student"} sx={{ mt: 1 }} />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: "center", p: compact ? 1 : 2 }}>
                            <Avatar sx={{ bgcolor: p.avatarColor ?? "#1976d2", width: compact ? 48 : 64, height: compact ? 48 : 64, mx: "auto", mb: 1 }}>
                                {initials(p.name)}
                            </Avatar>
                            <Typography variant={compact ? "body2" : "subtitle1"} fontWeight={700}>{p.name}</Typography>
                            {!compact && (
                                <Typography variant="caption" color="text.secondary">Camera off</Typography>
                            )}
                        </Box>
                    )}
                </Box>

                <Box sx={{ px: compact ? 1 : 2, py: compact ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "rgba(0,0,0,0.04)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant={compact ? "caption" : "body2"} sx={{ fontWeight: 600 }}>
                            {p.isLocal ? "You" : p.name}
                        </Typography>
                        {p.raisedHand && (
                            <Chip label="✋" size="small" sx={{ bgcolor: "rgba(255,235,59,0.12)", height: compact ? 20 : 24 }} />
                        )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {p.muted ? <MicOffIcon fontSize={compact ? "small" : "medium"} /> : <MicIcon fontSize={compact ? "small" : "medium"} />}
                        {!p.videoOn && <VideocamOffIcon fontSize={compact ? "small" : "medium"} />}
                        {teacher && !compact && (
                            <Chip label="Host" size="small" sx={{ borderRadius: 1, bgcolor: "rgba(0,191,165,0.08)", color: "#00796b", fontWeight: 700 }} />
                        )}
                    </Box>
                </Box>

                {/* Status indicators */}
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {p.muted && (
                        <Tooltip title="Muted">
                            <MicOffIcon sx={{ color: 'error.main', fontSize: 16, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                        </Tooltip>
                    )}
                    {!p.videoOn && (
                        <Tooltip title="Camera off">
                            <VideocamOffIcon sx={{ color: 'grey.500', fontSize: 16, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                        </Tooltip>
                    )}
                    {p.raisedHand && (
                        <Tooltip title="Hand raised">
                            <HandIcon sx={{ color: 'warning.main', fontSize: 16, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                        </Tooltip>
                    )}
                </Box>
            </Paper>
        );
    };




    return (
        <Box sx={{ height: '100vh', display: 'flex', gap: 2, bgcolor: 'background.default', p: 3, position: 'relative', overflow: 'hidden' }}>
            {/* Left/Main: if someone is sharing, show shared content here. Otherwise show grid */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>{passedClass.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Meeting ID: {roomId} {participants.length} participants {!!pubSubClientRef.current}
                        </Typography>
                    </Box>
                </Box>

                {/* If screen is being shared show it prominently */}
                {isSharing && sharedStream ? (
                    <Paper elevation={6} sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                        <video ref={sharedVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                    </Paper>
                ) : (
                    // Video Grid when no one is sharing
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, alignItems: 'stretch', flex: 1 }}>
                        {sortedParticipants.filter(p => !p.isLocal).map((p) => {
                            // ðŸ‘‡ ADD THIS LINE:
                            console.log("ðŸŽ¬ Rendering participant in grid:", p.name, "hasStream:", !!p.stream);
                            return (
                                <ParticipantTile key={p.id} p={p} />
                            );
                        })}
                    </Box>
                )}

                {/* Action Bar */}
                <Paper elevation={8} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, mx: 'auto', p: 2, borderRadius: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                        <IconButton onClick={toggleMute}>{isMuted ? <MicOffIcon /> : <MicIcon />}</IconButton>
                    </Tooltip>

                    <Tooltip title={videoOn ? 'Stop video' : 'Start video'}>
                        <IconButton onClick={toggleVideo}>{videoOn ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                    </Tooltip>

                    <Tooltip title="Raise hand">
                        <IconButton onClick={toggleHandRaise}><HandIcon /></IconButton>
                    </Tooltip>

                    <Tooltip title={isSharing ? 'Stop presenting' : 'Share screen'}>
                        <IconButton onClick={toggleScreenShare}>{isSharing ? <PresentIcon /> : <ScreenShareIcon />}</IconButton>
                    </Tooltip>

                    <Tooltip title="Participants">
                        <IconButton onClick={toggleParticipants}><PeopleIcon /></IconButton>
                    </Tooltip>

                    <Tooltip title="Chat">
                        <IconButton onClick={toggleChat}><ChatIcon /></IconButton>
                    </Tooltip>

                    <Tooltip title="More">
                        <IconButton><MoreVertIcon /></IconButton>
                    </Tooltip>

                    <Fab
                        color="error"
                        size="medium"
                        onClick={() => {
                            // Leave meeting logic
                            if (pubSubClientRef.current) {
                                sendSignalingMessage({
                                    type: "user-left",
                                    from: userId,
                                    roomId,
                                });
                            }
                            // Clean up and navigate away
                            localStreamRef.current?.getTracks().forEach(track => track.stop());
                            sharedStream?.getTracks().forEach(track => track.stop());
                            peersRef.current.forEach(pc => pc.close());
                            if (pubSubClientRef.current) pubSubClientRef.current.stop();
                            if (userRole == "Teacher") {
                                navigate("/dashboard/tea/class");
                            }
                            else {
                                navigate("/dashboard/stu/class");
                            }

                            // or use router
                        }}
                        sx={{ width: 48, height: 48 }}
                    >
                        <CallEndIcon />
                    </Fab>
                </Paper>
            </Box>

            {/* Right column: when sharing show participants; otherwise participants/chat panels */}
            <Box sx={{ width: chatOpen || participantsOpen || isSharing ? 360 : 0, transition: 'width 300ms', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                {/* If sharing, show participants in compact view */}
                {isSharing && (
                    <Paper elevation={6} sx={{ p: 2, borderRadius: 2, flex: 1, overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Participants</Typography>
                            <Chip label={`${participants.length}`} size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {participants.filter(p => !p.isLocal).map((p) => (
                                <ParticipantTile key={p.id} p={p} compact={true} />
                            ))}
                        </Box>
                    </Paper>
                )}

                {/* Participants list - show when not sharing */}
                <Collapse in={participantsOpen && !isSharing} timeout="auto">
                    <Paper elevation={6} sx={{ p: 2, borderRadius: 2, height: '70vh', overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Participants</Typography>
                            <Chip label={`${participants.length}`} size="small" />
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {participants.map((p) => (
                                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, bgcolor: p.isLocal ? 'rgba(25,118,210,0.04)' : undefined }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <Box sx={{ borderRadius: '50%', bgcolor: 'background.paper', p: 0.2 }}>
                                                {p.muted ? (
                                                    <MicOffIcon sx={{ fontSize: 14, color: 'error.main' }} />
                                                ) : (
                                                    <MicIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                                )}
                                            </Box>
                                        }
                                    >
                                        <Avatar sx={{ bgcolor: p.avatarColor ?? '#1976d2' }}>{initials(p.name)}</Avatar>
                                    </Badge>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 700 }}>{p.isLocal ? 'You' : p.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {p.role}{p.raisedHand ? ' â€¢ Raised hand' : ''}{!p.videoOn ? ' â€¢ Camera off' : ''}
                                        </Typography>
                                    </Box>
                                    {p.raisedHand && (
                                        <Tooltip title="Raised hand">
                                            <HandIcon color="warning" />
                                        </Tooltip>
                                    )}
                                    {p.role === 'Teacher' && <Chip size="small" label="Host" sx={{ bgcolor: 'rgba(0,191,165,0.08)', color: '#00796b' }} />}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Collapse>

                {/* Chat panel */}
                <Collapse in={chatOpen && !isSharing} timeout="auto">
                    <Paper elevation={6} sx={{ p: 2, borderRadius: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Chat</Typography>
                            <IconButton size="small" onClick={() => setChatOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, pr: 1 }}>
                            {messages.map((m, i) => {
                                const p = participants.find((x) => x.id === m.fromId);
                                const mine = m.fromId === userId;
                                return (
                                    <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                                        {!mine && p && (
                                            <Avatar sx={{ bgcolor: p.avatarColor ?? '#1976d2', width: 36, height: 36 }}>{initials(p.name)}</Avatar>
                                        )}
                                        <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{mine ? 'You' : p?.name ?? 'Unknown'}</Typography>
                                                {p?.role === 'Teacher' && <Chip label="Teacher" size="small" color="secondary" />}
                                            </Box>
                                            <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: mine ? 'primary.light' : 'grey.100', color: mine ? 'primary.contrastText' : 'text.primary' }}>
                                                {m.text}
                                            </Paper>
                                        </Box>
                                        {mine && (
                                            <Avatar sx={{ bgcolor: localParticipant?.avatarColor ?? '#1976d2', width: 36, height: 36 }}>
                                                {initials('You')}
                                            </Avatar>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <TextField
                                inputRef={messageRef}
                                size="small"
                                placeholder="Write a message..."
                                fullWidth
                                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                            />
                            <Button variant="contained" onClick={() => sendMessage()}>Send</Button>
                        </Box>
                    </Paper>
                </Collapse>
            </Box>

            {/* Small self-preview like Google Meet bottom-right */}
            {localParticipant && (
                <Box sx={{ position: 'fixed', right: 24, bottom: 96, width: 220, height: 140, zIndex: 1400 }}>
                    <Paper elevation={8} sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.900' }}>
                            {localStreamRef.current && videoOn ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Avatar sx={{ bgcolor: localParticipant.avatarColor, width: 64, height: 64, fontSize: 20 }}>
                                    {initials(localParticipant.name)}
                                </Avatar>
                            )}

                            {/* Status indicators */}
                            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                                {isMuted && (
                                    <Tooltip title="Muted">
                                        <MicOffIcon sx={{ color: 'error.main', fontSize: 20, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                                    </Tooltip>
                                )}
                                {!videoOn && (
                                    <Tooltip title="Camera off">
                                        <VideocamOffIcon sx={{ color: 'grey.500', fontSize: 20, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                                    </Tooltip>
                                )}
                                {localParticipant.raisedHand && (
                                    <Tooltip title="Hand raised">
                                        <HandIcon sx={{ color: 'warning.main', fontSize: 20, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }} />
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.7)' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'white' }}>You</Typography>
                            <Box>
                                <IconButton size="small" onClick={toggleMute} sx={{ color: 'white' }}>
                                    {isMuted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                                </IconButton>
                                <IconButton size="small" onClick={toggleVideo} sx={{ color: 'white' }}>
                                    {videoOn ? <VideocamIcon fontSize="small" /> : <VideocamOffIcon fontSize="small" />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default MeetingRoom;

// Helper function
function initials(name?: string): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}
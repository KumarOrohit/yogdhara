'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import HomeApiService from "../pages/home/homeService";
import { useAuth } from "./authContext";

type ProfileDataContextType = {
    name: string | undefined;
    userType: string | undefined;
    email: string | undefined;
    profileImage: string | undefined;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
}

const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { authToken } = useAuth();
    const [name, setName] = useState<string | undefined>(undefined);
    const [userType, setUserType] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const hasFetchedRef = useRef(false);

    // Create a reusable fetch function WITHOUT useCallback
    const fetchUserData = async () => {
        if (!authToken) {
            console.log("No auth token, clearing user data");
            setName(undefined);
            setUserType(undefined);
            setEmail(undefined);
            setProfileImage(undefined);
            hasFetchedRef.current = false;
            return;
        }

        // Don't fetch if we already have data
        if (hasFetchedRef.current) {
            console.log("Already fetched user data, skipping");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Fetching user data...");
            const response = await HomeApiService.getUserBasicInfoService();
            console.log("User data response:", response);
            
            if (response && response.user_type) {
                setEmail(response.email);
                setName(response.name);
                setProfileImage(response.profile_image);
                setUserType(response.user_type);
                hasFetchedRef.current = true;
            } else {
                console.error("Invalid response format:", response);
                throw new Error("Invalid user data response");
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setName(undefined);
            setUserType(undefined);
            setEmail(undefined);
            setProfileImage(undefined);
            hasFetchedRef.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch - only when authToken changes
    useEffect(() => {
        console.log("Auth token changed to:", authToken);
        hasFetchedRef.current = false; // Reset fetched state when authToken changes
        fetchUserData();
    }, [authToken]); // Only depend on authToken

    // Listen for auth changes from other components
    useEffect(() => {
        const handleAuthChange = () => {
            console.log("Auth change detected, resetting fetch state");
            hasFetchedRef.current = false;
            fetchUserData(); // Call directly instead of relying on dependencies
        };

        window.addEventListener('localStorageAccesChange', handleAuthChange);
        return () => {
            window.removeEventListener('localStorageAccesChange', handleAuthChange);
        };
    }, []);

    // Refresh function that can be called manually
    const refreshProfile = async () => {
        console.log("Manual refresh triggered");
        hasFetchedRef.current = false;
        await fetchUserData();
    };

    return (
        <ProfileDataContext.Provider value={{ 
            name, 
            userType, 
            email, 
            profileImage, 
            isLoading,
            refreshProfile 
        }}>
            {children}
        </ProfileDataContext.Provider>
    );
};

export const useProfileData = () => {
    const context = useContext(ProfileDataContext);
    if (!context) throw new Error('useProfileData must be used within an ProfileDataProvider');
    return context;
}
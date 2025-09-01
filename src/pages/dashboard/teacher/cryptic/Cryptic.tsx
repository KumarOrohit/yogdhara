import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Fade,
  Zoom
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  AutoAwesome,
  Schedule,
  Group,
  Spa
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'batch_creation' | 'class_creation' | 'query_response';
  data?: any;
}

const AIAssistantChat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your Yoga AI Assistant Cryptic. How can I help you today? I can create batches, schedule classes, answer yoga-related questions, or help manage your platform.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateAIResponse(inputText);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let response: Message;

    if (lowerInput.includes('create batch') || lowerInput.includes('new batch')) {
      response = {
        id: Date.now().toString(),
        text: "I'll create a new batch for you!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'batch_creation',
        data: {
          batchName: "Morning Yoga Flow",
          level: "Intermediate",
          time: "6:00 AM - 7:00 AM",
          days: ["Mon", "Wed", "Fri"],
          students: 15
        }
      };
    } else if (lowerInput.includes('schedule class') || lowerInput.includes('new class')) {
      response = {
        id: Date.now().toString(),
        text: "I've scheduled a new class for you!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'class_creation',
        data: {
          className: "Advanced Ashtanga",
          date: new Date(Date.now() + 86400000).toLocaleDateString(),
          time: "8:00 AM - 9:30 AM",
          duration: "90 minutes",
          maxParticipants: 20
        }
      };
    } else if (lowerInput.includes('yoga') && lowerInput.includes('question')) {
      response = {
        id: Date.now().toString(),
        text: "Here's some information about yoga based on your question:",
        sender: 'ai',
        timestamp: new Date(),
        type: 'query_response',
        data: {
          topic: "Yoga Philosophy",
          answer: "The word 'yoga' comes from the Sanskrit root 'yuj', which means 'to yoke' or 'to unite'. Traditional yoga practice aims to unite body, mind, and spirit through physical postures (asanas), breathing techniques (pranayama), and meditation.",
          resources: ["The Yoga Sutras of Patanjali", "Light on Yoga by B.K.S. Iyengar"]
        }
      };
    } else {
      response = {
        id: Date.now().toString(),
        text: "I'm here to help you manage your yoga platform. You can ask me to create batches, schedule classes, or answer any yoga-related questions. What would you like to do?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
    }

    setMessages(prev => [...prev, response]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    
    return (
      <Fade in={true} key={message.id}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isAI ? 'flex-start' : 'flex-end',
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isAI ? 'row' : 'row-reverse',
              alignItems: 'flex-start',
              maxWidth: '80%'
            }}
          >
            <Avatar
              sx={{
                bgcolor: isAI ? theme.palette.secondary.main : theme.palette.primary.main,
                mx: 1
              }}
            >
              {isAI ? <SmartToy /> : <Person />}
            </Avatar>
            
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: isAI 
                  ? alpha(theme.palette.secondary.light, 0.1) 
                  : alpha(theme.palette.primary.light, 0.1),
                border: `1px solid ${isAI 
                  ? alpha(theme.palette.secondary.main, 0.2) 
                  : alpha(theme.palette.primary.main, 0.2)
                }`,
                borderRadius: isAI 
                  ? '20px 20px 20px 5px' 
                  : '20px 20px 5px 20px'
              }}
            >
              {message.type === 'text' && (
                <Typography variant="body1">{message.text}</Typography>
              )}
              
              {message.type === 'batch_creation' && (
                <Zoom in={true}>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AutoAwesome sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="body1" fontWeight="500">
                        Batch Created Successfully!
                      </Typography>
                    </Box>
                    <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.light, 0.1), mb: 1 }}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {message.data.batchName}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                          <Chip label={message.data.level} size="small" color="primary" />
                          <Chip label={message.data.time} size="small" variant="outlined" />
                          <Chip icon={<Group />} label={`${message.data.students} students`} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="body2">
                          Days: {message.data.days.join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Typography variant="body2" color="text.secondary">
                      The batch has been added to your dashboard. Students can now enroll.
                    </Typography>
                  </Box>
                </Zoom>
              )}
              
              {message.type === 'class_creation' && (
                <Zoom in={true}>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Schedule sx={{ color: theme.palette.info.main, mr: 1 }} />
                      <Typography variant="body1" fontWeight="500">
                        Class Scheduled!
                      </Typography>
                    </Box>
                    <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.info.light, 0.1), mb: 1 }}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {message.data.className}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                          <Chip label={message.data.date} size="small" color="info" />
                          <Chip label={message.data.time} size="small" variant="outlined" />
                          <Chip label={message.data.duration} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="body2">
                          Max participants: {message.data.maxParticipants}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Typography variant="body2" color="text.secondary">
                      Notifications have been sent to your students. You can manage this class in your schedule.
                    </Typography>
                  </Box>
                </Zoom>
              )}
              
              {message.type === 'query_response' && (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Spa sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    <Typography variant="body1" fontWeight="500">
                      {message.data.topic}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {message.data.answer}
                  </Typography>
                  <Typography variant="caption" display="block" fontWeight="500">
                    Recommended Resources:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {message.data.resources.map((resource: string, index: number) => (
                      <li key={index}>
                        <Typography variant="caption">{resource}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              
              <Typography variant="caption" display="block" textAlign="right" mt={1} color="text.secondary">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Fade>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
          <SmartToy />
        </Avatar>
        <Box>
          <Typography variant="h6">Cryptic</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Here to help with your yoga platform needs
          </Typography>
        </Box>
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflow: 'auto',
          bgcolor: alpha(theme.palette.background.default, 0.5),
          backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, mx: 1 }}>
              <SmartToy />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.secondary.light, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                borderRadius: '20px 20px 20px 5px',
                minWidth: '100px'
              }}
            >
              <Box display="flex" alignItems="center">
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 3
                      }
                    }} 
                  />
                </Box>
                <Typography variant="caption">Thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper'
        }}
      >
        <Box display="flex">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me to create a batch, schedule a class, or ask a yoga question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                pr: 1
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isLoading}
            sx={{ ml: 1 }}
          >
            <Send />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Try: "Create a new batch for intermediate yoga" or "Schedule a class for next Monday"
        </Typography>
      </Box>
    </Paper>
  );
};

export default AIAssistantChat;
import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Divider
} from '@mui/material';

const Chats = ({ token, userId }) => {
    const [messages, setMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [newMessage, setNewMessage] = useState('');

    // Fetch all messages
    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:4000/user/messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (err) {
            console.error('Error fetching messages:', err.message);
        }
    }, [token]);

    // Fetch user data
    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:4000/user/getdata', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userNameMap = data.userData.reduce((acc, user) => {
                    acc[user._id] = user.userName;
                    return acc;
                }, {});
                setUserNames(userNameMap);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (err) {
            console.error('Error fetching user data:', err.message);
        }
    }, [token]);

    // Set up the interval to periodically fetch messages
    useEffect(() => {
        fetchMessages();
        fetchUserData();

        const intervalId = setInterval(() => {
            fetchMessages();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchMessages, fetchUserData]);

    // Group messages by sender/receiver ID
    useEffect(() => {
        const grouped = messages.reduce((acc, message) => {
            const senderId = message.sender._id;
            const receiverId = message.receiver._id;

            const groupId = senderId === userId ? receiverId : senderId;

            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push(message);
            return acc;
        }, {});

        setGroupedMessages(grouped);
    }, [messages, userId]);

    // Handle opening chat history
    const handleOpenChat = (userId) => {
        setSelectedUserId(userId);
        setChatHistory(groupedMessages[userId] || []);
    };

    // Close chat dialog
    const handleCloseChat = () => {
        setSelectedUserId(null);
        setChatHistory([]);
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:4000/user/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: newMessage,
                    receiver: selectedUserId,
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            } else {
                console.error('Failed to send message');
            }
        } catch (err) {
            console.error('Error sending message:', err.message);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Chats
            </Typography>
            <List>
                {Object.keys(groupedMessages).map((userId) => (
                    <ListItem
                        button
                        key={userId}
                        onClick={() => handleOpenChat(userId)}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            marginBottom: '8px',
                        }}
                    >
                        <ListItemText primary={userNames[userId] || 'User'} />
                    </ListItem>
                ))}
            </List>

            {/* Dialog for chat history */}
            <Dialog open={Boolean(selectedUserId)} onClose={handleCloseChat}>
                <DialogTitle>Chat History</DialogTitle>
                <DialogContent>
                    {chatHistory.length === 0 ? (
                        <Typography>No messages found.</Typography>
                    ) : (
                        chatHistory.map((msg, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText primary={msg.message} secondary={msg.sender.userName} />
                                </ListItem>
                                {index < chatHistory.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                    <TextField
                        label="Type your message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChat} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleSendMessage} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Chats;

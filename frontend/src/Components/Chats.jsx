import React, { useEffect, useState } from 'react';
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
    Grid,
} from '@mui/material';

const Chats = ({ token, userId }) => {
    const [messages, setMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [newMessage, setNewMessage] = useState('');

    // Fetch all messages
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:4000/user/messages', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.error(err.message);
        }
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:4000/user/getdata', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            const userNameMap = data.userData.reduce((acc, user) => {
                acc[user._id] = user.userName;
                return acc;
            }, {});
            setUserNames(userNameMap);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchMessages(); // Fetch messages on component mount
        fetchUserData(); // Fetch user data on component mount
    }, [token,selectedUserId]);

    // Group messages by sender ID
    useEffect(() => {
        const grouped = messages.reduce((acc, message) => {
            const senderId = message.sender._id;
            if (!acc[senderId]) {
                acc[senderId] = [];
            }
            acc[senderId].push(message);
            return acc;
        }, {});
        setGroupedMessages(grouped);
    }, [messages]);

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
        if (!newMessage.trim()) return; // Prevent sending empty messages

        try {
            const response = await fetch('http://localhost:4000/user/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: newMessage,
                    receiver: selectedUserId, // The ID of the user receiving the message
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Clear the input and refresh chat history
            setNewMessage('');
            setChatHistory((prev) => [
                ...prev,
                { message: newMessage, senderId: userId, _id: new Date().getTime() }, // Add the new message to chat history
            ]);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Chats
            </Typography>
            <List>
                {Object.keys(groupedMessages).map((userId) => (
                    <ListItem button key={userId} onClick={() => handleOpenChat(userId)} sx={{
                        border: '1px solid #e0e0e0', // Add border to list items
                        borderRadius: '8px', // Add border radius for rounded corners
                        marginBottom: '8px', // Add some spacing between list items
                    }}>
                        <ListItemText primary={`${userNames[userId] || 'User'}`} />
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
                        chatHistory.map((msg) => (
                            <Box key={msg._id} sx={{ mb: 1 }}>
                                <Grid container alignItems="center">
                                    {msg.senderId === userId ? (
                                        // Message sent by admin
                                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: '#e0e0e0',
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    display: 'inline-block',
                                                    maxWidth: '70%',
                                                    boxShadow: 1, // Add shadow for depth
                                                }}
                                            >
                                                <Typography variant="body1">{msg.message}</Typography>
                                            </Box>
                                        </Grid>
                                    ) : (
                                        // Message received by admin
                                        <Grid item xs={12}>
                                            <Box
                                                sx={{
                                                    backgroundColor: '#3f51b5',
                                                    color: 'white',
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    display: 'inline-block',
                                                    maxWidth: '70%',
                                                    boxShadow: 1, // Add shadow for depth
                                                }}
                                            >
                                                <Typography variant="body1">{msg.message}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        ))
                    )}
                    {/* Input for sending a new message */}
                    <TextField
                        label="Type your message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined" // Use outlined variant for better visibility
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
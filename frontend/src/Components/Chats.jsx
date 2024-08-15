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
    setInterval(async ()=>{
        try{

            const response = await fetch('http://localhost:4000/user/messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                if(messages.length!==data.length)
                    fetchMessages();
                // setChatHistory(groupedMessages[selectedUserId] || []);
            }
        }catch(e){
            console.log(e)
        }
      },1000);
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
            const receiverId = message.receiver._id;
    
            // Determine the correct grouping ID
            const groupId = (senderId === userId) ? receiverId : senderId;
    
            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push(message);
            return acc;
        }, {});
        console.log(grouped,"new grouped");
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
            fetchMessages();
            setChatHistory(groupedMessages[selectedUserId] || []);
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
                        chatHistory.map((msg, index) => (
                            <React.Fragment key={index}>
                              <ListItem>
                                <ListItemText primary={msg.message} secondary={msg.sender.userName} />
                              </ListItem>
                              {index < chatHistory.length - 1 && <Divider />}
                            </React.Fragment>
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
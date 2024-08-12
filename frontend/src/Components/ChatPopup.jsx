import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatPopup = ({ onClose, userId, token }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch chat history for the user
  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/messages', {
        headers: {
          Authorization: `Bearer ${token}`, // Use the provided token for authentication
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      setMessages(data); // Assuming the API returns messages
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory(); // Fetch chat history when the component mounts
  }, [token]);

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const response = await fetch('http://localhost:4000/user/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Use the provided token for authentication
          },
          body: JSON.stringify({
            message,
            receiver: 'admin', // Sending message to admin
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        // Append the new message to the chat history
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: userId,
            receiver: 'admin',
            message,
            isAdmin: false, // Indicates the message is sent by the user
          },
        ]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        width: 300,
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Chat with Admin</Typography>
        <IconButton onClick={onClose} color="error">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        id="chat-box"
        sx={{ maxHeight: 200, overflowY: 'auto', mb: 1 }}
      >
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Grid container alignItems="center">
              {msg.sender === userId ? (
                // Message sent by user
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Box
                    sx={{
                      backgroundColor: '#e0e0e0',
                      color: 'text.primary',
                      borderRadius: '12px',
                      padding: '8px',
                      maxWidth: '70%',
                      display: 'inline-block',
                    }}
                  >
                    {msg.message}
                  </Box>
                </Grid>
              ) : (
                // Message sent by admin
                <Grid item xs={12}>
                  <Box
                    sx={{
                      backgroundColor: '#3f51b5',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '8px',
                      maxWidth: '70%',
                      display: 'inline-block',
                    }}
                  >
                    {msg.message}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
      </Box>
      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <IconButton onClick={handleSendMessage} color="primary" aria-label="send">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatPopup;
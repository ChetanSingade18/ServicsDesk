import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, TextField, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatPopup = ({ onClose, userId, token }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:4000/user/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (messages.length !== data.length) {
            fetchMessages();
          }
        }
      } catch (error) {
        console.error('Error in interval fetch:', error);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchMessages, messages.length]);


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
          receiver: 'admin', // Sending message to admin
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
        console.log(messages) // Update messages with the new message
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 75,
        right: 0,
        width: 300,
        height: '60vh',
        maxHeight: '60vh',
        margin: 2,
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1, borderBottom: '1px solid #ddd' }}>
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 1 }}>
          <List>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              messages.map((msg, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText primary={msg.message} secondary={msg.sender.userName} />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, borderTop: '1px solid #ddd' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            sx={{ marginRight: 1 }}
          />
          <IconButton onClick={handleSendMessage} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPopup;

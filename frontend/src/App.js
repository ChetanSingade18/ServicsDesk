import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardComponent from './pages/Dashboard/Dashboard'; // Import your Dashboard component
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeComponent from './pages/Home/Home'; // Import your Home component
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import TicketsComponent from './pages/Tickets/Tickets'; // Import your Tickets component
import Signin from './pages/Signin/Signin'; // Import the Signin component
import Signup from './pages/Signup/Signup'; // Import the Signup component
import ForgotPassword from './pages/Signin/Password/ForgotPassword';
import VerifyOtp from './pages/Signin/Password/VerifyOtp';
import ChatPopup from './Components/ChatPopup'; // Import your ChatPopup component
import Chats from './Components/Chats';

const drawerWidth = 240;

const App = () => {
  const [open, setOpen] = useState(true); // Drawer open state
  const [selectedTab, setSelectedTab] = useState('home'); // State to manage selected tab
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [token, setToken] = useState("asdfghjkjhgfdsasdfghjkjhgfdsasdfghjkjhgfdsa"); // State to store the authentication token
  const [userData, setUserData] = useState({}); // State to store the authentication token
  useEffect(() => {
    const checkLogin = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/tickets/66b90ebde298cf0da090b8fa', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          // console.log(await response.status,await response.statusText);
          if (response.status === 401) {
            setIsLoggedIn(false);
            setToken("asdfghjkjhgfdsasdfghjkjhgfdsasdfghjkjhgfdsa");
          } else {
            setIsLoggedIn(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkLogin();
  }, [token]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleSignin = (data) => {
    setToken(data.token);
    setUserData(data.userData);
    console.log(data);
    setIsLoggedIn(true);
  };

  const handleSignup = (data) => {
    setIsLoggedIn(false);
  };

  const handleSignout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <AppBar
          position="fixed"
          open={open}
          sx={{
            transition: 'width 0.3s ease',
            width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 60px)`,
            ml: open ? `${drawerWidth}px` : '60px',
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Ticket Management System
            </Typography>
            <Box sx={{ flexGrow: 1 }} /> {/* This will push the button to the right */}
            {isLoggedIn && (
              <Button
                color="error" // Set the button color to red
                onClick={handleSignout}
                variant="contained" // Optional: Add variant for better visibility
                sx={{ marginLeft: 2 }} // Optional: Add some space to the left of the button
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <Signin onSignin={handleSignin} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignup={handleSignup} />} />
          <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />} />
          <Route path="/verify-otp" element={isLoggedIn ? <Navigate to="/" /> : <VerifyOtp />} />
          <Route path="/" element={
            isLoggedIn ? (
              <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer
                  variant="permanent"
                  open={open}
                  sx={{
                    width: open ? drawerWidth : 60,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                      width: open ? drawerWidth : 60,
                      backgroundColor: 'var(--drawer-background)',
                      color: 'var(--text-color)',
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  <Toolbar>
                    {open ? (
                      <>
                        <IconButton onClick={handleDrawerToggle}>
                          <ChevronLeftIcon />
                        </IconButton>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            alt={userData.userName} // Use the user's name for accessibility
                            src={userData.profilePicture} // Assuming userData has a profilePicture URL
                            sx={{
                              marginRight: 1, // Add some space to the right of the avatar
                              width: 40, // Set the width of the avatar
                              height: 40 // Set the height of the avatar
                            }} // Add some space to the right of the avatar
                          />
                          <Typography variant="h10" noWrap component="div">
                            Hey, {userData.userName}!
                          </Typography>
                        </div>
                      </>
                    ) : (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                          marginRight: 5,
                          ...(open && { display: 'none' }),
                        }}
                      >
                        <MenuIcon />
                      </IconButton>
                    )}
                  </Toolbar>
                  <Divider />
                  <List>
                    {[
                      { text: 'Home', icon: <HomeIcon />, value: 'home' },
                      { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
                      { text: 'Tickets', icon: <ConfirmationNumberIcon />, value: 'tickets' },
                      ...(userData.role === 'admin' ? [{ text: 'Chats', icon: <ChatIcon />, value: 'chats' }] : []),
                    ].map((item) => (
                      <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          onClick={() => handleTabChange(item.value)}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Drawer>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    transition: 'margin 0.3s ease',
                  }}
                >
                  <Toolbar />
                  {selectedTab === 'home' && <HomeComponent role={userData?.role} userId={userData?._id} token={token} />}
                  {selectedTab === 'dashboard' && <DashboardComponent role={userData?.role} userId={userData?._id} token={token} />}
                  {selectedTab === 'tickets' && <TicketsComponent role={userData?.role} userId={userData?._id} token={token} />}
                  {selectedTab === 'chats' && <Chats role={userData?.role} userName={userData.userName} userId={userData?._id} token={token} />}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup" style={{ marginLeft: '20px' }}>Sign Up</Link>
              </Box>
            )
          } />
        </Routes>
        { userData?.role!=="admin" && <Box sx={{ display: 'flex' }}>
          <Fab
            color="primary"
            aria-label="chat"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => setShowChatPopup(!showChatPopup)}
          >
            <ChatIcon />
          </Fab>
          {showChatPopup && userData?.role!=="admin" && <ChatPopup userId={userData._id} userName={userData.userName} token={token} onClose={() => setShowChatPopup(false)} />}
        </Box>}
      </div>
    </Router>
  );
};

export default App;

// src/Components/ChatPopup.js

// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
// } from '@mui/material';

// const socket = io('http://localhost:4000'); // Replace with your backend URL if different

// const ChatPopup = ({ onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [feedback, setFeedback] = useState('');
//   const [username, setUsername] = useState('anonymous');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.on('chat-message', (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//       setFeedback('');
//     });

//     socket.on('feedback', (data) => {
//       setFeedback(data.feedback);
//     });

//     socket.on('clients-total', (total) => {
//       console.log(`Total clients: ${total}`);
//     });

//     return () => {
//       socket.off('chat-message');
//       socket.off('feedback');
//       socket.off('clients-total');
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const sendMessage = () => {
//     if (message === '') return;
//     const data = {
//       name: username,
//       message,
//       dateTime: new Date(),
//     };
//     socket.emit('message', data);
//     setMessages((prevMessages) => [...prevMessages, data]);
//     setMessage('');
//   };

//   const handleKeyPress = () => {
//     socket.emit('feedback', {
//       feedback: `✍️ ${username} is typing a message...`,
//     });
//   };

//   const handleBlur = () => {
//     socket.emit('feedback', {
//       feedback: '',
//     });
//   };

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 80,
//         right: 16,
//         width: 300,
//         height: 400,
//         backgroundColor: '#fff',
//         boxShadow: 24,
//         borderRadius: 2,
//         p: 2,
//       }}
//     >
//       <Typography variant="h6">Chat Support</Typography>
//       <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//         <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
//           {messages.map((msg, index) => (
//             <ListItem key={index}>
//               <ListItemText
//                 primary={msg.message}
//                 secondary={`${msg.name} • ${new Date(msg.dateTime).toLocaleTimeString()}`}
//               />
//             </ListItem>
//           ))}
//           {feedback && (
//             <ListItem>
//               <ListItemText secondary={feedback} />
//             </ListItem>
//           )}
//           <div ref={messagesEndRef} />
//         </List>
//         <TextField
//           label="Your Name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 1 }}
//         />
//         <TextField
//           label="Type a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           onBlur={handleBlur}
//           variant="outlined"
//           size="small"
//           fullWidth
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={sendMessage}
//           sx={{ mt: 1 }}
//         >
//           Send
//         </Button>
//         <Button
//           variant="text"
//           color="secondary"
//           onClick={onClose}
//           sx={{ mt: 1 }}
//         >
//           Close
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ChatPopup;

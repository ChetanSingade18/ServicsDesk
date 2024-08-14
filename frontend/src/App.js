import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
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
  Avatar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DashboardComponent from "./pages/Dashboard/Dashboard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeComponent from "./pages/Home/Home";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import TicketsComponent from "./pages/Tickets/Tickets";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/Signin/Password/ForgotPassword";
import VerifyOtp from "./pages/Signin/Password/VerifyOtp";
import ChatPopup from "./Components/ChatPopup";
import Chats from "./Components/Chats";

const drawerWidth = 240;

const App = () => {
  const [open, setOpen] = useState(true); // Drawer open state
  const [selectedTab, setSelectedTab] = useState("home"); // State to manage selected tab
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [token, setToken] = useState(
    "asdfghjkjhgfdsasdfghjkjhgfdsasdfghjkjhgfdsa"
  ); // State to store the authentication token
  const [userData, setUserData] = useState({}); // State to store user data

  useEffect(() => {
    const checkLogin = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:4000/tickets/66b90ebde298cf0da090b8fa",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 401) {
            setIsLoggedIn(false);
            setToken("asdfghjkjhgfdsasdfghjkjhgfdsasdfghjkjhgfdsa");
          } else {
            setIsLoggedIn(true);
            const userResponse = await fetch("http://localhost:4000/users/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const user = await userResponse.json();
            setUserData(user);
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
        {/* Conditionally render the AppBar based on login status */}
        {isLoggedIn && (
          <AppBar
            position="fixed"
            open={open}
            sx={{
              transition: "width 0.3s ease",
              width: "100%",
              ml: open ? `${drawerWidth}px` : "60px",
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Ticket Management System
              </Typography>
              <Box sx={{ flexGrow: 1 }} />{" "}
              {/* This will push the button to the right */}
              <Button
                color="error" // Set the button color to red
                onClick={handleSignout}
                variant="contained" // Optional: Add variant for better visibility
                sx={{ marginLeft: 2 }} // Optional: Add some space to the left of the button
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}
        <Routes>
          <Route
            path="/signin"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Signin onSignin={handleSignin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Signup onSignup={handleSignup} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/verify-otp"
            element={isLoggedIn ? <Navigate to="/" /> : <VerifyOtp />}
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Box sx={{ display: "flex" }}>
                  <CssBaseline />
                  <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                      width: open ? drawerWidth : 60,
                      flexShrink: 0,
                      "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : 60,
                        backgroundColor: "var(--drawer-background)",
                        color: "var(--text-color)",
                        transition: "width 0.3s ease",
                        marginTop: "64px",
                      },
                    }}
                  >
                    <Toolbar>
                      {open ? (
                        <>
                          <IconButton onClick={handleDrawerToggle}>
                            <ChevronLeftIcon />
                          </IconButton>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar
                              alt={userData.userName} // Use the user's name for accessibility
                              src={userData.profilePicture} // Assuming userData has a profilePicture URL
                              sx={{
                                marginRight: 1, // Add some space to the right of the avatar
                                width: 40, // Set the width of the avatar
                                height: 40, // Set the height of the avatar
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
                            ...(open && { display: "none" }),
                          }}
                        >
                          <MenuIcon />
                        </IconButton>
                      )}
                    </Toolbar>
                    <Divider />
                    <List>
                      {[
                        { text: "Home", icon: <HomeIcon />, value: "home" },
                        {
                          text: "Dashboard",
                          icon: <DashboardIcon />,
                          value: "dashboard",
                        },
                        {
                          text: "Tickets",
                          icon: <ConfirmationNumberIcon />,
                          value: "tickets",
                        },
                        ...(userData.role === "admin"
                          ? [
                              {
                                text: "Chats",
                                icon: <ChatIcon />,
                                value: "chats",
                              },
                            ]
                          : []),
                      ].map((item) => (
                        <ListItem
                          key={item.text}
                          disablePadding
                          sx={{ display: "block" }}
                        >
                          <ListItemButton
                            onClick={() => handleTabChange(item.value)}
                            sx={{
                              minHeight: 48,
                              justifyContent: open ? "initial" : "center",
                              px: 2.5,
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              sx={{ opacity: open ? 1 : 0 }}
                            />
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
                      transition: "margin 0.3s ease",
                    }}
                  >
                    <Toolbar />
                    {selectedTab === "home" && (
                      <HomeComponent
                        role={userData?.role}
                        userId={userData?._id}
                        token={token}
                      />
                    )}
                    {selectedTab === "dashboard" && (
                      <DashboardComponent
                        role={userData?.role}
                        userId={userData?._id}
                        token={token}
                      />
                    )}
                    {selectedTab === "tickets" && (
                      <TicketsComponent
                        role={userData?.role}
                        userId={userData?._id}
                        token={token}
                      />
                    )}
                    {selectedTab === "chats" && (
                      <Chats
                        role={userData?.role}
                        userName={userData.userName}
                        userId={userData?._id}
                        token={token}
                      />
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <Signin onSignin={handleSignin} />
                  {/* The Signin component will now handle navigation to SignUp, ForgotPassword, etc., if needed */}
                </Box>
              )
            }
          />
        </Routes>
        {isLoggedIn && userData?.role !== "admin" && (
          <Box sx={{ display: "flex" }}>
            <Fab
              color="primary"
              aria-label="chat"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
              }}
              onClick={() => setShowChatPopup(!showChatPopup)}
            >
              <ChatIcon />
            </Fab>
            {showChatPopup && (
              <ChatPopup
                userId={userData._id}
                userName={userData.userName}
                token={token}
                onClose={() => setShowChatPopup(false)}
              />
            )}
          </Box>
        )}
      </div>
    </Router>
  );
};

export default App;

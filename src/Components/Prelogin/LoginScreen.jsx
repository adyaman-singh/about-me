import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginScreen.css"; // Your custom styles
// Import any additional components you need:
import MacWifiIcon from "../path/to/MacWifiIcon";
import BatteryStatus from "../path/to/BatteryStatus";
import ContentHeader from "../path/to/ContentHeader";

const LoginScreen = ({
  onGuestLogin, // Function to call when logging in
  backgroundImage, // URL for background image
  isExiting, // Boolean to control exit animation
}) => {
  // Login handler
  const handleLogin = () => {
    onGuestLogin();
  };

  // Set up keyboard and click listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.code === "Space") {
        handleLogin();
      }
    };

    const handleClick = () => {
      handleLogin();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick, { once: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="login-screen"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          {/* Top menu bar */}
          <div className="top-bar">
            <div className="menu-item" title="Wi-Fi">
              <MacWifiIcon size={16} />
            </div>
            <BatteryStatus />
            <div className="menu-item" title="Current Time">
              <ContentHeader />
            </div>
          </div>

          {/* Date/time display */}
          <div
            className="datetime"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="day-date">
              {new Date()
                .toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
                .replace(",", "")}
            </div>
            <div className="time">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Login prompt */}
          <motion.div
            className="login-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="profile-circle">
              <span className="profile-initial">G</span>
            </div>
            <div className="profile-name">Guest</div>
            <div className="login-prompt">Press Enter to Login</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginScreen;

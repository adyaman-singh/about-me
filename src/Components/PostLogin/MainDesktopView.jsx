import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// Import your custom components:
import DesktopViewPrompt from "../path/to/DesktopViewPrompt";
import Desktop from "../path/to/Desktop";
import Bootscreen from "../path/to/Bootscreen";
import LoginScreen from "../path/to/LoginScreen";
import Spotlight from "../path/to/Spotlight";
import { useSystem } from "../path/to/SystemProvider";
// Import your constants:
import { imageMap, loginAnimation, windowDefault } from "../path/to/constants";

const MainDesktopExperience = () => {
  // State management
  const [darkMode, setDarkMode] = useState(true);
  const [background, setBackground] = useState(null);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootCanComplete, setBootCanComplete] = useState(false);
  const [desktopReady, setDesktopReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isCustomBackground, setIsCustomBackground] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { showSpotlight, setShowSpotlight } = useSystem();
  const [windows, setWindows] = useState(windowDefault);

  // Keyboard shortcut for Spotlight (Cmd/Ctrl + Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        setShowSpotlight((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load random background image
  useEffect(() => {
    const imageFilenames = Object.keys(imageMap);
    const randomFilename = imageFilenames[Math.floor(Math.random() * imageFilenames.length)];
    const imageUrl = imageMap[randomFilename];
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setBackground(imageUrl);
      setDesktopReady(true);
      setBootCanComplete(true);
    };
  }, []);

  // Handle login transition
  useEffect(() => {
    if (loggedIn && desktopReady) {
      const appElement = document.querySelector(".app");
      if (appElement) appElement.classList.add("visible");
    }
  }, [loggedIn, desktopReady]);

  // Window management functions
  const toggleWindow = (windowName) => {
    setWindows(prev => ({ ...prev, [windowName]: !prev[windowName] }));
  };

  const openWindow = (windowName) => {
    setWindows(prev => ({ ...prev, [windowName]: true }));
  };

  // Login handler
  const handleLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLoggedIn(true);
      setIsTransitioning(false);
    }, 500);
  };

  // Boot completion handler
  const handleBootComplete = () => {
    setBootComplete(true);
  };

  return (
    <div
      className={`app ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: isCustomBackground ? "contain" : "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "black",
        zIndex: 500,
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Mobile view prompt */}
      <DesktopViewPrompt />

      {/* Login screen (shown when not logged in) */}
      {!loggedIn && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={loginAnimation}>
          <LoginScreen
            backgroundImage={background}
            onGuestLogin={handleLogin}
            isExiting={isTransitioning}
          />
        </motion.div>
      )}

      {/* Boot screen (shown when not complete) */}
      {!bootComplete && (
        <Bootscreen
          canComplete={bootCanComplete}
          onComplete={handleBootComplete}
        />
      )}

      {/* Main desktop interface */}
      <div style={{ zIndex: 500 }}>
        <Desktop
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setBackground={setBackground}
          windows={windows}
          toggleWindow={toggleWindow}
          openWindow={openWindow}
          setIsCustomBackground={setIsCustomBackground}
          isLoggedIn={loggedIn && !isTransitioning}
        />
      </div>

      {/* Spotlight search (shown when activated) */}
      {showSpotlight && (
        <Spotlight
          onClose={() => setShowSpotlight(false)}
          openWindow={openWindow}
        />
      )}
    </div>
  );
};

export default MainDesktopExperience;
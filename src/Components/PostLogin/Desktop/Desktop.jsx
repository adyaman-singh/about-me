import React from "react";
import { motion } from "framer-motion";
import MenuBar from "../MenuBar/MenuBar";
import DesktopIcons from "../DesktopIcons/DesktopIcons";
import Dock from "../Dock/Dock";
import FinderWindow from "../windows/FinderWindow/FinderWindow";
import PDFWindow from "../windows/PDFWindow/PDFWindow";
import SummaryWindow from "../windows/SummaryWindow/SummaryWindow";
import MapWindow from "../windows/MapWindow/MapWindow";
import BrowserWindow from "../BrowserWindow/BrowserWindow";
import TerminalWindow from "../TerminalWindow/TerminalWindow";
import Notes from "../windows/Notes/Notes";
import ProjectsWindow from "../windows/Projects/Project";

import TechStack from "../windows/My Techstack/Skills";

export default function Desktop({
  darkMode,
  setDarkMode,
  setBackground,
  windows,
  toggleWindow,
  openWindow,
  setIsCustomBackground,
  isLoggedIn,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoggedIn ? 1 : 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
      style={{ zIndex: 500 }}
    >
      <MenuBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openWindow={openWindow}
        setBackground={setBackground}
        setIsCustomBackground={setIsCustomBackground}
      />
      <DesktopIcons toggleWindow={toggleWindow} openWindow={openWindow} />
      {windows?.finder && (
        <FinderWindow
          onClose={() => toggleWindow("finder")}
          darkMode={darkMode}
        />
      )}
      {windows?.pdf && (
        <PDFWindow onClose={() => toggleWindow("pdf")} darkMode={darkMode} />
      )}
      {windows?.summary && (
        <SummaryWindow
          onClose={() => toggleWindow("summary")}
          darkMode={darkMode}
        />
      )}
      {windows?.browser && (
        <BrowserWindow
          onClose={() => toggleWindow("browser")}
          darkMode={darkMode}
        />
      )}
      {windows?.map && (
        <MapWindow onClose={() => toggleWindow("map")} darkMode={darkMode} />
      )}
      {windows?.terminal && (
        <TerminalWindow
          onClose={() => toggleWindow("terminal")}
          darkMode={darkMode}
        />
      )}
      {windows?.notes && (
        <Notes onClose={() => toggleWindow("notes")} darkMode={darkMode} />
      )}
      {windows?.project && (
        <ProjectsWindow
          onClose={() => toggleWindow("project")}
          darkMode={darkMode}
        />
      )}
      {windows?.skills && (
        <TechStack onClose={() => toggleWindow("skills")} darkMode={darkMode} />
      )}
      <Dock openWindow={openWindow} />
    </motion.div>
  );
}

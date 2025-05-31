import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BootScreen.css";
import {
  languages,
  textVariants,
  screenVariants,
  contentVariants,
} from "../../constants";

export default function BootScreen({ canComplete, onComplete }) {
  const [currentText, setCurrentText] = useState(languages[0]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let langIndex = 0;
    const langInterval = setInterval(() => {
      langIndex = (langIndex + 1) % languages.length;
      setCurrentText(languages[langIndex]);
    }, 200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(langInterval);
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => {
      clearInterval(langInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (isComplete && canComplete) {
      const timer = setTimeout(onComplete, 600); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isComplete, canComplete, onComplete]);

  return (
    <AnimatePresence>
      {(!isComplete || !canComplete) && (
        <motion.div
          className="boot-screen"
          initial="visible"
          animate="visible"
          exit="exit"
          variants={screenVariants}
        >
          <motion.div
            className="boot-content"
            variants={contentVariants}
            exit="exit"
          >
            <motion.div
              className="boot-text"
              key={currentText}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.2 }}
            >
              {currentText}
            </motion.div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

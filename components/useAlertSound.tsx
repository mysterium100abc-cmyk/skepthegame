"use client";
import { useEffect, useRef, useState } from "react";

export function useAlertSound(src: string = "/music/alert.mp3") {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.load();
        setReady(true);
      }
    };

    // browsers require a gesture → attach once
    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("touchstart", initAudio, { once: true });

    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("touchstart", initAudio);
    };
  }, [src]);

  const playAlert = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      if (navigator.vibrate) navigator.vibrate(120); // optional mobile buzz
    } catch (err) {
      console.warn("Autoplay blocked:", err);
      // fallback UI → ask user to click a "Play" button
    }
  };

  return { playAlert, ready };
}

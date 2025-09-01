import React, { useEffect, useRef } from "react";

export default function BackgroundMusic({ playing }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playing]);

  return (
    <audio ref={audioRef} loop>
      <source src="/public/musik2.mp3" type="audio/mp3" />
    </audio>
  );
}

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

function VideoPlayer({ hlsUrl }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!hlsUrl) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => video.play());
    }

    return () => {
      if (video) video.src = "";
    };
  }, [hlsUrl]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: "100%", display: "block", borderRadius: 12 }}
    />
  );
}

export default VideoPlayer;

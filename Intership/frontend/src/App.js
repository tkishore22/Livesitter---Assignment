import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "./VedioPlayer";

function App() {
  const [hlsUrl, setHlsUrl] = useState("");
  const [overlays, setOverlays] = useState([]);
  const [text, setText] = useState("");

  // Load overlays
  useEffect(() => {
    axios.get("http://localhost:5000/api/overlays").then((res) => {
      setOverlays(res.data);
    });
  }, []);

  // Add overlay
  const addOverlay = async () => {
    if (!text.trim()) return;
    const res = await axios.post("http://localhost:5000/api/overlays", {
      type: "text",
      content: text,
      x: 50,
      y: 50,
      width: 150,
      height: 50,
    });
    setOverlays([...overlays, res.data]);
    setText("");
  };


  const deleteOverlay = async (id) => {
    await axios.delete(`http://localhost:5000/api/overlays/${id}`);
    setOverlays(overlays.filter((o) => o.id !== id));
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#333" }}>
        LiveSitter Stream + Overlays
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, gap: 10 }}>
        <input
          placeholder="Enter URL"
          value={hlsUrl}
          onChange={(e) => setHlsUrl(e.target.value)}
          style={{
            padding: 10,
            width: "60%",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <button
          onClick={() => setHlsUrl(hlsUrl)}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Load
        </button>
      </div>

      <div style={{ margin: "auto", position: "relative", width: "80%", maxWidth: 800, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
        {hlsUrl ? (
          <VideoPlayer hlsUrl={hlsUrl} />
        ) : (
          <div style={{ padding: 60, textAlign: "center", background: "#000", color: "#fff" }}>
            Enter a video URL above
          </div>
        )}

        {overlays.map((o) => (
          <div
            key={o.id}
            style={{
              position: "absolute",
              top: o.y,
              left: o.x,
              width: o.width,
              height: o.height,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              textAlign: "center",
              lineHeight: o.height + "px",
              borderRadius: 6,
              fontWeight: "bold",
              padding: "0 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {o.content}
            <button
              onClick={() => deleteOverlay(o.id)}
              style={{
                marginLeft: 8,
                fontSize: 12,
                background: "red",
                border: "none",
                borderRadius: 4,
                padding: "2px 5px",
                color: "white",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 10 }}>
        <input
          placeholder="Overlay text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 200,
            fontSize: 16,
          }}
        />
        <button
          onClick={addOverlay}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#28a745",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add Overlay
        </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect, useCallback, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8000";

function VoiceTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const audioContext = useRef(null);
  const processor = useRef(null);
  const audioInput = useRef(null);
  const audioData = useRef([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket Connected");
      setConnectionStatus("Connected");
    },
    onClose: () => {
      console.log("WebSocket Disconnected");
      setConnectionStatus("Disconnected");
      if (isRecording) {
        stopRecording();
      }
    },
    onError: (error) => {
      console.error("WebSocket Error:", error);
      setConnectionStatus("Error");
      if (isRecording) {
        stopRecording();
      }
    },
    shouldReconnect: () => true,
    reconnectInterval: 3000,
    reconnectAttempts: 10,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const result = JSON.parse(lastMessage.data);
        if (result.transcription) {
          setTranscription((prev) => prev + " " + result.transcription);
        }
        if (result.error) {
          console.error("Server error:", result.error);
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    }
  }, [lastMessage]);

  const createWavBlob = (audioData) => {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF"); // RIFF identifier
    view.setUint32(4, 36 + audioData.length * 2, true); // file length
    writeString(view, 8, "WAVE"); // WAVE identifier
    writeString(view, 12, "fmt "); // fmt chunk
    view.setUint32(16, 16, true); // length of fmt chunk
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono channel
    view.setUint32(24, 16000, true); // sample rate
    view.setUint32(28, 16000 * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, "data"); // data chunk
    view.setUint32(40, audioData.length * 2, true); // data chunk length

    // Write audio data
    let offset = 44;
    for (let i = 0; i < audioData.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  const startRecording = useCallback(async () => {
    if (readyState !== ReadyState.OPEN) {
      alert("WebSocket is not connected. Please wait...");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: 16000,
      });

      audioInput.current = audioContext.current.createMediaStreamSource(stream);
      processor.current = audioContext.current.createScriptProcessor(
        4096,
        1,
        1
      );
      audioData.current = [];

      processor.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioData.current = audioData.current.concat(Array.from(inputData));

        // Send chunks every 2 seconds (32000 samples at 16kHz)
        if (audioData.current.length >= 32000) {
          const wavBlob = createWavBlob(audioData.current);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result.split(",")[1];
            sendMessage(JSON.stringify({ audio: base64Audio }));
          };
          reader.readAsDataURL(wavBlob);
          audioData.current = [];
        }
      };

      audioInput.current.connect(processor.current);
      processor.current.connect(audioContext.current.destination);

      setMediaRecorder(stream);
      setIsRecording(true);
      setTranscription("");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone: " + error.message);
    }
  }, [sendMessage, readyState]);

  const stopRecording = useCallback(() => {
    if (isRecording) {
      if (processor.current) {
        processor.current.disconnect();
        audioInput.current.disconnect();
      }
      if (mediaRecorder) {
        mediaRecorder.getTracks().forEach((track) => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
      setIsRecording(false);
      audioData.current = [];
    }
  }, [isRecording, mediaRecorder]);

  const connectionStatusColor = {
    Connected: "green",
    Disconnected: "red",
    Error: "red",
  };

  return (
    <div className="voice-transcription">
      <div
        className="connection-status"
        style={{
          color: connectionStatusColor[connectionStatus],
          marginBottom: "1rem",
        }}
      >
        Status: {connectionStatus}
      </div>
      <div className="controls">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? "recording" : ""}`}
          disabled={readyState !== ReadyState.OPEN}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <div className="transcription">
        <h3>Transcription:</h3>
        <p>{transcription || "No transcription yet..."}</p>
      </div>
    </div>
  );
}

export default VoiceTranscription;

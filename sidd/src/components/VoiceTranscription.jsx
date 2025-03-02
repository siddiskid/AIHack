import { useState, useEffect, useCallback, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "../styles/VoiceTranscription.css";
import PropTypes from "prop-types";

const WS_URL = "ws://localhost:8001";

// Language options
const LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
  ar: "Arabic",
  hi: "Hindi",
};

function VoiceTranscription({ hideMainTitle }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [hideTranscription, setHideTranscription] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("en");
  const [parsedSummary, setParsedSummary] = useState({
    symptoms: [],
    diagnosis: "",
    treatment: [],
  });
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
        if (result.summary) {
          setSummary(result.summary);
          try {
            // Try to parse the summary into structured format
            // This is a simple parsing logic - you might need to adjust based on your actual summary format
            const lines = result.summary.split('\n');
            const newParsedSummary = {
              symptoms: [],
              diagnosis: "",
              treatment: []
            };

            let currentSection = null;

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;

              if (trimmedLine.toLowerCase().includes('symptom')) {
                currentSection = 'symptoms';
              } else if (trimmedLine.toLowerCase().includes('diagnos')) {
                currentSection = 'diagnosis';
              } else if (trimmedLine.toLowerCase().includes('treatment') ||
                trimmedLine.toLowerCase().includes('plan')) {
                currentSection = 'treatment';
              } else if (currentSection) {
                // Extract bullet points (assuming they start with - or *)
                const bulletMatch = trimmedLine.match(/^[-*•]\s*(.+)$/);
                if (bulletMatch && (currentSection === 'symptoms' || currentSection === 'treatment')) {
                  if (currentSection === 'symptoms') {
                    newParsedSummary.symptoms.push(bulletMatch[1]);
                  } else if (currentSection === 'treatment') {
                    newParsedSummary.treatment.push(bulletMatch[1]);
                  }
                } else if (currentSection === 'diagnosis') {
                  newParsedSummary.diagnosis = trimmedLine;
                } else if (trimmedLine.length > 3) {
                  // If not a bullet point but has content
                  if (currentSection === 'symptoms') {
                    newParsedSummary.symptoms.push(trimmedLine);
                  } else if (currentSection === 'diagnosis') {
                    newParsedSummary.diagnosis = trimmedLine;
                  } else if (currentSection === 'treatment') {
                    newParsedSummary.treatment.push(trimmedLine);
                  }
                }
              }
            }

            // If we got any content, update the state
            if (newParsedSummary.symptoms.length > 0 ||
              newParsedSummary.diagnosis ||
              newParsedSummary.treatment.length > 0) {
              setParsedSummary(newParsedSummary);
            }

          } catch (parseError) {
            console.error("Failed to parse summary:", parseError);
          }
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
            sendMessage(
              JSON.stringify({
                audio: base64Audio,
                inputLanguage,
                outputLanguage,
              })
            );
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
  }, [sendMessage, readyState, inputLanguage, outputLanguage]);

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

  const handleTextAreaChange = (e) => {
    setTranscription(e.target.value);
  };

  // Handle manual text input for testing
  const handleSubmitText = () => {
    if (transcription.trim().length > 0) {
      // First clear any existing summary
      setSummary("");
      setParsedSummary({
        symptoms: [],
        diagnosis: "",
        treatment: [],
      });

      // Show processing status to the user
      setConnectionStatus("Processing...");

      // Send the text for processing
      sendMessage(
        JSON.stringify({
          text: transcription, // Changed from transcription to text to match backend API
          inputLanguage,
          outputLanguage,
          requestType: "text_summary" // Add a flag to indicate this is a text-based request
        })
      );

      console.log("Sent text for processing:", transcription.substring(0, 100) + "...");
    }
  };

  return (
    <div className="voice-transcription-container">
      <div className="transcription-header">
        {!hideMainTitle && (
          <h1>Prescripto</h1>
        )}
        <p>Record or paste medical conversations for instant clinical summaries</p>
      </div>

      <div className="language-controls">
        <div className="language-control">
          <label htmlFor="input-language-select">Translate from:</label>
          <select
            id="input-language-select"
            className="language-select"
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
            disabled={isRecording}
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="language-control">
          <label htmlFor="output-language-select">Translate to:</label>
          <select
            id="output-language-select"
            className="language-select"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
            disabled={isRecording}
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="record-controls">
          <button
            className={`mic-button ${isRecording ? "recording" : ""}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={readyState !== ReadyState.OPEN}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {!isRecording ? (
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
              )}
            </svg>
          </button>

          <div className="toggle-container">
            <span className="toggle-label">Hide Transcription</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={hideTranscription}
                onChange={() => setHideTranscription(!hideTranscription)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="panels-container">
        {!hideTranscription && (
          <div className="transcription-panel">
            <textarea
              className="transcription-content"
              value={transcription}
              onChange={handleTextAreaChange}
              placeholder="Transcription will appear here or you can paste text directly..."
              disabled={isRecording}
            />
            {!isRecording && (
              <div className="process-text-container">
                <button
                  className="process-text-button"
                  onClick={handleSubmitText}
                  disabled={!transcription.trim() || readyState !== ReadyState.OPEN}
                >
                  {connectionStatus === "Processing..." ? "Processing..." : "Process Text"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="summary-panel">
          <div className="summary-header">
            <h2>Clinical Summary</h2>
          </div>
          <div className="summary-content">
            <div className="summary-section">
              <h3>Symptoms</h3>
              {parsedSummary.symptoms.length > 0 ? (
                <ul>
                  {parsedSummary.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p>No symptoms identified yet.</p>
              )}
            </div>

            <div className="summary-section">
              <h3>Diagnosis</h3>
              <p>
                {parsedSummary.diagnosis || "No diagnosis available yet."}
              </p>
            </div>

            <div className="summary-section">
              <h3>Treatment Plan</h3>
              {parsedSummary.treatment.length > 0 ? (
                <ul>
                  {parsedSummary.treatment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No treatment plan available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="connection-indicator">
        <span
          className={`status-dot ${connectionStatus === "Connected"
            ? "connected"
            : connectionStatus === "Error"
              ? "error"
              : "disconnected"
            }`}
        ></span>
        Server status: {connectionStatus}
      </div>
    </div>
  );
}

VoiceTranscription.propTypes = {
  hideMainTitle: PropTypes.bool
};

VoiceTranscription.defaultProps = {
  hideMainTitle: false
};

export default VoiceTranscription;

import whisper
import pyaudio
import numpy as np
import torch
import time
import wave

# Load the Whisper model (use "tiny", "base", "small", "medium", "large")
model = whisper.load_model("small")

# Audio settings
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000  # Whisper models work best with 16kHz
CHUNK = 1024  # Size of audio chunk

# Initialize PyAudio
audio = pyaudio.PyAudio()
stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

print("Listening... Speak into the microphone.")

# Live transcription loop
try:
    while True:
        frames = []
        start_time = time.time()
        
        # Record short audio segment
        for _ in range(0, int(RATE / CHUNK * 2)):  # Record for ~2 seconds
            data = stream.read(CHUNK)
            frames.append(data)

        # Convert audio to NumPy array
        audio_data = np.frombuffer(b''.join(frames), dtype=np.int16).astype(np.float32) / 32768.0

        # Save as WAV file (temp storage for Whisper)
        with wave.open("temp.wav", "wb") as wf:
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(audio.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))

        # Transcribe the audio
        result = model.transcribe("temp.wav", fp16=torch.cuda.is_available())

        # Print the text
        print("You said:", result["text"])

except KeyboardInterrupt:
    print("Stopping...")
    stream.stop_stream()
    stream.close()
    audio.terminate()

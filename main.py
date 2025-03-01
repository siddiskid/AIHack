import asyncio
import websockets
import json
import base64
import whisper
import tempfile
import os
import google.generativeai as genai
import re
import socket

# Initialize Whisper model
model = whisper.load_model("base")

# Configure Gemini
genai.configure(api_key="AIzaSyC1yhDfnx43dciIaAGIHplN0Wqp6Eu1Cs8")

MEDICAL_TEMPLATE = """CLINICAL SUMMARY FORMATTING TASK

Generate response in this EXACT structure:

SYMPTOMS
- [Symptom] (Duration: [X days/weeks])
- [Symptom]...

DIAGNOSIS
Primary: [Diagnosis]
Evidence:
- [Finding]
- [Finding]...

TREATMENT PLAN
Medications:
1. [Drug]
   - Dosage: [Amount]
   - Duration: [Timeframe]
Lifestyle:
- [Recommendation]
- [Recommendation]...

FOLLOW UP
Monitoring:
- [Instruction]
- [Instruction]...
Return Visit: [Timeline]

TRANSCRIPT TO PROCESS:
{transcript}"""

def process_transcript(transcript):
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(
        MEDICAL_TEMPLATE.format(transcript=transcript),
        generation_config={
            "temperature": 0.2,
            "top_p": 0.95,
            "response_mime_type": "text/plain"
        }
    )
    return response.text

async def handle_audio(websocket, path):
    try:
        print("Client connected")
        full_transcript = ""
        async for message in websocket:
            try:
                data = json.loads(message)
                audio_base64 = data.get('audio')
                if not audio_base64:
                    await websocket.send(json.dumps({"error": "No audio data received"}))
                    continue

                # Decode and save audio
                audio_bytes = base64.b64decode(audio_base64)
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(audio_bytes)
                    temp_path = temp_file.name

                # Transcribe
                result = model.transcribe(temp_path)
                transcription = result["text"].strip()
                full_transcript += " " + transcription
                
                # Generate summary if transcript is substantial
                summary = ""
                if len(full_transcript.split()) > 20:  # Only generate summary if we have enough words
                    try:
                        summary = process_transcript(full_transcript)
                    except Exception as e:
                        print(f"Summary generation error: {str(e)}")
                        summary = "Error generating summary"

                # Clean up and send result
                os.unlink(temp_path)
                await websocket.send(json.dumps({
                    "transcription": transcription,
                    "summary": summary
                }))

            except Exception as e:
                print(f"Error: {str(e)}")
                await websocket.send(json.dumps({"error": str(e)}))
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

def find_free_port(start_port=8000, max_attempts=10):
    for port in range(start_port, start_port + max_attempts):
        try:
            # Try to create a socket with the port
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('localhost', port))
            sock.close()
            return port
        except OSError:
            continue
    raise OSError("No free ports found in range")

async def main():
    try:
        port = find_free_port()
        server = await websockets.serve(handle_audio, "localhost", port, ping_interval=None)
        print(f"WebSocket server started on ws://localhost:{port}")
        
        # Also update the frontend URL
        frontend_path = os.path.join('sidd', 'src', 'components', 'VoiceTranscription.jsx')
        if os.path.exists(frontend_path):
            with open(frontend_path, 'r') as f:
                content = f.read()
            
            # Update the WebSocket URL
            new_content = content.replace(
                'const WS_URL = "ws://localhost:8000"',
                f'const WS_URL = "ws://localhost:{port}"'
            )
            
            with open(frontend_path, 'w') as f:
                f.write(new_content)
            
            print(f"Updated frontend WebSocket URL to port {port}")
        
        await server.wait_closed()
    except Exception as e:
        print(f"Server error: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main()) 
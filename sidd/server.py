import asyncio
import json
import base64
import whisper
import numpy as np
import websockets
import tempfile
import os
from pathlib import Path

# Load the Whisper model
model = whisper.load_model("small")

async def handle_websocket(websocket, path):
    print(f"Client connected on path: {path}")
    try:
        async for message in websocket:
            try:
                # Parse the incoming message
                data = json.loads(message)
                if 'audio' not in data:
                    continue

                # Decode the base64 audio data
                audio_data = base64.b64decode(data['audio'])

                # Create a temporary WAV file
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(audio_data)
                    temp_path = temp_file.name

                try:
                    # Transcribe the audio
                    result = model.transcribe(temp_path)
                    
                    # Send the transcription back to the client
                    response = {
                        'transcription': result['text'].strip()
                    }
                    await websocket.send(json.dumps(response))
                finally:
                    # Clean up the temporary file
                    os.unlink(temp_path)

            except Exception as e:
                print(f"Error processing message: {e}")
                await websocket.send(json.dumps({
                    'error': str(e)
                }))

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def main():
    async with websockets.serve(
        handle_websocket,
        "localhost",
        8000,
        ping_interval=None,  # Disable ping-pong to avoid timeouts
        origins=None  # Allow all origins
    ) as server:
        print("WebSocket server started on ws://localhost:8000")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main()) 
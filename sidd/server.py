import asyncio
import json
import base64
import whisper
import numpy as np
import websockets
import tempfile
import os
import logging
import google.generativeai as genai
from pathlib import Path
import sys

# Add the parent directory to the path to be able to import the module
sys.path.append(str(Path(__file__).parent.parent))
from transcription_to_summary import process_transcript  # Import the function

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Configure Google Generative AI for summaries
try:
    # Use a free API key for demonstration/development
    genai.configure(api_key="AIzaSyDJC5A5zIgj2URU2bUtp4tUBv1gUCuKVeE")
    logging.info("Google GenerativeAI model configured successfully")
except Exception as e:
    logging.error(f"Failed to configure Google GenerativeAI: {e}")
    logging.warning("Clinical summaries will not be available")

# Load the Whisper model (using medium for better multilingual support)
try:
    whisper_model = whisper.load_model("medium")
    logging.info("Whisper model loaded successfully")
except Exception as e:
    logging.error(f"Failed to load Whisper model: {e}")
    raise

# Use the process_transcript function imported from transcription_to_summary.py
async def generate_clinical_summary(transcription, language='English'):
    try:
        # Call the imported function
        summary = process_transcript(transcription, language)
        return summary
    except Exception as e:
        logging.error(f"Failed to generate summary: {e}")
        return "Error generating summary"

async def handle_websocket(websocket, path):
    client_id = id(websocket)
    logging.info(f"Client {client_id} connected on path: {path}")
    try:
        async for message in websocket:
            try:
                # Parse the incoming message
                data = json.loads(message)
                if 'audio' not in data:
                    logging.warning(f"Client {client_id} sent message without audio data")
                    continue

                # Get the input language (default to English if not specified)
                input_language = data.get('inputLanguage', 'en')
                logging.info(f"Processing {input_language} audio from client {client_id}")

                # Map frontend language codes to Whisper language codes
                language_map = {
                    'en': 'english',
                    'es': 'spanish',
                    'fr': 'french',
                    'de': 'german',
                    'it': 'italian',
                    'pt': 'portuguese',
                    'nl': 'dutch',
                    'pl': 'polish',
                    'ja': 'japanese',
                    'ko': 'korean',
                    'zh': 'chinese',
                    'ru': 'russian',
                    'ar': 'arabic',
                    'hi': 'hindi'
                }

                # Decode the base64 audio data
                try:
                    audio_data = base64.b64decode(data['audio'])
                except Exception as e:
                    logging.error(f"Failed to decode audio data from client {client_id}: {e}")
                    await websocket.send(json.dumps({
                        'error': 'Invalid audio data format'
                    }))
                    continue

                # Create a temporary WAV file
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(audio_data)
                    temp_path = temp_file.name

                try:
                    # Transcribe the audio with language specification
                    whisper_language = language_map.get(input_language, 'english')
                    logging.info(f"Starting transcription for client {client_id} in {whisper_language}")
                    
                    result = whisper_model.transcribe(
                        temp_path,
                        language=whisper_language,
                        task='transcribe',
                        # Force Whisper to only use the specified language and not auto-detect
                        fp16=False,
                        suppress_tokens=[],  # Don't suppress any tokens
                        without_timestamps=True,  # Simpler output format
                        initial_prompt=f"The following is speech in {whisper_language}."  # Prime with language
                    )
                    
                    transcription = result['text'].strip()
                    
                    # Send the transcription back to the client
                    response = {
                        'transcription': transcription,
                        'language': input_language
                    }
                    await websocket.send(json.dumps(response))
                    logging.info(f"Sent transcription to client {client_id}")
                    
                    # Generate and send a clinical summary if there's enough text
                    if len(transcription) > 50:  # Only generate summary if we have substantial text
                        logging.info(f"Generating clinical summary for client {client_id}")
                        summary = await generate_clinical_summary(transcription, input_language)
                        summary_response = {
                            'summary': summary
                        }
                        await websocket.send(json.dumps(summary_response))
                        logging.info(f"Sent clinical summary to client {client_id}")
                    
                except Exception as e:
                    logging.error(f"Transcription error for client {client_id}: {e}")
                    await websocket.send(json.dumps({
                        'error': f'Transcription failed: {str(e)}'
                    }))
                finally:
                    # Clean up the temporary file
                    try:
                        os.unlink(temp_path)
                    except Exception as e:
                        logging.error(f"Failed to delete temporary file {temp_path}: {e}")

            except json.JSONDecodeError as e:
                logging.error(f"Invalid JSON from client {client_id}: {e}")
                await websocket.send(json.dumps({
                    'error': 'Invalid JSON format'
                }))
            except Exception as e:
                logging.error(f"Error processing message from client {client_id}: {e}")
                await websocket.send(json.dumps({
                    'error': str(e)
                }))

    except websockets.exceptions.ConnectionClosed:
        logging.info(f"Client {client_id} disconnected")
    except Exception as e:
        logging.error(f"Unexpected error with client {client_id}: {e}")

async def main():
    try:
        async with websockets.serve(
            handle_websocket,
            "localhost",
            8000,
            ping_interval=None,  # Disable ping-pong to avoid timeouts
            origins=None  # Allow all origins
        ) as server:
            logging.info("WebSocket server started on ws://localhost:8000")
            await asyncio.Future()  # run forever
    except Exception as e:
        logging.error(f"Failed to start WebSocket server: {e}")
        raise

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped by user")
    except Exception as e:
        logging.error(f"Server crashed: {e}")
        raise 
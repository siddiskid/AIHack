# AI Healthcare Assistant

This repository contains two applications:
1. A Pharmacy Finder application to locate nearby pharmacies
2. A Voice-to-Text Medical Assistant for transcribing and analyzing medical conversations

# Application 1: Pharmacy Finder

A Python application that helps users find nearby pharmacies using the Google Places API. The application features a user-friendly GUI with filtering options and detailed pharmacy information.

## Features

- **Location Services**:
  - Auto-locate using IP-based geolocation
  - Manual location input (address, city, or coordinates)
  - Current location display with coordinates

- **Search Filters**:
  - Adjustable search radius (0.5km to 5km)
  - "Open Now" filter to show only currently open pharmacies
  - Minimum rating filter (0 to 4.5 stars)

- **Results Display**:
  - Pharmacy name and address
  - Current open/closed status
  - Google Maps rating
  - Direct link to Google Maps
  - Number of results found and filtered

## Setup Instructions

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Google Places API Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Places API for your project
   - Create an API key
   - Replace the API key in `pharmacy/nearest.py`:
     ```python
     self.API_KEY = 'YOUR_API_KEY_HERE'
     ```

3. **Run the Application**:
   ```bash
   python pharmacy/nearest.py
   ```

## How to Use Pharmacy Finder

1. **Setting Your Location**:
   - Click "Auto-locate" to automatically detect your location
   - OR enter an address/city in the text field and click "Set Location"

2. **Adjusting Search Filters**:
   - Select search radius from dropdown (0.5km to 5km)
   - Check "Open Now" to show only currently open pharmacies
   - Select minimum rating if desired (0 to 4.5 stars)

3. **Searching**:
   - Click "Search" to find pharmacies
   - Results will show in the main window
   - Each result includes:
     - Pharmacy name
     - Address
     - Rating
     - Open/Closed status
     - Link to Google Maps

4. **Troubleshooting**:
   - If no results appear, try:
     - Increasing the search radius
     - Removing filters (uncheck "Open Now" or lower minimum rating)
     - Verifying your location is correct
     - Checking your internet connection

# Application 2: Voice-to-Text Medical Assistant

A Python application that transcribes medical conversations and provides analysis using OpenAI's Whisper model.

## Features

- **Voice Recording**:
  - Real-time audio recording
  - Automatic speech detection
  - Support for multiple audio input devices

- **Transcription**:
  - Accurate speech-to-text conversion
  - Medical terminology recognition
  - Support for multiple languages

- **Analysis**:
  - Medical conversation summarization
  - Key points extraction
  - Important medical terms highlighting

## How to Use Voice-to-Text Assistant

1. **Starting the Application**:
   ```bash
   python gui.py
   ```

2. **Recording Audio**:
   - Click "Start Recording" to begin capturing audio
   - Speak clearly into your microphone
   - Click "Stop Recording" when finished

3. **Transcription**:
   - The application will automatically transcribe your recording
   - Transcribed text appears in the main window
   - Wait for processing to complete (indicated by status messages)

4. **Viewing Results**:
   - Transcribed text is displayed in the main text area
   - Analysis and key points are shown below the transcription
   - Use the scroll bar to view long transcriptions

5. **Troubleshooting Audio**:
   - Ensure your microphone is properly connected
   - Check your system's audio input settings
   - Verify microphone permissions are enabled

## Dependencies

- geopy==2.4.1: For geocoding addresses (Pharmacy Finder)
- requests==2.31.0: For API requests (Pharmacy Finder)
- tk==0.1.0: For the graphical interface (Both applications)
- openai-whisper: For speech recognition (Voice-to-Text Assistant)
- pyaudio: For audio recording (Voice-to-Text Assistant)
- numpy: For data processing (Both applications)
- torch: For machine learning models (Voice-to-Text Assistant)

## Notes

- Both applications require an active internet connection
- Pharmacy Finder depends on Google Places API quota and billing status
- Voice-to-Text Assistant requires a working microphone
- Location accuracy may vary based on the geolocation method used
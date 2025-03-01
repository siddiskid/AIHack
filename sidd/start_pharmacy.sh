#!/bin/bash

# Start the WebSocket server in the background
python pharmacy_server.py &
WEBSOCKET_PID=$!

# Wait a moment for the WebSocket server to start
sleep 2

# Function to clean up processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $WEBSOCKET_PID
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start the HTTP server in the foreground
python -m http.server 8080

# If HTTP server stops, clean up the WebSocket server
cleanup 
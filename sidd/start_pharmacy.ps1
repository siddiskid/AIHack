# Start the WebSocket server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python pharmacy_server.py"

# Wait a moment for the WebSocket server to start
Start-Sleep -Seconds 2

# Start the HTTP server in the current window
python -m http.server 8080

# Note: The script will keep running until you close both windows
# To stop both servers:
# 1. Press Ctrl+C in the HTTP server window
# 2. Close the WebSocket server window 
# React + Vite Pharmacy Finder

This application helps users find nearby pharmacies based on location, rating, and operating hours. It combines React+Vite for the frontend with a Python WebSocket server for backend functionality.

## Setup and Installation

### Prerequisites
- Python 3.7 or higher
- Node.js and npm
- Required Python packages (install using `pip install -r requirements_pharmacy.txt`):
  - websockets==12.0
  - requests==2.31.0
  - geopy==2.4.1

### Running the Application

#### Option 1: Using the Start Script (Recommended)
1. Run the start script:
   ```bash
   ./start_pharmacy.ps1    # For Windows PowerShell
   # OR
   ./start_pharmacy.sh     # For Unix/Linux/MacOS
   ```
   This will start both servers automatically.

2. Open your browser and navigate to:
   ```
   http://localhost:8080/pharmacy_test.html
   ```

#### Option 2: Manual Start
If you prefer to start the servers manually:

1. Start the WebSocket server:
   ```bash
   python pharmacy_server.py
   ```
   The server will run on `ws://localhost:8001`

2. In a new terminal, start the HTTP server:
   ```bash
   python -m http.server 8080
   ```
   Access the application at `http://localhost:8080/pharmacy_test.html`

## Using the Pharmacy Finder

### Auto-Location Feature
The application can automatically detect your location:
- Uses IP-based geolocation with Google Geocoding for precise results
- Provides detailed location information including:
  - Street address
  - Neighborhood
  - City and postal code
  - State/Province
  - Country
- Falls back to approximate location if precise location unavailable

### Location Input Format
The application accepts various location formats:

1. City and Province/State:
   - "Vancouver, BC"
   - "Calgary, AB"

2. Street Address or Area with City:
   - "17th Avenue SW, Calgary, AB"
   - "West Broadway, Vancouver, BC"

3. Neighborhood with City:
   - "Kitsilano, Vancouver, BC"
   - "Beltline, Calgary, AB"

For best results:
- Include specific location (street/area/neighborhood)
- Add city name
- Include province/state abbreviation

### Search Options
- **Radius**: Choose from 0.5km to 5km search radius
- **Minimum Rating**: Filter pharmacies by Google rating (0-5 stars)
- **Open Now**: Show only currently open pharmacies

### Search Results
Results include:
- Pharmacy name
- Address
- Rating (out of 5 stars)
- Open/Closed status
- Google Maps link

## Original React+Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pharmacy.css';

// WebSocket server URL
const WS_URL = 'ws://localhost:8001';

const Pharmacy = ({ isAuthenticated, onSignOut }) => {
    const [ws, setWs] = useState(null);
    const [connected, setConnected] = useState(false);
    const [detectedLocation, setDetectedLocation] = useState(null);
    const [locationInput, setLocationInput] = useState('');
    const [radius, setRadius] = useState(1);
    const [openNow, setOpenNow] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Initializing...');
    const [showLocationDetails, setShowLocationDetails] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    // Connect to WebSocket when component mounts
    useEffect(() => {
        console.log("Pharmacy component mounted, connecting to WebSocket...");
        connect();

        // Check connection status periodically
        const intervalId = setInterval(() => {
            if (ws && ws.readyState !== WebSocket.OPEN) {
                console.log("WebSocket not open, current state:", ws.readyState);
                if (connectionAttempts < 3) {
                    console.log("Attempting reconnection...");
                    connect();
                }
            }
        }, 5000);

        // Cleanup when component unmounts
        return () => {
            console.log("Pharmacy component unmounting, cleaning up...");
            clearInterval(intervalId);
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const connect = () => {
        setStatus('Connecting to server...');
        setConnectionAttempts(prev => prev + 1);
        console.log(`Attempt #${connectionAttempts + 1} to connect to ${WS_URL}`);

        try {
            // Close existing socket if any
            if (ws && ws.readyState !== WebSocket.CLOSED) {
                console.log("Closing existing WebSocket connection");
                ws.close();
            }

            console.log("Creating new WebSocket connection");
            const socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                console.log("WebSocket connection established successfully");
                setConnected(true);
                setStatus('Connected to server');
                setWs(socket);
                setError('');
                setConnectionAttempts(0); // Reset counter on successful connection

                // Send a ping to make sure the connection is working
                console.log("Sending ping to test connection");
                try {
                    socket.send(JSON.stringify({ type: 'ping' }));
                } catch (err) {
                    console.error("Failed to send ping:", err);
                }
            };

            socket.onclose = (event) => {
                console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
                setConnected(false);
                setStatus('Disconnected from server');
                setError(`Connection to server closed (Code: ${event.code}). Make sure the pharmacy_server.py is running on port 8001.`);

                // Only try to reconnect if we haven't reached the limit
                if (connectionAttempts < 3) {
                    console.log(`Will attempt to reconnect in 5 seconds (Attempt #${connectionAttempts + 1})`);
                    setTimeout(connect, 5000);
                } else {
                    setStatus('Failed to connect to server after multiple attempts');
                    setError('Unable to establish a stable connection to the pharmacy server. Please try refreshing the page or check if the server is running.');
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                setStatus('Error connecting to server');
                setError('Could not connect to the pharmacy server. Please check if it\'s running on port 8001.');
            };

            socket.onmessage = (event) => {
                console.log("Received message from server:", event.data);
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'pong') {
                        console.log("Received pong from server, connection confirmed working");
                    } else if (data.type === 'auto_locate_response') {
                        console.log("Received auto-locate response:", data);
                        handleAutoLocateResponse(data);
                    } else if (data.error) {
                        console.error("Server reported error:", data.error);
                        setError(`Server error: ${data.error}`);
                        setResults(null);
                    } else {
                        console.log("Received search results:", data);
                        setResults(data);
                        setError('');
                    }
                } catch (e) {
                    console.error('Error parsing message:', e);
                    setError(`Error processing server response: ${e.message}`);
                }
            };

            setWs(socket);
        } catch (err) {
            console.error('Error establishing WebSocket connection:', err);
            setStatus('Failed to connect to server');
            setError(`Could not establish connection to pharmacy server: ${err.message}`);
        }
    };

    const testConnection = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("WebSocket not connected, attempting to reconnect");
            setStatus('Not connected to server. Trying to reconnect...');
            setError('Server connection lost. Attempting to reconnect...');
            connect();
            return;
        }

        console.log("Testing WebSocket connection");
        setStatus('Testing connection...');

        try {
            ws.send(JSON.stringify({
                type: 'ping'
            }));
            console.log("Ping sent successfully");
        } catch (err) {
            console.error('Error sending ping:', err);
            setError(`Failed to send ping: ${err.message}`);
        }
    };

    const autoLocate = () => {
        console.log("Auto-locate requested");
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("WebSocket not connected, attempting to reconnect");
            setStatus('Not connected to server. Trying to reconnect...');
            setError('Server connection lost. Attempting to reconnect...');
            connect();
            return;
        }

        setShowLocationDetails(false);
        setStatus('Detecting location...');
        setError('');

        try {
            console.log("Sending auto-locate request");
            ws.send(JSON.stringify({
                type: 'auto_locate'
            }));
            console.log("Auto-locate request sent successfully");
        } catch (err) {
            console.error('Error sending auto-locate request:', err);
            setError(`Failed to send location request to server: ${err.message}`);
        }
    };

    const handleAutoLocateResponse = (data) => {
        console.log("Processing auto-locate response:", data);
        if (data.success) {
            console.log("Location detected successfully:", data.location);
            setDetectedLocation(data.location);
            setShowLocationDetails(true);
            setError('');
            setTimeout(() => {
                setStatus('Connected to server');
            }, 1500);
        } else {
            console.error("Failed to detect location:", data.error);
            setError(`Could not detect location: ${data.error || 'Unknown error'}`);
            setTimeout(() => {
                setStatus('Connected to server');
            }, 3000);
        }
    };

    const useDetectedLocation = () => {
        if (detectedLocation) {
            console.log("Using detected location:", detectedLocation.address);
            setLocationInput(detectedLocation.address);
        }
    };

    const searchPharmacies = () => {
        console.log("Pharmacy search requested");
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("WebSocket not connected, attempting to reconnect");
            setStatus('Not connected to server. Trying to reconnect...');
            setError('Server connection lost. Attempting to reconnect...');
            connect();
            return;
        }

        const searchParams = {
            location: locationInput,
            radius: parseFloat(radius),
            openNow: openNow,
            minRating: parseFloat(minRating)
        };

        // If we have detected coordinates, include them
        if (detectedLocation) {
            searchParams.lat = detectedLocation.lat;
            searchParams.lng = detectedLocation.lng;
        }

        console.log("Sending search request with params:", searchParams);
        setResults({ searching: true });
        setError('');

        try {
            ws.send(JSON.stringify(searchParams));
            console.log("Search request sent successfully");
        } catch (err) {
            console.error('Error sending search request:', err);
            setError(`Failed to send search request to server: ${err.message}`);
            setResults(null);
        }
    };

    const formatRating = (rating) => {
        if (rating === 'No rating') return rating;
        const numRating = parseFloat(rating);
        return numRating.toFixed(1) + ' stars';
    };

    return (
        <div className="pharmacy-container">
            <nav className="home-nav">
                <div className="nav-logo">
                    <Link to="/" className="logo-link">Prescripto</Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact">Contact us</Link>
                </div>
                <div className="nav-button">
                    {isAuthenticated ? (
                        <button onClick={onSignOut} className="sign-out-btn">Sign out</button>
                    ) : (
                        <Link to="/auth" className="get-started-btn">Get started</Link>
                    )}
                </div>
            </nav>

            <main className="pharmacy-main">
                <h1 className="pharmacy-title">Pharmacy Finder</h1>

                <div className="location-group">
                    <h3>Location Settings</h3>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Enter location or use auto-locate"
                            className="location-input"
                        />
                        <button className="btn btn-secondary" onClick={autoLocate}>Auto-Locate Me</button>
                    </div>

                    {showLocationDetails && (
                        <div className="location-details">
                            <p><strong>Detected Location:</strong> <span>{detectedLocation?.address || 'Not detected yet'}</span></p>
                            <p><strong>Full Address:</strong> <span>{detectedLocation?.full_address || detectedLocation?.address || 'Not available'}</span></p>
                            <p><strong>Neighborhood:</strong> <span>{detectedLocation?.details?.neighborhood || 'Not available'}</span></p>
                            <p><strong>Coordinates:</strong> <span>{detectedLocation ? `${detectedLocation.lat.toFixed(6)}, ${detectedLocation.lng.toFixed(6)}` : 'Not available'}</span></p>
                            <button className="btn btn-secondary" onClick={useDetectedLocation}>Use This Location</button>
                        </div>
                    )}

                    <div className="location-options">
                        <div className="form-group">
                            <label>Radius (km):</label>
                            <select value={radius} onChange={(e) => setRadius(e.target.value)}>
                                <option value="0.5">0.5</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Open Now:</label>
                            <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />
                        </div>

                        <div className="form-group">
                            <label>Min Rating:</label>
                            <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                                <option value="0">Any</option>
                                <option value="3">3+ stars</option>
                                <option value="4">4+ stars</option>
                                <option value="4.5">4.5+ stars</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="connection-status">
                    <div className="status-indicator" style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: connected ? 'green' : 'red',
                        marginRight: '8px'
                    }}></div>
                    <span>Server status: {connected ? 'Connected' : 'Disconnected'}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={testConnection}
                        style={{ marginLeft: '10px', padding: '3px 8px', fontSize: '0.8rem' }}
                    >
                        Test Connection
                    </button>
                </div>

                <button className="pharmacy-search-btn" onClick={searchPharmacies}>Search Pharmacies</button>

                {status && <div className="status" style={{ color: status.includes('Error') || status.includes('Disconnected') || status.includes('Failed') ? 'red' : (status.includes('Connected') ? 'green' : 'black') }}>{status}</div>}
                {error && <div className="error">{error}</div>}

                <div className="results">
                    {results?.searching && <p style={{ textAlign: 'center' }}>Searching for pharmacies...</p>}

                    {results?.error && <p className="error">Error: {results.error}</p>}

                    {results?.success && (
                        <div>
                            <h3>Found {results.total} pharmacies near {results.location.address}</h3>

                            {results.filters_applied && (
                                <div className="filters-summary">
                                    Filters applied: {' '}
                                    {[
                                        results.filters_applied.min_rating ? `Rating >= ${results.filters_applied.min_rating} stars` : null,
                                        results.filters_applied.open_now ? 'Open Now' : null
                                    ].filter(Boolean).join(', ') || 'None'}
                                    <br />
                                    Search radius: {results.filters_applied.radius_km}km
                                    {results.filtered_out > 0 && (
                                        <><br />Note: {results.filtered_out} pharmacies were filtered out</>
                                    )}
                                </div>
                            )}

                            {results.results.length === 0 ? (
                                <div className="no-results">
                                    <p>No pharmacies found matching your criteria.</p>
                                    <p>Try adjusting your filters or increasing the search radius.</p>
                                </div>
                            ) : (
                                <div className="pharmacy-results">
                                    {results.results.map((pharmacy, index) => (
                                        <div className="pharmacy-item" key={index}>
                                            <h4>{index + 1}. {pharmacy.name}</h4>
                                            <p>Address: {pharmacy.address}</p>
                                            <p>Rating: <span className="rating">{formatRating(pharmacy.rating)}</span></p>
                                            <p>Open Now: {pharmacy.openNow ? 'Yes' : 'No'}</p>
                                            {pharmacy.mapsLink && (
                                                <p><a href={pharmacy.mapsLink} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Pharmacy; 
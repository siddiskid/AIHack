import asyncio
import json
import websockets
import requests
from geopy.geocoders import Nominatim

class PharmacyFinder:
    def __init__(self):
        # API Key - replace with your actual key
        self.API_KEY = 'AIzaSyBWDerWhQ1mItURpJgOB3NeMQ-N7cAOge4'
        self.geolocator = Nominatim(user_agent="pharmacy_finder_web")
        # Default location (Vancouver, BC)
        self.default_location = {
            'lat': 49.2827,
            'lng': -123.1207,
            'address': 'Vancouver, British Columbia, Canada'
        }

    async def get_location_from_ip(self, ip_address=None):
        try:
            # First try Google's Geolocation API
            geolocation_url = "https://www.googleapis.com/geolocation/v1/geolocate"
            geolocation_params = {
                'key': self.API_KEY
            }
            
            print("Attempting to get location using Google Geolocation API")
            geolocation_response = requests.post(geolocation_url, json={}, params=geolocation_params, timeout=5)
            print(f"Google Geolocation API Response status: {geolocation_response.status_code}")
            
            if geolocation_response.status_code == 200:
                geolocation_data = geolocation_response.json()
                lat = geolocation_data['location']['lat']
                lng = geolocation_data['location']['lng']
                accuracy = geolocation_data.get('accuracy', 0)
                
                print(f"Got location: {lat}, {lng} (accuracy: {accuracy}m)")
                
                # Use Google's Geocoding API to get detailed address information
                geocoding_url = "https://maps.googleapis.com/maps/api/geocode/json"
                params = {
                    'latlng': f"{lat},{lng}",
                    'key': self.API_KEY,
                    'result_type': 'street_address|premise|subpremise|route|neighborhood|sublocality|locality'
                }
                
                print(f"Attempting Google Geocoding API request for detailed location")
                geocoding_response = requests.get(geocoding_url, params=params, timeout=5)
                print(f"Google Geocoding API Response status: {geocoding_response.status_code}")
                
                if geocoding_response.status_code == 200:
                    geocoding_data = geocoding_response.json()
                    print(f"Google Geocoding API status: {geocoding_data.get('status')}")
                    
                    if geocoding_data['status'] == 'OK' and geocoding_data['results']:
                        # Get the most specific result
                        result = geocoding_data['results'][0]
                        formatted_address = result['formatted_address']
                        
                        # Extract detailed components
                        components = {}
                        for component in result['address_components']:
                            for type in component['types']:
                                components[type] = component['long_name']
                        
                        # Build detailed location information with more specific neighborhood data
                        location_details = {
                            'street_number': components.get('street_number', ''),
                            'street': components.get('route', ''),
                            'neighborhood': (
                                components.get('neighborhood') or 
                                components.get('sublocality_level_1') or 
                                components.get('sublocality') or 
                                components.get('political') or
                                ''
                            ),
                            'city': components.get('locality', ''),
                            'district': components.get('administrative_area_level_2', ''),
                            'state': components.get('administrative_area_level_1', ''),
                            'postal_code': components.get('postal_code', ''),
                            'country': components.get('country', '')
                        }
                        
                        # Create a more specific address string
                        address_parts = []
                        if location_details['street_number'] and location_details['street']:
                            address_parts.append(f"{location_details['street_number']} {location_details['street']}")
                        if location_details['neighborhood']:
                            address_parts.append(location_details['neighborhood'])
                        if not address_parts:
                            address_parts.append(formatted_address)
                            
                        specific_address = ', '.join(address_parts)
                            
                        return {
                            'success': True,
                            'location': {
                                'lat': lat,
                                'lng': lng,
                                'address': specific_address,
                                'full_address': formatted_address,
                                'details': location_details,
                                'accuracy': accuracy
                            }
                        }
            
            # If Google Geolocation fails, try IP-based location
            ip_url = 'https://ipapi.co/json/' if not ip_address else f'https://ipapi.co/{ip_address}/json/'
            print(f"Falling back to IP-based location using URL: {ip_url}")
            
            response = requests.get(ip_url, timeout=5)
            print(f"IP API Response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"IP API Response data: {data}")
                
                if 'latitude' in data and 'longitude' in data:
                    return {
                        'success': True,
                        'location': {
                            'lat': float(data['latitude']),
                            'lng': float(data['longitude']),
                            'address': f"{data.get('city', '')}, {data.get('region_code', '')}, {data.get('country_name', '')}",
                            'details': {
                                'city': data.get('city', ''),
                                'state': data.get('region', ''),
                                'country': data.get('country_name', ''),
                                'postal_code': data.get('postal', '')
                            }
                        }
                    }
            
            print("All location detection methods failed, using default location")
            return {
                'success': True,
                'location': self.default_location
            }
            
        except Exception as e:
            print(f"Error in get_location_from_ip: {str(e)}")
            return {
                'success': True,
                'location': self.default_location
            }

    async def find_pharmacies(self, location=None, lat=None, lng=None, radius_km=1, open_now=False, min_rating=0):
        try:
            if location:
                # Use provided location string
                location_info = self.geolocator.geocode(location)
                if not location_info:
                    return {"error": "Location not found"}
                lat, lng = location_info.latitude, location_info.longitude
                address = location_info.address
            elif lat is not None and lng is not None:
                # Use provided coordinates
                location_info = self.geolocator.reverse(f"{lat}, {lng}")
                address = location_info.address if location_info else f"Location at {lat}, {lng}"
            else:
                return {"error": "Either location or coordinates must be provided"}

            # Convert radius from km to meters
            radius = int(float(radius_km) * 1000)

            # Convert and validate min_rating
            try:
                min_rating = float(min_rating)
                if min_rating < 0:
                    min_rating = 0
            except (TypeError, ValueError):
                min_rating = 0

            print(f"Initial min_rating value: {min_rating}")  # Debug print

            # Prepare request for Google Places API
            base_url = "https://places.googleapis.com/v1/places:searchNearby"
            request_body = {
                "includedTypes": ["pharmacy"],
                "maxResultCount": 20,
                "locationRestriction": {
                    "circle": {
                        "center": {
                            "latitude": lat,
                            "longitude": lng
                        },
                        "radius": radius
                    }
                }
            }

            # Add minimum rating filter if specified
            if min_rating > 0:
                request_body["minRating"] = min_rating
                request_body["rankPreference"] = "DISTANCE"

            # Add openNow filter if selected
            if open_now:
                request_body["includedTypes"] = ["pharmacy"]
                request_body["openNow"] = True

            headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': self.API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.currentOpeningHours.openNow,places.location,places.googleMapsUri'
            }

            print(f"Debug - Request body: {json.dumps(request_body, indent=2)}")

            # Make the API request
            response = requests.post(
                base_url,
                json=request_body,
                headers=headers
            )

            if response.status_code == 200:
                data = response.json()
                if 'places' in data:
                    # Transform the results
                    transformed_results = []
                    filtered_count = 0
                    total_found = len(data['places'])
                    print(f"Debug - Total places found: {total_found}")

                    for place in data['places']:
                        # Get the rating as a float or None if not available
                        rating = place.get('rating')
                        
                        # Track filtered out places based on rating
                        if min_rating > 0 and (rating is None or rating < min_rating):
                            filtered_count += 1
                            continue
                            
                        # Check if place is open if the filter is active
                        if open_now:
                            current_hours = place.get('currentOpeningHours', {})
                            if not current_hours.get('openNow', False):
                                filtered_count += 1
                                continue
                            
                        transformed_place = {
                            'name': place.get('displayName', {}).get('text', 'N/A'),
                            'address': place.get('formattedAddress', 'N/A'),
                            'rating': rating if rating is not None else 'No rating',
                            'openNow': place.get('currentOpeningHours', {}).get('openNow', False),
                            'mapsLink': place.get('googleMapsUri', '')
                        }
                        print(f"Debug - Including {transformed_place['name']} with rating {transformed_place['rating']}")
                        transformed_results.append(transformed_place)

                    print(f"Debug - Final results: {len(transformed_results)} places after filtering")

                    return {
                        'success': True,
                        'results': transformed_results,
                        'total': len(transformed_results),
                        'total_found': total_found,
                        'filtered_out': filtered_count,
                        'location': {
                            'address': address,
                            'lat': lat,
                            'lng': lng
                        },
                        'filters_applied': {
                            'min_rating': min_rating if min_rating > 0 else None,
                            'open_now': open_now,
                            'radius_km': float(radius_km)
                        }
                    }
                else:
                    return {"error": "No pharmacies found"}
            else:
                return {"error": "API request failed"}

        except Exception as e:
            return {"error": str(e)}

# Initialize the pharmacy finder
pharmacy_finder = PharmacyFinder()

async def handle_websocket(websocket, path):
    print(f"Client connected on path: {path}")
    try:
        async for message in websocket:
            try:
                # Parse the incoming message
                data = json.loads(message)
                
                # Check if this is an auto-locate request
                if data.get('type') == 'auto_locate':
                    print("Received auto-locate request")
                    # Get client's IP address from websocket
                    client_ip = websocket.remote_address[0] if websocket.remote_address else None
                    location_result = await pharmacy_finder.get_location_from_ip(client_ip)
                    
                    # Send back the response with type
                    response = {
                        'type': 'auto_locate_response',
                        'success': location_result['success'],
                        'location': location_result['location']
                    }
                    if 'error' in location_result:
                        response['error'] = location_result['error']
                    
                    await websocket.send(json.dumps(response))
                    print("Sent auto-locate response:", response)
                    continue

                # Handle regular pharmacy search
                location = data.get('location', '')
                lat = data.get('lat')
                lng = data.get('lng')
                radius_km = float(data.get('radius', 1))
                open_now = bool(data.get('openNow', False))
                min_rating = float(data.get('minRating', 0))

                if not location and (lat is None or lng is None):
                    await websocket.send(json.dumps({
                        "error": "Either location or coordinates are required"
                    }))
                    continue

                # Search for pharmacies
                results = await pharmacy_finder.find_pharmacies(
                    location=location,
                    lat=lat,
                    lng=lng,
                    radius_km=radius_km,
                    open_now=open_now,
                    min_rating=min_rating
                )

                # Send results back to client
                await websocket.send(json.dumps(results))

            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    "error": "Invalid JSON message"
                }))
            except Exception as e:
                print(f"Error processing message: {e}")
                await websocket.send(json.dumps({
                    "error": str(e)
                }))

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def main():
    async with websockets.serve(
        handle_websocket,
        "localhost",
        8001,  # Using port 8001 to avoid conflict with the voice transcription server
        ping_interval=None,
        origins=None
    ) as server:
        print("Pharmacy Finder WebSocket server started on ws://localhost:8001")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main()) 
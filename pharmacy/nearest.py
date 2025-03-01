import requests
import json
from geopy.geocoders import Nominatim
import time
import tkinter as tk
from tkinter import ttk, messagebox
import threading
import os

class PharmacyFinderGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Pharmacy Finder")
        self.root.geometry("800x600")
        
        # API Key - directly set it here
        self.API_KEY = 'AIzaSyBWDerWhQ1mItURpJgOB3NeMQ-N7cAOge4'  # Replace with your actual API key
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Create and set up the GUI elements
        self.setup_location_input()
        self.setup_filters()
        self.setup_results_area()
        
        # Initialize variables
        self.current_lat = None
        self.current_lng = None

    def setup_location_input(self):
        # Location frame
        location_frame = ttk.LabelFrame(self.main_frame, text="Location", padding="5")
        location_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # Location entry
        ttk.Label(location_frame, text="Address:").grid(row=0, column=0, padx=5)
        self.location_var = tk.StringVar()
        self.location_entry = ttk.Entry(location_frame, textvariable=self.location_var, width=50)
        self.location_entry.grid(row=0, column=1, padx=5)
        
        # Auto-locate button
        ttk.Button(location_frame, text="Auto-locate", command=self.get_initial_location).grid(row=0, column=2, padx=5)
        
        # Set location button
        ttk.Button(location_frame, text="Set Location", command=self.set_manual_location).grid(row=0, column=3, padx=5)

    def setup_filters(self):
        # Filters frame
        filters_frame = ttk.LabelFrame(self.main_frame, text="Filters", padding="5")
        filters_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # Radius selection
        ttk.Label(filters_frame, text="Search Radius:").grid(row=0, column=0, padx=5)
        self.radius_var = tk.StringVar(value="1")
        radius_combo = ttk.Combobox(filters_frame, textvariable=self.radius_var, width=10)
        radius_combo['values'] = ("0.5", "1", "2", "3", "4", "5")
        radius_combo.grid(row=0, column=1, padx=5)
        ttk.Label(filters_frame, text="km").grid(row=0, column=2, padx=2)
        
        # Open now filter
        self.open_now_var = tk.BooleanVar()
        ttk.Checkbutton(filters_frame, text="Open Now", variable=self.open_now_var).grid(row=0, column=3, padx=20)
        
        # Minimum rating filter
        ttk.Label(filters_frame, text="Min Rating:").grid(row=0, column=4, padx=5)
        self.min_rating_var = tk.StringVar(value="0")
        rating_combo = ttk.Combobox(filters_frame, textvariable=self.min_rating_var, width=5)
        rating_combo['values'] = ("0", "3", "4", "4.5")
        rating_combo.grid(row=0, column=5, padx=5)
        
        # Search button
        ttk.Button(filters_frame, text="Search", command=self.search_pharmacies).grid(row=0, column=6, padx=20)

    def setup_results_area(self):
        # Results frame
        results_frame = ttk.LabelFrame(self.main_frame, text="Nearest Pharmacies", padding="5")
        results_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        
        # Create text widget for results
        self.results_text = tk.Text(results_frame, height=20, width=80, wrap=tk.WORD)
        self.results_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Add scrollbar
        scrollbar = ttk.Scrollbar(results_frame, orient=tk.VERTICAL, command=self.results_text.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.results_text['yscrollcommand'] = scrollbar.set
        
        # Configure grid weights to make the results area expandable
        self.main_frame.grid_rowconfigure(2, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        results_frame.grid_rowconfigure(0, weight=1)
        results_frame.grid_columnconfigure(0, weight=1)

    def set_manual_location(self):
        address = self.location_var.get().strip()
        if not address:
            messagebox.showerror("Error", "Please enter an address")
            return
            
        def get_location():
            try:
                geolocator = Nominatim(user_agent="my_pharmacy_finder")
                location = geolocator.geocode(address)
                if location:
                    self.current_lat = location.latitude
                    self.current_lng = location.longitude
                    self.root.after(0, lambda: self.update_status(
                        f"Location set to: {address}\nCoordinates: {self.current_lat:.4f}, {self.current_lng:.4f}"
                    ))
                    self.search_pharmacies()
                else:
                    self.root.after(0, lambda: messagebox.showerror("Error", f"Could not find location: {address}"))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Error", f"Error getting location: {str(e)}"))
        
        threading.Thread(target=get_location, daemon=True).start()

    def get_initial_location(self):
        def get_location():
            try:
                # Try multiple geolocation services
                # First try ipinfo.io
                response = requests.get('https://ipinfo.io/json')
                if response.status_code == 200:
                    data = response.json()
                    if 'loc' in data:
                        lat, lng = map(float, data['loc'].split(','))
                        self.current_lat = lat
                        self.current_lng = lng
                        self.location_var.set(f"{data.get('city', '')}, {data.get('region', '')}")
                        self.root.after(0, lambda: self.update_status(
                            f"Location found via ipinfo.io:\n"
                            f"Coordinates: {self.current_lat:.4f}, {self.current_lng:.4f}\n"
                            f"Location: {self.location_var.get()}"
                        ))
                        self.search_pharmacies()
                        return
                
                # If ipinfo.io fails, try ip-api.com
                response = requests.get('http://ip-api.com/json/')
                if response.status_code == 200:
                    data = response.json()
                    if data.get('status') == 'success':
                        self.current_lat = float(data['lat'])
                        self.current_lng = float(data['lon'])
                        self.location_var.set(f"{data.get('city', '')}, {data.get('region', '')}")
                        self.root.after(0, lambda: self.update_status(
                            f"Location found via ip-api.com:\n"
                            f"Coordinates: {self.current_lat:.4f}, {self.current_lng:.4f}\n"
                            f"Location: {self.location_var.get()}"
                        ))
                        self.search_pharmacies()
                        return

                # If both services fail, show detailed error
                self.root.after(0, lambda: self.update_status(
                    "Could not determine location automatically.\n"
                    "Please enter your address manually.\n"
                    "Error: Both geolocation services failed to respond."
                ))
            except Exception as e:
                self.root.after(0, lambda: self.update_status(
                    f"Error getting location: {str(e)}\n"
                    "Please enter your address manually.\n"
                    "Tip: You can enter your city name or full address in the text box above."
                ))
        
        # Show loading message
        self.update_status("Detecting your location...\nPlease wait...")
        
        # Run location detection in a separate thread
        threading.Thread(target=get_location, daemon=True).start()

    def update_status(self, message):
        self.results_text.delete(1.0, tk.END)
        self.results_text.insert(tk.END, message + "\n")

    def find_nearest_pharmacies(self, lat, lng, radius=5000):
        """Find the nearest pharmacies using Google Places API"""
        base_url = "https://places.googleapis.com/v1/places:searchNearby"
        
        # Prepare request body according to new API format
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
        min_rating = float(self.min_rating_var.get())
        if min_rating > 0:
            request_body["minRating"] = min_rating
            request_body["rankPreference"] = "DISTANCE"
        
        # Add openNow filter if selected
        if self.open_now_var.get():
            request_body["includedTypes"] = ["pharmacy"]
            request_body["openNow"] = True
        
        headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': self.API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.currentOpeningHours.openNow,places.location,places.googleMapsUri'
        }
        
        try:
            # Make POST request with proper headers and body
            response = requests.post(
                base_url,
                json=request_body,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'places' in data:
                    # Transform the response to match our display format
                    transformed_results = []
                    filtered_out_count = 0
                    for place in data['places']:
                        # Get the rating as a float or None if not available
                        rating = place.get('rating')
                        
                        # Track filtered out places
                        if min_rating > 0 and (rating is None or rating < min_rating):
                            filtered_out_count += 1
                            continue
                            
                        # Check if place is open if the filter is active
                        if self.open_now_var.get():
                            current_hours = place.get('currentOpeningHours', {})
                            if not current_hours.get('openNow', False):
                                filtered_out_count += 1
                                continue
                            
                        transformed_place = {
                            'name': place.get('displayName', {}).get('text', 'N/A'),
                            'formattedAddress': place.get('formattedAddress', 'N/A'),
                            'rating': rating if rating is not None else 'No rating',
                            'openNow': place.get('currentOpeningHours', {}).get('openNow', False),
                            'googleMapsUri': place.get('googleMapsUri', '')
                        }
                        transformed_results.append(transformed_place)
                    
                    # Return results with filter information
                    return {
                        'results': transformed_results,
                        'total_found': len(data['places']),
                        'filtered_out': filtered_out_count,
                        'filters_active': {
                            'min_rating': min_rating if min_rating > 0 else None,
                            'open_now': self.open_now_var.get(),
                            'radius_km': float(self.radius_var.get())
                        }
                    }
                else:
                    return "No pharmacies found in this area. Please try:\n1. Increasing the search radius\n2. Checking a different location"
            else:
                return "Unable to search for pharmacies at this time. Please try again later."
        except Exception as e:
            return "Unable to connect to pharmacy search service. Please check your internet connection and try again."

    def search_pharmacies(self):
        if self.current_lat is None or self.current_lng is None:
            messagebox.showerror("Error", "Location not available. Please set your location first.")
            return
        
        # Clear previous results
        self.results_text.delete(1.0, tk.END)
        self.results_text.insert(tk.END, "Searching for pharmacies...\n")
        
        def search():
            try:
                # Convert radius from km to meters
                radius = int(float(self.radius_var.get()) * 1000)
                
                # Get pharmacies
                pharmacies = self.find_nearest_pharmacies(self.current_lat, self.current_lng, radius)
                
                if isinstance(pharmacies, str):  # Error message
                    if "REQUEST_DENIED" in pharmacies:
                        # Make the error message more readable in the GUI
                        self.root.after(0, lambda: self.results_text.delete(1.0, tk.END))
                        self.root.after(0, lambda: self.results_text.insert(tk.END, pharmacies))
                        # Also show in a message box for better visibility
                        self.root.after(0, lambda: messagebox.showerror("API Error", 
                            "The Places API is not enabled for this project.\n\n"
                            "Please follow the instructions in the main window to enable it."
                        ))
                    else:
                        self.root.after(0, lambda: self.update_status(f"Error: {pharmacies}"))
                    return
                
                # Update GUI with results
                self.root.after(0, lambda: self.display_results(pharmacies))
            except Exception as e:
                self.root.after(0, lambda: self.update_status(f"Error during search: {str(e)}"))
        
        # Run search in a separate thread
        threading.Thread(target=search, daemon=True).start()

    def display_results(self, pharmacies):
        self.results_text.delete(1.0, tk.END)
        
        # Handle error messages
        if isinstance(pharmacies, str):
            self.results_text.insert(tk.END, pharmacies)
            return
            
        results = pharmacies.get('results', [])
        total_found = pharmacies.get('total_found', 0)
        filtered_out = pharmacies.get('filtered_out', 0)
        filters = pharmacies.get('filters_active', {})
        
        if not results:
            message = "No pharmacies found!\n\n"
            
            # Add helpful information about why no results were found
            if total_found > 0:
                message += f"Initially found {total_found} pharmacies, but they were filtered out due to your criteria:\n"
                if filters.get('min_rating'):
                    message += f"• Minimum rating filter: {filters['min_rating']} stars\n"
                if filters.get('open_now'):
                    message += "• Open Now filter: showing only currently open pharmacies\n"
                
                message += "\nTry these suggestions:\n"
                message += "1. Lower the minimum rating requirement\n"
                message += "2. Uncheck 'Open Now' to see all pharmacies\n"
                message += f"3. Increase the search radius (currently {filters['radius_km']}km)\n"
            else:
                message += f"We couldn't find any pharmacies within {filters['radius_km']}km of {self.location_var.get()}.\n\n"
                message += "Try these suggestions:\n"
                message += f"1. Increase the search radius (currently {filters['radius_km']}km)\n"
                message += "2. Double-check your location is correct\n"
                message += "3. Try searching in a more populated area\n"
            
            self.results_text.insert(tk.END, message)
            return
        
        # Show summary of results and filters
        summary = f"Found {len(results)} pharmacies"
        if filtered_out > 0:
            summary += f" (filtered out {filtered_out} results)"
        summary += ":\n"
        if filters.get('min_rating'):
            summary += f"- Minimum rating: {filters['min_rating']}\n"
        if filters.get('open_now'):
            summary += "- Showing only open pharmacies\n"
        summary += f"- Search radius: {filters['radius_km']}km\n\n"
        
        self.results_text.insert(tk.END, summary)
        
        # Display results
        for i, pharmacy in enumerate(results, 1):
            name = pharmacy.get('name', 'N/A')
            address = pharmacy.get('formattedAddress', 'N/A')
            rating = pharmacy.get('rating', 'No rating')
            maps_link = pharmacy.get('googleMapsUri', '')
            open_now = pharmacy.get('openNow', False)
            
            self.results_text.insert(tk.END, f"{i}. {name}\n")
            self.results_text.insert(tk.END, f"   Address: {address}\n")
            self.results_text.insert(tk.END, f"   Rating: {rating}\n")
            self.results_text.insert(tk.END, f"   Open now: {'Yes' if open_now else 'No'}\n")
            
            if maps_link:
                self.results_text.insert(tk.END, f"   Maps Link: {maps_link}\n")
            
            self.results_text.insert(tk.END, "\n")

def main():
    root = tk.Tk()
    app = PharmacyFinderGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()

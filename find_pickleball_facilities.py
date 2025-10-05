#!/usr/bin/env python3
"""
Find Pickleball Facilities using Google Places API

This script searches for pickleball facilities by name and returns verified
locations with accurate addresses, coordinates, and place IDs.

Usage:
    python find_pickleball_facilities.py facilities_to_find.json verified_facilities.json
"""

import os
import sys
import json
import time
import argparse
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

if not API_KEY:
    print("Error: GOOGLE_MAPS_API_KEY not found in .env file")
    print("Please create a .env file and add your Google Maps API key")
    sys.exit(1)


def search_facility(name, location="Chicago", api_key=None):
    """
    Search for a pickleball facility using Google Places Text Search API.

    Args:
        name: Facility name
        location: City/area to search in (default: Chicago)
        api_key: Google Maps API key

    Returns:
        Dictionary with facility data or None if not found
    """
    # Construct search query
    query = f"{name} pickleball {location}"

    # Google Places Text Search API endpoint
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        'query': query,
        'key': api_key
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if data['status'] == 'OK' and len(data['results']) > 0:
            # Get the first (most relevant) result
            result = data['results'][0]

            return {
                'name': result.get('name'),
                'address': result.get('formatted_address'),
                'lat': result['geometry']['location']['lat'],
                'lng': result['geometry']['location']['lng'],
                'place_id': result['place_id'],
                'rating': result.get('rating'),
                'rating_n': result.get('user_ratings_total', 0),
                'types': result.get('types', [])
            }
        else:
            return None

    except requests.exceptions.RequestException as e:
        print(f"  ❌ API error: {e}")
        return None


def process_facilities(input_file, output_file, delay=0.5):
    """
    Process all facilities from input file and search for them.

    Args:
        input_file: Path to input JSON file with facility names
        output_file: Path to output JSON file with verified data
        delay: Delay between API calls in seconds (default 0.5s)
    """
    # Read input file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            facilities = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{input_file}': {e}")
        sys.exit(1)

    print(f"\n🔍 Searching for {len(facilities)} pickleball facilities...\n")

    results = []
    success_count = 0
    not_found_count = 0

    for i, facility in enumerate(facilities, 1):
        # Get facility name and optional location
        if isinstance(facility, dict):
            name = facility.get('name', '')
            location = facility.get('location', 'Chicago')
            facility_type = facility.get('type', 'unknown')
        else:
            # If just a string
            name = facility
            location = 'Chicago'
            facility_type = 'unknown'

        if not name:
            print(f"{i:2d}. ⚠️  Skipping: No name provided")
            not_found_count += 1
            continue

        print(f"{i:2d}. Searching: {name}")
        print(f"    Query: \"{name} pickleball {location}\"")

        # Search for the facility
        result = search_facility(name, location, API_KEY)

        if result:
            # Add original type if available
            result['type'] = facility_type if isinstance(facility, dict) else 'unknown'

            results.append(result)
            success_count += 1

            print(f"    ✅ Found: {result['name']}")
            print(f"       Address: {result['address']}")
            print(f"       Coords: ({result['lat']:.6f}, {result['lng']:.6f})")
            print(f"       Rating: {result.get('rating', 'N/A')} ({result.get('rating_n', 0)} reviews)")
        else:
            print(f"    ❌ Not found")
            not_found_count += 1

        print()  # Blank line for readability

        # Rate limiting
        if i < len(facilities):
            time.sleep(delay)

    # Write results to output file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Results written to: {output_file}")
    except IOError as e:
        print(f"\n❌ Error writing output file: {e}")
        sys.exit(1)

    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY:")
    print(f"  Total searched: {len(facilities)}")
    print(f"  ✅ Found: {success_count}")
    print(f"  ❌ Not found: {not_found_count}")
    print(f"  📊 Success rate: {success_count/len(facilities)*100:.1f}%")
    print(f"{'='*60}\n")


def main():
    """Main function with command-line argument parsing."""
    parser = argparse.ArgumentParser(
        description='Find pickleball facilities using Google Places Text Search',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Search for facilities
  python find_pickleball_facilities.py facilities_to_find.json verified_facilities.json

  # Slower search (safer rate limiting)
  python find_pickleball_facilities.py facilities_to_find.json verified.json --delay 1.0

Input JSON format (Option 1 - Simple names):
  [
    "Grant Park",
    "Horner Park",
    "Big City Pickle - Fulton Market"
  ]

Input JSON format (Option 2 - With metadata):
  [
    {
      "name": "Grant Park",
      "location": "Chicago",
      "type": "public"
    },
    {
      "name": "Lovelace Park",
      "location": "Evanston",
      "type": "public"
    }
  ]

Output JSON format:
  [
    {
      "name": "Grant Park Pickleball Courts",
      "address": "1000 S Columbus Dr, Chicago, IL 60605, USA",
      "lat": 41.8681,
      "lng": -87.6197,
      "place_id": "ChIJ...",
      "rating": 4.4,
      "rating_n": 31,
      "type": "public",
      "types": ["point_of_interest", "establishment"]
    },
    ...
  ]
        """
    )

    parser.add_argument('input', help='Input JSON file with facility names to search')
    parser.add_argument('output', help='Output JSON file for verified facility data')
    parser.add_argument('--delay', type=float, default=0.5,
                       help='Delay between API calls in seconds (default: 0.5)')

    args = parser.parse_args()

    process_facilities(args.input, args.output, delay=args.delay)


if __name__ == "__main__":
    main()

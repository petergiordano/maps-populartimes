#!/usr/bin/env python3
"""
Geocoding Utility for Pickleball Facilities

This script reads addresses from a JSON file, geocodes them using Google Maps
Geocoding API, and outputs enriched data with coordinates and place IDs.

Usage:
    python geocode_addresses.py input.json output.json
    python geocode_addresses.py addresses_test.json geocoded_test.json
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


def geocode_address(address, api_key):
    """
    Geocode a single address using Google Maps Geocoding API.

    Args:
        address: Full address string
        api_key: Google Maps API key

    Returns:
        Dictionary with lat, lng, place_id, formatted_address or None if error
    """
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"

    params = {
        'address': address,
        'key': api_key
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data['status'] == 'OK' and len(data['results']) > 0:
            result = data['results'][0]
            location = result['geometry']['location']

            return {
                'lat': location['lat'],
                'lng': location['lng'],
                'place_id': result['place_id'],
                'formatted_address': result['formatted_address']
            }
        else:
            print(f"  ⚠️  Geocoding failed for '{address}': {data['status']}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"  ❌ API error for '{address}': {e}")
        return None


def process_addresses(input_file, output_file, delay=0.2):
    """
    Process all addresses from input JSON file and write enriched data to output.

    Args:
        input_file: Path to input JSON file with addresses
        output_file: Path to output JSON file for geocoded results
        delay: Delay between API calls in seconds (default 0.2s = 5 req/sec)
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

    print(f"\n📍 Geocoding {len(facilities)} facilities...\n")

    results = []
    success_count = 0
    error_count = 0

    for i, facility in enumerate(facilities, 1):
        name = facility.get('name', 'Unknown')
        address = facility.get('address', '')

        if not address:
            print(f"{i:3d}. ⚠️  Skipping '{name}': No address provided")
            error_count += 1
            continue

        print(f"{i:3d}. Geocoding: {name}")
        print(f"     Address: {address}")

        # Geocode the address
        geo_data = geocode_address(address, API_KEY)

        if geo_data:
            # Merge original data with geocoded data
            enriched = {
                'name': name,
                'address': address,
                'formatted_address': geo_data['formatted_address'],
                'lat': geo_data['lat'],
                'lng': geo_data['lng'],
                'place_id': geo_data['place_id']
            }

            # Add any additional fields from original data
            for key, value in facility.items():
                if key not in enriched:
                    enriched[key] = value

            results.append(enriched)
            success_count += 1
            print(f"     ✅ Success: ({geo_data['lat']:.6f}, {geo_data['lng']:.6f})")
        else:
            error_count += 1
            # Still add to results but without geocoding
            results.append(facility)

        print()  # Blank line for readability

        # Rate limiting: wait before next request
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
    print(f"  Total facilities: {len(facilities)}")
    print(f"  Successfully geocoded: {success_count}")
    print(f"  Errors: {error_count}")
    print(f"{'='*60}\n")


def main():
    """Main function with command-line argument parsing."""
    parser = argparse.ArgumentParser(
        description='Geocode addresses from JSON file using Google Maps API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Geocode test file
  python geocode_addresses.py addresses_test.json geocoded_test.json

  # Geocode full list
  python geocode_addresses.py addresses_full.json geocoded_full.json

  # Custom rate limiting (faster)
  python geocode_addresses.py addresses_test.json output.json --delay 0.1

Input JSON format:
  [
    {
      "name": "Facility Name",
      "address": "123 Main St, City, State ZIP"
    },
    ...
  ]

Output JSON format:
  [
    {
      "name": "Facility Name",
      "address": "123 Main St, City, State ZIP",
      "formatted_address": "123 Main St, City, State ZIP, USA",
      "lat": 41.8781,
      "lng": -87.6298,
      "place_id": "ChIJ..."
    },
    ...
  ]
        """
    )

    parser.add_argument('input', help='Input JSON file with addresses')
    parser.add_argument('output', help='Output JSON file for geocoded results')
    parser.add_argument('--delay', type=float, default=0.2,
                       help='Delay between API calls in seconds (default: 0.2)')

    args = parser.parse_args()

    process_addresses(args.input, args.output, delay=args.delay)


if __name__ == "__main__":
    main()

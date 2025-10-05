#!/usr/bin/env python3
"""
Batch Popular Times Fetcher for Pickleball Facilities

This script reads geocoded facility data from JSON and fetches popular times
data for each facility using the Google Maps API (via populartimes library).

Usage:
    python batch_popular_times.py geocoded_test.json facilities_test.json
    python batch_popular_times.py geocoded_full.json facilities_full.json
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime
from dotenv import load_dotenv
import populartimes

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

if not API_KEY:
    print("Error: GOOGLE_MAPS_API_KEY not found in .env file")
    print("Please create a .env file and add your Google Maps API key")
    sys.exit(1)


def fetch_popular_times(facility, api_key):
    """
    Fetch popular times data for a single facility.

    Args:
        facility: Dictionary with facility data (must include place_id or lat/lng)
        api_key: Google Maps API key

    Returns:
        Dictionary with popular times data or None if error
    """
    name = facility.get('name', 'Unknown')

    # Try using place_id first (most reliable)
    if 'place_id' in facility:
        try:
            print(f"  Fetching via Place ID: {facility['place_id'][:20]}...")
            result = populartimes.get_id(api_key, facility['place_id'])
            return result
        except Exception as e:
            print(f"  ⚠️  Place ID fetch failed: {e}")
            # Fall back to coordinates if available
            if 'lat' not in facility or 'lng' not in facility:
                return None

    # Try using coordinates
    if 'lat' in facility and 'lng' in facility:
        try:
            lat = facility['lat']
            lng = facility['lng']
            print(f"  Fetching via coordinates: ({lat:.6f}, {lng:.6f})...")

            # Search in small radius around facility
            radius = 50  # meters
            offset = radius / 111000.0
            p1 = (lat - offset, lng - offset)
            p2 = (lat + offset, lng + offset)

            # Search for all types to maximize chance of finding the facility
            results = populartimes.get(api_key, ['establishment'], p1, p2)

            if results and len(results) > 0:
                # Return the first result (should be the closest)
                return results[0]
            else:
                print(f"  ⚠️  No results found near coordinates")
                return None

        except Exception as e:
            print(f"  ⚠️  Coordinate fetch failed: {e}")
            return None

    print(f"  ⚠️  No place_id or coordinates available")
    return None


def process_facilities(input_file, output_file, delay=0.5):
    """
    Process all facilities from input JSON and fetch popular times data.

    Args:
        input_file: Path to geocoded JSON file
        output_file: Path to output JSON file with popular times data
        delay: Delay between API calls in seconds (default 0.5s to be safe)
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

    print(f"\n📊 Fetching popular times for {len(facilities)} facilities...\n")
    print(f"⏱️  Estimated time: ~{len(facilities) * delay / 60:.1f} minutes\n")

    results = []
    success_count = 0
    no_data_count = 0
    error_count = 0
    timestamp = datetime.utcnow().isoformat() + 'Z'

    for i, facility in enumerate(facilities, 1):
        name = facility.get('name', 'Unknown')

        print(f"{i:3d}/{len(facilities)} Processing: {name}")

        # Fetch popular times data
        popular_data = fetch_popular_times(facility, API_KEY)

        if popular_data:
            # Check if it has popular times
            has_popular_times = 'populartimes' in popular_data and popular_data['populartimes']

            if has_popular_times:
                # Merge original facility data with popular times data
                enriched = {
                    # Original data
                    'id': facility.get('id', f"facility-{i}"),
                    'name': facility.get('name', popular_data.get('name', 'Unknown')),
                    'address': facility.get('address', popular_data.get('address', '')),
                    'formatted_address': facility.get('formatted_address', popular_data.get('address', '')),
                    'type': facility.get('type', 'unknown'),
                    'location': facility.get('location', ''),

                    # Geocoded data
                    'lat': facility.get('lat', popular_data.get('coordinates', {}).get('lat')),
                    'lng': facility.get('lng', popular_data.get('coordinates', {}).get('lng')),
                    'place_id': facility.get('place_id', popular_data.get('id', '')),

                    # Popular times data
                    'rating': popular_data.get('rating'),
                    'rating_n': popular_data.get('rating_n', 0),
                    'current_popularity': popular_data.get('current_popularity'),
                    'time_spent': popular_data.get('time_spent'),
                    'populartimes': popular_data.get('populartimes', []),

                    # Metadata
                    'fetched_at': timestamp,
                    'has_popular_times': True
                }

                results.append(enriched)
                success_count += 1
                print(f"     ✅ Success: {len(enriched['populartimes'])} days of data")
                print(f"        Rating: {enriched.get('rating', 'N/A')} ({enriched.get('rating_n', 0)} reviews)")
            else:
                # No popular times data available
                enriched = {**facility}
                enriched['has_popular_times'] = False
                enriched['fetched_at'] = timestamp
                enriched['populartimes'] = []

                results.append(enriched)
                no_data_count += 1
                print(f"     ⚠️  No popular times data available")
        else:
            # API error or not found
            enriched = {**facility}
            enriched['has_popular_times'] = False
            enriched['error'] = 'Failed to fetch data'
            enriched['fetched_at'] = timestamp
            enriched['populartimes'] = []

            results.append(enriched)
            error_count += 1
            print(f"     ❌ Error fetching data")

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
    print(f"\n{'='*70}")
    print(f"SUMMARY:")
    print(f"  Total facilities: {len(facilities)}")
    print(f"  ✅ With popular times data: {success_count}")
    print(f"  ⚠️  Without popular times data: {no_data_count}")
    print(f"  ❌ Errors: {error_count}")
    print(f"  📊 Success rate: {success_count/len(facilities)*100:.1f}%")
    print(f"{'='*70}\n")

    # Additional info
    if success_count > 0:
        print(f"✨ {success_count} facilities ready for the comparison grid!")
    if no_data_count > 0:
        print(f"💡 {no_data_count} facilities don't have popular times (may be new or less visited)")
    if error_count > 0:
        print(f"⚠️  {error_count} facilities had errors - check place_id or coordinates")


def main():
    """Main function with command-line argument parsing."""
    parser = argparse.ArgumentParser(
        description='Fetch popular times data for geocoded facilities',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fetch data for test facilities
  python batch_popular_times.py geocoded_test.json facilities_test.json

  # Fetch data for full list
  python batch_popular_times.py geocoded_full.json facilities_full.json

  # Custom rate limiting (slower, safer)
  python batch_popular_times.py geocoded_full.json facilities_full.json --delay 1.0

Input JSON format:
  [
    {
      "name": "Facility Name",
      "address": "123 Main St",
      "lat": 41.8781,
      "lng": -87.6298,
      "place_id": "ChIJ...",
      "type": "public",
      "location": "City"
    },
    ...
  ]

Output JSON format:
  [
    {
      "id": "facility-1",
      "name": "Facility Name",
      "address": "123 Main St",
      "lat": 41.8781,
      "lng": -87.6298,
      "place_id": "ChIJ...",
      "type": "public",
      "location": "City",
      "rating": 4.5,
      "rating_n": 120,
      "current_popularity": 45,
      "time_spent": "1-2 hours",
      "populartimes": [
        {"day": 0, "data": [0, 0, 0, 5, 10, ...]},
        ...
      ],
      "has_popular_times": true,
      "fetched_at": "2025-01-05T15:30:00Z"
    },
    ...
  ]
        """
    )

    parser.add_argument('input', help='Input JSON file with geocoded facilities')
    parser.add_argument('output', help='Output JSON file for facilities with popular times data')
    parser.add_argument('--delay', type=float, default=0.5,
                       help='Delay between API calls in seconds (default: 0.5)')

    args = parser.parse_args()

    process_facilities(args.input, args.output, delay=args.delay)


if __name__ == "__main__":
    main()

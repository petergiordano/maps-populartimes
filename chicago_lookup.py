#!/usr/bin/env python3
"""
Chicago Address Popular Times Lookup

This script retrieves Google Maps popular times data for a specific address in Chicago
and creates visualizations with customizable date ranges.
"""

import os
import argparse
from dotenv import load_dotenv
import populartimes
from visualizer import (
    create_heatmap,
    create_line_chart,
    create_bar_chart_comparison,
    create_summary_dashboard,
    show_plots
)

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

if not API_KEY:
    print("Error: GOOGLE_MAPS_API_KEY not found in .env file")
    print("Please create a .env file and add your Google Maps API key")
    exit(1)


def get_popular_times_by_area(api_key, lat, lng, place_types=None, radius=100):
    """
    Get popular times data for places in an area.

    Args:
        api_key: Google Maps API key
        lat: Center latitude
        lng: Center longitude
        place_types: List of place types (e.g., ['restaurant', 'bar', 'cafe'])
        radius: Search radius in meters (default 100m)
    """
    if place_types is None:
        place_types = ['restaurant', 'bar', 'cafe', 'store']

    # Calculate bounding box (approximate)
    # ~111 meters per 0.001 degrees at Chicago's latitude
    offset = radius / 111000.0

    p1 = (lat - offset, lng - offset)  # Southwest corner
    p2 = (lat + offset, lng + offset)  # Northeast corner

    print(f"\nSearching for {place_types} within {radius}m of ({lat}, {lng})...")

    try:
        results = populartimes.get(api_key, place_types, p1, p2)
        return results
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_place_by_id(api_key, place_id):
    """
    Get popular times data for a specific place by ID.

    Args:
        api_key: Google Maps API key
        place_id: Google Maps Place ID
    """
    try:
        result = populartimes.get_id(api_key, place_id)
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None


def print_popular_times(place):
    """Print popular times data for a place in a readable format."""
    print(f"\n{'='*80}")
    print(f"Name: {place.get('name', 'Unknown')}")
    print(f"Address: {place.get('address', 'Unknown')}")
    print(f"Rating: {place.get('rating', 'N/A')} ({place.get('rating_n', 0)} reviews)")

    if 'current_popularity' in place:
        print(f"Current Popularity: {place['current_popularity']}/100")

    if 'time_spent' in place:
        print(f"Typical Time Spent: {place['time_spent']}")

    if 'populartimes' in place and place['populartimes']:
        print("\nPopular Times (by day):")
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        for day_data in place['populartimes']:
            if 'day' not in day_data:
                continue
            day_name = days[day_data['day']]
            print(f"\n  {day_name}:")

            if 'data' in day_data:
                # Show peak hours
                peak_hour = max(range(len(day_data['data'])), key=lambda i: day_data['data'][i])
                peak_value = day_data['data'][peak_hour]
                print(f"    Peak: {peak_hour}:00 - {peak_hour+1}:00 (popularity: {peak_value}/100)")

                # Show hourly breakdown
                print(f"    Hourly breakdown:")
                for hour, popularity in enumerate(day_data['data']):
                    if popularity > 0:
                        bar = '█' * (popularity // 5)
                        print(f"      {hour:02d}:00 [{popularity:3d}/100] {bar}")
    else:
        print("\nNo popular times data available for this location")

    print('='*80)


def parse_day_range(day_range_str):
    """
    Parse day range string into tuple.

    Args:
        day_range_str: String like "0-4" (Mon-Fri) or "5-6" (Sat-Sun)

    Returns:
        Tuple of (start_day, end_day) or None
    """
    if not day_range_str:
        return None

    try:
        parts = day_range_str.split('-')
        if len(parts) == 2:
            start = int(parts[0])
            end = int(parts[1])
            if 0 <= start <= 6 and 0 <= end <= 6 and start <= end:
                return (start, end)
        elif len(parts) == 1:
            day = int(parts[0])
            if 0 <= day <= 6:
                return (day, day)
    except ValueError:
        pass

    print(f"Invalid day range: {day_range_str}")
    print("Use format: 0-6 (0=Monday, 6=Sunday)")
    return None


def main():
    """Main function with command-line arguments for customization."""

    parser = argparse.ArgumentParser(
        description='Get and visualize Google Maps popular times data for Chicago locations',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Get data for area and show full dashboard
  python chicago_lookup.py --lat 41.8788 --lng -87.6359

  # Filter by specific days (Monday-Friday)
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 0-4

  # Show only weekends
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --days 5-6

  # Customize search parameters
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --radius 500 --types restaurant bar

  # Get data for specific place by ID
  python chicago_lookup.py --place-id ChIJ3eFG8Sj0BIgRJvVcGtERPJ0

  # Choose visualization type
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz heatmap
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz line
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --viz comparison

  # Save output to file
  python chicago_lookup.py --lat 41.8788 --lng -87.6359 --output results.png

Day codes: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
        """
    )

    # Location parameters
    parser.add_argument('--lat', type=float, help='Latitude of search center')
    parser.add_argument('--lng', type=float, help='Longitude of search center')
    parser.add_argument('--place-id', help='Google Maps Place ID for specific location')

    # Search parameters
    parser.add_argument('--radius', type=int, default=200,
                       help='Search radius in meters (default: 200)')
    parser.add_argument('--types', nargs='+', default=['restaurant', 'cafe'],
                       help='Place types to search for (default: restaurant cafe)')

    # Visualization parameters
    parser.add_argument('--days', type=str,
                       help='Day range to display (e.g., "0-4" for Mon-Fri, "5-6" for weekend)')
    parser.add_argument('--viz', choices=['dashboard', 'heatmap', 'line', 'comparison'],
                       default='dashboard',
                       help='Visualization type (default: dashboard)')
    parser.add_argument('--output', help='Save visualization to file (e.g., output.png)')
    parser.add_argument('--no-display', action='store_true',
                       help='Do not display plots (useful with --output)')

    args = parser.parse_args()

    # Parse day range
    day_range = parse_day_range(args.days) if args.days else None

    # Get data
    results = None

    if args.place_id:
        # Get specific place by ID
        print(f"Fetching data for place ID: {args.place_id}")
        result = get_place_by_id(API_KEY, args.place_id)
        if result:
            results = [result]

    elif args.lat and args.lng:
        # Search by area
        print(f"Searching near ({args.lat}, {args.lng})")
        results = get_popular_times_by_area(
            API_KEY,
            args.lat,
            args.lng,
            place_types=args.types,
            radius=args.radius
        )

    else:
        # Use default Chicago location (Willis Tower)
        print("No location specified, using default (Willis Tower)")
        print("Use --lat and --lng to specify a location, or --place-id for a specific place")
        lat, lng = 41.8788, -87.6359
        results = get_popular_times_by_area(
            API_KEY,
            lat,
            lng,
            place_types=args.types,
            radius=args.radius
        )

    # Process results
    if not results or len(results) == 0:
        print("No results found")
        return

    print(f"\nFound {len(results)} places with data")

    # Filter places that have popular times data
    places_with_data = [p for p in results if 'populartimes' in p and p['populartimes']]

    if not places_with_data:
        print("No places with popular times data found")
        return

    print(f"{len(places_with_data)} places have popular times data")

    # Print text summary for first place
    print_popular_times(places_with_data[0])

    # Create visualizations
    if args.viz == 'dashboard':
        print("\nCreating dashboard...")
        create_summary_dashboard(places_with_data[0], save_path=args.output)

    elif args.viz == 'heatmap':
        print("\nCreating heatmap...")
        create_heatmap(places_with_data[0], days_range=day_range, save_path=args.output)

    elif args.viz == 'line':
        print("\nCreating line chart...")
        create_line_chart(places_with_data[0], days_range=day_range, save_path=args.output)

    elif args.viz == 'comparison':
        print("\nCreating comparison chart...")
        # Compare all places at noon
        create_bar_chart_comparison(places_with_data, hour=12, save_path=args.output)

    # Show plots unless --no-display is set
    if not args.no_display:
        print("\nDisplaying plots... (close window to exit)")
        show_plots()


if __name__ == "__main__":
    main()

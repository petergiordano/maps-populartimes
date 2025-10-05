#!/usr/bin/env python3
"""
Data Summary Tool

Analyzes the facilities dataset and provides a summary of what's ready for the app.
"""

import json
import sys


def summarize_dataset(file_path):
    """Generate summary statistics for the facilities dataset."""

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            facilities = json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{file_path}': {e}")
        sys.exit(1)

    print(f"\n{'='*70}")
    print(f"DATASET SUMMARY: {file_path}")
    print(f"{'='*70}\n")

    # Basic counts
    total = len(facilities)
    public = sum(1 for f in facilities if f.get('type') == 'public')
    private = sum(1 for f in facilities if f.get('type') == 'private')

    print(f"📊 TOTALS:")
    print(f"   Total facilities: {total}")
    print(f"   Public (free): {public}")
    print(f"   Private (pay-to-play): {private}")
    print()

    # Popular times data
    with_popular_times = [f for f in facilities if f.get('has_popular_times', False)]
    without_popular_times = [f for f in facilities if not f.get('has_popular_times', False)]

    print(f"📈 POPULAR TIMES DATA:")
    print(f"   ✅ With data: {len(with_popular_times)}")
    print(f"   ❌ Without data: {len(without_popular_times)}")
    print(f"   📊 Coverage: {len(with_popular_times)/total*100:.1f}%")
    print()

    # Ratings
    with_ratings = [f for f in facilities if f.get('rating')]
    avg_rating = sum(f['rating'] for f in with_ratings) / len(with_ratings) if with_ratings else 0

    print(f"⭐ RATINGS:")
    print(f"   Facilities with ratings: {len(with_ratings)}/{total}")
    print(f"   Average rating: {avg_rating:.2f}")
    if with_ratings:
        highest = max(with_ratings, key=lambda f: f['rating'])
        print(f"   Highest rated: {highest['name']} ({highest['rating']}⭐)")
    print()

    # List facilities with popular times
    if with_popular_times:
        print(f"✅ FACILITIES WITH POPULAR TIMES DATA:")
        for i, f in enumerate(with_popular_times, 1):
            rating_str = f"({f.get('rating', 'N/A')}⭐)" if f.get('rating') else ""
            type_str = f.get('type', 'unknown').upper()
            days = len(f.get('populartimes', []))
            print(f"   {i}. {f['name']} [{type_str}] {rating_str}")
            print(f"      {f.get('formatted_address', f.get('address', 'No address'))}")
            print(f"      Popular times: {days} days of data")
        print()

    # List facilities without popular times
    if without_popular_times:
        print(f"❌ FACILITIES WITHOUT POPULAR TIMES DATA:")
        for i, f in enumerate(without_popular_times, 1):
            type_str = f.get('type', 'unknown').upper()
            print(f"   {i}. {f['name']} [{type_str}]")
            print(f"      {f.get('formatted_address', f.get('address', 'No address'))}")
        print()

    # Data quality
    print(f"✨ DATA QUALITY:")
    complete_data = [f for f in facilities if all([
        f.get('name'),
        f.get('lat'),
        f.get('lng'),
        f.get('place_id'),
        f.get('has_popular_times')
    ])]
    print(f"   Complete records: {len(complete_data)}/{total} ({len(complete_data)/total*100:.1f}%)")
    print()

    print(f"{'='*70}")
    print(f"✅ READY FOR APP DEVELOPMENT")
    print(f"{'='*70}\n")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "facilities_final.json"

    summarize_dataset(file_path)

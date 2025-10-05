#!/usr/bin/env python3
"""
Popular Times Visualization Module

Creates various visualizations for Google Maps popular times data.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import seaborn as sns


# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 8)


def create_heatmap(place, days_range=None, save_path=None):
    """
    Create a heatmap showing popular times across the week.

    Args:
        place: Place data from populartimes API
        days_range: Tuple of (start_day, end_day) where 0=Monday, 6=Sunday
                   None means show all days
        save_path: Optional path to save the figure
    """
    if 'populartimes' not in place or not place['populartimes']:
        print(f"No popular times data available for {place.get('name', 'this location')}")
        return None

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    # Build data matrix
    data = []
    day_labels = []

    for day_data in place['populartimes']:
        day_idx = day_data['day']

        # Filter by date range if specified
        if days_range and (day_idx < days_range[0] or day_idx > days_range[1]):
            continue

        if 'data' in day_data:
            data.append(day_data['data'])
            day_labels.append(days[day_idx])

    if not data:
        print("No data in specified date range")
        return None

    data = np.array(data)

    # Create heatmap
    fig, ax = plt.subplots(figsize=(16, 6))

    im = ax.imshow(data, cmap='YlOrRd', aspect='auto', vmin=0, vmax=100)

    # Set ticks and labels
    ax.set_xticks(np.arange(24))
    ax.set_yticks(np.arange(len(day_labels)))
    ax.set_xticklabels([f'{h}:00' for h in range(24)], rotation=45, ha='right')
    ax.set_yticklabels(day_labels)

    # Add colorbar
    cbar = plt.colorbar(im, ax=ax)
    cbar.set_label('Popularity (0-100)', rotation=270, labelpad=20)

    # Add text annotations
    for i in range(len(day_labels)):
        for j in range(24):
            if data[i, j] > 0:
                text = ax.text(j, i, int(data[i, j]),
                             ha="center", va="center",
                             color="white" if data[i, j] > 50 else "black",
                             fontsize=7)

    ax.set_title(f"Popular Times - {place.get('name', 'Location')}\n{place.get('address', '')}",
                 fontsize=14, pad=20)
    ax.set_xlabel('Hour of Day')
    ax.set_ylabel('Day of Week')

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Saved heatmap to {save_path}")

    return fig


def create_line_chart(place, days_range=None, save_path=None):
    """
    Create line charts showing popular times by day.

    Args:
        place: Place data from populartimes API
        days_range: Tuple of (start_day, end_day) where 0=Monday, 6=Sunday
        save_path: Optional path to save the figure
    """
    if 'populartimes' not in place or not place['populartimes']:
        print(f"No popular times data available for {place.get('name', 'this location')}")
        return None

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    colors = plt.cm.tab10(np.linspace(0, 1, 7))

    fig, ax = plt.subplots(figsize=(14, 7))

    for day_data in place['populartimes']:
        day_idx = day_data['day']

        # Filter by date range if specified
        if days_range and (day_idx < days_range[0] or day_idx > days_range[1]):
            continue

        if 'data' in day_data:
            hours = list(range(24))
            popularity = day_data['data']
            ax.plot(hours, popularity, marker='o', label=days[day_idx],
                   color=colors[day_idx], linewidth=2, markersize=4)

    ax.set_xlabel('Hour of Day', fontsize=12)
    ax.set_ylabel('Popularity (0-100)', fontsize=12)
    ax.set_title(f"Popular Times by Day - {place.get('name', 'Location')}\n{place.get('address', '')}",
                 fontsize=14, pad=20)
    ax.set_xticks(range(24))
    ax.set_xticklabels([f'{h}:00' for h in range(24)], rotation=45, ha='right')
    ax.legend(loc='upper left', bbox_to_anchor=(1, 1))
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 105)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Saved line chart to {save_path}")

    return fig


def create_bar_chart_comparison(places, hour=12, day=None, save_path=None):
    """
    Create bar chart comparing popularity across multiple places at a specific time.

    Args:
        places: List of place data from populartimes API
        hour: Hour of day (0-23) to compare
        day: Day of week (0=Monday, 6=Sunday), None means average all days
        save_path: Optional path to save the figure
    """
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    place_names = []
    popularities = []

    for place in places:
        if 'populartimes' not in place or not place['populartimes']:
            continue

        name = place.get('name', 'Unknown')[:30]  # Truncate long names

        if day is not None:
            # Get specific day
            day_data = next((d for d in place['populartimes'] if d['day'] == day), None)
            if day_data and 'data' in day_data and len(day_data['data']) > hour:
                place_names.append(name)
                popularities.append(day_data['data'][hour])
        else:
            # Average across all days
            values = []
            for day_data in place['populartimes']:
                if 'data' in day_data and len(day_data['data']) > hour:
                    values.append(day_data['data'][hour])
            if values:
                place_names.append(name)
                popularities.append(np.mean(values))

    if not place_names:
        print("No data available for comparison")
        return None

    # Sort by popularity
    sorted_indices = np.argsort(popularities)[::-1]
    place_names = [place_names[i] for i in sorted_indices]
    popularities = [popularities[i] for i in sorted_indices]

    # Create bar chart
    fig, ax = plt.subplots(figsize=(12, max(6, len(place_names) * 0.4)))

    colors = plt.cm.YlOrRd(np.array(popularities) / 100)
    bars = ax.barh(range(len(place_names)), popularities, color=colors)

    ax.set_yticks(range(len(place_names)))
    ax.set_yticklabels(place_names)
    ax.set_xlabel('Popularity (0-100)', fontsize=12)
    ax.set_xlim(0, 105)

    day_str = days[day] if day is not None else "Average All Days"
    ax.set_title(f"Popularity Comparison at {hour}:00 ({day_str})", fontsize=14, pad=20)

    # Add value labels on bars
    for i, (bar, val) in enumerate(zip(bars, popularities)):
        ax.text(val + 2, i, f'{int(val)}', va='center', fontsize=9)

    ax.grid(axis='x', alpha=0.3)
    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Saved comparison chart to {save_path}")

    return fig


def create_summary_dashboard(place, save_path=None):
    """
    Create a comprehensive dashboard with multiple visualizations.

    Args:
        place: Place data from populartimes API
        save_path: Optional path to save the figure
    """
    if 'populartimes' not in place or not place['populartimes']:
        print(f"No popular times data available for {place.get('name', 'this location')}")
        return None

    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    fig = plt.figure(figsize=(16, 10))
    gs = fig.add_gridspec(3, 2, hspace=0.3, wspace=0.3)

    # Title
    fig.suptitle(f"{place.get('name', 'Location')} - Popular Times Dashboard\n{place.get('address', '')}",
                 fontsize=16, fontweight='bold')

    # 1. Heatmap (top row, full width)
    ax1 = fig.add_subplot(gs[0, :])
    data = []
    for day_data in place['populartimes']:
        if 'data' in day_data:
            data.append(day_data['data'])

    data = np.array(data)
    im = ax1.imshow(data, cmap='YlOrRd', aspect='auto', vmin=0, vmax=100)
    ax1.set_xticks(np.arange(24))
    ax1.set_yticks(np.arange(7))
    ax1.set_xticklabels([f'{h}:00' for h in range(24)], rotation=45, ha='right', fontsize=8)
    ax1.set_yticklabels(days)
    ax1.set_title('Weekly Heatmap')
    plt.colorbar(im, ax=ax1, label='Popularity')

    # 2. Weekday vs Weekend (middle left)
    ax2 = fig.add_subplot(gs[1, 0])
    weekday_avg = np.mean([d['data'] for d in place['populartimes'][:5] if 'data' in d], axis=0)
    weekend_avg = np.mean([d['data'] for d in place['populartimes'][5:] if 'data' in d], axis=0)
    hours = list(range(24))
    ax2.plot(hours, weekday_avg, label='Weekday Avg', linewidth=2, marker='o', markersize=4)
    ax2.plot(hours, weekend_avg, label='Weekend Avg', linewidth=2, marker='o', markersize=4)
    ax2.set_xlabel('Hour')
    ax2.set_ylabel('Popularity')
    ax2.set_title('Weekday vs Weekend')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    ax2.set_xticks(range(0, 24, 3))

    # 3. Peak hours by day (middle right)
    ax3 = fig.add_subplot(gs[1, 1])
    peak_hours = []
    peak_values = []
    for day_data in place['populartimes']:
        if 'data' in day_data:
            peak_hour = np.argmax(day_data['data'])
            peak_hours.append(peak_hour)
            peak_values.append(day_data['data'][peak_hour])

    colors = plt.cm.YlOrRd(np.array(peak_values) / 100)
    bars = ax3.bar(range(7), peak_hours, color=colors)
    ax3.set_xticks(range(7))
    ax3.set_xticklabels(days)
    ax3.set_ylabel('Peak Hour')
    ax3.set_ylim(0, 24)
    ax3.set_yticks(range(0, 24, 3))
    ax3.set_yticklabels([f'{h}:00' for h in range(0, 24, 3)])
    ax3.set_title('Daily Peak Hours')
    ax3.grid(axis='y', alpha=0.3)

    # Add value labels
    for i, (bar, hour, val) in enumerate(zip(bars, peak_hours, peak_values)):
        ax3.text(i, hour + 0.5, f'{hour}:00\n({int(val)})', ha='center', fontsize=8)

    # 4. Statistics table (bottom left)
    ax4 = fig.add_subplot(gs[2, 0])
    ax4.axis('off')

    stats_text = f"""
    Location Statistics:

    Rating: {place.get('rating', 'N/A')} ({place.get('rating_n', 0)} reviews)
    Current Popularity: {place.get('current_popularity', 'N/A')}
    Time Spent: {place.get('time_spent', 'N/A')}

    Overall Peak: {np.argmax(np.max(data, axis=0))}:00 ({int(np.max(data))} popularity)
    Overall Quietest: {np.argmin(np.mean(data, axis=0))}:00
    Busiest Day: {days[np.argmax(np.mean(data, axis=1))]}
    """

    ax4.text(0.1, 0.5, stats_text, fontsize=11, verticalalignment='center',
             fontfamily='monospace', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))

    # 5. Average daily pattern (bottom right)
    ax5 = fig.add_subplot(gs[2, 1])
    avg_pattern = np.mean(data, axis=0)
    ax5.fill_between(hours, avg_pattern, alpha=0.3, color='steelblue')
    ax5.plot(hours, avg_pattern, linewidth=2, marker='o', markersize=4, color='steelblue')
    ax5.set_xlabel('Hour')
    ax5.set_ylabel('Popularity')
    ax5.set_title('Average Daily Pattern')
    ax5.grid(True, alpha=0.3)
    ax5.set_xticks(range(0, 24, 3))
    ax5.set_xticklabels([f'{h}:00' for h in range(0, 24, 3)])

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Saved dashboard to {save_path}")

    return fig


def show_plots():
    """Display all created plots."""
    plt.show()

import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.widgets import Button

# Load the CSV file containing hotel data
def analyze_top_rated_hotels(csv_file_path, show_chart=False, output_image_path=None):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Ensure the required columns exist
    if 'name' not in df.columns or 'rating' not in df.columns:
        raise ValueError("CSV file must contain 'Hotel Name' and 'Rating' columns.")

    # Sort hotels by rating in descending order and select the top 10
    top_hotels = df.sort_values(by='rating', ascending=False).head(10)

    # Generate a bar chart for the top-rated hotels
    plt.figure(figsize=(10, 6))
    plt.barh(top_hotels['name'], top_hotels['rating'], color='skyblue')
    plt.xlabel('Rating')
    plt.ylabel('Hotel Name')
    plt.title('Top 10 Rated Hotels')
    plt.gca().invert_yaxis()  # Invert y-axis to show the highest-rated hotel at the top
    plt.tight_layout()

    if show_chart:
        # Show the chart on the screen
        plt.show()
    elif output_image_path:
        # Save the chart as an image
        plt.savefig(output_image_path)
        print(f"Bar chart saved as {output_image_path}")
    plt.close()

# Function to analyze price vs location
def analyze_price_vs_location(csv_file_path, show_chart=False, output_image_path=None):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Ensure the required columns exist
    if 'location' not in df.columns or 'price' not in df.columns:
        raise ValueError("CSV file must contain 'location' and 'price' columns.")

    # Generate a scatter plot for price vs location
    plt.figure(figsize=(12, 6))
    plt.scatter(df['location'], str(df['price']), alpha=0.7, color='blue')
    plt.xlabel('Location')
    plt.ylabel('Price')
    plt.title('Price vs Location')
    plt.xticks(rotation=45)  # Rotate x-axis labels for better readability
    plt.tight_layout()

    if show_chart:
        # Show the chart on the screen
        plt.show()
    elif output_image_path:
        # Save the chart as an image
        plt.savefig(output_image_path)
        print(f"Scatter plot saved as {output_image_path}")
    plt.close()

def show_combined_graphs(csv_file_path):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Ensure the required columns exist for both analyses
    if 'name' not in df.columns or 'rating' not in df.columns:
        raise ValueError("CSV file must contain 'name' and 'rating' columns for top-rated hotels analysis.")
    if 'location' not in df.columns or 'price' not in df.columns:
        raise ValueError("CSV file must contain 'location' and 'price' columns for price analysis.")

    # Create a figure with two subplots
    fig, axes = plt.subplots(1, 2, figsize=(18, 8))

    # Top Rated Hotels Analysis
    top_hotels = df.sort_values(by='rating', ascending=False).head(10)
    axes[0].barh(top_hotels['name'], top_hotels['rating'], color='skyblue')
    axes[0].set_xlabel('Rating')
    axes[0].set_ylabel('Hotel Name')
    axes[0].set_title('Top 10 Rated Hotels')
    axes[0].invert_yaxis()  # Invert y-axis to show the highest-rated hotel at the top

    # Most Expensive vs Cheapest Locations Analysis
    # Group by location and calculate the average price
    location_prices = df.groupby('location')['price'].mean().reset_index()

    # Sort by price to get the top 5 most expensive and cheapest locations
    most_expensive = location_prices.sort_values(by='price', ascending=False).head(5)
    cheapest = location_prices.sort_values(by='price', ascending=True).head(5)

    # Combine the two datasets for visualization
    combined = pd.concat([most_expensive, cheapest])
    combined['type'] = ['Most Expensive'] * len(most_expensive) + ['Cheapest'] * len(cheapest)

    # Create a bar chart
    axes[1].bar(combined['location'], combined['price'], color=['red' if t == 'Most Expensive' else 'green' for t in combined['type']])
    axes[1].set_xlabel('Location')
    axes[1].set_ylabel('Average Price')
    axes[1].set_title('Most Expensive vs Cheapest Locations')
    axes[1].tick_params(axis='x', rotation=45)  # Rotate x-axis labels for better readability

    # Adjust layout and show the combined figure
    plt.tight_layout()
    plt.show()

def show_toggling_graphs(csv_file_path):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Ensure the required columns exist for all analyses
    if 'name' not in df.columns or 'rating' not in df.columns:
        raise ValueError("CSV file must contain 'name' and 'rating' columns for top-rated hotels analysis.")
    if 'location' not in df.columns or 'price' not in df.columns:
        raise ValueError("CSV file must contain 'location' and 'price' columns for price analysis.")
    if 'breakfast' not in df.columns or 'beds' not in df.columns:
        raise ValueError("CSV file must contain 'breakfast' and 'beds' columns for additional analysis.")

    # Create a figure
    fig, ax = plt.subplots(figsize=(12, 8))
    plt.subplots_adjust(top=0.9, right=0.95)  # Adjust space for navigation arrows

    # Function to draw Page 1 (Top Rated Hotels)
    def draw_page_1():
        ax.clear()
        top_hotels = df.sort_values(by='rating', ascending=False).head(10)
        ax.barh(top_hotels['name'], top_hotels['rating'], color='skyblue')
        ax.set_xlabel('Rating')
        ax.set_ylabel('Hotel Name')
        ax.set_title('Top 10 Rated Hotels')
        ax.invert_yaxis()  # Invert y-axis to show the highest-rated hotel at the top
        fig.canvas.draw_idle()

    # Function to draw Page 2 (Most Expensive vs Cheapest Locations)
    def draw_page_2():
        ax.clear()
        # Group by location and calculate the average price
        location_prices = df.groupby('location')['price'].mean().reset_index()

        # Sort by price to get the top 5 most expensive and cheapest locations
        most_expensive = location_prices.sort_values(by='price', ascending=False).head(5)
        cheapest = location_prices.sort_values(by='price', ascending=True).head(5)

        # Combine the two datasets for visualization
        combined = pd.concat([most_expensive, cheapest])
        combined['type'] = ['Most Expensive'] * len(most_expensive) + ['Cheapest'] * len(cheapest)

        # Create a bar chart
        ax.bar(combined['location'], combined['price'], color=['red' if t == 'Most Expensive' else 'green' for t in combined['type']])
        ax.set_xlabel('Location')
        ax.set_ylabel('Average Price')
        ax.set_title('Most Expensive vs Cheapest Locations')
        ax.tick_params(axis='x', rotation=45)  # Rotate x-axis labels for better readability
        fig.canvas.draw_idle()

    # Function to draw Page 3 (Free Breakfast vs Beds)
    def draw_page_3():
        ax.clear()
        # Group by free breakfast and calculate average price and beds
        breakfast_data = df.groupby('breakfast').agg({'price': 'mean', 'beds': 'mean'}).reset_index()

        # Create a bar chart with two bars for each group
        bar_width = 0.35
        x = range(len(breakfast_data))
        ax.bar(x, breakfast_data['price'], width=bar_width, label='Average Price', color='blue')
        ax.bar([i + bar_width for i in x], breakfast_data['beds'], width=bar_width, label='Average Beds', color='orange')

        # Add labels and title
        ax.set_xlabel('Free Breakfast (Yes=1, No=0)')
        ax.set_ylabel('Values')
        ax.set_title('Comparison of Free Breakfast vs Beds')
        ax.set_xticks([i + bar_width / 2 for i in x])
        ax.set_xticklabels(breakfast_data['breakfast'])
        ax.legend()
        fig.canvas.draw_idle()

    # Initial draw (Page 1)
    draw_page_1()

    # Add navigation arrows
    ax_prev = plt.axes([0.85, 0.92, 0.05, 0.05])  # Position for the "Previous" arrow
    ax_next = plt.axes([0.91, 0.92, 0.05, 0.05])  # Position for the "Next" arrow
    button_prev = Button(ax_prev, '←')  # Left arrow
    button_next = Button(ax_next, '→')  # Right arrow

    # State to track the current page
    current_page = [1]

    # Function to handle "Previous" button click
    def on_prev(event):
        if current_page[0] > 1:
            current_page[0] -= 1
            if current_page[0] == 1:
                draw_page_1()
            elif current_page[0] == 2:
                draw_page_2()

    # Function to handle "Next" button click
    def on_next(event):
        if current_page[0] < 3:
            current_page[0] += 1
            if current_page[0] == 2:
                draw_page_2()
            elif current_page[0] == 3:
                draw_page_3()

    # Connect button clicks to their respective functions
    button_prev.on_clicked(on_prev)
    button_next.on_clicked(on_next)

    # Show the UI
    plt.show()

# Example usage
csv_file_path = r'c:\Users\yasir\Desktop\41091 Data Systems\StayMatch\Backend\data\finaldata\merged_finaldata.csv'  # Update with your CSV file path

# Show the toggling UI
show_toggling_graphs(csv_file_path)
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd
import time
import keyboard
import datetime
import os

# Setup Chrome
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument("--disable-blink-features=AutomationControlled")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Booking.com search URL with your filter/location/dates
url = (
    "https://www.booking.com/searchresults.en-gb.html?label=en-au-booking-desktop-NG5ZKhQc*lZ*DP_1zn8GPAS652796015697%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp9071746%3Ali%3Adec%3Adm"
    "&sid=73ea76648bf9569ec3605e090937b7ee&aid=2311236&ss=Saudi+Arabia&lang=en-gb"
    "&dest_id=186&dest_type=country&checkin=2026-07-31&checkout=2026-08-01"
    "&group_adults=2&no_rooms=1&group_children=0"
)
driver.get(url)
time.sleep(5)

hotel_data = []
all_features = set()
print("✅ Scraper running. Scroll manually and apply filters.\n⏹️ Press ALT + B to stop and save.\n")

def scrape_visible_hotels():
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    hotels = soup.find_all('div', {'data-testid': 'property-card'})

    for hotel in hotels:
        name = (
            hotel.find('div', {'data-testid': 'title'}).get_text(strip=True)
            if hotel.find('div', {'data-testid': 'title'}) else 'N/A'
        )
        location = (
            hotel.find('span', {'data-testid': 'address'}).get_text(strip=True)
            if hotel.find('span', {'data-testid': 'address'}) else 'N/A'
        )
        price = (
            hotel.find('span', {'data-testid': 'price-and-discounted-price'}).get_text(strip=True)
            if hotel.find('span', {'data-testid': 'price-and-discounted-price'}) else 'N/A'
        )
        rating = (
            hotel.find('div', {'data-testid': 'review-score'}).get_text(strip=True)
            if hotel.find('div', {'data-testid': 'review-score'}) else 'N/A'
        )
        reviews = (
            hotel.find('div', {'data-testid': 'review-score'}).find_next('div').get_text(strip=True)
            if hotel.find('div', {'data-testid': 'review-score'}) else 'N/A'
        )

        # Combine visible text for feature detection
        all_text = hotel.get_text(separator=' ', strip=True).lower()
        detected_features = set()
        keywords = [
            "free wifi", "private bathroom", "sea view", "swimming pool", "spa",
            "no prepayment", "breakfast included", "restaurant", "parking",
            "24-hour front desk", "free cancellation", "soundproof",
            "non-smoking rooms", "air conditioning"
        ]
        for kw in keywords:
            if kw in all_text:
                detected_features.add(kw)
        all_features.update(detected_features)

        # Extract room type and bed info
        room_type, bed_info = "N/A", "N/A"
        for span in hotel.find_all('span'):
            text = span.get_text(strip=True).lower()
            if 'room' in text and len(text.split()) < 8:
                room_type = text
            if 'bed' in text:
                bed_info = text

        hotel_data.append({
            'Hotel Name': name,
            'Location': location,
            'Price': price,
            'Rating': rating,
            'Review Count': reviews,
            'Room Type': room_type,
            'Bed Info': bed_info,
            '_features': detected_features
        })

try:
    while True:
        scrape_visible_hotels()
        print(f"📦 Scraped {len(hotel_data)} hotels so far...")

        if keyboard.is_pressed("alt+b"):
            print("🛑 ALT + B pressed. Saving file...")
            break

        driver.execute_script("window.scrollBy(0, 2500);")
        time.sleep(2)

except Exception as e:
    print(f"❌ Error occurred: {e}")

finally:
    driver.quit()
    print("📄 Processing CSV...")

    final_rows = []
    for h in hotel_data:
        row = { key: h[key] for key in [
            'Hotel Name','Location','Price','Rating','Review Count','Room Type','Bed Info'
        ]}
        for feature in all_features:
            row[feature.title()] = 'YES' if feature in h['_features'] else 'NO'
        final_rows.append(row)

    df = pd.DataFrame(final_rows)

    # Write to fixed path
    script_dir = os.path.abspath(os.path.dirname(__file__))
    output_dir = os.path.join(script_dir, '..', 'data', 'extracted')
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, 'scraped_data.csv')

    df.to_csv(out_path, index=False, encoding='utf-8-sig')
    print(f"✅ Done. Data saved as: {out_path}")

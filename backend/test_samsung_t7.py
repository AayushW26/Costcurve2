#!/usr/bin/env python3
"""
Test script to check Samsung T7 SSD pricing on Flipkart
"""

import requests
from bs4 import BeautifulSoup
import re
import json

def test_samsung_t7_scraping():
    # Test with Samsung T7 SSD search
    query = "Samsung T7 1TB SSD"
    
    # Mobile headers for better success rate
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    # Search URL
    search_url = f"https://www.flipkart.com/search?q={query.replace(' ', '%20')}"
    
    print(f"🔍 Testing Samsung T7 search: {search_url}")
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for all price elements with different selectors
            print("\n🔍 Searching for prices with different selectors:")
            
            # Traditional selectors
            traditional_selectors = [
                '._30jeq3', '._1_WHN1', '.srp-x9y0c1', '._25b18c', 
                '._1vC4OE', '.Nx9bqj', '._3I9_wc'
            ]
            
            print("\n📊 Traditional CSS selectors:")
            for selector in traditional_selectors:
                elements = soup.select(selector)
                print(f"  {selector}: {len(elements)} elements found")
                for elem in elements[:3]:  # Show first 3
                    text = elem.get_text(strip=True)
                    if '₹' in text or re.search(r'\d{3,}', text):
                        print(f"    Text: {text}")
            
            # New CSS-based selectors
            print("\n📊 New CSS-based selectors:")
            css_selectors = [
                '.css-1rynq56',
                '[class*="css-"]'
            ]
            
            for selector in css_selectors:
                if selector == '[class*="css-"]':
                    elements = soup.find_all('div', class_=lambda x: x and 'css-' in str(x))
                else:
                    elements = soup.select(selector)
                    
                print(f"  {selector}: {len(elements)} elements found")
                for elem in elements[:5]:  # Show first 5
                    text = elem.get_text(strip=True)
                    if '₹' in text and re.search(r'\d{3,}', text):
                        print(f"    Text: {text}")
            
            # Search for all price patterns in page
            print("\n💰 All price patterns found:")
            all_text = soup.get_text()
            price_matches = re.findall(r'₹([\d,]+)', all_text)
            unique_prices = list(set(price_matches))
            unique_prices.sort(key=lambda x: int(x.replace(',', '')))
            
            print(f"Found {len(unique_prices)} unique prices:")
            for price in unique_prices:
                price_int = int(price.replace(',', ''))
                if price_int > 1000:  # Only show substantial prices
                    print(f"  ₹{price} (₹{price_int:,})")
            
            # Find product containers
            print("\n📦 Product containers:")
            container_selectors = [
                '[data-id]',
                '._1AtVbE',
                '._13oc-S',
                '._2kHMtA',
                '._1fQZEK'
            ]
            
            for selector in container_selectors:
                containers = soup.select(selector)
                print(f"  {selector}: {len(containers)} containers found")
                
                for i, container in enumerate(containers[:3]):
                    # Check for Samsung T7 in title
                    title_text = container.get_text()
                    if 'samsung' in title_text.lower() and ('t7' in title_text.lower() or 'ssd' in title_text.lower()):
                        print(f"    Container {i+1} - Samsung T7 candidate:")
                        
                        # Look for price in this container
                        for price_selector in traditional_selectors + ['.css-1rynq56']:
                            price_elem = container.select_one(price_selector)
                            if price_elem:
                                price_text = price_elem.get_text(strip=True)
                                print(f"      Price ({price_selector}): {price_text}")
                        
                        # Extract any price from container text
                        container_prices = re.findall(r'₹([\d,]+)', title_text)
                        if container_prices:
                            print(f"      Container prices: {container_prices}")
            
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_samsung_t7_scraping()
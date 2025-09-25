#!/usr/bin/env python3
"""
Test script to debug the exact Samsung T7 pricing on Flipkart
"""

import requests
from bs4 import BeautifulSoup
import re
import json

def debug_flipkart_pricing():
    # Test with exact Samsung T7 search
    query = "Samsung T7 1TB"
    
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
    
    print(f"🔍 Testing exact Flipkart pricing: {search_url}")
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for the specific product you showed in screenshot
            print("\n🎯 Looking for Samsung T7 products:")
            
            # Find all links that might be Samsung T7 products
            all_links = soup.find_all('a', href=True)
            samsung_links = []
            
            for link in all_links:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                
                if 'samsung' in href.lower() and 't7' in href.lower():
                    samsung_links.append((link, href, text))
            
            print(f"Found {len(samsung_links)} Samsung T7 links")
            
            for i, (link, href, text) in enumerate(samsung_links[:5]):  # Check first 5
                print(f"\n📦 Samsung T7 Product #{i+1}:")
                print(f"   Link: {href[:80]}...")
                print(f"   Text: {text[:80]}...")
                
                # Look for prices near this link
                parent = link.parent
                if parent:
                    # Go up the DOM tree to find the product container
                    for level in range(5):  # Check up to 5 levels up
                        if parent:
                            container_text = parent.get_text()
                            
                            # Look for prices in this container
                            price_patterns = re.findall(r'₹([\d,]+)', container_text)
                            if price_patterns:
                                prices = [int(p.replace(',', '')) for p in price_patterns if int(p.replace(',', '')) > 1000]
                                if prices:
                                    prices.sort()
                                    print(f"   Container Level {level} prices: {prices}")
                                    
                                    # Look for the specific ₹6,119 price
                                    if 6119 in prices:
                                        print(f"   🎯 FOUND TARGET PRICE ₹6,119 at level {level}!")
                                    
                            parent = parent.parent
                        else:
                            break
            
            # Also do a broad search for the specific price ₹6,119
            print(f"\n💰 Searching for specific price ₹6,119:")
            page_text = soup.get_text()
            if '₹6,119' in page_text or '6,119' in page_text or '6119' in page_text:
                print("✅ Found ₹6,119 in page text!")
                
                # Find elements containing this price
                elements_with_price = soup.find_all(text=re.compile(r'6,?119'))
                print(f"Found {len(elements_with_price)} elements with 6119")
                
                for elem in elements_with_price[:3]:
                    parent_elem = elem.parent if hasattr(elem, 'parent') else None
                    if parent_elem:
                        print(f"   Element: {elem.strip()}")
                        print(f"   Parent tag: {parent_elem.name}")
                        print(f"   Parent class: {parent_elem.get('class', 'No class')}")
                        print(f"   Full parent text: {parent_elem.get_text(strip=True)[:100]}...")
                        print()
            else:
                print("❌ ₹6,119 not found in page text")
            
            # Check all price patterns in the page
            print(f"\n📊 All price patterns found on page:")
            all_prices = re.findall(r'₹([\d,]+)', page_text)
            unique_prices = list(set([int(p.replace(',', '')) for p in all_prices if int(p.replace(',', '')) > 1000]))
            unique_prices.sort()
            
            print(f"Found {len(unique_prices)} unique prices over ₹1,000:")
            for price in unique_prices:
                print(f"  ₹{price:,}")
                if price == 6119:
                    print("    👆 TARGET PRICE FOUND!")
                    
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart_pricing()
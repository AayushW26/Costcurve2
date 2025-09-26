#!/usr/bin/env python3
"""
Strategy 3 Test: Navigate to the actual Flipkart product page that shows ₹9,499
and test various selector strategies to find the current price.
"""

import requests
from bs4 import BeautifulSoup
import re
import time

def test_flipkart_product_page():
    # Let's try the regular Samsung T7 (not Shield) which should show ₹9,499
    test_urls = [
        # Different Samsung T7 product URLs from the search results
        "https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itmce3d59cd47952?pid=ACCFTZGREYWPY4GE",
        "https://www.flipkart.com/samsung-t7-shield-1tb-usb-3-2-gen-2-10-gbps-ip65-rated-speed-upto-1050-mb-s-mu-pe1t0k-1-tb-external-solid-state-drive-ssd/p/itmd6019e2419a6b?pid=ACCGDTJ2HZTKPZER",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for url_idx, product_url in enumerate(test_urls):
        print(f"\n{'='*60}")
        print(f"🔗 Testing URL #{url_idx+1}: {product_url}")
        
        try:
            response = requests.get(product_url, headers=headers, timeout=10)
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Strategy 1: Test the priority selectors from our scraper
                priority_selectors = [
                    '.Nx9bqj.CxhGGd',
                    '.Nx9bqj',
                    '._30jeq3',
                    '.css-1rynq56',
                    '._1vC4OE',
                    '._25b18c'
                ]
                
                print(f"\n🎯 Testing priority selectors:")
                found_prices = []
                
                for selector in priority_selectors:
                    elems = soup.select(selector)
                    print(f"  {selector}: {len(elems)} elements")
                    for i, elem in enumerate(elems[:3]):  # Show first 3
                        text = elem.get_text(strip=True)
                        if text and len(text) < 50:  # Avoid huge text blocks
                            print(f"    #{i+1}: {text}")
                            price_match = re.search(r'₹([\d,]+)', text)
                            if price_match:
                                price = int(price_match.group(1).replace(',', ''))
                                if 1000 <= price <= 50000:
                                    found_prices.append(price)
                                    print(f"         💰 Price: ₹{price}")
                
                # Strategy 2: Look for any element containing "₹9,499" or "₹9499"
                print(f"\n🔍 Searching for ₹9,499 or ₹9499 specifically:")
                all_text = soup.get_text()
                if '₹9,499' in all_text:
                    print(f"  ✅ Found ₹9,499 in page text!")
                elif '₹9499' in all_text:
                    print(f"  ✅ Found ₹9499 in page text!")
                else:
                    print(f"  ❌ Neither ₹9,499 nor ₹9499 found in page text")
                
                # Strategy 3: Find all price patterns and show them
                all_prices = re.findall(r'₹([\d,]+)', all_text)
                price_values = []
                for p in all_prices:
                    try:
                        price_val = int(p.replace(',', ''))
                        if 1000 <= price_val <= 50000:
                            price_values.append(price_val)
                    except:
                        pass
                
                print(f"\n📈 All reasonable prices on page: {sorted(set(price_values))}")
                
                # Strategy 4: Check specific price-related classes
                print(f"\n🏷️ Checking common Flipkart price classes:")
                common_classes = [
                    'div[class*="price"]',
                    'span[class*="price"]',
                    'div[class*="Price"]',
                    'span[class*="Price"]',
                    '[class*="_30jeq3"]',
                    '[class*="Nx9bqj"]'
                ]
                
                for class_pattern in common_classes:
                    elems = soup.select(class_pattern)
                    if elems:
                        print(f"  {class_pattern}: {len(elems)} elements")
                        for elem in elems[:2]:  # Show first 2
                            text = elem.get_text(strip=True)
                            if text and len(text) < 30:
                                print(f"    Text: {text}")
                
                time.sleep(1)  # Be nice to Flipkart
                
            else:
                print(f"❌ Failed to fetch page: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_flipkart_product_page()
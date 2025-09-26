#!/usr/bin/env python3
"""
Test script to check individual Samsung T7 product pages for real prices
"""

import requests
from bs4 import BeautifulSoup
import re
import time

def check_product_page():
    # Let's try to access one of the Samsung T7 product pages directly
    product_urls = [
        "https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itmce3d59cd47952",
        "https://www.flipkart.com/samsung-t7-shield-1tb-usb-3-2-gen-2-10-gbps-ip65-rated-speed-upto-1050-mb-s-mu-pe1t0k-1-tb-external-solid-state-drive-ssd/p/itmd6019e2419a6b"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for i, url in enumerate(product_urls):
        print(f"\n🔍 Testing Product Page #{i+1}:")
        print(f"URL: {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=15)
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for price on product page
                page_text = soup.get_text()
                
                # Search for the specific ₹6,119 price
                if '6,119' in page_text or '6119' in page_text:
                    print("✅ Found ₹6,119 on this product page!")
                else:
                    print("❌ ₹6,119 not found on this product page")
                
                # Find all prices on the page
                all_prices = re.findall(r'₹([\d,]+)', page_text)
                unique_prices = list(set([int(p.replace(',', '')) for p in all_prices if int(p.replace(',', '')) > 1000 and int(p.replace(',', '')) < 100000]))
                unique_prices.sort()
                
                print(f"📊 All prices found on product page: {unique_prices}")
                
                # Look for price elements more specifically
                price_selectors = [
                    '._30jeq3', '._1_WHN1', '.srp-x9y0c1', '._25b18c', 
                    '._1vC4OE', '.Nx9bqj', '._3I9_wc', '.css-1rynq56',
                    '[class*="_30jeq3"]', '[class*="_1_WHN1"]',
                    '.CEmiEU', '._16Jk6d'  # More price selectors
                ]
                
                print("🎯 Checking specific price selectors:")
                for selector in price_selectors:
                    elements = soup.select(selector)
                    if elements:
                        for elem in elements[:2]:  # Show first 2 matches
                            text = elem.get_text(strip=True)
                            if '₹' in text:
                                print(f"   {selector}: {text}")
                
                # Look for discounted price patterns
                print("🏷️ Looking for discount/sale price patterns:")
                
                # Common discount patterns
                discount_patterns = [
                    r'₹([\d,]+)\s*₹[\d,]+',  # Current price followed by crossed out price
                    r'Special\s*Price.*?₹([\d,]+)',
                    r'Deal\s*Price.*?₹([\d,]+)',
                    r'Sale\s*Price.*?₹([\d,]+)',
                ]
                
                for pattern in discount_patterns:
                    matches = re.findall(pattern, page_text, re.IGNORECASE)
                    if matches:
                        print(f"   Pattern '{pattern}': {matches}")
                
            else:
                print(f"❌ Failed to fetch product page: {response.status_code}")
                
            time.sleep(1)  # Be respectful
            
        except Exception as e:
            print(f"❌ Error accessing product page: {e}")

if __name__ == "__main__":
    check_product_page()
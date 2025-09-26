#!/usr/bin/env python3
"""
Flipkart Debug Script - Find Current Price Selectors
"""

import requests
from bs4 import BeautifulSoup
import re

def debug_flipkart_selectors():
    """Debug current Flipkart price selectors"""
    
    # Test with a known Flipkart product URL
    test_urls = [
        "https://www.flipkart.com/search?q=samsung+ssd",
        "https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itm8e6ef1b1b8c33?pid=ESSDGYKVZJNRCZ2F"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    }
    
    for url in test_urls:
        print(f"\n🔍 Testing URL: {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find all elements with class containing price-related keywords
                price_patterns = ['price', 'Price', 'cost', 'Cost', 'amount', 'Amount', 'rupee', 'Rupee']
                
                print("\n💰 Finding elements with price-related classes:")
                for pattern in price_patterns:
                    elements = soup.find_all(class_=lambda x: x and pattern in ' '.join(x) if isinstance(x, list) else pattern in x if x else False)
                    
                    for elem in elements[:3]:  # Limit to 3 per pattern
                        classes = ' '.join(elem.get('class', []))
                        text = elem.get_text(strip=True)[:100]
                        print(f"  🏷️ Class: {classes}")
                        print(f"  📝 Text: {text}")
                        
                        # Check if it contains rupee symbol or numbers
                        if '₹' in text or re.search(r'\d+', text):
                            print(f"  ✅ POTENTIAL PRICE ELEMENT!")
                        print()
                
                # Also check for newer Flipkart selectors
                print("\n🔍 Checking modern Flipkart selectors:")
                modern_selectors = [
                    '[data-testid*="price"]',
                    '[class*="price"]',
                    '[class*="Price"]',
                    '.Nx9bqj',
                    '.CxhGGd',
                    '._4b5DiR',
                    '._30jeq3',
                    '._1_WHN1',
                    '._25b18c'
                ]
                
                for selector in modern_selectors:
                    elements = soup.select(selector)
                    if elements:
                        print(f"✅ Found {len(elements)} elements with selector: {selector}")
                        for elem in elements[:2]:
                            text = elem.get_text(strip=True)[:50]
                            print(f"   Text: {text}")
                    else:
                        print(f"❌ No elements found with selector: {selector}")
        
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart_selectors()
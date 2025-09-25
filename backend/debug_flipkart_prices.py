#!/usr/bin/env python3
"""
Debug Flipkart price selectors specifically
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import re

def debug_flipkart_prices():
    mobile_headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    }
    
    search_url = f"https://www.flipkart.com/search?q={quote_plus('iPhone 14')}"
    print(f"🌐 Flipkart URL: {search_url}")
    
    try:
        response = requests.get(search_url, headers=mobile_headers, timeout=10)
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for ANY element that might contain prices
            print("\n🔍 SEARCHING FOR PRICE PATTERNS:")
            
            # Search for text that looks like prices
            all_text = soup.get_text()
            rupee_matches = re.findall(r'₹[\d,]+|Rs\.?\s*[\d,]+|\d{1,2},\d{2,3}', all_text)
            print(f"💰 Found {len(rupee_matches)} potential price patterns:")
            for match in rupee_matches[:10]:  # Show first 10
                print(f"  - {match}")
            
            print("\n🔍 CHECKING CURRENT PRICE SELECTORS:")
            price_selectors = [
                '._30jeq3', '._1_WHN1', '.srp-x9y0c1', '._25b18c', 
                '._1vC4OE', '.Nx9bqj', '._3I9_wc'
            ]
            
            for selector in price_selectors:
                elements = soup.select(selector)
                print(f"  {selector}: {len(elements)} elements found")
                if elements:
                    for elem in elements[:2]:  # Show first 2
                        print(f"    Text: '{elem.get_text(strip=True)}'")
            
            print("\n🔍 LOOKING FOR ELEMENTS WITH CURRENCY SYMBOLS:")
            # Look for any element containing ₹ or Rs
            currency_elements = soup.find_all(text=re.compile(r'₹|Rs\.?'))
            print(f"💱 Found {len(currency_elements)} elements with currency symbols")
            
            for i, elem in enumerate(currency_elements[:5]):  # First 5
                parent = elem.parent if hasattr(elem, 'parent') else None
                if parent:
                    classes = parent.get('class', [])
                    print(f"  #{i+1}: '{elem.strip()}' in <{parent.name}> with classes: {classes}")
            
            print("\n🔍 ANALYZING PRODUCT LINK AREA:")
            # Find the product link and analyze its surrounding area
            product_links = soup.find_all('a', href=True)
            for link in product_links:
                href = link.get('href', '')
                if '/p/' in href:
                    print(f"\n📦 PRODUCT LINK FOUND: {href[:50]}...")
                    
                    # Check the link's parent and siblings for price info
                    parent = link.parent
                    if parent:
                        print(f"📋 Parent element: <{parent.name}>")
                        parent_text = parent.get_text(strip=True)
                        price_in_parent = re.search(r'₹[\d,]+|Rs\.?\s*[\d,]+', parent_text)
                        if price_in_parent:
                            print(f"💰 PRICE FOUND IN PARENT: {price_in_parent.group()}")
                        
                        # Check all child elements for price
                        price_children = parent.find_all(text=re.compile(r'₹|Rs\.?'))
                        print(f"💱 Price elements in parent: {len(price_children)}")
                        for child in price_children:
                            child_parent = child.parent if hasattr(child, 'parent') else None
                            if child_parent:
                                classes = child_parent.get('class', [])
                                print(f"    Price: '{child.strip()}' in class: {classes}")
                    
                    break  # Only analyze first product link
                    
        else:
            print(f"❌ Bad response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart_prices()
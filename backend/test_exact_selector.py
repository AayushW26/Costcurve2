#!/usr/bin/env python3
"""
Test script to extract price using the exact .Nx9bqj.CxhGGd selector
from the specific Flipkart Samsung T7 product page.
"""

import requests
from bs4 import BeautifulSoup
import re

def test_exact_selector():
    # The specific Samsung T7 product URL from search results
    product_url = "https://www.flipkart.com/samsung-t7-shield-1tb-usb-3-2-gen-2-10-gbps-ip65-rated-speed-upto-1050-mb-s-mu-pe1t0k-1-tb-external-solid-state-drive-ssd/p/itmd6019e2419a6b?pid=ACCGDTJ2HZTKPZER&lid=LSTACCGDTJ2HZTKPZERQUKR3M&marketplace=FLIPKART&hl_lid=&q=Samsung+T7+1TB&store=6bo%2Fjdy%2Fdus"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    print(f"🔗 Testing URL: {product_url}")
    
    try:
        response = requests.get(product_url, headers=headers, timeout=10)
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Test the exact selector
            print("\n🎯 Testing .Nx9bqj.CxhGGd selector:")
            exact_elems = soup.select('.Nx9bqj.CxhGGd')
            for i, elem in enumerate(exact_elems[:5]):  # Show first 5
                text = elem.get_text(strip=True)
                print(f"  #{i+1}: {text}")
                price_match = re.search(r'₹([\d,]+)', text)
                if price_match:
                    price = int(price_match.group(1).replace(',', ''))
                    print(f"       💰 Extracted price: ₹{price}")
            
            # Test general .Nx9bqj selector
            print("\n🔍 Testing general .Nx9bqj selector:")
            general_elems = soup.select('.Nx9bqj')
            price_found = []
            for i, elem in enumerate(general_elems[:10]):  # Show first 10
                text = elem.get_text(strip=True)
                price_match = re.search(r'₹([\d,]+)', text)
                if price_match:
                    price = int(price_match.group(1).replace(',', ''))
                    price_found.append(price)
                    print(f"  #{i+1}: {text} -> ₹{price}")
            
            print(f"\n📊 All prices found with .Nx9bqj: {sorted(set(price_found))}")
            
            # Test other common selectors
            print("\n🔍 Testing other common price selectors:")
            
            # Test ._30jeq3 selector
            price_elems = soup.select('._30jeq3')
            for elem in price_elems[:3]:
                text = elem.get_text(strip=True)
                print(f"  ._30jeq3: {text}")
            
            # Test .css-1rynq56 selector
            price_elems = soup.select('.css-1rynq56')
            for elem in price_elems[:3]:
                text = elem.get_text(strip=True)
                print(f"  .css-1rynq56: {text}")
            
            # Get all text and find all prices
            page_text = soup.get_text()
            all_prices = re.findall(r'₹([\d,]+)', page_text)
            price_values = []
            for p in all_prices:
                try:
                    price_val = int(p.replace(',', ''))
                    if 1000 <= price_val <= 50000:  # Reasonable price range
                        price_values.append(price_val)
                except:
                    pass
            
            print(f"\n📈 All reasonable prices found on page: {sorted(set(price_values))}")
            
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_exact_selector()
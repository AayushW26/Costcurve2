#!/usr/bin/env python3
"""
Debug the exact Flipkart page from the screenshot to understand why ₹10,499 isn't being selected.
"""

import requests
from bs4 import BeautifulSoup
import re

def debug_flipkart_price_selection():
    # Let's test with the same Samsung T7 search that our scraper does
    search_url = "https://www.flipkart.com/search?q=Samsung+T7+1TB"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    print(f"🔗 Testing search URL: {search_url}")
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find product links like our scraper does
            product_links = []
            for link in soup.find_all('a', href=True):
                href = link.get('href', '')
                if '/p/' in href and any(term in href.lower() for term in ['samsung', 't7']):
                    full_url = f"https://www.flipkart.com{href}" if href.startswith('/') else href
                    product_links.append(full_url)
            
            print(f"🎯 Found {len(product_links)} Samsung T7 product links")
            
            # Let's check the first few product pages individually
            for i, product_url in enumerate(product_links[:3]):
                print(f"\n{'='*50}")
                print(f"🔗 Testing product #{i+1}: {product_url}")
                
                try:
                    product_response = requests.get(product_url, headers=headers, timeout=10)
                    if product_response.status_code == 200:
                        product_soup = BeautifulSoup(product_response.content, 'html.parser')
                        
                        # Test the exact selector that should work
                        print(f"\n🎯 Testing .Nx9bqj.CxhGGd selector:")
                        exact_elems = product_soup.select('.Nx9bqj.CxhGGd')
                        for j, elem in enumerate(exact_elems):
                            text = elem.get_text(strip=True)
                            print(f"  Element #{j+1}: {text}")
                            if '₹' in text:
                                price_match = re.search(r'₹([\d,]+)', text)
                                if price_match:
                                    price = int(price_match.group(1).replace(',', ''))
                                    print(f"    💰 Extracted price: ₹{price}")
                                    
                                    # Check if this is the ₹10,499 from the screenshot
                                    if price == 10499:
                                        print(f"    🎉 FOUND THE EXACT PRICE FROM SCREENSHOT!")
                        
                        # Also check general .Nx9bqj
                        print(f"\n🔍 Testing general .Nx9bqj selector:")
                        general_elems = product_soup.select('.Nx9bqj')
                        prices_found = []
                        for j, elem in enumerate(general_elems[:5]):  # First 5
                            text = elem.get_text(strip=True)
                            if '₹' in text:
                                price_match = re.search(r'₹([\d,]+)', text)
                                if price_match:
                                    price = int(price_match.group(1).replace(',', ''))
                                    prices_found.append(price)
                                    print(f"  Element #{j+1}: {text} -> ₹{price}")
                        
                        print(f"📊 All .Nx9bqj prices: {sorted(set(prices_found))}")
                        
                        # Check if ₹10,499 exists anywhere on the page
                        page_text = product_soup.get_text()
                        if '10,499' in page_text or '10499' in page_text:
                            print(f"✅ ₹10,499 found somewhere on this page!")
                        else:
                            print(f"❌ ₹10,499 not found on this page")
                            
                except Exception as e:
                    print(f"❌ Error fetching product page: {e}")
                    
        else:
            print(f"❌ Failed to fetch search page: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart_price_selection()
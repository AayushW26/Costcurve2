#!/usr/bin/env python3
"""
Debug script to investigate Flipkart HTML structure
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

def debug_flipkart():
    # Mobile headers like our scraper
    mobile_headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
    }
    
    search_url = f"https://www.flipkart.com/search?q={quote_plus('iPhone 14')}"
    print(f"🌐 Flipkart URL: {search_url}")
    
    try:
        response = requests.get(search_url, headers=mobile_headers, timeout=10)
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Check if we're getting the right page
            title = soup.find('title')
            print(f"📄 Page title: {title.get_text() if title else 'None'}")
            
            # Look for any div elements with classes
            divs_with_classes = soup.find_all('div', class_=True)[:20]  # First 20
            print(f"\n🔍 Found {len(divs_with_classes)} divs with classes")
            
            classes_found = set()
            for div in divs_with_classes:
                classes = div.get('class', [])
                for cls in classes:
                    if any(keyword in cls.lower() for keyword in ['product', 'item', 'card', 'result']):
                        classes_found.add(cls)
            
            print(f"🎯 Relevant classes found: {sorted(classes_found)}")
            
            # Look for any elements with data attributes
            data_elements = soup.find_all(attrs={"data-id": True})[:5]
            print(f"\n📊 Elements with data-id: {len(data_elements)}")
            for elem in data_elements:
                print(f"  - {elem.name} with data-id='{elem.get('data-id')}'")
            
            # Save HTML for inspection
            with open('flipkart_debug.html', 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print(f"\n💾 HTML saved to flipkart_debug.html")
            
            # Look for links that might be products
            product_links = soup.find_all('a', href=True)
            relevant_links = [link for link in product_links if '/p/' in link.get('href', '')][:5]
            print(f"\n🔗 Product links found: {len(relevant_links)}")
            for link in relevant_links:
                print(f"  - {link.get('href')}")
                
        else:
            print(f"❌ Bad response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart()
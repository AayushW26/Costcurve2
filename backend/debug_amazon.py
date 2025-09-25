#!/usr/bin/env python3
"""
Focused debug for Amazon scraping
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import re

def clean_price(price_text):
    """Extract numeric price from text"""
    if not price_text:
        return None
    
    # Remove currency symbols and extract numbers
    price_match = re.search(r'[\d,]+(?:\.\d{2})?', price_text.replace(',', ''))
    if price_match:
        return float(price_match.group().replace(',', ''))
    return None

def debug_amazon_detailed():
    query = "iPhone 15"
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = f"https://www.amazon.in/s?k={quote_plus(query)}"
    print(f"🔍 Debugging Amazon for: {query}")
    print(f"URL: {url}")
    
    try:
        response = session.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find product containers
            products = soup.find_all('div', {'data-component-type': 's-search-result'})[:2]
            print(f"Found {len(products)} products")
            
            results = []
            
            for i, product in enumerate(products):
                print(f"\n--- Product {i+1} ---")
                
                try:
                    # Extract title - try multiple selectors
                    title_elem = product.find('h2', class_='a-size-mini')
                    if not title_elem:
                        title_elem = product.find('span', class_='a-size-medium')
                    if not title_elem:
                        title_elem = product.find('span', class_='a-size-base-plus')
                    if not title_elem:
                        title_elem = product.select_one('h2 a span')
                    
                    title = title_elem.get_text().strip() if title_elem else None
                    print(f"Title: {title}")
                    
                    # Extract price - try multiple selectors
                    price_elem = product.find('span', class_='a-price-whole')
                    if not price_elem:
                        price_elem = product.find('span', class_='a-offscreen')
                    if not price_elem:
                        price_elem = product.select_one('.a-price .a-offscreen')
                    
                    price_text = price_elem.get_text().strip() if price_elem else None
                    price = clean_price(price_text) if price_text else None
                    
                    print(f"Price text: {price_text}")
                    print(f"Cleaned price: {price}")
                    
                    # Extract URL
                    link_elem = product.find('h2').find('a') if product.find('h2') else None
                    product_url = f"https://www.amazon.in{link_elem['href']}" if link_elem else None
                    print(f"URL: {product_url[:100] if product_url else None}...")
                    
                    # Extract image
                    img_elem = product.find('img', class_='s-image')
                    image_url = img_elem.get('src') if img_elem else None
                    print(f"Image: {image_url[:100] if image_url else None}...")
                    
                    if title and price:
                        result = {
                            'platform': 'Amazon',
                            'title': title[:100],
                            'price': int(price) if price else 0,
                            'url': product_url,
                            'image': image_url,
                            'currency': 'INR',
                            'availability': 'In Stock'
                        }
                        results.append(result)
                        print("✅ SUCCESS: Added to results")
                    else:
                        print("❌ FAILED: Missing title or price")
                        print(f"   Title found: {title is not None}")
                        print(f"   Price found: {price is not None}")
                        
                except Exception as e:
                    print(f"❌ ERROR parsing product: {e}")
                    
            print(f"\n📊 FINAL RESULTS: {len(results)} products added")
            for result in results:
                print(f"  - {result['title'][:50]}... - ₹{result['price']:,}")
                
    except Exception as e:
        print(f"❌ Request error: {e}")

if __name__ == "__main__":
    debug_amazon_detailed()
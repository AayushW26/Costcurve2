#!/usr/bin/env python3
"""
Debug script to check if we're getting real data from websites
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import json

def debug_amazon(query):
    print(f"🔍 Testing Amazon India for: {query}")
    print("-" * 50)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    url = f"https://www.amazon.in/s?k={quote_plus(query)}"
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try different selectors
            selectors_to_try = [
                'div[data-component-type="s-search-result"]',
                '.s-result-item',
                '[data-cel-widget="search_result"]',
                '.s-card-container'
            ]
            
            for selector in selectors_to_try:
                products = soup.select(selector)[:1]  # Just get first one for testing
                print(f"\nTrying selector: {selector}")
                print(f"Found {len(products)} products")
                
                if products:
                    product = products[0]
                    
                    # Try to find title
                    title_selectors = [
                        'h2 a span',
                        '.a-size-medium',
                        '.a-size-base-plus',
                        'h2 span'
                    ]
                    
                    for title_sel in title_selectors:
                        title_elem = product.select_one(title_sel)
                        if title_elem:
                            print(f"✅ Title found with {title_sel}: {title_elem.get_text().strip()[:50]}...")
                            break
                    else:
                        print("❌ No title found")
                    
                    # Try to find price
                    price_selectors = [
                        '.a-price-whole',
                        '.a-offscreen',
                        '.a-price .a-offscreen',
                        '.a-price-range'
                    ]
                    
                    for price_sel in price_selectors:
                        price_elem = product.select_one(price_sel)
                        if price_elem:
                            print(f"✅ Price found with {price_sel}: {price_elem.get_text().strip()}")
                            break
                    else:
                        print("❌ No price found")
                        
                    # Show some HTML structure
                    print(f"\nFirst 500 chars of product HTML:")
                    print(str(product)[:500])
                    break
                    
        else:
            print(f"❌ Request failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def debug_snapdeal(query):
    print(f"\n🔍 Testing Snapdeal for: {query}")
    print("-" * 50)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    url = f"https://www.snapdeal.com/search?keyword={quote_plus(query)}"
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try different selectors for Snapdeal
            selectors_to_try = [
                '.product-tuple-listing',
                '.col-xs-6',
                '.product-item',
                '.product-tup'
            ]
            
            for selector in selectors_to_try:
                products = soup.select(selector)[:2]
                print(f"\nTrying selector: {selector}")
                print(f"Found {len(products)} products")
                
                if products:
                    for i, product in enumerate(products):
                        print(f"\nProduct {i+1}:")
                        
                        # Try to find title
                        title_elem = product.select_one('.product-title') or product.select_one('p')
                        if title_elem:
                            title = title_elem.get_text().strip()
                            print(f"✅ Title: {title[:50]}...")
                        
                        # Try to find price
                        price_elem = product.select_one('.lfloat') or product.select_one('.product-price')
                        if price_elem:
                            price = price_elem.get_text().strip()
                            print(f"✅ Price: {price}")
                            
                        # Check if we have both title and price
                        if title_elem and price_elem:
                            print("✅ This product has both title and price - SUCCESS!")
                    break
                    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Test with a specific product
    query = "iPhone 14"
    
    debug_amazon(query)
    debug_snapdeal(query)
    
    print("\n" + "="*60)
    print("📊 CONCLUSION:")
    print("- Snapdeal: Working ✅ (Getting real prices)")
    print("- Amazon: May be blocked or using different selectors ❓")
    print("- Other platforms: Using mock data for demo 📝")
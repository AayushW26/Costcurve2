#!/usr/bin/env python3
"""
Advanced Flipkart Structure Analysis
"""

import requests
from bs4 import BeautifulSoup
import re
import json

def analyze_flipkart_structure():
    """Analyze current Flipkart HTML structure"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    }
    
    url = "https://www.flipkart.com/search?q=samsung+ssd"
    print(f"🔍 Analyzing Flipkart structure: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Save HTML for inspection
            with open('flipkart_debug_page.html', 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print("✅ HTML saved to flipkart_debug_page.html")
            
            # Find all elements with ₹ symbol
            print("\n💰 Elements containing ₹ symbol:")
            rupee_elements = soup.find_all(text=re.compile(r'₹'))
            
            for idx, text in enumerate(rupee_elements[:10]):
                parent = text.parent if text.parent else None
                if parent:
                    parent_classes = ' '.join(parent.get('class', []))
                    grandparent_classes = ' '.join(parent.parent.get('class', [])) if parent.parent else ''
                    
                    print(f"  🏷️ #{idx+1}")
                    print(f"     Text: {text.strip()}")
                    print(f"     Parent tag: {parent.name}")
                    print(f"     Parent classes: {parent_classes}")
                    print(f"     Grandparent classes: {grandparent_classes}")
                    print()
            
            # Find all div elements and analyze their structure
            print("\n📦 Analyzing div elements with classes:")
            all_divs = soup.find_all('div', class_=True)
            
            class_frequency = {}
            for div in all_divs:
                classes = div.get('class', [])
                for cls in classes:
                    if cls not in class_frequency:
                        class_frequency[cls] = 0
                    class_frequency[cls] += 1
            
            # Show most common classes
            print("🔢 Most common CSS classes:")
            sorted_classes = sorted(class_frequency.items(), key=lambda x: x[1], reverse=True)
            for cls, count in sorted_classes[:20]:
                print(f"   .{cls} - used {count} times")
            
            # Look for patterns that might be prices
            print("\n🔍 Looking for potential price patterns:")
            price_candidates = []
            
            for div in all_divs:
                text = div.get_text(strip=True)
                # Look for price-like patterns
                if re.search(r'₹[\d,]+', text) and len(text) < 50:
                    classes = ' '.join(div.get('class', []))
                    price_candidates.append({
                        'text': text,
                        'classes': classes,
                        'tag': div.name
                    })
            
            print(f"Found {len(price_candidates)} potential price elements:")
            for idx, candidate in enumerate(price_candidates[:10]):
                print(f"  💰 #{idx+1}: '{candidate['text']}'")
                print(f"     Classes: {candidate['classes']}")
                print()
                
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    analyze_flipkart_structure()
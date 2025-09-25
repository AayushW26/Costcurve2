#!/usr/bin/env python3
"""
Comprehensive Flipkart debugging script
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

def debug_flipkart_comprehensive():
    """Comprehensive debug of Flipkart structure"""
    
    # Mobile headers for Flipkart
    mobile_headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
    }
    
    search_url = f"https://www.flipkart.com/search?q={quote_plus('iPhone 14')}"
    print(f"🌐 Search URL: {search_url}")
    
    try:
        response = requests.get(search_url, headers=mobile_headers, timeout=10)
        print(f"✅ Response status: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Save HTML for manual inspection
            with open('flipkart_comprehensive_debug.html', 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print("💾 Saved HTML to flipkart_comprehensive_debug.html")
            
            # 1. Look for ALL links with /p/ pattern (product pages)
            print("\n🔍 PRODUCT LINKS ANALYSIS:")
            product_links = soup.find_all('a', href=True)
            product_link_count = 0
            for link in product_links:
                href = link.get('href', '')
                if '/p/' in href:
                    product_link_count += 1
                    link_text = link.get_text(strip=True)
                    img = link.find('img')
                    img_alt = img.get('alt', '') if img else 'No img'
                    
                    print(f"  Link #{product_link_count}:")
                    print(f"    URL: {href[:100]}...")
                    print(f"    Text: '{link_text[:50]}...' (len: {len(link_text)})")
                    print(f"    Image alt: '{img_alt[:50]}...'")
                    print(f"    Has meaningful content: {len(link_text) > 10 or len(img_alt) > 10}")
                    print()
                    
                    if product_link_count >= 5:  # Limit output
                        break
            
            print(f"📊 Total product links found: {product_link_count}")
            
            # 2. Look for data attributes that might contain product info
            print("\n🔍 DATA ATTRIBUTES ANALYSIS:")
            elements_with_data = soup.find_all(attrs=lambda x: x and any(k.startswith('data-') for k in x.keys()))
            data_count = 0
            for elem in elements_with_data[:10]:  # First 10
                data_attrs = {k: v for k, v in elem.attrs.items() if k.startswith('data-')}
                if data_attrs:
                    data_count += 1
                    print(f"  Element #{data_count}: {elem.name}")
                    for attr, value in data_attrs.items():
                        print(f"    {attr}: {str(value)[:100]}...")
                    text_content = elem.get_text(strip=True)
                    if text_content:
                        print(f"    Text: '{text_content[:100]}...'")
                    print()
                    
            # 3. Look for elements that might be containers based on class patterns
            print("\n🔍 POTENTIAL CONTAINER ANALYSIS:")
            # Common e-commerce container patterns
            container_patterns = ['product', 'item', 'card', 'result', 'listing', 'tile']
            
            for pattern in container_patterns:
                # Look for classes containing the pattern
                elements = soup.find_all(class_=lambda x: x and any(pattern in cls.lower() for cls in x if isinstance(x, list)))
                if not elements:
                    # Try attribute selectors
                    elements = soup.select(f'[class*="{pattern}"]')
                
                if elements:
                    print(f"  Pattern '{pattern}': {len(elements)} elements")
                    for i, elem in enumerate(elements[:3]):  # First 3
                        classes = elem.get('class', [])
                        text = elem.get_text(strip=True)
                        print(f"    #{i+1}: classes={classes}, text='{text[:50]}...'")
                else:
                    print(f"  Pattern '{pattern}': 0 elements")
            
            # 4. Look for script tags that might contain JSON data
            print("\n🔍 SCRIPT TAG ANALYSIS:")
            scripts = soup.find_all('script')
            json_scripts = 0
            for script in scripts:
                script_content = script.string if script.string else ''
                if 'product' in script_content.lower() or 'item' in script_content.lower():
                    json_scripts += 1
                    print(f"  Script #{json_scripts} contains product data: {len(script_content)} chars")
                    # Show first 200 chars
                    print(f"    Preview: {script_content[:200]}...")
                    print()
                    
                    if json_scripts >= 3:  # Limit output
                        break
            
            print(f"📊 Scripts with potential product data: {json_scripts}")
            
            # 5. Look for images that might be product images
            print("\n🔍 PRODUCT IMAGES ANALYSIS:")
            images = soup.find_all('img')
            product_images = 0
            for img in images:
                src = img.get('src', '') or img.get('data-src', '')
                alt = img.get('alt', '')
                
                # Check if this looks like a product image
                if any(keyword in alt.lower() for keyword in ['iphone', 'phone', 'mobile', 'apple']) or \
                   any(keyword in src.lower() for keyword in ['product', 'item', 'catalog']):
                    product_images += 1
                    print(f"  Image #{product_images}:")
                    print(f"    Alt: '{alt[:50]}...'")
                    print(f"    Src: '{src[:80]}...'")
                    print()
                    
                    if product_images >= 5:
                        break
            
            print(f"📊 Potential product images: {product_images}")
            
        else:
            print(f"❌ Non-200 response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_flipkart_comprehensive()
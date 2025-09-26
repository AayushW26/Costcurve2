import requests
from bs4 import BeautifulSoup
import re

# Visit the specific URL from the screenshot that shows ₹8,999
url = 'https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itmd533336b46fa3?pid=ACCFTZGRJ7AG6ZJB'

headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
}

try:
    print('=== TESTING SPECIFIC URL FROM SCREENSHOT ===')
    print(f'URL: {url}')
    
    response = requests.get(url, headers=headers, timeout=10)
    print(f'Status: {response.status_code}')
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for JavaScript __INITIAL_STATE__
        script_tags = soup.find_all('script')
        found_js_price = False
        
        for script in script_tags:
            script_text = script.get_text()
            if 'window.__INITIAL_STATE__' in script_text:
                print('Found __INITIAL_STATE__ script')
                # Look for price patterns in the JavaScript object
                price_matches = re.findall(r'"price":(\d+)', script_text)
                if not price_matches:
                    price_matches = re.findall(r'₹([\d,]+)', script_text)
                
                if price_matches:
                    print(f'Found price patterns in JS: {price_matches[:10]}')  # Show first 10
                    # Convert all found prices and get valid ones
                    found_js_prices = []
                    for match in price_matches:
                        try:
                            price_val = int(str(match).replace(',', ''))
                            if 5000 <= price_val <= 50000:  # Reasonable price range
                                found_js_prices.append(price_val)
                        except:
                            continue
                    
                    if found_js_prices:
                        # Sort and show all prices
                        sorted_prices = sorted(list(set(found_js_prices)))
                        print(f'Valid prices found: {sorted_prices}')
                        
                        # Check if 8999 is in there
                        if 8999 in sorted_prices:
                            print('✅ FOUND ₹8,999 in the JavaScript!')
                        else:
                            print('❌ ₹8,999 NOT found in JavaScript prices')
                            print(f'Lowest price: ₹{min(sorted_prices)}')
                        
                        found_js_price = True
                break
        
        if not found_js_price:
            print('❌ No JavaScript price extraction successful')
        
        # Also check for any ₹8999 or ₹8,999 in the entire page
        page_text = soup.get_text()
        if '8999' in page_text or '8,999' in page_text:
            print('✅ Found "8999" or "8,999" in page text')
            # Find context around the price
            lines = page_text.split('\n')
            for i, line in enumerate(lines):
                if '8999' in line or '8,999' in line:
                    print(f'Context line {i}: "{line.strip()}"')
                    if i > 0:
                        print(f'  Previous: "{lines[i-1].strip()}"')
                    if i < len(lines) - 1:
                        print(f'  Next: "{lines[i+1].strip()}"')
                    break
        else:
            print('❌ No "8999" found in entire page text')
            
    else:
        print(f'Failed to fetch page: {response.status_code}')
        
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
import requests
from bs4 import BeautifulSoup
import re

# Visit the Flipkart URL and find current price selectors
url = 'https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itmd533336b46fa3?pid=ACCFTZGRJ7AG6ZJB'

headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
}

try:
    print('=== FINDING CURRENT FLIPKART PRICE SELECTORS ===')
    response = requests.get(url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all elements that contain price text
        all_elements = soup.find_all(string=re.compile(r'₹[\d,]+'))
        print(f'Found {len(all_elements)} text nodes with ₹ symbol')
        
        unique_price_elements = []
        for text_node in all_elements:
            parent = text_node.parent
            if parent:
                price_match = re.search(r'₹([\d,]+)', text_node)
                if price_match:
                    price_val = int(price_match.group(1).replace(',', ''))
                    classes = ' '.join(parent.get('class', []))
                    tag_name = parent.name
                    
                    # Only show reasonable prices for electronics
                    if 5000 <= price_val <= 30000:
                        unique_price_elements.append({
                            'price': price_val,
                            'text': text_node.strip(),
                            'tag': tag_name,
                            'classes': classes,
                            'parent_text': parent.get_text(strip=True)[:100]
                        })
        
        # Remove duplicates and sort by price
        seen_prices = set()
        unique_elements = []
        for elem in sorted(unique_price_elements, key=lambda x: x['price']):
            if elem['price'] not in seen_prices:
                seen_prices.add(elem['price'])
                unique_elements.append(elem)
        
        print(f'\nUnique price elements found:')
        for i, elem in enumerate(unique_elements):
            print(f'{i+1}. ₹{elem["price"]} -> <{elem["tag"]} class="{elem["classes"]}">')
            print(f'   Text: "{elem["parent_text"]}"')
            print()
        
        # Test specific current price patterns
        print('=== TESTING SPECIFIC CURRENT PRICE PATTERNS ===')
        
        # Look for the lowest price (usually current price)
        if unique_elements:
            lowest_price = unique_elements[0]
            print(f'LOWEST PRICE: ₹{lowest_price["price"]}')
            print(f'Selector suggestion: {lowest_price["tag"]}.{lowest_price["classes"].replace(" ", ".")}')
            
            # Find the exact selector for this element
            parent_elem = soup.find(lowest_price['tag'], class_=lowest_price['classes'].split())
            if parent_elem:
                print(f'Element found with suggested selector!')
                print(f'Full selector: {lowest_price["tag"]}.{".".join(lowest_price["classes"].split())}')
    else:
        print(f'Failed to fetch page: {response.status_code}')
        
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
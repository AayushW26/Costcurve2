import requests
from bs4 import BeautifulSoup
import re

# Visit one of the Flipkart URLs and check the actual page structure
url = 'https://www.flipkart.com/samsung-t7-1050-mbs-pc-mac-android-portable-type-c-enabled-3y-warranty-usb-3-2-1-tb-external-solid-state-drive-ssd/p/itmd533336b46fa3?pid=ACCFTZGRJ7AG6ZJB'

headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
}

try:
    print('=== DEBUGGING FLIPKART PAGE STRUCTURE ===')
    print(f'Visiting: {url[:80]}...')
    
    response = requests.get(url, headers=headers, timeout=10)
    print(f'Status: {response.status_code}')
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for any elements containing Nx9bqj
        nx9bqj_all = soup.find_all(class_=lambda x: x and 'Nx9bqj' in ' '.join(x) if isinstance(x, list) else 'Nx9bqj' in x if x else False)
        print(f'Total Nx9bqj elements found: {len(nx9bqj_all)}')
        
        for i, elem in enumerate(nx9bqj_all[:5]):  # Show first 5
            classes = ' '.join(elem.get('class', []))
            text = elem.get_text(strip=True)
            print(f'  #{i+1}: class="{classes}" text="{text[:100]}"')
        
        # Specifically look for .Nx9bqj.CxhGGd
        exact_elem = soup.select('.Nx9bqj.CxhGGd')
        print(f'\n.Nx9bqj.CxhGGd elements: {len(exact_elem)}')
        for i, elem in enumerate(exact_elem):
            classes = ' '.join(elem.get('class', []))
            text = elem.get_text(strip=True)
            print(f'  EXACT #{i+1}: class="{classes}" text="{text}"')
        
        # Look for general .Nx9bqj elements
        general_elem = soup.select('.Nx9bqj')
        print(f'\nGeneral .Nx9bqj elements: {len(general_elem)}')
        for i, elem in enumerate(general_elem[:5]):
            classes = ' '.join(elem.get('class', []))
            text = elem.get_text(strip=True)
            print(f'  GEN #{i+1}: class="{classes}" text="{text[:100]}"')
        
        # Look for any price-like text in the entire page
        page_text = soup.get_text()
        prices = re.findall(r'₹([\d,]+)', page_text)
        unique_prices = sorted(list(set([int(p.replace(',','')) for p in prices])))
        print(f'\nAll prices found on page: {unique_prices[:10]}')  # Show first 10
        
        # Look for specific price selectors that might work
        print('\n=== TESTING OTHER PRICE SELECTORS ===')
        
        price_selectors = [
            '._30jeq3._16Jk6d', # Common Flipkart price selector
            '._16Jk6d',         # Another common one
            '._1_WHN1',         # Price selector
            '[class*="_30jeq3"]', # Any class containing _30jeq3
            '.CEmiEU',          # Another price selector
            '[data-testid="selling-price"]',
            '.Nx9bqj',          # Original
            '.yRaY8j',          # Price related
        ]
        
        for selector in price_selectors:
            elements = soup.select(selector)
            print(f'{selector}: {len(elements)} elements')
            for i, elem in enumerate(elements[:2]):  # Show first 2
                text = elem.get_text(strip=True)
                classes = ' '.join(elem.get('class', []))
                if '₹' in text:
                    print(f'  #{i+1}: "{text}" (classes: {classes})')
    else:
        print(f'Failed to load page: {response.status_code}')
        
except Exception as e:
    print(f'Error: {e}')
import requests
from bs4 import BeautifulSoup

mobile_headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
}

response = requests.get('https://www.flipkart.com/search?q=iPhone+14', headers=mobile_headers)
soup = BeautifulSoup(response.text, 'html.parser')

product_links = soup.find_all('a', href=True)
for link in product_links:
    href = link.get('href', '')
    if '/p/' in href:
        print(f'URL: {href}')
        img = link.find('img')
        if img:
            print(f'Alt text: "{img.get("alt", "")}"')
            print(f'Title: "{img.get("title", "")}"')
            print(f'Src: "{img.get("src", "")}"')
        link_text = link.get_text(strip=True)
        print(f'Link text: "{link_text}"')
        print(f'Link HTML: {str(link)[:200]}...')
        break
# Amazon Third-Party Data Sources - Complete Guide

## 🎯 **YES! Multiple third-party options exist for Amazon product data**

## 🏆 **Top Recommendations**

### **1. Keepa API (BEST OVERALL)**
- **Website**: https://keepa.com
- **Features**: Price history, price drops, stock tracking, BSR history
- **Data**: Real MRP, current price, lowest price, price charts
- **Coverage**: All Amazon marketplaces (US, IN, UK, DE, etc.)
- **Pricing**: 
  - Free: 100 requests/month
  - Starter: $19/month (500,000 requests)
  - Pro: $39/month (2M requests)

**Sample API Call**:
```python
import requests

# Get product data from Keepa
url = "https://api.keepa.com/product"
params = {
    'key': 'YOUR_API_KEY',
    'domain': '8',  # 8 = Amazon India
    'asin': 'B08N5WRWNW',  # Example ASIN
    'stats': '1',  # Include statistics
    'history': '1'  # Include price history
}
response = requests.get(url, params=params)
data = response.json()
```

### **2. RapidAPI Amazon Services**
**Multiple providers on one platform**

#### **A. Amazon Data Scraper API**
- **Endpoint**: `amazon-web-scraping-api.p.rapidapi.com`
- **Features**: Product details, prices, reviews, search
- **Pricing**: $10-50/month

```python
import requests

url = "https://amazon-web-scraping-api.p.rapidapi.com/products/search"
querystring = {"query": "iPhone 14", "country": "IN"}

headers = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "amazon-web-scraping-api.p.rapidapi.com"
}

response = requests.request("GET", url, headers=headers, params=querystring)
print(response.json())
```

#### **B. Real-Time Amazon Data API**
- **Endpoint**: `real-time-amazon-data.p.rapidapi.com`
- **Features**: Live pricing, product details, reviews
- **Pricing**: $15-100/month

```python
url = "https://real-time-amazon-data.p.rapidapi.com/product-details"
querystring = {"asin": "B08N5WRWNW", "country": "IN"}

headers = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
}

response = requests.request("GET", url, headers=headers, params=querystring)
```

## 🆓 **Free Alternatives**

### **3. Amazon Affiliate API (Product Advertising API)**
- **Cost**: FREE (but requires affiliate account)
- **Features**: Product details, pricing, images, reviews
- **Limitation**: Must generate affiliate commissions or account gets suspended

```python
# Using Amazon Product Advertising API
from paapi5_python_sdk.api.default_api import DefaultApi
from paapi5_python_sdk.models.search_items_request import SearchItemsRequest
from paapi5_python_sdk.models.search_items_resource import SearchItemsResource

def search_amazon_products(keywords):
    search_items_request = SearchItemsRequest(
        partner_tag="your-associate-id",
        partner_type="Associates",
        marketplace="www.amazon.in",
        keywords=keywords,
        resources=[
            SearchItemsResource.ITEM_INFO_TITLE,
            SearchItemsResource.OFFERS_LISTINGS_PRICE,
            SearchItemsResource.IMAGES_PRIMARY_LARGE
        ]
    )
    
    default_api = DefaultApi(
        access_key="YOUR_ACCESS_KEY",
        secret_key="YOUR_SECRET_KEY",
        host="webservices.amazon.in",
        region="us-east-1"
    )
    
    response = default_api.search_items(search_items_request)
    return response
```

### **4. Web Scraping Service APIs**

#### **ScrapingBee** (Handles anti-bot protection)
```python
import requests

url = "https://app.scrapingbee.com/api/v1/"
params = {
    'api_key': 'YOUR_SCRAPINGBEE_API_KEY',
    'url': 'https://www.amazon.in/dp/B08N5WRWNW',
    'render_js': 'true',
    'premium_proxy': 'true',
    'country_code': 'in'
}

response = requests.get(url, params=params)
# Parse HTML with BeautifulSoup
```

## 📊 **Comparison Table**

| Service | Cost/Month | Free Tier | Price History | Real-time | API Quality | Setup Difficulty |
|---------|------------|-----------|---------------|-----------|-------------|------------------|
| **Keepa** | $19-199 | ✅ 100 req | ✅ Excellent | ✅ | ⭐⭐⭐⭐⭐ | Easy |
| **RapidAPI** | $10-100 | ✅ Limited | ❌ Varies | ✅ | ⭐⭐⭐⭐ | Easy |
| **Amazon API** | FREE* | ✅ | ❌ | ✅ | ⭐⭐⭐⭐ | Medium |
| **ScrapingBee** | $29-249 | ✅ 1000 req | ❌ | ✅ | ⭐⭐⭐ | Medium |

*Requires affiliate sales to maintain

## 🚀 **Implementation for Your Project**

### **Option 1: Add Keepa Integration (RECOMMENDED)**
```python
# Add to your existing scraper.py
def scrape_amazon_keepa(query):
    import requests
    
    # Search for products first
    search_url = "https://api.keepa.com/query"
    search_params = {
        'key': 'YOUR_KEEPA_API_KEY',
        'domain': '8',  # Amazon India
        'type': 'product',
        'term': query,
        'sort': 'RELEVANCE_LAUNCH_DATE',
        'range': '0-50'  # First 50 results
    }
    
    search_response = requests.get(search_url, params=search_params)
    products = search_response.json()
    
    results = []
    for product in products.get('products', []):
        asin = product.get('asin')
        
        # Get detailed product data
        detail_params = {
            'key': 'YOUR_KEEPA_API_KEY',
            'domain': '8',
            'asin': asin,
            'stats': '1'
        }
        
        detail_response = requests.get("https://api.keepa.com/product", params=detail_params)
        detail_data = detail_response.json()
        
        if detail_data.get('products'):
            product_data = detail_data['products'][0]
            
            results.append({
                'platform': 'Amazon (Keepa)',
                'title': product_data.get('title', ''),
                'price': extract_current_price(product_data),
                'url': f"https://www.amazon.in/dp/{asin}",
                'image': product_data.get('imagesCSV', '').split(',')[0] if product_data.get('imagesCSV') else '',
                'currency': 'INR',
                'availability': 'In Stock' if product_data.get('availabilityAmazon', -1) > 0 else 'Out of Stock',
                'original_price': extract_original_price(product_data),
                'price_history': extract_price_history(product_data)
            })
    
    return results

def extract_current_price(product_data):
    # Keepa stores prices in specific format, need to decode
    current_price = product_data.get('stats', {}).get('current', [None, None, None])[0]
    return current_price / 100 if current_price and current_price > 0 else None
```

### **Option 2: Add RapidAPI Integration**
```python
# Add to your scraper routes
def scrape_amazon_rapidapi(query):
    import requests
    
    url = "https://amazon-web-scraping-api.p.rapidapi.com/products/search"
    querystring = {"query": query, "country": "IN", "max_results": "20"}
    
    headers = {
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
        "X-RapidAPI-Host": "amazon-web-scraping-api.p.rapidapi.com"
    }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.json()
    
    results = []
    for product in data.get('products', []):
        results.append({
            'platform': 'Amazon (RapidAPI)',
            'title': product.get('title', ''),
            'price': product.get('price', {}).get('value'),
            'url': product.get('url', ''),
            'image': product.get('image', ''),
            'currency': 'INR',
            'availability': 'In Stock',
            'rating': product.get('rating', {}).get('value'),
            'reviews': product.get('reviews_count')
        })
    
    return results
```

## 💡 **Quick Start Guide**

### **To get started immediately:**

1. **Sign up for Keepa** (recommended)
   - Go to https://keepa.com/#!api
   - Create account → Get API key
   - Start with free tier (100 requests/month)

2. **Or try RapidAPI**
   - Go to https://rapidapi.com
   - Search "Amazon Data API"
   - Subscribe to free tier
   - Get API key

3. **Integrate with your existing scraper**
   - Add new scraping method
   - Update your routes to include Amazon data
   - Test with sample queries

## ⚡ **Benefits of Using Third-Party APIs**

✅ **Legal compliance** - No terms of service violations  
✅ **Reliable data** - Professional data providers  
✅ **Price history** - Historical pricing data  
✅ **No blocking** - APIs designed for programmatic access  
✅ **Rich metadata** - Reviews, ratings, images, etc.  
✅ **Global coverage** - Multiple Amazon marketplaces  

## 🎯 **Next Steps**

1. **Choose your provider** (Keepa recommended)
2. **Get API access** 
3. **Test integration** with sample products
4. **Add to your existing scraper architecture**
5. **Update frontend** to show Amazon data

**Ready to implement? Let me know which option you'd like to proceed with!**
#!/usr/bin/env python3
"""
Flipkart Price Scraping Analysis
"""

from scraper import ProductScraper
import logging

# Enable detailed logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

def analyze_flipkart_price_scraping():
    print("🕷️ FLIPKART PRICE SCRAPING ANALYSIS")
    print("=" * 50)
    
    scraper = ProductScraper()
    
    print("🔍 Testing Flipkart scraping for 'iPhone 14'...")
    print("📋 This will show exactly how prices are extracted\n")
    
    # Run Flipkart scraping
    scraper.scrape_flipkart('iPhone 14')
    
    print("\n" + "=" * 50)
    print("📊 FINAL RESULTS:")
    
    flipkart_results = [r for r in scraper.results if r['platform'] == 'Flipkart']
    
    if flipkart_results:
        for i, result in enumerate(flipkart_results, 1):
            print(f"\n🎯 Product #{i}:")
            print(f"   📝 Title: {result['title']}")
            print(f"   💰 Price: ₹{result['price']}")
            print(f"   🔗 URL: {result['url']}")
            print(f"   🖼️ Image: {result['image'][:50]}..." if result['image'] else "   🖼️ Image: None")
    else:
        print("❌ No Flipkart results found")
    
    print(f"\n📈 Total Flipkart products scraped: {len(flipkart_results)}")

if __name__ == "__main__":
    analyze_flipkart_price_scraping()
#!/usr/bin/env python3
"""
Test script for the Cost Curve web scraper
Run this to verify the scraper works correctly
"""

import json
import subprocess
import sys

def test_scraper():
    print("🧪 Testing Cost Curve Web Scraper")
    print("=" * 50)
    
    test_queries = ["iPhone 15", "laptop", "sneakers"]
    
    for query in test_queries:
        print(f"\n🔍 Testing query: '{query}'")
        print("-" * 30)
        
        try:
            # Run the scraper
            result = subprocess.run([
                sys.executable, 'scraper.py', query
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                try:
                    data = json.loads(result.stdout)
                    
                    if data.get('success'):
                        products = data.get('products', [])
                        print(f"✅ Found {len(products)} products")
                        
                        for i, product in enumerate(products[:3], 1):  # Show first 3
                            print(f"  {i}. {product['platform']}: {product['title'][:50]}...")
                            print(f"     Price: ₹{product['price']:,}")
                            print(f"     Deal Score: {product['dealScore']}/100")
                            print()
                    else:
                        print(f"❌ Scraper returned error: {data.get('error', 'Unknown error')}")
                        
                except json.JSONDecodeError as e:
                    print(f"❌ Failed to parse JSON output: {e}")
                    print(f"Raw output: {result.stdout[:200]}...")
                    
            else:
                print(f"❌ Scraper failed with exit code {result.returncode}")
                print(f"Error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print("❌ Scraper timed out (30s)")
        except Exception as e:
            print(f"❌ Test failed: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")

if __name__ == "__main__":
    test_scraper()
#!/bin/bash

# Cost Curve Web Scraper Setup Script
echo "🚀 Setting up Cost Curve Web Scraper"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Determine Python command
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PIP_CMD="pip"
fi

echo "✅ Using Python: $(which $PYTHON_CMD)"

# Navigate to backend directory
cd "$(dirname "$0")"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
$PIP_CMD install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed successfully!"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Test the scraper
echo "🧪 Testing the scraper..."
$PYTHON_CMD test_scraper.py

echo "🎉 Setup complete!"
echo ""
echo "To start the backend server:"
echo "  npm run dev"
echo ""
echo "To test the scraper manually:"
echo "  $PYTHON_CMD scraper.py \"iPhone 15\""
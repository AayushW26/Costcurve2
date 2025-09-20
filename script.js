// Cost Curve - JavaScript Functionality

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const productUrl = document.getElementById('productUrl');
const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('resultsGrid');
const loadingOverlay = document.getElementById('loadingOverlay');
const dealScore = document.getElementById('dealScore');
const scoreDescription = document.getElementById('scoreDescription');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const enableAlerts = document.getElementById('enableAlerts');
const budgetInput = document.getElementById('budgetInput');

// Sample data for demonstration
const sampleResults = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max 256GB",
        price: "₹1,34,900",
        originalPrice: "₹1,49,900",
        platform: "Amazon India",
        image: "https://via.placeholder.com/300x200?text=iPhone+15+Pro",
        link: "#",
        discount: "10%",
        inStock: true,
        shippingCost: "Free",
        totalCost: "₹1,34,900"
    },
    {
        id: 2,
        title: "Apple iPhone 15 Pro Max 256GB",
        price: "₹1,36,500",
        originalPrice: "₹1,49,900",
        platform: "Flipkart",
        image: "https://via.placeholder.com/300x200?text=iPhone+15+Pro",
        link: "#",
        discount: "9%",
        inStock: true,
        shippingCost: "₹200",
        totalCost: "₹1,36,700"
    },
    {
        id: 3,
        title: "Apple iPhone 15 Pro Max 256GB",
        price: "₹1,38,000",
        originalPrice: "₹1,49,900",
        platform: "Croma",
        image: "https://via.placeholder.com/300x200?text=iPhone+15+Pro",
        link: "#",
        discount: "8%",
        inStock: false,
        shippingCost: "₹500",
        totalCost: "₹1,38,500"
    }
];

// Price history data for chart
const priceHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
        label: 'Price History',
        data: [149900, 145000, 142000, 138000, 140000, 136000, 134900],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
    }, {
        label: 'Predicted Price',
        data: [null, null, null, null, null, null, 134900, 132000, 130000],
        borderColor: '#764ba2',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
    }]
};

// User data simulation
let userData = {
    isLoggedIn: false,
    username: '',
    watchlist: [],
    alerts: [],
    budget: null
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

searchBtn.addEventListener('click', handleSearch);
productUrl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

loginBtn.addEventListener('click', showLoginModal);
closeModal.addEventListener('click', hideLoginModal);
loginForm.addEventListener('submit', handleLogin);

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        hideLoginModal();
    }
});

// Functions
function initializeApp() {
    console.log('Cost Curve app initialized');
    updateLoginStatus();
}

function handleSearch() {
    const url = productUrl.value.trim();
    
    if (!url) {
        showNotification('Please enter a product URL or search term', 'warning');
        return;
    }
    
    if (!isValidUrl(url) && url.length < 3) {
        showNotification('Please enter a valid URL or search term', 'warning');
        return;
    }
    
    showLoading();
    simulateSearch(url);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function simulateSearch(searchTerm) {
    // Simulate API call delay
    setTimeout(() => {
        hideLoading();
        displayResults(sampleResults);
        updateDealScore(8.5, "Excellent deal! Price is near all-time low.");
        showPriceChart();
        
        // Scroll to results
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        showNotification('Found ' + sampleResults.length + ' results across platforms', 'success');
    }, 2000);
}

function displayResults(results) {
    resultsSection.style.display = 'block';
    resultsGrid.innerHTML = '';
    
    results.forEach(result => {
        const resultCard = createResultCard(result);
        resultsGrid.appendChild(resultCard);
    });
}

function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const stockStatus = result.inStock ? 
        '<span style="color: green; font-weight: bold;">✓ In Stock</span>' : 
        '<span style="color: red; font-weight: bold;">✗ Out of Stock</span>';
    
    const discountBadge = result.discount ? 
        `<span class="discount-badge" style="background: #e74c3c; color: white; padding: 0.25rem 0.5rem; border-radius: 5px; font-size: 0.8rem;">${result.discount} OFF</span>` : '';
    
    card.innerHTML = `
        <img src="${result.image}" alt="${result.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
        <h4>${result.title}</h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="price">${result.price}</div>
            ${discountBadge}
        </div>
        ${result.originalPrice ? `<div style="text-decoration: line-through; color: #999; margin-bottom: 0.5rem;">${result.originalPrice}</div>` : ''}
        <div class="platform">📍 ${result.platform}</div>
        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
            Shipping: ${result.shippingCost} | Total: ${result.totalCost}
        </div>
        <div style="margin-bottom: 1rem;">${stockStatus}</div>
        <button class="view-deal-btn" onclick="viewDeal('${result.link}', '${result.platform}')" ${!result.inStock ? 'disabled' : ''}>
            ${result.inStock ? 'View Deal' : 'Notify When Available'}
        </button>
        <button class="view-deal-btn" onclick="addToWatchlist(${result.id})" style="background: #f39c12; margin-top: 0.5rem;">
            <i class="fas fa-eye"></i> Add to Watchlist
        </button>
    `;
    
    return card;
}

function viewDeal(link, platform) {
    showNotification(`Redirecting to ${platform}...`, 'info');
    // In a real app, this would open the actual product link
    console.log('Opening deal:', link);
}

function addToWatchlist(productId) {
    if (!userData.isLoggedIn) {
        showNotification('Please login to add items to watchlist', 'warning');
        showLoginModal();
        return;
    }
    
    const product = sampleResults.find(p => p.id === productId);
    if (product && !userData.watchlist.some(p => p.id === productId)) {
        userData.watchlist.push(product);
        showNotification(`${product.title} added to watchlist!`, 'success');
        
        // Setup price alert if enabled
        if (enableAlerts.checked) {
            setupPriceAlert(product);
        }
    } else {
        showNotification('Item already in watchlist', 'info');
    }
}

function setupPriceAlert(product) {
    const budget = budgetInput.value ? parseInt(budgetInput.value) : null;
    const currentPrice = parseInt(product.price.replace(/[₹,]/g, ''));
    
    const alert = {
        productId: product.id,
        productTitle: product.title,
        targetPrice: budget || currentPrice * 0.9, // 10% below current price if no budget set
        currentPrice: currentPrice,
        created: new Date()
    };
    
    userData.alerts.push(alert);
    showNotification(`Price alert set for ₹${alert.targetPrice.toLocaleString()}`, 'success');
}

function updateDealScore(score, description) {
    const scoreNumber = dealScore.querySelector('.score-number');
    const scoreDesc = scoreDescription;
    
    scoreNumber.textContent = score.toFixed(1);
    scoreDesc.textContent = description;
    
    // Color code the score
    const scoreElement = scoreNumber;
    if (score >= 8) {
        scoreElement.style.color = '#27ae60'; // Green
    } else if (score >= 6) {
        scoreElement.style.color = '#f39c12'; // Orange
    } else {
        scoreElement.style.color = '#e74c3c'; // Red
    }
}

function showPriceChart() {
    const canvas = document.getElementById('priceChart');
    const ctx = canvas.getContext('2d');
    
    // Simple chart implementation (in a real app, you'd use Chart.js or similar)
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple line chart
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const data = [149900, 145000, 142000, 138000, 140000, 136000, 134900];
    const maxPrice = Math.max(...data);
    const minPrice = Math.min(...data);
    const priceRange = maxPrice - minPrice;
    
    data.forEach((price, index) => {
        const x = (index / (data.length - 1)) * canvas.width;
        const y = canvas.height - ((price - minPrice) / priceRange) * (canvas.height - 40) - 20;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Price Trend (Last 7 months)', 10, 20);
    ctx.fillText(`₹${minPrice.toLocaleString()}`, 10, canvas.height - 5);
    ctx.fillText(`₹${maxPrice.toLocaleString()}`, 10, 35);
}

function showLoginModal() {
    loginModal.style.display = 'block';
}

function hideLoginModal() {
    loginModal.style.display = 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate login process
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        userData.isLoggedIn = true;
        userData.username = email.split('@')[0];
        updateLoginStatus();
        hideLoginModal();
        showNotification(`Welcome back, ${userData.username}!`, 'success');
        
        // Clear form
        loginForm.reset();
    }, 1000);
}

function updateLoginStatus() {
    if (userData.isLoggedIn) {
        loginBtn.textContent = `👋 ${userData.username}`;
        loginBtn.onclick = showUserMenu;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = showLoginModal;
    }
}

function showUserMenu() {
    // Simple user menu implementation
    const menu = confirm(`Hello ${userData.username}!\n\nWatchlist: ${userData.watchlist.length} items\nAlerts: ${userData.alerts.length} active\n\nClick OK to logout, Cancel to continue`);
    
    if (menu) {
        logout();
    }
}

function logout() {
    userData = {
        isLoggedIn: false,
        username: '',
        watchlist: [],
        alerts: [],
        budget: null
    };
    updateLoginStatus();
    showNotification('Logged out successfully', 'info');
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 4000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function getRandomPrice(base, variance) {
    return base + (Math.random() - 0.5) * variance;
}

// Price tracking simulation
function simulatePriceTracking() {
    if (userData.alerts.length > 0) {
        userData.alerts.forEach(alert => {
            const newPrice = getRandomPrice(alert.currentPrice, 5000);
            if (newPrice <= alert.targetPrice) {
                showNotification(
                    `🎉 Price Alert: ${alert.productTitle} is now available for ${formatCurrency(newPrice)}!`,
                    'success'
                );
            }
        });
    }
}

// Start price tracking simulation
setInterval(simulatePriceTracking, 30000); // Check every 30 seconds

// Analytics tracking (placeholder)
function trackEvent(eventName, properties) {
    console.log('Analytics Event:', eventName, properties);
    // In a real app, this would send data to analytics service
}

// Track user interactions
searchBtn.addEventListener('click', () => trackEvent('search_initiated', { query: productUrl.value }));
loginBtn.addEventListener('click', () => trackEvent('login_attempt'));

console.log('Cost Curve JavaScript loaded successfully!');

import React from 'react';
import SearchSection from '../../components/SearchSection/SearchSection';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: 'fas fa-chart-area',
      title: 'Predictive Analytics',
      description: 'AI-powered price predictions help you decide when to buy'
    },
    {
      icon: 'fas fa-shopping-cart',
      title: 'Total Cost Analysis',
      description: 'See complete costs including shipping, taxes, and duties'
    },
    {
      icon: 'fas fa-bell',
      title: 'Smart Alerts',
      description: 'Get notified when prices drop or products are back in stock'
    },
    {
      icon: 'fas fa-star',
      title: 'Deal Score',
      description: 'Proprietary scoring system to rate deal quality'
    },
    {
      icon: 'fas fa-tags',
      title: 'Multi-Platform',
      description: 'Compare prices across fashion, electronics, travel, and more'
    },
    {
      icon: 'fas fa-user-cog',
      title: 'Personalized Budget',
      description: 'Set budgets and get recommendations within your limits'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Find the Best Deals Across All Platforms</h2>
            <p>Track prices, predict trends, and never miss a great deal again</p>
            
            <SearchSection />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h3>Why Choose Cost Curve?</h3>
            <p>Discover the features that make us the smartest choice for price tracking</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Products Tracked</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹50Cr+</div>
              <div className="stat-label">Money Saved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Retailers Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h3>Ready to Save Money?</h3>
            <p>Join thousands of smart shoppers who never pay full price</p>
            <button className="cta-btn" onClick={() => {
              document.querySelector('.search-input').focus();
            }}>
              Start Tracking Prices Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
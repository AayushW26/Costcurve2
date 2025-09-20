import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './PriceChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ priceHistory, productName, currentPrice }) => {
  // Sample data if no price history provided
  const defaultData = [
    { date: '2024-01-01', price: 149900 },
    { date: '2024-01-15', price: 145000 },
    { date: '2024-02-01', price: 142000 },
    { date: '2024-02-15', price: 138000 },
    { date: '2024-03-01', price: 140000 },
    { date: '2024-03-15', price: 136000 },
    { date: '2024-04-01', price: currentPrice || 134900 }
  ];

  const data = priceHistory || defaultData;

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: `${productName || 'Product'} Price`,
        data: data.map(item => item.price),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 14
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: `Price History - ${productName || 'Product'}`,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold'
        },
        color: '#111827',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          label: function(context) {
            return `Price: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6',
          borderColor: '#d1d5db'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          borderColor: '#d1d5db'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#6b7280',
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#5a67d8'
      }
    }
  };

  // Calculate price trend
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(1);

  return (
    <div className="price-chart">
      <div className="chart-header">
        <div className="price-info">
          <span className="current-price">₹{lastPrice.toLocaleString()}</span>
          <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}₹{Math.abs(priceChange).toLocaleString()} 
            ({priceChange >= 0 ? '+' : ''}{priceChangePercent}%)
          </span>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <div className="chart-footer">
        <div className="chart-insights">
          <div className="insight">
            <span className="insight-label">Lowest Price:</span>
            <span className="insight-value">₹{Math.min(...data.map(d => d.price)).toLocaleString()}</span>
          </div>
          <div className="insight">
            <span className="insight-label">Highest Price:</span>
            <span className="insight-value">₹{Math.max(...data.map(d => d.price)).toLocaleString()}</span>
          </div>
          <div className="insight">
            <span className="insight-label">Average Price:</span>
            <span className="insight-value">
              ₹{Math.round(data.reduce((sum, d) => sum + d.price, 0) / data.length).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
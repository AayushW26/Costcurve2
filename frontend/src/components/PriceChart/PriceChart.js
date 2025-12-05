import React, { useState, useMemo } from 'react';
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
  const [timeRange, setTimeRange] = useState('max');

  // Generate realistic price history data spanning 16 months
  const generatePriceHistory = (basePrice) => {
    const data = [];
    const startDate = new Date('2024-09-01');
    const endDate = new Date('2025-12-01');
    
    let price = basePrice || 75000;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Add some realistic price fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.08 * price;
      const seasonalFactor = Math.sin(currentDate.getMonth() * Math.PI / 6) * 0.03 * price;
      
      // Occasional price drops (sales)
      const isOnSale = Math.random() < 0.1;
      const saleDiscount = isOnSale ? price * 0.15 : 0;
      
      price = Math.max(price * 0.7, Math.min(price * 1.3, price + fluctuation + seasonalFactor - saleDiscount));
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        price: Math.round(price)
      });
      
      // Move to next data point (every 3-5 days for more detail)
      currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 3);
    }
    
    return data;
  };

  const defaultData = useMemo(() => generatePriceHistory(currentPrice || 75000), [currentPrice]);
  const fullData = priceHistory || defaultData;

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3month':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'max':
      default:
        return fullData;
    }
    
    return fullData.filter(item => new Date(item.date) >= startDate);
  }, [fullData, timeRange]);

  // Create gradient for chart
  const createGradient = (ctx, chartArea) => {
    if (!chartArea) return 'rgba(255, 107, 107, 0.3)';
    
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(255, 107, 107, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.3)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0.2)');
    return gradient;
  };

  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Price',
        data: filteredData.map(item => item.price),
        borderColor: '#ff6b6b',
        backgroundColor: function(context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return createGradient(ctx, chartArea);
        },
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ff6b6b',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 0,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#9ca3af',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        }
      },
      y: {
        position: 'left',
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#9ca3af',
          callback: function(value) {
            if (value >= 100000) {
              return '₹' + (value / 1000).toFixed(0) + 'K';
            } else if (value >= 1000) {
              return '₹' + (value / 1000).toFixed(0) + 'K';
            }
            return '₹' + value;
          },
          padding: 10,
        },
        beginAtZero: true,
      }
    },
    elements: {
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
      }
    }
  };

  return (
    <div className="price-chart">
      <div className="chart-header">
        <h3 className="chart-title">Price History</h3>
        <div className="time-range-buttons">
          <button 
            className={`time-btn ${timeRange === '1month' ? 'active' : ''}`}
            onClick={() => setTimeRange('1month')}
          >
            1 Month
          </button>
          <button 
            className={`time-btn ${timeRange === '3month' ? 'active' : ''}`}
            onClick={() => setTimeRange('3month')}
          >
            3 Month
          </button>
          <button 
            className={`time-btn ${timeRange === 'max' ? 'active' : ''}`}
            onClick={() => setTimeRange('max')}
          >
            Max
          </button>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;
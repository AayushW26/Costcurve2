import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SavingsChart = ({ savings = [] }) => {
  const defaultSavings = [
    { platform: 'Amazon', savings: 2500 },
    { platform: 'Flipkart', savings: 1800 },
    { platform: 'Myntra', savings: 3200 },
    { platform: 'BigBasket', savings: 450 },
  ];

  const data = savings.length > 0 ? savings : defaultSavings;

  const chartData = {
    labels: data.map(item => item.platform),
    datasets: [
      {
        label: 'Savings (₹)',
        data: data.map(item => item.savings),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Savings by Platform',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Savings: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', marginBottom: '20px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SavingsChart;
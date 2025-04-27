import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const AdminStatistics = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [statistics, setStatistics] = useState(null);
  const [totalListingsCount, setTotalListingsCount] = useState(0);
  const [totalPromotionsCount, setTotalPromotionsCount] = useState(0);
  const [totalReservationsCount, setTotalReservationsCount] = useState(0);
  const [listingsPerMonthData, setListingsPerMonthData] = useState(null);
  const [promotedListingsPerMonthData, setPromotedListingsPerMonthData] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [listingsPerTutorOverTimeData, setListingsPerTutorOverTimeData] = useState(null);
  const [reservationsPerMonthData, setReservationsPerMonthData] = useState(null);

  const prepareListingsPerTutorOverTimeChartData = (tutorId) => {
    const dataForTutor = statistics.listingsPerTutorOverTime.filter(
      (item) => item.tutorId === tutorId
    );

    const dataMap = {};
    dataForTutor.forEach((item) => {
      const key = `${item.month}/${item.year}`;
      dataMap[key] = item.listingCount;
    });

    const years = [...new Set(dataForTutor.map((item) => item.year))];
    years.sort();

    const months = [];
    years.forEach((year) => {
      for (let month = 1; month <= 12; month++) {
        months.push({ month, year });
      }
    });

    const labels = months.map((item) => `${item.month}/${item.year}`);
    const data = labels.map((label) => dataMap[label] || 0);

    setListingsPerTutorOverTimeData({
      labels,
      datasets: [
        {
          label: 'Liczba ofert',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  };

  const prepareListingsPerMonthChartData = (listingsPerMonth) => {
    const years = [...new Set(listingsPerMonth.map((item) => item._id.year))];
    years.sort();

    const months = [];

    years.forEach((year) => {
      for (let month = 1; month <= 12; month++) {
        months.push({ month, year });
      }
    });

    const dataMap = {};
    listingsPerMonth.forEach((item) => {
      const key = `${item._id.month}/${item._id.year}`;
      dataMap[key] = Math.round(item.count);
    });

    const labels = months.map((item) => `${item.month}/${item.year}`);
    const data = labels.map((label) => dataMap[label] || 0);

    setListingsPerMonthData({
      labels,
      datasets: [
        {
          label: 'Liczba dodanych ofert',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  };

  const preparePromotedListingsPerMonthChartData = (promotedListingsPerMonth) => {
    const years = [...new Set(promotedListingsPerMonth.map((item) => item._id.year))];
    years.sort();

    const months = [];

    years.forEach((year) => {
      for (let month = 1; month <= 12; month++) {
        months.push({ month, year });
      }
    });

    const dataMap = {};
    promotedListingsPerMonth.forEach((item) => {
      const key = `${item._id.month}/${item._id.year}`;
      dataMap[key] = Math.round(item.count);
    });

    const labels = months.map((item) => `${item.month}/${item.year}`);
    const data = labels.map((label) => dataMap[label] || 0);

    setPromotedListingsPerMonthData({
      labels,
      datasets: [
        {
          label: 'Liczba zakupionych promocji',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  };

  const prepareReservationsPerMonthChartData = (reservationsPerMonth) => {
    const dataMap = {};
    reservationsPerMonth.forEach((item) => {
      const key = `${item._id.month}/${item._id.year}`;
      dataMap[key] = item.count;
    });

    const years = [...new Set(reservationsPerMonth.map((item) => item._id.year))];
    years.sort();

    const months = [];
    years.forEach((year) => {
      for (let month = 1; month <=12; month++) {
        months.push({ month, year });
      }
    });

    const labels = months.map((item) => `${item.month}/${item.year}`);
    const data = labels.map((label) => dataMap[label] || 0);

    setReservationsPerMonthData({
      labels,
      datasets: [
        {
          label: 'Liczba rezerwacji',
          data,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/statistics', {
          headers: { 'x-auth-token': token },
        });
        setStatistics(response.data);
        setTotalListingsCount(response.data.totalListingsCount);
        setTotalPromotionsCount(response.data.totalPromotionsCount);
        setTotalReservationsCount(response.data.totalReservationsCount);

        prepareListingsPerMonthChartData(response.data.listingsPerMonth);
        preparePromotedListingsPerMonthChartData(response.data.promotedListingsPerMonth);
        prepareReservationsPerMonthChartData(response.data.reservationsPerMonth);

        if (response.data.listingsPerTutorOverTime.length > 0) {
          const firstTutor = response.data.listingsPerTutorOverTime[0];
          setSelectedTutor(firstTutor.tutorId);
          prepareListingsPerTutorOverTimeChartData(firstTutor.tutorId);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTutor && statistics) {
      prepareListingsPerTutorOverTimeChartData(selectedTutor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTutor, statistics]);

  if (!isAuthenticated || userRole !== 'Admin') {
    return <p className="text-danger">Brak dostępu.</p>;
  }

  if (!statistics) {
    return <p>Ładowanie statystyk...</p>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
          color: '#333',
        },
      },
      y: {
        grid: {
          color: '#e0e0e0',
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
          stepSize: 1,
          callback: function (value) {
            if (Math.floor(value) === value) {
              return value;
            }
          },
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
          color: '#333',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
          color: '#333',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 14,
          family: 'Arial, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Arial, sans-serif',
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (Number.isInteger(context.parsed.y)) {
              label += context.parsed.y;
            } else {
              label += context.parsed.y.toFixed(0);
            }
            return label;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuad',
    },
  };

  const chartStyle = {
    height: '400px',
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Statystyki</h1>

      <div className="mb-5">
        <h3>Wybierz korepetytora:</h3>
        <select
          className="form-control"
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
        >
          {statistics.listingsPerTutorOverTime
            .map((item) => ({
              tutorId: item.tutorId,
              tutorName: item.tutorName,
            }))
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.tutorId === value.tutorId)
            )
            .map((tutor) => (
              <option key={tutor.tutorId} value={tutor.tutorId}>
                {tutor.tutorName}
              </option>
            ))}
        </select>
        <h3>
          Liczba ofert korepetycji dla wybranego korepetytora na przestrzeni miesięcy
        </h3>
        {listingsPerTutorOverTimeData && (
          <div style={chartStyle}>
            <Line data={listingsPerTutorOverTimeData} options={chartOptions} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3>Liczba ofert dodanych w ciągu miesięcy (Łącznie: {totalListingsCount})</h3>
        {listingsPerMonthData && (
          <div style={chartStyle}>
            <Line data={listingsPerMonthData} options={chartOptions} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3>Liczba zakupionych promocji w ciągu miesięcy (Łącznie: {totalPromotionsCount})</h3>
        {promotedListingsPerMonthData && (
          <div style={chartStyle}>
            <Line data={promotedListingsPerMonthData} options={chartOptions} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3>Liczba rezerwacji w ciągu miesięcy (Łącznie: {totalReservationsCount})</h3>
        {reservationsPerMonthData && (
          <div style={chartStyle}>
            <Line data={reservationsPerMonthData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;

// src/components/SIPGraph.js
import React from 'react';
import Chart from 'react-apexcharts';

const SIPGraph = ({ data, calcType }) => {
  const categories = data.map(point =>
    calcType === 'SIP' ? `Month ${point.period}` : `Year ${point.period}`
  );

  const series = [{
    name: calcType === 'SIP' ? 'Future Value (SIP)' : 'Future Value (Lumpsum)',
    data: data.map(point => point.value)
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      animations: { enabled: true },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: '#333', fontSize: '12px' }
      }
    },
    yaxis: {
      title: {
        text: 'Future Value (₹)',
        style: { fontSize: '14px', color: '#333' }
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: ['#00bcd4'],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    title: {
      text: calcType === 'SIP' ? 'SIP Growth Over Time' : 'Lumpsum Growth Over Time',
      align: 'center',
      style: { fontSize: '18px', color: '#333' }
    },
    tooltip: { theme: 'dark' }
  };

  return (
    <div id="chart">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default SIPGraph;

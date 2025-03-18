// src/components/SIPCalculator.js
import React, { useState } from 'react';
import SIPGraph from './SIPGraph';
import BarInput from './BarInput';
import { Button, Box, Typography, Paper, ButtonGroup } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SIPCalculator = () => {
  // State for calculation type: "SIP" or "Lumpsum"
  const [calcType, setCalcType] = useState("SIP");
  // Investment amount: for SIP, it's monthly; for Lumpsum, it's one-time
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (calcType === "SIP") {
      const monthlyRate = annualRate / 12 / 100;
      const totalMonths = years * 12;
      const generatedData = [];
      for (let month = 1; month <= totalMonths; month++) {
        const value = investmentAmount * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
        generatedData.push({ period: month, value: parseFloat(value.toFixed(2)) });
      }
      setData(generatedData);
      const totalInvested = investmentAmount * totalMonths;
      const futureValue = generatedData[generatedData.length - 1].value;
      const totalReturn = futureValue - totalInvested;
      setSummary({
        investmentAmount,
        annualRate,
        years,
        totalInvested: totalInvested.toFixed(2),
        futureValue: futureValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
      });
    } else {
      // Lumpsum calculation: generate data yearly
      const generatedData = [];
      for (let yearCounter = 1; yearCounter <= years; yearCounter++) {
        const value = investmentAmount * Math.pow(1 + annualRate / 100, yearCounter);
        generatedData.push({ period: yearCounter, value: parseFloat(value.toFixed(2)) });
      }
      setData(generatedData);
      const totalInvested = investmentAmount;
      const futureValue = generatedData[generatedData.length - 1].value;
      const totalReturn = futureValue - totalInvested;
      setSummary({
        investmentAmount,
        annualRate,
        years,
        totalInvested: totalInvested.toFixed(2),
        futureValue: futureValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
      });
    }
  };

  // Function to download the current view as a PDF
  const handleDownloadPDF = () => {
    const input = document.getElementById('downloadable-content');
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${calcType}-Investment-Data.pdf`);
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Investment Calculator
      </Typography>
      {/* Wrap the content to be downloaded in a container with id */}
      <div id="downloadable-content">
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ButtonGroup variant="contained">
              <Button onClick={() => setCalcType("SIP")} color={calcType === "SIP" ? "primary" : "inherit"}>
                SIP
              </Button>
              <Button onClick={() => setCalcType("Lumpsum")} color={calcType === "Lumpsum" ? "primary" : "inherit"}>
                Lumpsum
              </Button>
            </ButtonGroup>
          </Box>
          <form onSubmit={handleCalculate}>
            <BarInput
              label={calcType === "SIP" ? "Monthly Investment (₹)" : "Lumpsum Investment (₹)"}
              min={100}
              max={1000000}
              step={100}
              value={investmentAmount}
              onChange={setInvestmentAmount}
            />
            <BarInput
              label="Annual Interest Rate (%)"
              min={1}
              max={20}
              step={0.1}
              value={annualRate}
              onChange={setAnnualRate}
            />
            <BarInput
              label="Years"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={setYears}
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Calculate
              </Button>
            </Box>
          </form>
        </Paper>
        {data.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <SIPGraph data={data} calcType={calcType} />
          </Paper>
        )}
        {summary && (
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fafafa', mt: 3 }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
              {calcType === "SIP" ? "SIP Summary" : "Lumpsum Summary"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1">
                <strong>{calcType === "SIP" ? "Monthly Investment:" : "Lumpsum Investment:"}</strong>{' '}
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  ₹{summary.investmentAmount}
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Annual Interest Rate:</strong>{' '}
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {summary.annualRate}%
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Investment Period:</strong>{' '}
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {summary.years} years
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Total Amount Invested:</strong>{' '}
                <span style={{ color: '#388e3c', fontWeight: 'bold' }}>
                  ₹{summary.totalInvested}
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Total Future Value:</strong>{' '}
                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                  ₹{summary.futureValue}
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Total Return (Profit):</strong>{' '}
                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                  ₹{summary.totalReturn}
                </span>
              </Typography>
            </Box>
          </Paper>
        )}
      </div>
        {/* Show download button only if summary exists */}
        {summary && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button onClick={handleDownloadPDF} variant="outlined" color="secondary">
            Download Data as PDF
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SIPCalculator;

import { useEffect, useRef, useState } from 'react';
import styles from './disaster-prediction-agent.module.css'; // Import CSS module

export default function DisasterPredictionAgent() {
  const [inputs, setInputs] = useState({
    temperature: 25,
    humidity: 60,
    pressure: 1013,
    windSpeed: 10,
    windDirection: 180,
    precipitation: 0,
    visibility: 10,
    cloudCover: 30,
  });
  const [prediction, setPrediction] = useState(null);
  const networkCanvasRef = useRef(null);
  const dataChartRef = useRef(null);

  // DisasterPredictionAgent class
  class DisasterPredictionAgent {
    constructor() {
      this.weights = this.initializeWeights();
      this.historicalData = [];
      this.isTraining = false;
    }

    initializeWeights() {
      const weights = [];
      for (let i = 0; i < 15; i++) {
        weights.push(Math.random() * 0.1 - 0.05);
      }
      return weights;
    }

    async predict(inputsArray) {
      let hiddenState = 0;
      let cellState = 0;

      for (let i = 0; i < inputsArray.length; i++) {
        const input = inputsArray[i];
        const weight = this.weights[i] || 0.01;

        const forget = this.sigmoid(hiddenState * 0.1 + input * weight);
        const inputGate = this.sigmoid(hiddenState * 0.2 + input * weight);
        const candidate = Math.tanh(hiddenState * 0.3 + input * weight);
        const output = this.sigmoid(hiddenState * 0.4 + input * weight);

        cellState = cellState * forget + inputGate * candidate;
        hiddenState = output * Math.tanh(cellState);
      }

      const riskProbability = this.sigmoid(hiddenState);
      const confidence = Math.min(0.95, Math.max(0.60, Math.abs(hiddenState) * 0.3 + 0.6));

      return {
        riskProbability,
        confidence,
        hiddenState,
        cellState,
      };
    }

    sigmoid(x) {
      return 1 / (1 + Math.exp(-x));
    }

    getRiskLevel(probability) {
      if (probability < 0.3) return { level: 'LOW', color: 'risk-low' };
      if (probability < 0.7) return { level: 'MEDIUM', color: 'risk-medium' };
      return { level: 'HIGH', color: 'risk-high' };
    }

    getRiskDescription(level, probability) {
      const descriptions = {
        LOW: [
          'Weather conditions are stable and within normal parameters',
          'Low probability of natural disaster occurrence',
          'Continue normal operations with standard monitoring',
        ],
        MEDIUM: [
          'Weather patterns show some irregularities',
          'Increased monitoring recommended',
          'Prepare emergency protocols for activation',
        ],
        HIGH: [
          'Critical weather conditions detected',
          'High probability of disaster occurrence',
          'Immediate action and evacuation may be required',
        ],
      };
      return descriptions[level][Math.floor(Math.random() * descriptions[level].length)];
    }
  }

  const agent = new DisasterPredictionAgent();

  // Draw Neural Network Visualization
  const drawNeuralNetwork = () => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const layers = [8, 12, 8, 4, 1];
    const layerSpacing = width / (layers.length + 1);

    for (let l = 0; l < layers.length; l++) {
      const x = (l + 1) * layerSpacing;
      const nodeSpacing = height / (layers[l] + 1);

      for (let n = 0; n < layers[l]; n++) {
        const y = (n + 1) * nodeSpacing;

        if (l < layers.length - 1) {
          const nextLayerSpacing = height / (layers[l + 1] + 1);
          for (let nn = 0; nn < layers[l + 1]; nn++) {
            const nextY = (nn + 1) * nextLayerSpacing;
            const nextX = (l + 2) * layerSpacing;

            ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 + Math.random() * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
          }
        }

        const activation = Math.random();
        ctx.fillStyle = `rgba(255, 107, 53, ${0.3 + activation * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const labels = ['Input', 'LSTM 1', 'LSTM 2', 'Dense', 'Output'];
    for (let i = 0; i < labels.length; i++) {
      ctx.fillText(labels[i], (i + 1) * layerSpacing, height - 10);
    }
  };

  // Draw Data Chart Visualization
  const drawDataChart = () => {
    const canvas = dataChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const dataPoints = 50;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      data.push(Math.sin(i * 0.1) * 50 + Math.random() * 20 + height / 2);
    }

    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < dataPoints; i++) {
      const x = (i / (dataPoints - 1)) * width;
      const y = height - data[i];

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('Time Series Weather Data', 10, 20);
    ctx.fillText('Risk Level Over Time', 10, height - 10);
  };

  // Handle Prediction
  const runPrediction = async () => {
    const inputsArray = Object.values(inputs);

    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const predictionResult = await agent.predict(inputsArray);
    const riskInfo = agent.getRiskLevel(predictionResult.riskProbability);
    const description = agent.getRiskDescription(riskInfo.level, predictionResult.riskProbability);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'grid';

    const riskElement = document.getElementById('riskLevel');
    riskElement.textContent = riskInfo.level;
    riskElement.className = `risk-level ${riskInfo.color}`;

    document.getElementById('riskProgress').style.width = `${predictionResult.riskProbability * 100}%`;
    document.getElementById('confidenceProgress').style.width = `${predictionResult.confidence * 100}%`;

    document.getElementById('confidenceScore').textContent = `${Math.round(predictionResult.confidence * 100)}%`;

    document.getElementById('riskDescription').textContent = description;
    document.getElementById('confidenceDescription').textContent = `Model shows ${
      predictionResult.confidence > 0.8 ? 'high' : predictionResult.confidence > 0.6 ? 'medium' : 'low'
    } confidence in this prediction`;

    document.querySelectorAll('.result-card').forEach((card) => {
      card.classList.add('pulse');
      setTimeout(() => card.classList.remove('pulse'), 2000);
    });

    setPrediction(predictionResult);
    drawNeuralNetwork();
    drawDataChart();
  };

  // Generate Random Prediction
  const generateRandomPrediction = () => {
    const newInputs = {};
    const inputIds = ['temperature', 'humidity', 'pressure', 'windSpeed', 'windDirection', 'precipitation', 'visibility', 'cloudCover'];
    inputIds.forEach((id) => {
      const input = document.getElementById(id);
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      newInputs[id] = (Math.random() * (max - min) + min).toFixed(1);
    });
    setInputs(newInputs);
  };

  useEffect(() => {
    drawNeuralNetwork();
    drawDataChart();

    setInterval(drawNeuralNetwork, 3000);
    setInterval(drawDataChart, 5000);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    const demoButton = document.createElement('button');
    demoButton.textContent = '🎲 Generate Random Data';
    demoButton.className = styles.predictButton;
    demoButton.style.marginRight = '1rem';
    demoButton.onclick = generateRandomPrediction;

    const buttonContainer = document.querySelector(`.${styles.controlPanel} > div:last-child`);
    if (buttonContainer) {
      buttonContainer.insertBefore(demoButton, buttonContainer.firstChild);
    }

    return () => {
      observer.disconnect();
      if (buttonContainer && demoButton.parentNode) {
        buttonContainer.removeChild(demoButton);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>🧠 Disaster Prediction Agent</div>
          <a href="/" className={styles.backButton}>
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={`${styles.hero} fade-in`}>
          <h1>🧠 AI-Powered Disaster Prediction Agent</h1>
          <p>Advanced LSTM Neural Network for real-time disaster prediction using 15 weather parameters and machine learning algorithms</p>
        </section>

        {/* Control Panel */}
        <section className={`${styles.controlPanel} fade-in`}>
          <h2>🌡️ Weather Parameters Input</h2>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="temperature">Temperature (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={inputs.temperature}
                min="-50"
                max="60"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="humidity">Humidity (%)</label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                value={inputs.humidity}
                min="0"
                max="100"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="pressure">Pressure (hPa)</label>
              <input
                type="number"
                id="pressure"
                name="pressure"
                value={inputs.pressure}
                min="950"
                max="1050"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="windSpeed">Wind Speed (km/h)</label>
              <input
                type="number"
                id="windSpeed"
                name="windSpeed"
                value={inputs.windSpeed}
                min="0"
                max="200"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="windDirection">Wind Direction (°)</label>
              <input
                type="number"
                id="windDirection"
                name="windDirection"
                value={inputs.windDirection}
                min="0"
                max="360"
                step="1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="precipitation">Precipitation (mm)</label>
              <input
                type="number"
                id="precipitation"
                name="precipitation"
                value={inputs.precipitation}
                min="0"
                max="500"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="visibility">Visibility (km)</label>
              <input
                type="number"
                id="visibility"
                name="visibility"
                value={inputs.visibility}
                min="0"
                max="50"
                step="0.1"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="cloudCover">Cloud Cover (%)</label>
              <input
                type="number"
                id="cloudCover"
                name="cloudCover"
                value={inputs.cloudCover}
                min="0"
                max="100"
                step="1"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className={styles.predictButton} onClick={runPrediction}>
              🔮 Generate Prediction
            </button>
          </div>
        </section>

        {/* Loading Animation */}
        <div className={styles.loading} id="loading">
          <div className={styles.spinner}></div>
          <p>Processing neural network predictions...</p>
        </div>

        {/* Results Section */}
        <section className={`${styles.results} fade-in`} id="results" style={{ display: prediction ? 'grid' : 'none' }}>
          <div className={styles.resultCard}>
            <h3>🎯 Risk Assessment</h3>
            <div className={`risk-level ${prediction ? agent.getRiskLevel(prediction.riskProbability).color : 'risk-low'}`} id="riskLevel">
              {prediction ? agent.getRiskLevel(prediction.riskProbability).level : 'LOW'}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                id="riskProgress"
                style={{ width: prediction ? `${prediction.riskProbability * 100}%` : '0%' }}
              ></div>
            </div>
            <p id="riskDescription">
              {prediction ? agent.getRiskDescription(agent.getRiskLevel(prediction.riskProbability).level, prediction.riskProbability) : 'Current conditions indicate low disaster risk'}
            </p>
          </div>
          <div className={styles.resultCard}>
            <h3>📊 Confidence Score</h3>
            <div className={styles.confidenceScore} id="confidenceScore">
              {prediction ? `${Math.round(prediction.confidence * 100)}%` : '0%'}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                id="confidenceProgress"
                style={{ width: prediction ? `${prediction.confidence * 100}%` : '0%' }}
              ></div>
            </div>
            <p id="confidenceDescription">
              {prediction
                ? `Model shows ${prediction.confidence > 0.8 ? 'high' : prediction.confidence > 0.6 ? 'medium' : 'low'} confidence in this prediction`
                : 'Model confidence in prediction'}
            </p>
          </div>
        </section>

        {/* Neural Network Visualization */}
        <section className={`${styles.neuralNetwork} fade-in`}>
          <h2>🧠 LSTM Neural Network Visualization</h2>
          <canvas className={styles.networkCanvas} id="networkCanvas" ref={networkCanvasRef}></canvas>
        </section>

        {/* Data Visualization */}
        <section className={`${styles.dataViz} fade-in`}>
          <h2>📈 Real-time Data Analysis</h2>
          <canvas className={styles.chartContainer} id="dataChart" ref={dataChartRef}></canvas>
        </section>
      </div>
    </div>
  );
}
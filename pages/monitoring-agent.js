import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Eye,
  Droplets,
  Flame,
  Satellite,
  Activity,
  MapPin,
  Clock,
  TrendingUp,
  Settings,
  Upload,
  Download,
  RefreshCw,
} from 'lucide-react';
import styles from './monitoring-agent.module.css'; // Import CSS module

export default function MonitoringAgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'fire', severity: 'high', location: 'California, USA', confidence: 94, time: '2 min ago', coordinates: [37.7749, -122.4194] },
    { id: 2, type: 'flood', severity: 'medium', location: 'Bangladesh', confidence: 87, time: '15 min ago', coordinates: [23.6850, 90.3563] },
    { id: 3, type: 'fire', severity: 'low', location: 'Australia', confidence: 76, time: '1 hour ago', coordinates: [-25.2744, 133.7751] },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalAlerts: 247,
    activeIncidents: 12,
    areasMonitored: 1847,
    accuracy: 92.4,
  });

  const severityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const typeIcons = {
    fire: Flame,
    flood: Droplets,
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'fire' : 'flood',
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        location: 'New Detection Zone',
        confidence: Math.floor(Math.random() * 20) + 80,
        time: 'Just now',
        coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180],
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    }, 3000);
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`${styles.tabButton} ${active ? styles.active : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const AlertCard = ({ alert }) => {
    const Icon = typeIcons[alert.type];
    return (
      <div className={styles.alertCard}>
        <div className={styles.alertHeader}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${alert.type === 'fire' ? 'bg-red-900' : 'bg-blue-900'}`}>
              <Icon size={20} className={alert.type === 'fire' ? 'text-red-400' : 'text-blue-400'} />
            </div>
            <div className={styles.alertInfo}>
              <h3 className="font-semibold text-white capitalize">{alert.type} Detection</h3>
              <p className="text-gray-400 text-sm">{alert.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[alert.severity]} text-white`}
            >
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">{alert.confidence}%</span>
          </div>
        </div>
        <div className={styles.alertFooter}>
          <span className="text-gray-400">{alert.time}</span>
          <button className="text-blue-400 hover:text-blue-300">View Details</button>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, change }) => (
    <div className={styles.statCard}>
      <div className={styles.statCardContent}>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-green-400 text-sm ml-1">{change}%</span>
            </div>
          )}
        </div>
        <div className={styles.statCardIcon}>
          <Icon size={24} className="text-blue-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center space-x-4">
            <div className={styles.headerIcon}>
              <Satellite size={24} className="text-white" />
            </div>
            <div className={styles.headerTitle}>
              <h1 className="text-2xl font-bold">Disaster Monitoring Agent</h1>
              <p className="text-gray-400">CNN-based Satellite Image Analysis</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.statusIndicator}>
              <div className={styles.statusDot}></div>
              <span className="text-sm text-gray-400">System Online</span>
            </div>
            <button className={styles.settingsButton}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <div className={styles.navTabs}>
          <TabButton
            id="overview"
            label="Overview"
            icon={Activity}
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            id="alerts"
            label="Live Alerts"
            icon={AlertTriangle}
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
          />
          <TabButton
            id="monitoring"
            label="Monitoring"
            icon={Eye}
            active={activeTab === 'monitoring'}
            onClick={() => setActiveTab('monitoring')}
          />
          <TabButton
            id="analysis"
            label="Analysis"
            icon={TrendingUp}
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeTab === 'overview' && (
          <div className={styles.section}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <StatCard title="Total Alerts" value={stats.totalAlerts} icon={AlertTriangle} change={12} />
              <StatCard title="Active Incidents" value={stats.activeIncidents} icon={Activity} change={-8} />
              <StatCard title="Areas Monitored" value={stats.areasMonitored} icon={MapPin} change={15} />
              <StatCard title="AI Accuracy" value={`${stats.accuracy}%`} icon={TrendingUp} change={3} />
            </div>

            {/* Recent Alerts */}
            <div className={styles.alertsSection}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Recent Alerts
              </h2>
              <div className={styles.alertsList}>
                {alerts.slice(0, 3).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            {/* Processing Status */}
            <div className={styles.processingSection}>
              <h2 className="text-xl font-semibold mb-4">CNN Processing Status</h2>
              <div className={styles.processingGrid}>
                <div className={styles.processingItem}>
                  <div className="flex items-center justify-between">
                    <span>Fire Detection Model</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="mt-2">
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
                <div className={styles.processingItem}>
                  <div className="flex items-center justify-between">
                    <span>Flood Detection Model</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="mt-2">
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
                <div className={styles.processingItem}>
                  <div className="flex items-center justify-between">
                    <span>Image Processing</span>
                    <span className="text-blue-400">Processing</span>
                  </div>
                  <div className="mt-2">
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className={styles.section}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Live Alerts</h2>
              <button
                onClick={simulateProcessing}
                disabled={isProcessing}
                className={styles.refreshButton}
              >
                <RefreshCw size={18} className={isProcessing ? 'animate-spin' : ''} />
                <span>{isProcessing ? 'Processing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className={styles.alertsList}>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className={styles.section}>
            <h2 className="text-2xl font-bold">Real-Time Monitoring</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={styles.satelliteCoverage}>
                <div className="text-center">
                  <MapPin size={48} className="text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400">Interactive Map View</p>
                </div>
              </div>

              <div className={styles.uploadArea}>
                <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drop satellite images here or click to browse</p>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  Select Files
                </button>
              </div>
            </div>

            <div className={styles.confidenceControls}>
              <h3 className="text-lg font-semibold mb-4">Detection Confidence Levels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Fire Detection Threshold</span>
                  <input type="range" min="0" max="100" defaultValue="80" className="w-32" />
                  <span className="text-blue-400">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flood Detection Threshold</span>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-32" />
                  <span className="text-blue-400">75%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className={styles.section}>
            <h2 className="text-2xl font-bold">AI Analysis & Performance</h2>

            <div className={styles.performanceGrid}>
              <div className={styles.performanceSection}>
                <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fire Detection Accuracy</span>
                      <span>94.2%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Flood Detection Accuracy</span>
                      <span>87.8%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '87.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>False Positive Rate</span>
                      <span>3.4%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '3.4%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.performanceSection}>
                <h3 className="text-lg font-semibold mb-4">Processing Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">2.3s</div>
                    <div className="text-sm text-gray-400">Avg Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">1,247</div>
                    <div className="text-sm text-gray-400">Images Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">67</div>
                    <div className="text-sm text-gray-400">Alerts Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">12</div>
                    <div className="text-sm text-gray-400">Critical Incidents</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modelArchitecture}>
              <h3 className="text-lg font-semibold mb-4">CNN Model Architecture</h3>
              <div className={styles.modelGrid}>
                <div className={styles.modelItem}>
                  <h4 className="font-semibold text-blue-400">Input Layer</h4>
                  <p className="text-sm text-gray-400 mt-1">224x224x3 RGB Images</p>
                </div>
                <div className={styles.modelItem}>
                  <h4 className="font-semibold text-green-400">Hidden Layers</h4>
                  <p className="text-sm text-gray-400 mt-1">6 Convolutional + 3 Dense</p>
                </div>
                <div className={styles.modelItem}>
                  <h4 className="font-semibold text-yellow-400">Output Layer</h4>
                  <p className="text-sm text-gray-400 mt-1">Multi-class Classification</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
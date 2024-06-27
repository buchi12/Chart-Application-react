import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';

interface DataPoint {
  timestamp: string;
  value: number;
}

const ChartComponent: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(null);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  useEffect(() => {
    let filtered;
    if (timeframe === 'daily') {
      filtered = data;
    } else if (timeframe === 'weekly') {
      filtered = aggregateDataByWeek(data);
    } else {
      filtered = aggregateDataByMonth(data);
    }
    setFilteredData(filtered);
  }, [timeframe, data]);

  const aggregateDataByWeek = (data: DataPoint[]): DataPoint[] => {
    const result: DataPoint[] = [];
    const weeks: { [key: string]: DataPoint[] } = {};

    data.forEach((point) => {
      const date = new Date(point.timestamp);
      const week = `${date.getFullYear()}-W${Math.floor(date.getDate() / 7) + 1}`;
      if (!weeks[week]) {
        weeks[week] = [];
      }
      weeks[week].push(point);
    });

    for (const week in weeks) {
      const points = weeks[week];
      const avgValue =
        points.reduce((sum, point) => sum + point.value, 0) / points.length;
      result.push({ timestamp: week, value: avgValue });
    }

    return result;
  };

  const aggregateDataByMonth = (data: DataPoint[]): DataPoint[] => {
    const result: DataPoint[] = [];
    const months: { [key: string]: DataPoint[] } = {};

    data.forEach((point) => {
      const date = new Date(point.timestamp);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!months[month]) {
        months[month] = [];
      }
      months[month].push(point);
    });

    for (const month in months) {
      const points = months[month];
      const avgValue =
        points.reduce((sum, point) => sum + point.value, 0) / points.length;
      result.push({ timestamp: month, value: avgValue });
    }

    return result;
  };

  const handleClick = (curveProps: any) => {
    const { payload } = curveProps;
    if (payload) {
      const { timestamp, value } = payload as DataPoint; // Cast payload to DataPoint
      setSelectedDataPoint({ timestamp, value });
    }
  };

  const exportChart = () => {
    const chartElement = document.querySelector('#chart');
    if (chartElement) {
      html2canvas(chartElement as HTMLElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
      });
    }
  };

  return (
    <div className="chart-container">
      <div className="button-group">
        <button onClick={() => setTimeframe('daily')}>Daily</button>
        <button onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')}>Monthly</button>
      </div>
      <div id="chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#e06600"
              onClick={(data) => handleClick(data)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {selectedDataPoint && (
        <div className="modal">
          <div className="modal-content">
            <h3>Data Point Details</h3>
            <p>Timestamp: {selectedDataPoint.timestamp}</p>
            <p>Value: {selectedDataPoint.value}</p>
            <button onClick={() => setSelectedDataPoint(null)}>Close</button>
          </div>
        </div>
      )}
      <button onClick={exportChart}>Export Chart</button>
    </div>
  );
};

export default ChartComponent;

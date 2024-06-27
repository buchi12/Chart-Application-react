import React, { useState } from 'react';
import ChartComponent from './components/ChartComponent';
import TimeframeSelector from './components/TimeframeSelector';

const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState('daily');

  return (
    <div>
      <TimeframeSelector onSelect={setTimeframe} />
      <ChartComponent />
    </div>
  );
};

export default App;

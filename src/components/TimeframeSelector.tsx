import React from 'react';

interface TimeframeSelectorProps {
  onSelect: (timeframe: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ onSelect }) => (
  <div>
    <button onClick={() => onSelect('daily')}>Daily</button>
    <button onClick={() => onSelect('weekly')}>Weekly</button>
    <button onClick={() => onSelect('monthly')}>Monthly</button>
  </div>
);

export default TimeframeSelector;

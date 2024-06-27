import React from 'react';
import './DataModal.css';

interface DataModalProps {
  timestamp: string;
  value: number;
  onClose: () => void;
}

const DataModal: React.FC<DataModalProps> = ({ timestamp, value, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Data Point Details</h3>
        <p>Timestamp: {timestamp}</p>
        <p>Value: {value}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DataModal;

import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const ReduceNode = ({ id, data }) => {
  const [accumulator, setAccumulator] = useState('');
  const [callback, setCallback] = useState('');

  const handleAccumulatorChange = (event) => setAccumulator(event.target.value);
  const handleCallbackChange = (event) => setCallback(event.target.value);

  const applyReduce = () => {
    if (data.csvData) {
      const initialValue = accumulator ? JSON.parse(accumulator) : 0;
      const result = data.csvData.reduce(eval(`(${callback})`), initialValue);
      data.handleUpdateNodeData(id, result);
    }
  };

  return (
    <div style={{ position: 'relative', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Reduce Node</div>
        <IoClose 
          style={{ cursor: 'pointer' }} 
          onClick={() => data.handleDeleteNode(id)} 
        />
      </div>
      <div>
        <label>Accumulator (initial value): </label>
        <input type="text" value={accumulator} onChange={handleAccumulatorChange} />
      </div>
      <div>
        <label>Callback function: </label>
        <input type="text" value={callback} onChange={handleCallbackChange} />
      </div>
      <button onClick={applyReduce}>Apply Reduce</button>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ReduceNode;

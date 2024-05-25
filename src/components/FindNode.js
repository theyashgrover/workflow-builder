import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const FindNode = ({ id, data }) => {
  const [column, setColumn] = useState('');
  const [value, setValue] = useState('');

  const handleColumnChange = (event) => setColumn(event.target.value);
  const handleValueChange = (event) => setValue(event.target.value);

  const applyFind = () => {
    if (data.csvData) {
      const foundItem = data.csvData.find(row => row[column] === value);
      data.handleUpdateNodeData(id, foundItem ? [foundItem] : []);
    }
  };

  return (
    <div style={{ position: 'relative', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Find Node</div>
        <IoClose 
          style={{ cursor: 'pointer' }} 
          onClick={() => data.handleDeleteNode(id)} 
        />
      </div>
      <div>
        <label>Column: </label>
        <input type="text" value={column} onChange={handleColumnChange} />
      </div>
      <div>
        <label>Value: </label>
        <input type="text" value={value} onChange={handleValueChange} />
      </div>
      <button onClick={applyFind}>Apply Find</button>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default FindNode;

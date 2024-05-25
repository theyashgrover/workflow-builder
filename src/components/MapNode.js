import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const MapNode = ({ id, data }) => {
  const [mapFunction, setMapFunction] = useState('');

  const handleMapFunctionChange = (event) => setMapFunction(event.target.value);

  const applyMap = () => {
    if (data.csvData) {
      try {
        const mappedData = data.csvData.map(row => {
          const func = new Function('row', mapFunction);
          return func(row);
        });
        data.handleUpdateNodeData(id, mappedData);
      } catch (error) {
        console.error('Error applying map function:', error);
      }
    }
  };

  return (
    <div style={{ position: 'relative', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Map Node</div>
        <IoClose 
          style={{ cursor: 'pointer' }} 
          onClick={() => data.handleDeleteNode(id)} 
        />
      </div>
      <div>
        <label>Map Function: </label>
        <input type="text" value={mapFunction} onChange={handleMapFunctionChange} />
      </div>
      <button onClick={applyMap}>Apply Map</button>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default MapNode;

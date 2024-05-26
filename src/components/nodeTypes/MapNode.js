import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const MapNode = ({ id, data }) => {
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('uppercase');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.csvData && data.csvData.length > 0) {
      setColumns(data.csvData[0]);
    }
  }, [data.csvData]);

  const handleColumnChange = (event) => setColumn(event.target.value);
  const handleOperationChange = (event) => setOperation(event.target.value);

  //This function holds the logic behind the map functionality
  const applyMap = () => {
    if (data.csvData) {
      const columnIndex = columns.indexOf(column);
      const mappedData = data.csvData.map((row, index) => {
        if (index === 0) return row;
        const newRow = [...row];
        switch (operation) {
          case 'uppercase':
            newRow[columnIndex] = newRow[columnIndex].toUpperCase();
            break;
          case 'lowercase':
            newRow[columnIndex] = newRow[columnIndex].toLowerCase();
            break;
          // TODO-1 : Add more operations after assignment.
          // TODO-2 : Add a functionality to add custom functions as code on the fly. 
          default:
            break;
        }
        return newRow;
      });
      data.handleUpdateNodeData(id, mappedData);
    }
  };

  return (
    <div className='relative px-4 py-3 shadow-sm bg-[#ffffff] shadow-[#1e1e1e] rounded-md '>
      <div className='flex items-center justify-between my-2'>
        <div className='text-xl font-bold'>Map Node</div>
        <IoClose className='cursor-pointer text-red-500' style={{ cursor: 'pointer' }} onClick={() => data.handleDeleteNode(id)} />
      </div>
      <div>
        <label className='font-semibold'>Column: </label>
        <select className='py-2' value={column} onChange={handleColumnChange}>
          <option value="" disabled>Select a column</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      <div>
        <label className='font-semibold'>Operation: </label>
        <select className='py-2' value={operation} onChange={handleOperationChange}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
        </select>
      </div>
      <button className='py-2 px-3 font-bold text-white bg-green-500 rounded-md mt-4 hover:bg-green-700 hover:scale-105 ease-in-out duration-150' onClick={applyMap}>Apply Map</button>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}} />
      <Handle type="source" position={Position.Right} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}}/>
    </div>
  );
};

export default MapNode;

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const ReduceNode = ({ id, data }) => {
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('sum');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.csvData && data.csvData.length > 0) {
      setColumns(data.csvData[0]);
    }
  }, [data.csvData]);

  const handleColumnChange = (event) => setColumn(event.target.value);
  const handleOperationChange = (event) => setOperation(event.target.value);

  //This function holds the logic for the Reduce Functionality
  const applyReduce = () => {
    if (data.csvData) {
      const columnIndex = columns.indexOf(column);
      let result;
      switch (operation) {
        case 'sum':
          result = data.csvData.reduce((total, current) => total + Number(current[columnIndex]), 0);
          break;
        case 'average':
          const sum = data.csvData.reduce((total, current) => total + Number(current[columnIndex]), 0);
          result = sum / data.csvData.length;
          break;
        // TODO : Add more operations post assignment completion
        default:
          break;
      }
      data.handleUpdateNodeData(id, [[column, result]]);
    }
  };

  return (
    <div className='relative px-4 py-3 shadow-sm bg-[#ffffff] shadow-[#1e1e1e] rounded-md '>
      <div className='flex items-center justify-between my-2'>
        <div className='text-xl font-bold'>Reduce Node</div>
        <IoClose  className='cursor-pointer text-red-500' onClick={() => data.handleDeleteNode(id)} />
      </div>
      <div>
        <label className='font-semibold'>Column: </label>
        <select value={column} className='py-2' onChange={handleColumnChange}>
          <option value=""  disabled>Select a column</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      <div>
        <label className='font-semibold'>Operation: </label>
        <select value={operation} className='py-2' onChange={handleOperationChange}>
          <option value="sum">Sum</option>
          <option value="average">Average</option>
        </select>
      </div>
      <button className='py-2 px-3 font-bold text-white bg-green-500 rounded-md mt-4 hover:bg-green-700 hover:scale-105 ease-in-out duration-150' onClick={applyReduce}>Apply Reduce</button>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}} />
      <Handle type="source" position={Position.Right} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}} />
    </div>
  );
};

export default ReduceNode;

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const FindNode = ({ id, data }) => {
  const [column, setColumn] = useState('');
  const [value, setValue] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.csvData && data.csvData.length > 0) {
      setColumns(data.csvData[0]);
    }
  }, [data.csvData]);

  const handleColumnChange = (event) => setColumn(event.target.value);
  const handleValueChange = (event) => setValue(event.target.value);

  // This function holds the finding functionality based on the selected value
  const findData = () => {
    if (data.csvData) {
      const foundData = data.csvData.filter(row => row[columns.indexOf(column)] === value);
      data.handleUpdateNodeData(id, [data.csvData[0], ...foundData]);
    }
  };

  return (
    <div className='relative px-4 py-3 shadow-sm bg-[#ffffff] shadow-[#1e1e1e] rounded-md '>
      <div className='flex items-center justify-between my-2'>
        <div className='text-xl font-bold'>Find Node</div>
        <IoClose  className='cursor-pointer text-red-500' onClick={() => data.handleDeleteNode(id)} />
      </div>
      <div>
        <label className='font-semibold'>Column: </label>
        <select className='py-2' value={column} onChange={handleColumnChange}>
          <option value="" disabled>Select a column</option>
          {columns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
      </div>
      <div>
        <label className='font-semibold'>Value: </label>
        <input className='hover:border-2 border-[#1e1e1e]' type="text" value={value} onChange={handleValueChange} />
      </div>
      <button onClick={findData}  className='py-2 px-5 font-bold text-white bg-green-500 rounded-md mt-4 hover:bg-green-700 hover:scale-105 ease-in-out duration-150'>Find</button>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}}  />
      <Handle type="source" position={Position.Right} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}} />
    </div>
  );
};

export default FindNode;

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const FilterNode = ({ id, data }) => {

  const [column, setColumn] = useState('');
  const [condition, setCondition] = useState('equals');
  const [value, setValue] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.csvData && data.csvData.length > 0) {
      
      console.log('Data received:', data.csvData);
      setColumns(data.csvData[0]);
    }
  }, [data.csvData]);

  const handleColumnChange = (event) => setColumn(event.target.value);
  const handleConditionChange = (event) => setCondition(event.target.value);
  const handleValueChange = (event) => setValue(event.target.value);

  // This function holds the filter functionality based on 
  // the selected condition and value.
  const applyFilter = () => {
    if (data.csvData) {
      const filteredData = data.csvData.filter(row => {
        switch (condition) {
          case 'equals':
            return row[columns.indexOf(column)] === value;
          case 'not_equals':
            return row[columns.indexOf(column)] !== value;
          case 'includes':
            return row[columns.indexOf(column)].includes(value);
          case 'not_includes':
            return !row[columns.indexOf(column)].includes(value);
          default:
            return true;
        }
      });
      data.handleUpdateNodeData(id, [data.csvData[0],...filteredData]);
    }
  };

  return (
    
    <div className='relative px-4 py-3 shadow-sm bg-[#ffffff] shadow-[#1e1e1e] rounded-md '>
      <div className='flex items-center justify-between my-2'>
        <div className='text-xl font-bold'>Filter Node</div>
        <IoClose 
         className='cursor-pointer text-red-500'
          onClick={() => data.handleDeleteNode(id)} 
        />
      </div>
      <div>
        <label className='font-semibold'>Column: </label>
        <select value={column} onChange={handleColumnChange}>
          <option value="" disabled>Select a column</option>
          {columns.map((col) => {
            console.log(col)
              return <option key={col} value={col}>{col}</option>
          })}
        </select>
      </div>
      <div>
        <label className='font-semibold'>Condition: </label>
        <select value={condition} onChange={handleConditionChange} className='py-2'>
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="includes">Includes</option>
          <option value="not_includes">Not Includes</option>
        </select>
      </div>
      <div>
        <label className='font-semibold'>Value: </label>
        <input type="text" value={value} className='hover:border-2 border-[#1e1e1e]' onChange={handleValueChange} />
      </div>
      <button className='py-2 px-3 font-bold text-white bg-green-500 rounded-md mt-4 hover:bg-green-700 hover:scale-105 ease-in-out duration-150' onClick={applyFilter}>Apply Filter</button>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}} />
      <Handle type="source" position={Position.Right} style={{ backgroundColor: '#08E359', width: '12px', height: '12px',}}  />
    </div>
  );
};

export default FilterNode;

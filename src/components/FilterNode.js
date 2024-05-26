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
      data.handleUpdateNodeData(id, filteredData);
    }
  };

  return (
    <div style={{ position: 'relative', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Filter Node</div>
        <IoClose 
          style={{ cursor: 'pointer' }} 
          onClick={() => data.handleDeleteNode(id)} 
        />
      </div>
      <div>
        <label>Column: </label>
        <select value={column} onChange={handleColumnChange}>
          <option value="" disabled>Select a column</option>
          {columns.map((col) => {
            console.log(col)
              return <option key={col} value={col}>{col}</option>
          })}
        </select>
      </div>
      <div>
        <label>Condition: </label>
        <select value={condition} onChange={handleConditionChange}>
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="includes">Includes</option>
          <option value="not_includes">Not Includes</option>
        </select>
      </div>
      <div>
        <label>Value: </label>
        <input type="text" value={value} onChange={handleValueChange} />
      </div>
      <button onClick={applyFilter}>Apply Filter</button>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default FilterNode;

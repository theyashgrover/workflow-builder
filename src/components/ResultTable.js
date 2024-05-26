import React from 'react';
import { FiDownload } from 'react-icons/fi';

const ResultTable = ({ data }) => {

    const convertToCSV = () => {
      const csvContent = data.map(row => row.join(',')).join('\n');
      return csvContent;
    };
    
    const downloadCSV = () => {
      const csvContent = convertToCSV();
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'table_data.csv');
      document.body.appendChild(link);
      link.click();
    };

    const convertToJSON = () => {
      return JSON.stringify(data);
    };


  return (
    <div className='relative'>
      <div className='flex fixed -my-4 bg-white w-full'>
      <button className='px-2 flex items-center hover:scale-105 ease-in-out duration-150' onClick={downloadCSV}> <FiDownload className='mx-2'/> CSV</button>
      <a
        href={`data:text/json;charset=utf-8,${encodeURIComponent(convertToJSON())}`}
        download="table_data.json"
        className='px-2 flex items-center hover:scale-105 ease-in-out duration-150'
      >
         <FiDownload className='mx-2'/> JSON
      </a>
      </div>
      <hr/>
    <table className='my-4'>
      <thead>
        <tr>
          {data[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default ResultTable;

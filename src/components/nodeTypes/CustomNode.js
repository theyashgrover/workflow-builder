import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IoClose } from 'react-icons/io5';

const CustomNode = ({ id, data }) => {
  const { label, handleFileUpload, handleDeleteNode, handleClick } = data;
  const [fileName, setFileName] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : null);
    handleFileUpload(id, event);
  };

  return (
    <div className='relative px-2 py-2 shadow-md shadow-[#1e1e1e] h-24 rounded-md' >
      <div>
        <div className='flex items-center justify-end'>
          <IoClose 
            className='cursor-pointer top-0 text-red-600 text-lg' 
            onClick={() => handleDeleteNode(id)} 
          />   
        </div>   
        <div className='text-[12px] font-semibold'>{label}</div>
      </div>
      <div className='mt-2'>
      {label === 'Upload CSV' && (
        <>
          {fileName ? (
            <button onClick={handleClick(id)} className='mx-auto text-[#1e1e1e] px-2 '>
              {fileName}
            </button>
          ) : (
            <label htmlFor={`file-upload-${id}`} className='mt-2 mx-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer'>
              Choose File
            </label>
          )}
          <input
            id={`file-upload-${id}`}
            type="file"
            accept=".csv"
            className='hidden'
            onChange={(event) => handleUpload(event)}
          />
        </>
      )} 
      </div>
      <Handle type="source" position={Position.Right} style={{ backgroundColor: '#0064fe', width: '12px', height: '14%', marginLeft:'6px'}}/>
    </div>
  );
};

export default CustomNode;

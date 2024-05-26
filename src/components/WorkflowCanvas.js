import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState, Background, ReactFlowProvider, Controls, MiniMap } from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addNode, updateWorkflow, deleteNode } from '../redux/workflowSlice';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import nodeTypes from './nodeTypes';
import ResultTable from './ResultTable';
import 'react-resizable/css/styles.css';
import DownloadButton from './DownloadButton';

const WorkflowCanvas = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const workflows = useSelector((state) => state.workflows.list);
  const workflow = workflows.find((wf) => wf.id === id) || { nodes: [], edges: [] };
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [resultData, setResultData] = useState(null);
  const [entireInputData, setEntireInputData] = useState([]);
  const [localStateForAddNodes, setLocalStateForAddNodes] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);

 // This function handles the Connection of two nodes and updates the edges as well
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode && targetNode) { 
      if (sourceNode.type === 'input' && ['filter', 'find', 'map','reduce'].includes(targetNode.type) && sourceNode.data.csvData) {
        try{
          console.log("reached checkpoint 3" , nodes);
          handleUpdateNodeData(targetNode.id, sourceNode.data.csvData)
        }catch(err){
          console.log(err) 
        }
      } 
      else if(['filter', 'find', 'map','reduce'].includes(sourceNode.type) && ['filter', 'find', 'map','reduce'].includes(targetNode.type) && sourceNode.data.csvData) {
        try{
          console.log("reached checkpoint 3" , nodes);
          handleUpdateNodeData(targetNode.id, sourceNode.data.csvData)
        }catch(err){
          console.log(err)
        }
      }
      else {
        console.warn('Invalid connection');
      }
    } else {
      console.error('Error: Nodes not found during connection.');
    }
  }, [nodes, setEdges]);

  //This function triggers the Add Blocks/Hide Blocks functionality.
  const showAllCustomNodes = () => {
    setLocalStateForAddNodes(!localStateForAddNodes);
  };

  //This function handles the addition of new nodes. Please note that the 'type' is 
  //nodeType coming from the nodeTypes file 
  const handleAddNode = (type) => {
   try{
    let uuid=uuidv4();
    const newNode = {
      id: uuid,
      type,
      position: { x: 250, y: 5 },
      data: {
        label: type === 'input' ? 'Upload CSV' : `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        csvData: null,
        handleFileUpload: (event) => handleFileUpload(newNode.id, event),
        handleDeleteNode: () => handleDeleteNode(newNode.id),
        handleUpdateNodeData: (nodeId, newData) => handleUpdateNodeData(nodeId, newData),
        handleClick : () => handleNodeClick(id)
      },
    };
    setNodes(old=>[...old, newNode]);
    dispatch(addNode({ workflowId: id, node: newNode }));
   }catch(err){
    console.log(err)
   }
  };

  //This function handles deletion of a node and all the connections with it
  const handleDeleteNode = (nodeId) => {
    const nodeToDelete = nodes.find((node) => node.id === nodeId);
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    dispatch(deleteNode({ workflowId: id, nodeId }));

    if (nodeToDelete?.type === 'input' && nodeToDelete.data.csvData) {
      setResultData(null);
    }
  
    setEntireInputData((prevData) => prevData.filter((data) => data.nodeId !== nodeId));
  };

  //This function handles the .csv File Upload and conversion using papaparse 
  //and adds the resultant data into the entireInputData and resultData states 
  const handleFileUpload = (nodeId, event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  csvData: results.data,
                },
              };
            }
            return node;
          });
          setNodes(updatedNodes);
          dispatch(updateWorkflow({ id, nodes: updatedNodes, edges }));
  
          setResultData(results.data);
          const inputDataObj = {
            nodeId,
            fileName: file.name,
            csvData: results.data,
          };
          setEntireInputData((prevData) => [...prevData, inputDataObj]);
        },
      });
    }
  };
  
  //This function handles the functionality of updating a node with .csv data upon connection
  //It's mainly called in the onConnect function
  const handleUpdateNodeData = (nodeId, newData) => {
    console.log("inside update", nodes)
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        node={
          ...node,
          data: {
            ...node.data,
            csvData: newData,
          },
        }
      }
      return node;
    });
    setNodes(updatedNodes);
    setResultData(newData)
    dispatch(updateWorkflow({ id, nodes: updatedNodes, edges }));
  };


  const handleNodeClick = (nodeId) => {
    //TODO : Add Code for Handling Click Navigation between Input Nodes.
  };
  
  //The JSX
  return (
    <>
      <div className="flex flex-col h-[450px]">
        <div className="flex-1 relative">
          <div className='flex items-center'>
            <span onClick={showAllCustomNodes} className='w-36 rounded-lg mx-2 border-2 border-[#1e1e1e] py-2 px-3 text-[#1e1e1e] font-semibold hover:cursor-pointer hover:scale-105 ease-in-out duration-100 my-2 text-center'>
              {localStateForAddNodes ? `Hide Blocks` : `Add Blocks`}
            </span>
            {localStateForAddNodes && <span className="flex px-4">
              <button onClick={() => handleAddNode('input')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-1 py-2 px-3 rounded hover:scale-105 ease-in-out duration-100 ">
                Add Input Node
              </button>
              <button onClick={() => handleAddNode('filter')} className="bg-green-500 hover:bg-green-700 text-white font-bold mx-1 py-2 px-3 rounded hover:scale-105 ease-in-out duration-100">
                Add Filter Node
              </button>
              <button onClick={() => handleAddNode('map')} className="bg-green-500 hover:bg-green-700 text-white font-bold mx-1 py-2 px-3 rounded hover:scale-105 ease-in-out duration-100">
                Add Map Node
              </button>
              <button onClick={() => handleAddNode('reduce')} className="bg-green-500 hover:bg-green-700 text-white font-bold mx-1 py-2 px-3 rounded hover:scale-105 ease-in-out duration-100">
                Add Reduce Node
              </button>
              <button onClick={() => handleAddNode('find')} className="bg-green-500 hover:bg-green-700 text-white font-bold mx-1 py-2 px-3 rounded hover:scale-105 ease-in-out duration-100">
                Add Find Node
              </button>
            </span>}
            <h2 className="text-3xl mt-2 mx-3 font-bold pb-2">{workflow.name}</h2>
            <span className=''><DownloadButton/></span>
            </div>
          <ReactFlowProvider>
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                handleFileUpload,
                handleDeleteNode,
                handleUpdateNodeData,
                handleClick: () => {
                  console.log(`Node click handler called for node id: ${node.id}`); // Log statement added
                  handleNodeClick(node.id);
                },
                onClick: () => {console.log("Node Clicked")}
              }
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
            className="w-full"
          >
            <Controls/>
            <MiniMap/>
            <Background color='#1e1e1e' variant='dots' />
          </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      <div className="mt-12 p-4 max-h-[200px] overflow-y-scroll hover:overflow-x-scroll resize-y">
        {resultData && <ResultTable data={resultData} />}
      </div>
    </>
  );
};

export default WorkflowCanvas;

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState, Controls, Background, MiniMap } from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addNode, updateWorkflow, deleteNode } from '../redux/workflowSlice';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import nodeTypes from './nodeTypes';
import ResultTable from './ResultTable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './../App.css';

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

  useEffect(() => {
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
  }, [workflow.nodes, workflow.edges]);

  const onConnect = useCallback((params) => {
    console.log("onConnect called with params:", params); // Debugging log
    setEdges((eds) => addEdge(params, eds));
    console.log("reached checkpoint 1");
    // Update filter node data on connection
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode && targetNode) { // Check if both nodes exist
      console.log("reached checkpoint 2");
      if (sourceNode.type === 'input' && targetNode.type === 'filter' && sourceNode.data.csvData) {
        targetNode.data.handleUpdateNodeData(targetNode.id, sourceNode.data.csvData);
        console.log("reached checkpoint 3");
      } else {
        // Optional: Handle invalid connections (e.g., console warning)
        console.warn('Invalid connection: Only input to filter allowed.');
      }
    } else {
      // Optional: Handle cases where nodes are not found (e.g., console error)
      console.error('Error: Nodes not found during connection.');
    }
  }, [nodes, setEdges]);

  const showAllCustomNodes = () => {
    setLocalStateForAddNodes(!localStateForAddNodes);
  };

  const handleAddNode = (type) => {
    const newNode = {
      id: uuidv4(),
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
    setNodes((nds) => nds.concat(newNode));
    dispatch(addNode({ workflowId: id, node: newNode }));
  };

  const handleDeleteNode = (nodeId) => {
    const nodeToDelete = nodes.find((node) => node.id === nodeId);
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    dispatch(deleteNode({ workflowId: id, nodeId }));
  
    // Clear resultData if the deleted node was an input node with csvData
    if (nodeToDelete?.type === 'input' && nodeToDelete.data.csvData) {
      setResultData(null);
    }
  
    // Remove from entireInputData
    setEntireInputData((prevData) => prevData.filter((data) => data.nodeId !== nodeId));
  };
  

  const handleRunWorkflow = () => {
    const inputNode = nodes.find(node => node.type === 'input');
    if (inputNode && inputNode.data.csvData) {
      let outputData = inputNode.data.csvData;
      nodes.forEach(node => {
        if (node.type === 'filter' && node.data.csvData) {
          outputData = node.data.csvData;
        }
      });
      setResultData(outputData);
    }
  };

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
  
          // Update entireInputData
          const inputDataObj = {
            nodeId,
            fileName: file.name,
            csvData: results.data,
          };
          setEntireInputData((prevData) => [...prevData, inputDataObj]);
          console.log(entireInputData);
        },
      });
    }
  };
  

  const handleUpdateNodeData = (nodeId, newData) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            csvData: newData,
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    dispatch(updateWorkflow({ id, nodes: updatedNodes, edges }));
  };

  const handleNodeClick = (nodeId) => {
    console.log(`The default node id as params is ${nodeId}`)
    const clickedNodeData = entireInputData.find((data) => data.nodeId === nodeId);
    if (clickedNodeData) {
      setResultData(clickedNodeData.csvData);
      console.log("The result data is : " + resultData);
    } else {
      setResultData(null);
    }
    setActiveNodeId(nodeId);
  };
  
  return (
    <>
      <div className="flex flex-col h-[450px]">
        <div className="flex-1 relative">
          <div className='flex items-center'>
            <span onClick={showAllCustomNodes} className='w-36 rounded-lg mx-4 border-2 border-[#1e1e1e] py-2 px-3 text-[#1e1e1e] font-semibold hover:cursor-pointer hover:scale-105 ease-in-out duration-100 my-2 text-center'>
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
            <h1 className="text-3xl mt-2 text-center font-bold pb-2 shadow-sm">{workflow.name}</h1>
          </div>
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
            onConnect={onConnect} // Ensure this is passed correctly
            fitView
            nodeTypes={nodeTypes}
            className="w-full"
          >
            <Controls />
            <MiniMap />
            <Background color='#1e1e1e' variant='dots' />
          </ReactFlow>
        </div>
      </div>

      <div className="mt-12 p-4 max-h-[200px] overflow-y-scroll hover:overflow-x-scroll resize-y">
        {resultData && <ResultTable data={resultData} />}
      </div>
    </>
  );
};

export default WorkflowCanvas;

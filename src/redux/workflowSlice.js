import { createSlice } from '@reduxjs/toolkit';

const workflowSlice = createSlice({
  name: 'workflows',
  initialState: {
    list: [],
  },
  reducers: {
    addWorkflow: (state, action) => {
      state.list.push(action.payload);
    },
    updateWorkflow: (state, action) => {
      const index = state.list.findIndex((workflow) => workflow.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteWorkflow: (state, action) => {
      state.list = state.list.filter((workflow) => workflow.id !== action.payload);
    },
    addNode: (state, action) => {
      const { workflowId, node } = action.payload;
      const workflow = state.list.find((wf) => wf.id === workflowId);
      if (workflow) {
        workflow.nodes.push(node);
      }
    },
    deleteNode: (state, action) => {
      const { workflowId, nodeId } = action.payload;
      const workflow = state.list.find((wf) => wf.id === workflowId);
      if (workflow) {
        workflow.nodes = workflow.nodes.filter((node) => node.id !== nodeId);
      }
    },
  },
});

export const { addWorkflow, updateWorkflow, deleteWorkflow, addNode,  deleteNode} = workflowSlice.actions;
export default workflowSlice.reducer;

import CustomNode from './nodeTypes/CustomNode';
import FilterNode from './nodeTypes/FilterNode';
import FindNode from './nodeTypes/FindNode';
import MapNode from './nodeTypes/MapNode';
import ReduceNode from './nodeTypes/ReduceNode';

//This is the object that stores the Node Types. It's called in the WorkflowCanvas as well
const nodeTypes = {
  input: CustomNode,
  filter: FilterNode,
  map: MapNode,
  reduce: ReduceNode,
  find: FindNode
};

export default nodeTypes;

import CustomNode from './CustomNode';
import FilterNode from './FilterNode';
import FindNode from './FindNode';
import MapNode from './MapNode';
import ReduceNode from './ReduceNode';

const nodeTypes = {
  input: CustomNode,
  filter: FilterNode,
  map: MapNode,
  reduce: ReduceNode,
  find: FindNode
};

export default nodeTypes;

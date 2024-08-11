import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addWorkflow } from '../redux/workflowSlice';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const workflows = useSelector((state) => state.workflows.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createNewWorkflow = () => {
    const newWorkflow = {
      id: uuidv4(),
      name: `Workflow ${workflows.length + 1}`,
      nodes: [],
      edges: [],
    };
    dispatch(addWorkflow(newWorkflow));
    navigate(`/workflow/${newWorkflow.id}`);
  };


  return (
    <div>
      <div className='flex justify-between items-center mb-12 shadow-md py-6'>
        <div className='text-2xl font-semibold text-clip ml-6 text-[#1e1e1e]'>NYG Workflow Builder</div>
        <div className='flex items-center'>
          <a target='_blank' href='https://granite-shaker-22b.notion.site/My-DhiWise-Assignment-Implementation-How-It-Works-56d6c08aab884faa9697da3d9a6bfb7c'>
          <div className='text-[#1e1e1e] font-medium px-6 cursor-pointer hover:scale-105 ease-in-out duration-100 hover:underline'>How it works?</div>
          </a>
          <a href='https://granite-shaker-22b.notion.site/My-DhiWise-Assignment-Implementation-How-It-s-Built-88b5cf957820482087bce501d9fecd0f' target='_blank'>
          <div className='text-[#1e1e1e] font-medium px-6 cursor-pointer hover:scale-105 ease-in-out duration-100 hover:underline'>How it's built?</div>
          </a>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'>
      <h1 className='text-5xl font-semibold text-center'>Workflow Dashboard</h1>
      <button className='bg-[#0064fe] p-4 text-white font-semibold rounded-md hover:bg-[#0037fe] hover:scale-105 ease-in-out duration-150 mt-10' onClick={createNewWorkflow}>Create New Workflow</button>
      </div>
      <ul className='flex justify-center items-center mt-4'>
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            <button className='mx-4 my-2 px-5 py-3 text-[#1e1e1e] border-2 border-[#1e1e1e] hover:scale-105 ease-in-out duration-150 hover:cursor-pointer rounded-lg font-semibold'  onClick={() => {
                   navigate(`/workflow/${workflow.id}`); }}>
              {workflow.name||`Workflow (In Progress)`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

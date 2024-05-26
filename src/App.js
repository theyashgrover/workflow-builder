import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkflowCanvas from './components/WorkflowCanvas';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow/:id" element={<WorkflowCanvas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Submissions from './pages/Submissions';
import Lecturers from './pages/Lecturers';
import News from './pages/News';
import Templates from './pages/Templates';

function App() {
  return (
    <RoleProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/lecturers" element={<Lecturers />} />
            <Route path="/news" element={<News />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </Layout>
      </Router>
    </RoleProvider>
  );
}

export default App;

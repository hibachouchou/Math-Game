import './App.css'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Test1 from './pages/tests/test1';
import Test2 from './pages/tests/test2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />       {/* Page par défaut */}
      <Route path="/register" element={<Register />} />
      <Route path="/test1" element={<Test1 />} />
      <Route path="/test2" element={<Test2 />} />
    </Routes>
  )
}

export default App;


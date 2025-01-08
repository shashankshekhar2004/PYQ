import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Previous from './pages/previous';
import Upload from './pages/upload';
import Admin from './pages/admin';

function App() {

  return (
    // <style></style>
    <div id='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/previous" element={<Previous /> } />
          <Route path="/upload" element={<Upload /> } />
          <Route path="/admin" element={<Admin /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import NewsCheck from './NewsCheck';
import Upcoming from './Upcoming';
import { AboutUs } from './About';

function App() {
  return (
    <Router>
      <div
        className='bg-black'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23171717'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        
        <Routes>
          <Route path="/" element={<NewsCheck />} />
          <Route path="/Upcoming" element={ <Upcoming></Upcoming>} />
          <Route path="/About" element={ <AboutUs></AboutUs>} />

          {/* Add more routes as needed */}
        </Routes>

        {/* Footer component if needed */}
      </div>
    </Router>
  );
}

export default App;
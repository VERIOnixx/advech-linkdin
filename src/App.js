<<<<<<< HEAD
// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProspectsPage from "./pages/ProspectsPage";
import "./App.css";
import Header from "./components/Header";

const App = () => {
  return (
    
    <Router>
      <Header />
      <div className="app">
       
       <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/prospects" element={<ProspectsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};
=======
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
>>>>>>> 7793fcd (Initialize project using Create React App)

export default App;

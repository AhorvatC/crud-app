import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add" element={<User />}></Route>
          <Route path="/update/:id" element={<User />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

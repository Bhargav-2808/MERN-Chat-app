import { Routes,Route } from 'react-router-dom';
import './App.css';
import Chatpage from './Pages/Chatpage';
import HomePage from './Pages/HomePage';

function App() {
  return (
   <>
    <div className='App'>
    <Routes>
      <Route path="/" element={<HomePage/>} exact />
      <Route path="/chats" elemen={<Chatpage/>} />
    </Routes>
    </div>
   </>
  );
}

export default App;

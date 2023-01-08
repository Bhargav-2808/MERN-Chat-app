import { Routes,Route } from 'react-router-dom';
import './App.css';
import Chatpage from './Pages/Chatpage';
import HomePage from './Pages/HomePage';

function App() {
  return (
   <>
    <Routes>
      <Route path="/" element={<HomePage/>} exact />
      <Route path="/chats" elemen={<Chatpage/>} />
    </Routes>

   </>
  );
}

export default App;

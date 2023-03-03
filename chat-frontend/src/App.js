import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Chatpage from "./Pages/Chatpage";
import { VideoRoom } from "../src/components/components/VideoRoom";
import { useState } from "react";
import VideoCall from "./components/VideoCall";
import { SocketProvider } from "./Socket";

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <>
      <div className="App">
          <SocketProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chats" element={<Chatpage />} />
            <Route path="/call/:id" element={<VideoCall />} />
        </Routes>
          </SocketProvider>
      </div>
    </>
  );
}

export default App;

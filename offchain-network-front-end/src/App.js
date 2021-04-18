import "./css/app.css";
import Navbar from "./components/Navbar";
import Receiver from "./components/Receiver";
import Sender from "./components/Sender";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className="transfer-info">
        <Sender/>
        <Receiver/>
      </div>
    </div>
  );
}

export default App;

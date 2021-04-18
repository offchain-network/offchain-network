import "./css/app.css";
import Navbar from "./components/Navbar";
import Receiver from "./components/Receiver";
import Sender from "./components/Sender";
import arrow from "./images/Forward Arrow.png";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className="transfer-info">
        <Sender/>
        <img src={arrow} alt="arrow"/>
        <Receiver/>
      </div>
    </div>
  );
}

export default App;

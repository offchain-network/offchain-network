import "./css/app.css";
import Navbar from "./components/Navbar";
import Receiver from "./components/Receiver";
import Sender from "./components/Sender";
import Transaction from "./components/Transaction";
import arrow from "./images/Forward Arrow.png";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className="transfer-info">
        <Sender/>
        <img src={arrow} alt="arrow" className="arrow-png"/>
        <Receiver/>
      </div>
      <Transaction/>
    </div>
  );
}

export default App;

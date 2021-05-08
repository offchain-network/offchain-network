import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import ChannelId from "./components/ChannelId";
import Receive from "./components/Receive";
import Send from "./components/Send";
import { Route, Switch } from "react-router";
import Channel from "./components/Channel";

function App() {

  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <Route path="/send" render = {() => <Send/>}/>
        <Route path="/receive" component = {Receive}/>
        <Route path="/" component = {Channel}/>
      </Switch>
    </div>
  );
}

export default App;

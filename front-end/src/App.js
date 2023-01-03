import React from "react";
import "./App.css";
import Header from "./component/layout/Header.jsx";
import { BrowserRouter } from "react-router-dom";
import webfontloader from "webfontloader"

function App() {
  React.useEffect(()=>{
    webfontloader.load({
      google:{
        families:["roboto"]
      }
    })
  },[]);
  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

export default App;

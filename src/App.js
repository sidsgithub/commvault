import React from "react";
import Home from "./components/features/home";
import { Routes, Route } from "react-router-dom";
import DetailsPage from './components/features/details-page';
import 'react-notifications/lib/notifications.css';

import "./App.css";

function App() {
  return (
    <div className="home">
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/details" element={<DetailsPage />}>
          <Route path=":serverId" element={<DetailsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

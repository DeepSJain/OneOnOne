import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './assets/css/main.css';

import {default as Index} from './pages/index/index';
import {default as Events} from './pages/events/events';
import {default as Contacts} from './pages/contacts/contacts';
import {default as CreateEvent} from './pages/create_event/create_event';

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/events/" element={<Events />} />
        <Route path="/contacts/" element={<Contacts />} />
        <Route path="/create_event/" element={<CreateEvent />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './assets/css/main.css';

import {default as Index} from './pages/index/index';
import {default as Events} from './pages/events/events';
import {default as Contacts} from './pages/contacts/contacts';
import {default as CreateEvent} from './pages/create_event/create_event';
import {default as Event} from './pages/event/event';
import {default as SetAvailability} from './pages/set_availability/set_availability';
import {default as InviteContacts} from './pages/invite_contacts/invite_contacts';
import {default as ContactSetAvailibility} from './pages/contact_set_availability/contact_set_availability';
import {default as Logout} from './pages/logout/logout';

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

        <Route path="/events/:event_id/" element={<Event />} />
        <Route path="/events/:event_id/set_availability/" element={<SetAvailability />} />
        <Route path="/events/:event_id/invite_contacts/" element={<InviteContacts />} />

        <Route path="/set_availability/" element={<ContactSetAvailibility />} />

        <Route path="/logout/" element={<Logout />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// reportWebVitals();

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AuthProvider from "./Context/AuthContext.jsx";
import { QueryProvider } from "./lib/react-query/QueryProvider.jsx";


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
  
)

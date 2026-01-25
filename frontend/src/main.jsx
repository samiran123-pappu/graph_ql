import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { BackgroundRippleEffect } from './components/ui/background-ripple-effect.js'
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  //TODO : update the uri on production
  link: new HttpLink({
    // uri: import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:4000/graphql" : "/graphql",
    uri: "https://graph-ql-v6on.onrender.com/graphql",
    credentials: "include" // to include cookies in requests to the backend
  }),
  cache: new InMemoryCache(), // Configure cache as needed
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="relative min-h-screen w-full bg-neutral-950">
        <BackgroundRippleEffect />
        <div className="relative z-10">
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>,
)




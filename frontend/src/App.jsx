import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import TransactionPage from "./pages/TransactionPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import Header from "./components/ui/Header.jsx"
import { useQuery } from "@apollo/client/react";
import { Navigate } from "react-router-dom";

import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query.js"
import { Toaster } from "react-hot-toast"
function App() {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) return null;

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data.authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!data.authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/transaction/:id" element={data.authUser ? <TransactionPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!data.authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App;

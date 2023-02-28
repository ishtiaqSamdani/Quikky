import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ForgotPassword from './components/ForgotPassword'
import Login from './components/Login'
import Signup from './components/Signup'
// react router for login and signup


const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<h1 className="text-center mt-5 text-[8rem] text-bold">Error 404<br/> Page not Found</h1>} />
      </Routes>

    </BrowserRouter>

    </>
  )
}
export default App
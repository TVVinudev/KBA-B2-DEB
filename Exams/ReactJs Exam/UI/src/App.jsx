import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import FormData from './pages/form'
import Display from './pages/display'
import MainLayout from './layouts/mainlayout'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<FormData />} />
          <Route path='/display' element={<Display />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App

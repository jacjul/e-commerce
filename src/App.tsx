import Header from "./components/Header"
import {Routes, Route,Navigate} from "react-router-dom"
import Profile from "./sites/Profile.tsx"
import Login from "./sites/Login.tsx"
import Home from "./sites/Home.tsx"
import Register from "./sites/Register.tsx"
import { useEffect, useState } from 'react'
import { ThemeContext } from "./components/context/theme-context"
import type { Theme } from "./components/context/theme-context"
import {useAuth} from "./components/context/AuthContext.tsx"
import './App.css'

function App() {
  const [theme, setTheme] = useState<Theme>("dark")
  const {isAuthenticated} = useAuth()
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Header />

        <Routes >
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={isAuthenticated? <Profile />:<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
 
        </Routes>
      </div>
    </ThemeContext.Provider>

  )
}

export default App

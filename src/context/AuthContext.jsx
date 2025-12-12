import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('authflow-user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`)
      if (res.data.length > 0) {
        const userData = { id: res.data[0].id, name: res.data[0].name, email: res.data[0].email }
        setUser(userData)
        localStorage.setItem('authflow-user', JSON.stringify(userData))
        toast.success(`Welcome back, ${userData.name}! 🎉`)
        return true
      } else {
        toast.error('Invalid email or password')
        return false
      }
    } catch (err) {
      toast.error('Login failed. Please try again.')
      return false
    }
  }

  const signup = async (name, email, password, securityQuestion = '', securityAnswer = '') => {
    try {
      // Check if email exists
      const check = await axios.get(`http://localhost:3001/users?email=${email}`)
      if (check.data.length > 0) {
        toast.error('Email already exists')
        return false
      }

      const res = await axios.post('http://localhost:3001/users', { 
        name, 
        email, 
        password,
        securityQuestion,
        securityAnswer
      })
      const userData = { id: res.data.id, name, email }
      setUser(userData)
      localStorage.setItem('authflow-user', JSON.stringify(userData))
      toast.success(`Congratulations, ${name}! Account created! 🎊`)
      return true
    } catch (err) {
      toast.error('Signup failed. Try again.')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authflow-user')
    toast.success('Logged out successfully!')
  }

  const getSecurityQuestion = async (email) => {
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}`)
      if (res.data.length > 0) {
        return { question: res.data[0].securityQuestion, userId: res.data[0].id }
      } else {
        toast.error('Email not found')
        return null
      }
    } catch (err) {
      toast.error('Error fetching security question')
      return null
    }
  }

  const verifySecurityAnswer = async (email, answer) => {
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}`)
      if (res.data.length > 0) {
        if (res.data[0].securityAnswer.toLowerCase() === answer.toLowerCase()) {
          return true
        } else {
          toast.error('Incorrect answer')
          return false
        }
      }
      return false
    } catch (err) {
      toast.error('Error verifying answer')
      return false
    }
  }

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}`)
      if (res.data.length > 0) {
        const userId = res.data[0].id
        await axios.patch(`http://localhost:3001/users/${userId}`, { password: newPassword })
        toast.success('Password reset successfully!')
        return true
      }
      return false
    } catch (err) {
      toast.error('Error resetting password')
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, getSecurityQuestion, verifySecurityAnswer, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
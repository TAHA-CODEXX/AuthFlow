import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [answerVerified, setAnswerVerified] = useState(false)
  const { login, getSecurityQuestion, verifySecurityAnswer, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) navigate('/dashboard')
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    const result = await getSecurityQuestion(email)
    if (result) {
      setSecurityQuestion(result.question)
      setSecurityAnswer('')
      setAnswerVerified(false)
    }
  }

  const handleVerifyAnswer = async (e) => {
    e.preventDefault()
    const isCorrect = await verifySecurityAnswer(email, securityAnswer)
    if (isCorrect) {
      setAnswerVerified(true)
      toast.success('Login perfectly ✅')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const success = await resetPassword(email, newPassword)
    if (success) {
      setForgotPassword(false)
      setSecurityQuestion(null)
      setSecurityAnswer('')
      setNewPassword('')
      setConfirmPassword('')
      setAnswerVerified(false)
      setEmail('')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Log In</h1>
        <p>Welcome back! Please enter your details</p>

        {!forgotPassword ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-btn">Log In</button>
            </form>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => {
                setForgotPassword(true)
                setEmail('')
              }}
            >
              Forgot Password?
            </button>
            <p className="switch">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="login-btn">Get Security Question</button>
            </form>

            {securityQuestion && !answerVerified && (
              <form onSubmit={handleVerifyAnswer}>
                <p className="security-question">
                  <strong>Security Question:</strong> {securityQuestion}
                </p>
                <input
                  type="text"
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
                <button type="submit" className="login-btn">Verify Answer</button>
              </form>
            )}

            {answerVerified && (
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login-btn">Reset Password</button>
              </form>
            )}

            <button
              type="button"
              className="back-btn"
              onClick={() => {
                setForgotPassword(false)
                setSecurityQuestion(null)
                setSecurityAnswer('')
                setNewPassword('')
                setConfirmPassword('')
                setAnswerVerified(false)
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import './Signup.css'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const securityQuestions = [
    "What is your favorite color?",
    "What is your pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is your favorite book?",
    "What was the name of your first school?"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (!securityQuestion) {
      toast.error('Please select a security question')
      return
    }
    if (!securityAnswer.trim()) {
      toast.error('Please answer the security question')
      return
    }
    const success = await signup(name, email, password, securityQuestion, securityAnswer)
    if (success) navigate('/dashboard')
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Sign Up</h1>
        <p>Create your free account</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (6+ chars)" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <label htmlFor="security-question" className="question-label">Security Question (for password recovery)</label>
          <select
            id="security-question"
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            className="question-select"
            required
          >
            <option value="">-- Select a question --</option>
            {securityQuestions.map((q, idx) => (
              <option key={idx} value={q}>{q}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
          
          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        <p className="switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  )
}
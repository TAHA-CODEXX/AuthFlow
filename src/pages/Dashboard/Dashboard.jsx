import { useAuth } from '../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Hello, {user?.name || 'User'}! 👋</h1>
        <p>You are successfully logged in.</p>
        <button onClick={logout} className="logout-btn">Log Out</button>
        <Link to="/" className="home-link">← Back to Home</Link>
      </div>
    </div>
  )
}
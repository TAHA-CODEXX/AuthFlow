import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to AuthFlow</h1>
        <p>Simple, secure, and beautiful authentication</p>
        <div className="home-buttons">
          <Link to="/login" className="btn primary">Log In</Link>
          <Link to="/signup" className="btn secondary">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
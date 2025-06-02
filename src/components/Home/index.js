import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const Home = () => (
  <div className="home-container">
    <header className="header">
      <Link to="/">
        <img src="https://assets.ccbp.in/frontend/react-js/logo-img.png" alt="website logo" />
      </Link>
      <ul className="nav-items">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
        <li>
          <button type="button">Logout</button>
        </li>
      </ul>
    </header>
    <div className="home-content">
      <h1>Find The Job That Fits Your Life</h1>
      <p>Millions of people are searching for jobs, salary information, company reviews. Find the job that fits your abilities and potential.</p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  </div>
)

export default Home

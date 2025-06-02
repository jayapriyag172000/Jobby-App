import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import './index.css'

const JobItemDetails = () => {
  const { id } = useParams()
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const history = useHistory()

  useEffect(() => {
    const fetchJobDetails = async () => {
      const jwtToken = Cookies.get('jwt_token')
      const url = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        setJobDetails(data)
      } else {
        setError('Job details fetch failed')
      }
      setLoading(false)
    }

    fetchJobDetails()
  }, [id])

  const onRetry = () => {
    setLoading(true)
    setError('')
    fetchJobDetails()
  }

  return (
    <div className="job-item-details-container">
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
            <button type="button" onClick={() => {
              Cookies.remove('jwt_token')
              history.replace('/login')
            }}>
              Logout
            </button>
          </li>
        </ul>
      </header>
      {loading ? (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      ) : error ? (
        <div>
          <h1>Oops! Something Went Wrong</h1>
          <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" />
          <p>We cannot seem to find the page you are looking for</p>
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : (
        <div className="job-details">
          <img src={jobDetails.job_details.company_logo_url} alt="job details company logo" />
          <h1>{jobDetails.job_details.title}</h1>
          <p>{jobDetails.job_details.rating}</p>
          <p>{jobDetails.job_details.location}</p>
          <p>{jobDetails.job_details.employment_type}</p>
          <p>{jobDetails.job_details.package_per_annum}</p>
          <h1>Description</h1>
          <p>{jobDetails.job_details.job_description}</p>
          <a href={jobDetails.job_details.company_website_url}>Visit</a>
          <h1>Skills</h1>
          <ul>
            {jobDetails.job_details.skills.map(skill => (
              <li key={skill.name}>
                <img src={skill.image_url} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <p>{jobDetails.job_details.life_at_company.description}</p>
          <img src={jobDetails.job_details.life_at_company.image_url} alt="life at company" />
          <h1>Similar Jobs</h1>
          <ul>
            {jobDetails.similar_jobs.map(job => (
              <li key={job.id}>
                <img src={job.company_logo_url} alt="similar job company logo" />
                <h1>{job.title}</h1>
                <p>{job.rating}</p>
                <p>{job.location}</p>
                <p>{job.employment_type}</p>
                <p>{job.job_description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default JobItemDetails
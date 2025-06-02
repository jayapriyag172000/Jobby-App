import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { Link, useHistory } from 'react-router-dom'
import './index.css'

const employmentTypesList = [
  { employmentTypeId: 'FULLTIME', label: 'Full Time' },
  { employmentTypeId: 'PARTTIME', label: 'Part Time' },
  { employmentTypeId: 'FREELANCE', label: 'Freelance' },
  { employmentTypeId: 'INTERNSHIP', label: 'Internship' },
]

const salaryRangesList = [
  { salaryRangeId: '1000000', label: '10 LPA and above' },
  { salaryRangeId: '2000000', label: '20 LPA and above' },
  { salaryRangeId: '3000000', label: '30 LPA and above' },
  { salaryRangeId: '4000000', label: '40 LPA and above' },
]

const Jobs = () => {
  const [profile, setProfile] = useState({})
  const [jobs, setJobs] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [filters, setFilters] = useState({
    employmentType: [],
    minimumPackage: '',
    search: '',
  })
  const [error, setError] = useState('')
  const history = useHistory()

  useEffect(() => {
    const fetchProfile = async () => {
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://apis.ccbp.in/profile'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile_details)
      } else {
        setError('Profile fetch failed')
      }
      setLoadingProfile(false)
    }

    const fetchJobs = async () => {
      const jwtToken = Cookies.get('jwt_token')
      const { employmentType, minimumPackage, search } = filters
      const employmentTypeQuery = employmentType.join(',')
      const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${minimumPackage}&search=${search}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      } else {
        setError('Jobs fetch failed')
      }
      setLoadingJobs(false)
    }

    fetchProfile()
    fetchJobs()
  }, [filters])

  const onRetryProfile = () => {
    setLoadingProfile(true)
    setError('')
    fetchProfile()
  }

  const onRetryJobs = () => {
    setLoadingJobs(true)
    setError('')
    fetchJobs()
  }

  const onUpdateFilters = event => {
    const { name, value, checked } = event.target
    if (name === 'employmentType') {
      setFilters(prevFilters => {
        const updatedEmploymentType = checked
          ? [...prevFilters.employmentType, value]
          : prevFilters.employmentType.filter(type => type !== value)
        return { ...prevFilters, employmentType: updatedEmploymentType }
      })
    } else {
      setFilters(prevFilters => ({ ...prevFilters, [name]: value }))
    }
  }

  const onSearch = event => {
    setFilters(prevFilters => ({ ...prevFilters, search: event.target.value }))
  }

  const onSearchClick = () => {
    setFilters(prevFilters => ({ ...prevFilters, search: filters.search }))
  }

  return (
    <div className="jobs-container">
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
      <div className="filters-container">
        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(type => (
            <li key={type.employmentTypeId}>
              <input
                type="checkbox"
                id={type.employmentTypeId}
                name="employmentType"
                value={type.employmentTypeId}
                onChange={onUpdateFilters}
              />
              <label htmlFor={type.employmentTypeId}>{type.label}</label>
            </li>
          ))}
        </ul>
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(range => (
            <li key={range.salaryRangeId}>
              <input
                type="radio"
                id={range.salaryRangeId}
                name="minimumPackage"
                value={range.salaryRangeId}
                onChange={onUpdateFilters}
              />
              <label htmlFor={range.salaryRangeId}>{range.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="jobs-list-container">
        <input
          type="search"
          value={filters.search}
          onChange={onSearch}
        />
        <button type="button" data-testid="searchButton" onClick={onSearchClick}>
          <img src="https://assets.ccbp.in/frontend/react-js/search-icon-img.png" alt="search icon" />
        </button>
        {loadingProfile ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : error ? (
          <div>
            <h1>Oops! Something Went Wrong</h1>
            <button type="button" onClick={onRetryProfile}>
              Retry
            </button>
          </div>
        ) : (
          <div className="profile-container">
            <img src={profile.profile_image_url} alt="profile" />
            <h1>{profile.name}</h1>
            <p>{profile.short_bio}</p>
          </div>
        )}
        {loadingJobs ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : error ? (
          <div>
            <h1>Oops! Something Went Wrong</h1>
            <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" />
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={onRetryJobs}>
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div>
            <img src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png" alt="no jobs" />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          <ul>
            {jobs.map(job => (
              <li key={job.id}>
                <img src={job.company_logo_url} alt="company logo" />
                <div>
                  <h1>{job.title}</h1>
                  <p>{job.rating}</p>
                  <p>{job.location}</p>
                  <p>{job.employment_type}</p>
                  <h1>Description</h1>
                  <p>{job.job_description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Jobs
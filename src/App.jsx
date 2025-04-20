import { useState, useEffect } from 'react';
import './App.css';
import { Spin as Hamburger } from 'hamburger-react'


function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobType: '',
    location: '',
    description: ''
  });

  const [jobs, setJobs] = useState([]);
  const [viewingJob, setViewingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newJob = await response.json();
      setJobs([...jobs, newJob]);
      setFormData({
        jobTitle: '',
        companyName: '',
        jobType: '',
        location: '',
        description: ''
      });
    } catch (err) {
      console.error('Error posting job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewJob = (job) => {
    setViewingJob(job);
  };

  const closeModal = () => {
    setViewingJob(null);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="logo">ShopNow</a>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="navbar-right">
        us
         
        </div>
      </nav>

      <div className="app-body">
        <div className="app-body-left">
          <form className="job-form" onSubmit={handleSubmit}>
            <h2>Post a New Job</h2>
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobType">Job Type</label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Post Job</button>
          </form>
        </div>

        <div className="app-body-right">
  <div className="job-listings">
    <h2>Current Job Listings</h2>
    {isLoading ? (
      <p>Loading jobs...</p>
    ) : jobs.length === 0 ? (
      <p className="no-jobs">No jobs posted yet</p>
    ) : (
      <ul className="jobs">
        {jobs.map(job => (
          <li key={job._id} className="job-card"> 
            <h3>{job.jobTitle}</h3>
            <p>{job.companyName}</p>
            <button 
              onClick={() => handleViewJob(job)}
              className="view-btn"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
      </div>

      {viewingJob && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2>{viewingJob.jobTitle}</h2>
            <div className="job-details">
              <p><strong>Company:</strong> {viewingJob.companyName}</p>
              <p><strong>Type:</strong> {viewingJob.jobType}</p>
              <p><strong>Location:</strong> {viewingJob.location}</p>
              <p><strong>Description:</strong> {viewingJob.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
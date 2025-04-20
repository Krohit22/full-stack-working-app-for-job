require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables');
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    const jobSchema = new mongoose.Schema({
      jobTitle: String,
      companyName: String,
      jobType: String,
      location: String,
      description: String
    });
    const Job = mongoose.model('Job', jobSchema);

    app.get('/api/jobs', async (req, res) => {
      try {
        const jobs = await Job.find();
        res.json(jobs);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.post('/api/jobs', async (req, res) => {
      const job = new Job(req.body);
      try {
        const newJob = await job.save();
        res.status(201).json(newJob);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
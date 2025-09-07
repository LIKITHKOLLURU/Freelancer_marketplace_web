import express from 'express';
import { collection } from '../db.js';

const router = express.Router();

// Helper to normalize job payload
function normalizeJobPayload(body) {
  const skillsRaw = body.skills || '';
  const skills = Array.isArray(skillsRaw)
    ? skillsRaw
    : String(skillsRaw)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

  const job = {
    title: body.title || '',
    description: body.description || '',
    category: body.category || '',
    experienceLevel: body.experienceLevel || 'intermediate',
    projectType: body.projectType || 'fixed',
    budget: body.budget || '',
    duration: body.duration || '',
    skills,
    // Optional application deadline (ISO string). If client sends a date/datetime string, store as-is (validated on apply)
    deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
    // Normalize admin fields from either admin* or client*
    adminId: body.adminId || body.clientId || '',
    adminName: body.adminName || body.clientName || '',
    status: 'active',
    applicationsCount: 0,
    createdAt: new Date(),
  };
  return job;
}

// POST /jobs - create a new job (admin)
router.post('/', async (req, res) => {
  try {
    const jobsCol = collection('jobs');
    const job = normalizeJobPayload(req.body || {});

    if (!job.title || !job.description || !job.category || !job.adminId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await jobsCol.insertOne(job);
    return res.json({ success: true, job: { _id: result.insertedId, ...job } });
  } catch (err) {
    console.error('Create job error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /jobs - list jobs
router.get('/', async (_req, res) => {
  try {
    const jobsCol = collection('jobs');
    const jobs = await jobsCol.find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
    return res.json({ success: true, jobs });
  } catch (err) {
    console.error('List jobs error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /jobs/:id - get a job by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobsCol = collection('jobs');

    let filter = { _id: id };
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    } catch {}

    const job = await jobsCol.findOne(filter);
    if (!job || job.status === 'deleted') return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, job });
  } catch (err) {
    console.error('Get job error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /jobs/:id - soft delete a job (admin owner)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobsCol = collection('jobs');
    let result = null;
    // Try ObjectId
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) {
        result = await jobsCol.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: 'deleted', deletedAt: new Date() } },
          { returnDocument: 'after' }
        );
      }
    } catch {}

    // Try direct string _id
    if (!result || !result.value) {
      try {
        const direct = await jobsCol.findOneAndUpdate(
          { _id: String(id) },
          { $set: { status: 'deleted', deletedAt: new Date() } },
          { returnDocument: 'after' }
        );
        if (direct && direct.value) result = direct;
      } catch {}
    }

    // Try $expr toString match
    if (!result || !result.value) {
      result = await jobsCol.findOneAndUpdate(
        { $expr: { $eq: [ { $toString: '$_id' }, String(id) ] } },
        { $set: { status: 'deleted', deletedAt: new Date() } },
        { returnDocument: 'after' }
      );
    }

    if (!result?.value) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete job error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

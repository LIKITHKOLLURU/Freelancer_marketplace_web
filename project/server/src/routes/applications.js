import express from 'express';
import { ObjectId } from 'mongodb';
import { collection } from '../db.js';

const router = express.Router();

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// Create a new application
router.post('/', async (req, res) => {
  try {
    const { jobId, jobTitle, freelancerId, freelancerName, proposedPrice, proposal } = req.body || {};

    if (!jobId || !freelancerId || !proposal || proposedPrice == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const applicationsCol = collection('applications');
    const jobsCol = collection('jobs');

    // Check deadline
    const job = await jobsCol.findOne({ $or: [ { _id: jobId }, { $expr: { $eq: [ { $toString: '$_id' }, String(jobId) ] } } ] });
    if (job?.deadline) {
      const now = Date.now();
      const deadlineTs = new Date(job.deadline).getTime();
      if (!Number.isNaN(deadlineTs) && now > deadlineTs) {
        return res.status(400).json({ success: false, message: 'Applications closed for this job' });
      }
    }

    const doc = {
      jobId: String(jobId),
      jobTitle: jobTitle || '',
      freelancerId: String(freelancerId),
      freelancerName: freelancerName || '',
      proposedPrice: Number(proposedPrice),
      proposal: String(proposal),
      status: 'pending',
      appliedAt: new Date().toISOString(),
      bids: [],
    };

    const result = await applicationsCol.insertOne(doc);
    return res.json({ success: true, application: { _id: result.insertedId.toString(), ...doc } });
  } catch (err) {
    console.error('Error creating application:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get applications by jobId or by userId (freelancerId)
router.get('/', async (req, res) => {
  try {
    const { jobId, userId } = req.query;
    const applicationsCol = collection('applications');

    const filter = {};
    if (jobId) filter.jobId = String(jobId);
    if (userId) filter.freelancerId = String(userId);

    if (!jobId && !userId) {
      return res.json({ success: true, applications: [] });
    }

    const apps = await applicationsCol
      .find(filter)
      .sort({ appliedAt: -1 })
      .toArray();

    const normalized = apps.map(a => ({
      ...a,
      _id: a._id?.toString?.() || a._id,
    }));

    return res.json({ success: true, applications: normalized });
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Accept an application
router.patch('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const applicationsCol = collection('applications');

    // Try to match by ObjectId if valid, else by stringified _id using $expr
    let result = null;
    const maybeObjId = toObjectId(id);
    if (maybeObjId) {
      result = await applicationsCol.findOneAndUpdate(
        { _id: maybeObjId },
        { $set: { status: 'accepted' } },
        { returnDocument: 'after' }
      );
    }
    // Fallback 1: direct string equality match (in case _id was stored as a string previously)
    if (!result || !result.value) {
      try {
        const directMatch = await applicationsCol.findOneAndUpdate(
          { _id: String(id) },
          { $set: { status: 'accepted' } },
          { returnDocument: 'after' }
        );
        if (directMatch && directMatch.value) {
          result = directMatch;
        }
      } catch (e) {
        // no-op
      }
    }
    // Fallback 2: $expr with $toString to match ObjectId converted to string
    if (!result || !result.value) {
      result = await applicationsCol.findOneAndUpdate(
        { $expr: { $eq: [ { $toString: '$_id' }, String(id) ] } },
        { $set: { status: 'accepted' } },
        { returnDocument: 'after' }
      );
    }

    if (!result.value) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const app = result.value;
    return res.json({ success: true, application: { ...app, _id: app._id?.toString?.() || app._id } });
  } catch (err) {
    console.error('Error accepting application:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

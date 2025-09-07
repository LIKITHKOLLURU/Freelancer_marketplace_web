import express from 'express';
import { ObjectId } from 'mongodb';
import { collection } from '../db.js';

const router = express.Router();

function toObjectId(id) {
  try { return new ObjectId(id); } catch { return null; }
}

// POST /bids - place a new bid by an admin on an application (freelancer)
router.post('/', async (req, res) => {
  try {
    const { applicationId, jobId, freelancerId, adminId, adminName, amount } = req.body || {};
    if (!applicationId || !freelancerId || !adminId || amount == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const bidsCol = collection('bids');
    const bid = {
      applicationId: String(applicationId),
      jobId: jobId ? String(jobId) : '',
      freelancerId: String(freelancerId),
      adminId: String(adminId),
      adminName: adminName || '',
      amount: Number(amount),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const result = await bidsCol.insertOne(bid);
    return res.json({ success: true, bid: { _id: result.insertedId.toString(), ...bid } });
  } catch (err) {
    console.error('Create bid error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /bids?applicationId=... or ?adminId=...
router.get('/', async (req, res) => {
  try {
    const { applicationId, adminId } = req.query;
    const bidsCol = collection('bids');
    const filter = {};
    if (applicationId) filter.applicationId = String(applicationId);
    if (adminId) filter.adminId = String(adminId);
    if (!applicationId && !adminId) return res.json({ success: true, bids: [] });

    const items = await bidsCol.find(filter).sort({ createdAt: -1 }).toArray();
    const bids = items.map(b => ({ ...b, _id: b._id?.toString?.() || b._id }));
    return res.json({ success: true, bids });
  } catch (err) {
    console.error('List bids error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /bids/:id/accept - accept a bid; mark others as outbid and application as accepted
router.patch('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const bidsCol = collection('bids');
    const applicationsCol = collection('applications');

    // Find the bid by id (support both ObjectId and string _id)
    let bid = null;
    const maybeId = toObjectId(id);
    if (maybeId) bid = await bidsCol.findOne({ _id: maybeId });
    if (!bid) bid = await bidsCol.findOne({ _id: String(id) });
    if (!bid) bid = await bidsCol.findOne({ $expr: { $eq: [ { $toString: '$_id' }, String(id) ] } });
    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });

    // Accept selected bid
    await bidsCol.updateOne({ _id: bid._id }, { $set: { status: 'accepted' } });
    // Mark other bids on same application as outbid
    await bidsCol.updateMany({ applicationId: bid.applicationId, _id: { $ne: bid._id } }, { $set: { status: 'outbid' } });

    // Also mark application accepted for convenience
    const maybeAppId = toObjectId(bid.applicationId);
    if (maybeAppId) {
      await applicationsCol.updateOne({ _id: maybeAppId }, { $set: { status: 'accepted' } });
    } else {
      await applicationsCol.updateOne({ $expr: { $eq: [ { $toString: '$_id' }, String(bid.applicationId) ] } }, { $set: { status: 'accepted' } });
    }

    const updated = await bidsCol.findOne({ _id: bid._id });
    return res.json({ success: true, bid: { ...updated, _id: updated._id?.toString?.() || updated._id } });
  } catch (err) {
    console.error('Accept bid error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

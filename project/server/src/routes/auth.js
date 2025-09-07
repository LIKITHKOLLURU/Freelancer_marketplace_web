import express from 'express';
import bcrypt from 'bcryptjs';
import { collection } from '../db.js';

const router = express.Router();

// Helpers
function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const usersCol = collection('users');
    const normEmail = normalizeEmail(email);

    const existing = await usersCol.findOne({ email: normEmail });
    if (existing) {
      return res.status(200).json({ success: true, user: existing });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email: normEmail,
      passwordHash,
      role,
      skills: [],
      completedProjects: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await usersCol.insertOne(newUser);

    return res.json({ success: true, user: { _id: result.insertedId, ...newUser } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const usersCol = collection('users');
    const normEmail = normalizeEmail(email);

    const user = await usersCol.findOne({ email: normEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      // Backward compatibility: if plain password was ever stored (should not be), fallback compare
      if (user.password && user.password === password) {
        return res.json({ success: true, user });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usersCol = collection('users');

    // Try ObjectId
    let filter = { _id: id };
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    } catch {}

    const user = await usersCol.findOne(filter);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

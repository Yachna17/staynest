const express = require('express');
const bcrypt = require('bcryptjs');
const storage = require('../storage');
const { signToken } = require('../middleware/auth');

const router = express.Router();

const publicUser = ({ password, ...user }) => user;
const nextId = (items) => items.reduce((max, i) => Math.max(max, Number(i.id) || 0), 0) + 1;

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'email, password and name are required' });
    }
    if (String(password).length < 4) {
      return res.status(400).json({ message: 'Password is too short' });
    }
    const normalized = String(email).trim().toLowerCase();
    const hash = await bcrypt.hash(String(password), 10);

    const user = await storage.update((db) => {
      if (db.users.some((u) => u.email === normalized)) return null;
      const u = {
        id: nextId(db.users),
        email: normalized,
        name: String(name).trim(),
        password: hash,
        createdAt: new Date().toISOString(),
      };
      db.users.push(u);
      return u;
    });

    if (!user) return res.status(400).json({ message: 'Email already exists' });
    res.status(201).json({ accessToken: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const db = await storage.read();
    const user = db.users.find((u) => u.email === String(email).trim().toLowerCase());
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    res.json({ accessToken: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = { router, nextId };

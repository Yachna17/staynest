const express = require('express');
const multer = require('multer');
const storage = require('../storage');
const { requireAuth } = require('../middleware/auth');
const { applyQuery } = require('../query');
const { nextId } = require('./auth');

const router = express.Router();

// Max 5 MB per image, up to 10 images per request.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(Object.assign(new Error('Only image files are allowed'), { status: 400 }));
  },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 10 },
]);

const PROTECTED = ['id', 'userId', 'createdAt', 'updatedAt'];

// multipart/form-data sends everything as strings — turn numbers, booleans and JSON back into values
function coerce(value) {
  if (Array.isArray(value)) return value.map(coerce);
  if (typeof value !== 'string') return value;
  const v = value.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('[') && v.endsWith(']')) || (v.startsWith('{') && v.endsWith('}'))) {
    try { return JSON.parse(v); } catch { /* keep as string */ }
  }
  return value;
}

// Fields that always stay text, even when they look like numbers (e.g. zipCode "403001")
const TEXT_FIELDS = new Set(['name', 'description', 'address', 'city', 'state', 'country', 'zipCode', 'phone', 'checkIn', 'checkOut']);

function parseBody(body = {}) {
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    const key = k.replace(/\[\]$/, '');
    out[key] = TEXT_FIELDS.has(key) ? (typeof v === 'number' ? String(v) : v) : coerce(v);
  }
  return out;
}

function uploadedFiles(req) {
  const f = req.files || {};
  return [...(f.images || []), ...(f.image || [])];
}

const baseUrl = (req) => `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;

const toUrlList = (v) => (v == null || v === '' ? [] : Array.isArray(v) ? v : [v]).filter((x) => typeof x === 'string' && x);

// GET /hotels — public, supports filter / search / sort / pagination
router.get('/', async (req, res, next) => {
  try {
    const db = await storage.read();
    const { data, meta } = applyQuery(db.hotels, req.query);

    res.set('X-Total-Count', String(meta.total));
    if (meta.page) {
      const url = new URL(req.originalUrl, baseUrl(req));
      const link = (p, rel) => { url.searchParams.set(req.query._page ? '_page' : 'page', p); return `<${url}>; rel="${rel}"`; };
      const links = [link(1, 'first')];
      if (meta.page > 1) links.push(link(meta.page - 1, 'prev'));
      if (meta.page < meta.pages) links.push(link(meta.page + 1, 'next'));
      links.push(link(Math.max(1, meta.pages), 'last'));
      res.set('Link', links.join(', '));
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /hotels/:id — public
router.get('/:id', async (req, res, next) => {
  try {
    const db = await storage.read();
    const hotel = db.hotels.find((h) => String(h.id) === req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

// POST /hotels — auth, body must include userId (must be the logged-in user)
router.post('/', requireAuth, upload, async (req, res, next) => {
  try {
    const body = parseBody(req.body);
    if (body.userId === undefined || body.userId === null || body.userId === '') {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (Number(body.userId) !== req.userId) {
      return res.status(403).json({ message: 'userId must match the logged-in user' });
    }
    if (!body.name || !String(body.name).trim()) {
      return res.status(400).json({ message: 'name is required' });
    }

    const images = toUrlList(body.images ?? body.image);
    for (const file of uploadedFiles(req)) images.push(await storage.saveImage(file, baseUrl(req)));

    const fields = { ...body };
    for (const k of [...PROTECTED, 'images', 'image']) delete fields[k];

    const hotel = await storage.update((db) => {
      const now = new Date().toISOString();
      const h = {
        id: nextId(db.hotels),
        ...fields,
        userId: req.userId,
        images,
        image: images[0] || null,
        createdAt: now,
        updatedAt: now,
      };
      db.hotels.push(h);
      return h;
    });

    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
});

// PATCH /hotels/:id — auth + owner only (PUT behaves the same)
// Images: send `images` (list of existing URLs to keep) and/or upload new files; new files are appended.
async function editHotel(req, res, next) {
  try {
    const db = await storage.read();
    const existing = db.hotels.find((h) => String(h.id) === req.params.id);
    if (!existing) return res.status(404).json({ message: 'Hotel not found' });
    if (Number(existing.userId) !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own properties' });
    }

    const body = parseBody(req.body);
    const keepGiven = body.images !== undefined || body.image !== undefined;
    const newUrls = [];
    for (const file of uploadedFiles(req)) newUrls.push(await storage.saveImage(file, baseUrl(req)));

    const fields = { ...body };
    for (const k of [...PROTECTED, 'images', 'image']) delete fields[k];

    let removed = [];
    const result = await storage.update((db) => {
      const idx = db.hotels.findIndex((h) => String(h.id) === req.params.id);
      if (idx === -1) return null;
      const current = db.hotels[idx];
      if (Number(current.userId) !== req.userId) return 'forbidden';

      const oldImages = current.images || [];
      const kept = keepGiven ? toUrlList(body.images ?? body.image) : oldImages;
      const images = [...kept, ...newUrls];
      removed = oldImages.filter((u) => !images.includes(u));

      const updated = {
        ...current,
        ...fields,
        images,
        image: images[0] || null,
        updatedAt: new Date().toISOString(),
      };
      db.hotels[idx] = updated;
      return updated;
    });

    if (!result) return res.status(404).json({ message: 'Hotel not found' });
    if (result === 'forbidden') return res.status(403).json({ message: 'You can only edit your own properties' });
    await storage.deleteImages(removed);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
router.patch('/:id', requireAuth, upload, editHotel);
router.put('/:id', requireAuth, upload, editHotel);

// DELETE /hotels/:id — auth + owner only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await storage.update((db) => {
      const idx = db.hotels.findIndex((h) => String(h.id) === req.params.id);
      if (idx === -1) return null;
      if (Number(db.hotels[idx].userId) !== req.userId) return 'forbidden';
      return db.hotels.splice(idx, 1)[0];
    });

    if (!result) return res.status(404).json({ message: 'Hotel not found' });
    if (result === 'forbidden') return res.status(403).json({ message: 'You can only delete your own properties' });
    await storage.deleteImages(result.images);
    res.json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;

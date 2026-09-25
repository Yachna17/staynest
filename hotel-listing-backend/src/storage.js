// Storage layer — no database.
// Data is kept in data/db.json and images in uploads/ (both inside the project folder).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DB_FILE = path.join(ROOT, 'data', 'db.json');
const UPLOAD_DIR = path.join(ROOT, 'uploads');

const EMPTY_DB = { users: [], hotels: [] };

// ---------- data ----------

function read() {
  if (!fs.existsSync(DB_FILE)) return structuredClone(EMPTY_DB);
  return { ...EMPTY_DB, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
}

function write(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Serialize writes so two requests can't overwrite each other's changes.
let queue = Promise.resolve();

/** Read-modify-write. `fn(db)` mutates db and returns a result. */
function update(fn) {
  const run = async () => {
    const db = read();
    const result = await fn(db);
    write(db);
    return result;
  };
  const p = queue.then(run, run);
  queue = p.catch(() => {});
  return p;
}

// ---------- images ----------

async function saveImage(file, baseUrl) {
  const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, name), file.buffer);
  return `${baseUrl}/uploads/${name}`;
}

async function deleteImages(urls = []) {
  for (const u of urls.filter(Boolean)) {
    const m = u.match(/\/uploads\/([^/?#]+)$/);
    if (m) fs.rmSync(path.join(UPLOAD_DIR, m[1]), { force: true });
  }
}

module.exports = { read: async () => read(), update, saveImage, deleteImages, UPLOAD_DIR };

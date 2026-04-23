const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app          = express();
const PROFILES_DIR = path.join(__dirname, 'profiles');

if (!fs.existsSync(PROFILES_DIR)) fs.mkdirSync(PROFILES_DIR);

// ── helpers ──────────────────────────────────────────
function nextId() {
  const ids = fs.readdirSync(PROFILES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => parseInt(f));
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function readProfile(id) {
  const file = path.join(PROFILES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeProfile(profile) {
  fs.writeFileSync(
    path.join(PROFILES_DIR, `${profile.id}.json`),
    JSON.stringify(profile, null, 2)
  );
}

function allProfiles() {
  return fs.readdirSync(PROFILES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, f), 'utf8')))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

// ── middleware ────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

// ── routes ────────────────────────────────────────────

// List profiles (id + name only)
app.get('/api/profiles', (req, res) => {
  res.json(allProfiles().map(({ id, name, updated_at }) => ({ id, name, updated_at })));
});

// Create profile
app.post('/api/profiles', (req, res) => {
  const { name, data } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const profile = {
    id:         nextId(),
    name,
    data:       data ?? {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  writeProfile(profile);
  res.json({ id: profile.id, name });
});

// Get one profile
app.get('/api/profiles/:id', (req, res) => {
  const p = readProfile(+req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

// Update profile
app.put('/api/profiles/:id', (req, res) => {
  const p = readProfile(+req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  const { name, data } = req.body;
  if (data !== undefined) p.data = data;
  if (name !== undefined) p.name = name;
  p.updated_at = new Date().toISOString();
  writeProfile(p);
  res.json({ ok: true });
});

// Delete profile
app.delete('/api/profiles/:id', (req, res) => {
  const file = path.join(PROFILES_DIR, `${+req.params.id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`\n  CV Builder → http://localhost:${PORT}/cv-builder.html\n`);
});

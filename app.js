// vulnerable-app.js

const express = require('express');
const app = express();
app.use(express.json());

// ❌ Insecure random (predictable tokens)
app.get('/token', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  res.send({ token });
});

// ❌ Command Injection
const { exec } = require('child_process');
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    if (err) return res.send('Error');
    res.send(stdout);
  });
});

// ❌ Hardcoded secret
const API_KEY = "12345-SECRET-KEY";

// ❌ Insecure file read (Path Traversal)
const fs = require('fs');
app.get('/read', (req, res) => {
  const file = req.query.file;
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.send('Error');
    res.send(data);
  });
});

// ❌ No rate limiting (DoS risk)
app.get('/heavy', (req, res) => {
  while (true) {} // infinite loop
});

app.listen(3000, () => console.log('Server running'));

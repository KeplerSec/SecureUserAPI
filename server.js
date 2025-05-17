const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const addon = require('./build/Release/cryptoAddon');
const app = express();
app.use(express.json());

mongoose.connect('mongodb-connection');
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  passwordHash: String // Haché via C++
}));

// Inscription
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = addon.hashPassword(password); // Appel C++
  const user = new User({ email, passwordHash });
  await user.save();
  res.status(201).json({ message: 'Utilisateur créé' });
});

// Connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !addon.verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

// Lister utilisateurs (protégé)
app.get('/users', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  try {
    jwt.verify(token, 'secret');
    User.find().then(users => res.json(users));
  } catch (e) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Vérifier mot de passe
app.get('/users/:id/verify', async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password } = req.query;
  const isValid = addon.verifyPassword(password, user.passwordHash);
  res.json({ valid: isValid });
});

app.listen(3000, () => console.log('Serveur sur port 3000'));

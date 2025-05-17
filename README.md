# SecureUserAPI
API Node.js/Express avec chiffrement SHA-256 en C++ (N-API) pour une authentification sécurisée.

## Fonctionnalités
- Inscription/connexion avec hachage SHA-256 via addon C++.
- Authentification JWT.
- Stockage sécurisé avec MongoDB (Atlas/local).
- Déploiement prêt pour Render.

## Prérequis
- Node.js 22.x
- MongoDB (local ou Atlas)
- OpenSSL
- node-gyp

## Installation
```bash
npm install
node-gyp configure
node-gyp build
node server.js

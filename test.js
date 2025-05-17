const addon = require('./build/Release/cryptoAddon');
console.log(addon.hashPassword('test')); // Affiche hachage SHA-256
console.log(addon.verifyPassword('test', addon.hashPassword('test'))); // Doit afficher true
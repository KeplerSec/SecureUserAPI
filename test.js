const addon = require('../build/Release/cryptoAddon');

describe('Crypto Addon', () => {
  test('should hash password correctly', () => {
    const hash = addon.hashPassword('test');
    expect(hash).toMatch(/^[0-9a-f]{64}$/); // Vérifie format SHA-256
  });

  test('should verify correct password', () => {
    const hash = addon.hashPassword('test');
    expect(addon.verifyPassword('test', hash)).toBe(true);
  });

  test('should reject incorrect password', () => {
    const hash = addon.hashPassword('test');
    expect(addon.verifyPassword('wrong', hash)).toBe(false);
  });
});

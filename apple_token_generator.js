// apple_token_generator.js
// Usage: set env variables TEAM_ID and KEY_ID, and put AuthKey_{KEY_ID}.p8 next to this file.
const fs = require('fs');
const jwt = require('jsonwebtoken');

const TEAM_ID = process.env.APPLE_TEAM_ID; // e.g. ABCDE12345
const KEY_ID = process.env.APPLE_KEY_ID; // Key ID you get when creating the MusicKit key
const P8_PATH = `./AuthKey_${KEY_ID}.p8`; // download from Apple Developer

if(!TEAM_ID || !KEY_ID) {
  console.error('Set APPLE_TEAM_ID and APPLE_KEY_ID env vars');
  process.exit(1);
}

const privateKey = fs.readFileSync(P8_PATH);
const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d', // max ~6 months - choose appropriate
  issuer: TEAM_ID,
  header: { alg: 'ES256', kid: KEY_ID }
});
console.log(token);

#!/usr/bin/env node
const os = require('os');

function getLanIpv4() {
	for (const interfaces of Object.values(os.networkInterfaces())) {
		for (const net of interfaces ?? []) {
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
	return '127.0.0.1';
}

const ip = getLanIpv4();
console.log(`\nAdd to mobile/.env (phone must be on the same Wi‑Fi):\n`);
console.log(`API_URL=http://${ip}:3000\n`);
console.log(`Then restart Expo: npx expo start -c\n`);

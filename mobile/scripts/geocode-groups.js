/**
 * One-time / maintenance script: geocode in-person AA groups and write location into groups.json.
 * Usage: npm run geocode:groups
 */
const fs = require('fs');
const path = require('path');

const GROUPS_PATH = path.join(__dirname, '../data/groups.json');
const NOMINATIM_DELAY_MS = 1100;

function buildQueries(group) {
	const { address } = group;
	if (!address) return [];

	const cityState = [address.city, address.state, 'Brazil'].filter(Boolean).join(', ');
	const queries = [];

	if (address.street && address.neighborhood) {
		queries.push(`${address.street}, ${address.neighborhood}, ${cityState}`);
	}
	if (address.street) {
		queries.push(`${address.street}, ${cityState}`);
	}
	if (address.place) {
		queries.push(`${address.place}, ${cityState}`);
	}
	if (address.neighborhood) {
		queries.push(`${address.neighborhood}, ${cityState}`);
	}

	return [...new Set(queries)];
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeWithNominatim(query) {
	const url = new URL('https://nominatim.openstreetmap.org/search');
	url.searchParams.set('q', query);
	url.searchParams.set('format', 'json');
	url.searchParams.set('limit', '1');
	url.searchParams.set('countrycodes', 'br');

	const response = await fetch(url.toString(), {
		headers: {
			'User-Agent': 'MontisApp/1.0 (geocode-groups script)',
		},
	});

	if (!response.ok) {
		throw new Error(`Nominatim HTTP ${response.status}`);
	}

	const results = await response.json();
	if (!results?.length) {
		return null;
	}

	return {
		latitude: parseFloat(results[0].lat),
		longitude: parseFloat(results[0].lon),
	};
}

async function geocodeGroup(group) {
	const queries = buildQueries(group);
	if (!queries.length) {
		console.warn(`  skip ${group.id}: no address`);
		return null;
	}

	for (const query of queries) {
		console.log(`  trying ${group.name}: ${query}`);
		await sleep(NOMINATIM_DELAY_MS);
		const location = await geocodeWithNominatim(query);
		if (location) {
			return location;
		}
	}

	return null;
}

async function main() {
	const raw = fs.readFileSync(GROUPS_PATH, 'utf8');
	const data = JSON.parse(raw);
	let updated = 0;

	for (const group of data.groups) {
		if (group.type !== 'in-person') {
			continue;
		}

		if (group.location?.latitude && group.location?.longitude) {
			console.log(`  skip ${group.id}: already geocoded`);
			continue;
		}

		try {
			const location = await geocodeGroup(group);
			if (location) {
				group.location = location;
				updated += 1;
				console.log(`  -> ${location.latitude}, ${location.longitude}`);
			} else {
				console.warn(`  no result for ${group.id}`);
			}
		} catch (error) {
			console.error(`  failed ${group.id}:`, error.message);
		}
	}

	fs.writeFileSync(GROUPS_PATH, `${JSON.stringify(data, null, 4)}\n`, 'utf8');
	console.log(`Done. Updated ${updated} in-person groups in ${GROUPS_PATH}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

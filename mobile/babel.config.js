module.exports = function (api) {
	api.cache(true);
	// Use the preset bundled with `expo` (SDK 54). A hoisted copy from
	// `expo-module-scripts` can resolve to v13 and break JSX transforms.
	const expoPreset = require.resolve('babel-preset-expo', {
		paths: [require.resolve('expo')],
	});
	return {
		presets: [expoPreset],
	};
};

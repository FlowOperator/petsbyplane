const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add SVG as an asset extension so it can be loaded via require()
config.resolver.assetExts.push('svg');

module.exports = config;

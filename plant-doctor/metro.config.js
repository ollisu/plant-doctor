const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for TypeScript and CommonJS
defaultConfig.resolver.sourceExts.push('ts', 'tsx', 'cjs');

// Disable unstable package exports if needed
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;

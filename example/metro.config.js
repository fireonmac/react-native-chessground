const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
console.log('Project Root:', projectRoot);
console.log('Workspace Root:', workspaceRoot);
console.log('React Path:', path.resolve(workspaceRoot, 'node_modules/react'));
console.log(
  'React Native Path:',
  path.resolve(workspaceRoot, 'node_modules/react-native')
);

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force resolution of shared dependencies to avoid duplication or missing files
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
  '@expo/metro-config': path.resolve(
    projectRoot,
    'node_modules/@expo/metro-config'
  ),
  'react-native-chessground': workspaceRoot,
};

// 4. Ensure we don't blacklist root node_modules
config.resolver.disableHierarchicalLookup = false;

module.exports = config;

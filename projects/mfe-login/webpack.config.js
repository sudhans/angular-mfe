const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mfe-login',
  filename: 'remoteEntry.mjs',
  exposes: {
    './Module': './projects/mfe-login/src/app/remote-entry/remote-entry.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

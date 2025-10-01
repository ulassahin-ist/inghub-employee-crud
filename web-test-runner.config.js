// wtr.config.mjs
import {legacyPlugin} from '@web/dev-server-legacy';
import {playwrightLauncher} from '@web/test-runner-playwright';

const mode = process.env.MODE || 'dev';

const browsers = {
  chromium: playwrightLauncher({product: 'chromium'}),
  firefox: playwrightLauncher({product: 'firefox'}),
  webkit: playwrightLauncher({product: 'webkit'}),
};

let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(',').map(
    (b) => browsers[b]
  );
} catch (e) {
  console.warn(e);
}

export default {
  rootDir: '.',
  files: ['./src/**/*.test.js', './src/**/*.spec.js', './src/**/*.js'],
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? Object.values(browsers),
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '60000',
    },
  },
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: true,
      },
    }),
  ],
};

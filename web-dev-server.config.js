/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  appIndex: 'index.html',

  // 👇 This tells the dev server to always serve index.html
  // so routes like /employees/3?view=list survive refresh
  spa: true,

  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: false,
      },
    }),
  ],
};

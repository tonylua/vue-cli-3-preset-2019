const fs = require('fs');
const path = require('path');
const eslintConfig = require('./eslint.config');
const vueI18nHelper = require('./vueI18n.helper');
const eleHelper = require('./ele.helper');
const expressHelper = require('./express.helper');
const docsHelper = require('./docs.helper');
const configHelper = require('./config.helper');
const routerHelper = require('./router.helper');
const storybookHelper = require('./storybook.helper');

module.exports = (api, options, rootOptions) => {
  const ANSWERS = {
    "vue-i18n": options['i18n'] === 'vue-i18n',
    "element-ui": options['ui'] === 'element-ui',
    "mock-express": options['mock'] === 'express.js',
    "storybook": options['storybook']
  }

  api.render((files) => {
    Object.keys(files)
      .filter(path => path.startsWith('tests/'))
      .forEach(path => delete files[path]) // delete unexpect dirs
  });

  api.render('../template', {
    'projectName': rootOptions.projectName,
    'opt_i18n': ANSWERS['vue-i18n'],
    'opt_express': ANSWERS['mock-express'],
    'opt_elementui': ANSWERS['element-ui']
  });

  api.extendPackage({
    eslintConfig,
    scripts: {
      "test": "npm run test:unit",
      "lint-staged": "lint-staged",
      "build-prod": "vue-cli-service build --mode prod",
      "postinstall": "npm rebuild node-sass"
    },
    dependencies: {
      'qs': '^6.6.0'
    },
    devDependencies: {
      'whatwg-fetch': '^3.0.0',
      'lodash': '^4.17.11',
      "lint-staged": "^8.1.5",
      "pre-commit": "^1.2.2",
      'file-saver': '^2.0.0',
      'quickfetch': '^0.0.23',
      'normalize.css': '^8.0.1',
    },
    "lint-staged": {
      "*.js": [
        "eslint --fix",
        "git add"
      ],
      "*.vue": [
        "eslint --fix",
        "git add"
      ]
    },
    "pre-commit": [
      "lint-staged",
      "test"
    ],
    vue: {
      css: {
        sourceMap: true
      },
      devServer: {},
      chainWebpack: (config) => {}
    }
  });

  if (ANSWERS['vue-i18n']) {
    vueI18nHelper(api);
  }
  if (ANSWERS['element-ui']) { // 要晚于 i18n
    eleHelper(api, ANSWERS);
  }
  if (ANSWERS['mock-express']) {
    expressHelper(api);
  }
  if (ANSWERS['storybook']) {
    storybookHelper(api, ANSWERS);
  }

  api.onCreateComplete(() => {
    routerHelper(api);
    configHelper(api);
    docsHelper(api,
      rootOptions.projectName,
      !!ANSWERS['mock-express'],
      ANSWERS['storybook']);
  })
}

// @flow

type OptionsType = {
  packageJsonProperty: string,
  rawConfigFileName?: string,
  defaults: Object,
  cwd?: string
};

const merge = require('lodash.merge');
const utils = require('./utils.js');

async function findConfigUp(options: OptionsType): Promise<any> {
  const {
    cwd = process.cwd(),
    defaults = {},
    rawConfigFileName,
    packageJsonProperty
  } = options;
  let config;

  if (rawConfigFileName && rawConfigFileName.length) {
    const rawConfigPath = await utils.findUp(rawConfigFileName, {cwd});

    if (rawConfigPath && rawConfigPath.length) {
      config = await utils.readJson(rawConfigPath);
    }
  }

  if (!config) {
    const configPath = await utils.resolvePackageJsonConfigPath(
      packageJsonProperty,
      cwd
    );

    if (configPath && configPath.length) {
      const packageJson = await utils.readJson(configPath);

      config = packageJson[packageJsonProperty];
    }
  }

  return merge({}, defaults, config);
}

async function resolveConfigPath(options: {
  cwd?: string,
  rawConfigFileName?: string,
  packageJsonProperty: string
}): Promise<string | void> {
  const {cwd = process.cwd(), rawConfigFileName, packageJsonProperty} = options;
  let configPath;

  if (rawConfigFileName && rawConfigFileName.length) {
    configPath = await utils.findUp(rawConfigFileName, {cwd});
  }

  if (!configPath) {
    configPath = await utils.resolvePackageJsonConfigPath(
      packageJsonProperty,
      cwd
    );
  }

  return configPath;
}

module.exports = findConfigUp;
module.exports.resolveConfigPath = resolveConfigPath;

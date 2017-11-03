// @flow

type OptionsType = {
  rawConfigFileName: string,
  packageJsonProperty: string,
  defaults?: Object,
  cwd?: string
};

const fs = require('fs');
const {promisify} = require('util');
const merge = require('lodash/merge');
const findUp = require('find-up');

const _utils = {
  readFileAsync: promisify(fs.readFile),
  findUp
};

async function findConfigUp(options: OptionsType): Promise<any> {
  const {
    cwd = process.cwd(),
    defaults = {},
    rawConfigFileName,
    packageJsonProperty
  } = options;
  const rawConfigPath = await _utils.findUp(rawConfigFileName, {cwd});
  let config;

  if (rawConfigPath && rawConfigPath.length) {
    config = await readJson(rawConfigPath);
  } else {
    config = await readPackageJsonUp(packageJsonProperty, cwd);
  }

  return merge({}, defaults, config);
}
findConfigUp._utils = _utils;

async function readPackageJsonUp(propertyName: string, cwd: string) {
  const filePath = await _utils.findUp('package.json', {cwd});

  if (!filePath) {
    return undefined;
  }

  const pkg = await readJson(filePath);

  const config = pkg[propertyName];

  if (typeof config === 'object') {
    return config;
  }

  const pathPartials = cwd.split('/');
  pathPartials.pop();

  return readPackageJsonUp(propertyName, pathPartials.join('/'));
}
async function readJson(path: string | any): Promise<Object> {
  const contents = await _utils.readFileAsync(path, 'utf8');

  return JSON.parse(contents);
}

module.exports = findConfigUp;

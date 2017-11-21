// @flow

const fs = require('fs');
const {promisify} = require('util');
const findUp = require('find-up');

module.exports = {
  readFileAsync: promisify(fs.readFile),
  findUp,

  async resolvePackageJsonConfigPath(
    propertyName: string,
    cwd: string
  ): Promise<string | void> {
    const filePath = await this.findUp('package.json', {cwd});

    if (!filePath) {
      return;
    }

    const pkg = await this.readJson(filePath);

    if (typeof pkg[propertyName] === 'object') {
      return filePath;
    }

    const pathPartials = cwd.split('/');
    pathPartials.pop();

    return this.resolvePackageJsonConfigPath(
      propertyName,
      pathPartials.join('/')
    );
  },

  async readJson(path: string | any): Promise<Object> {
    const contents = await this.readFileAsync(path, 'utf8');

    return JSON.parse(contents);
  }
};

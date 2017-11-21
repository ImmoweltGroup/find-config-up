// @flow

jest.mock('./utils.js');

const utils: any = require('./utils.js');
const findConfigUp = require('./index.js');

describe('findConfigUp()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be a function', () => {
    expect(typeof findConfigUp).toBe('function');
  });

  it('should return the contents of the provided "rawConfigFileName" filename if one was found up the filesystem tree', async () => {
    utils.findUp.mockReturnValueOnce('/foo/raw-config/.foorc');
    utils.readJson.mockReturnValueOnce({
      someRawRcProperty: true
    });

    const cfg = await findConfigUp({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo',
      cwd: '/foo/raw-config/nested/folder',
      defaults: {}
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should return the contents of the "package.json" with the given "packageJsonProperty" property if one was found up the filesystem tree', async () => {
    utils.findUp.mockReturnValue(null);
    utils.resolvePackageJsonConfigPath.mockReturnValue(
      '/foo/package-json/package.json'
    );
    utils.readJson.mockReturnValue({
      foo: {
        somePackageJsonProperty: true
      }
    });

    const cfg = await findConfigUp({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo',
      cwd: '/foo/package-json/nested/folder',
      defaults: {}
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should return the defaults if no file was found', async () => {
    utils.findUp.mockReturnValue(null);

    const cfg = await findConfigUp({
      packageJsonProperty: 'foo',
      cwd: '/foo/package-json/nested/folder',
      defaults: {someDefaultsProperty: true}
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should not crash if no cwd was given', () => {
    utils.findUp.mockReturnValue(null);

    expect(() =>
      findConfigUp({
        packageJsonProperty: 'foo',
        defaults: {}
      })
    ).not.toThrow();
  });
});

describe('findConfigUp.resolveConfigPath()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be a function', () => {
    expect(typeof findConfigUp.resolveConfigPath).toBe('function');
  });

  it('should try to resolve the raw config path and if not found fall back to resolving the package.json path', async () => {
    utils.findUp.mockReturnValue(null);
    utils.resolvePackageJsonConfigPath.mockReturnValue('/foo/bar/package.json');

    const path = await findConfigUp.resolveConfigPath({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo'
    });

    expect(path).toBe('/foo/bar/package.json');
  });
});

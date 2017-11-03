// @flow

const findConfigUp = require('./index.js');

const mockFs = {
  '/foo/raw-config/nested/folder/some.json': '{}',
  '/foo/raw-config/nested/package.json': '{}',
  '/foo/raw-config/.foorc': '{"someRawRcProperty": true}',

  '/foo/package-json/nested/folder/package.json': '{}',
  '/foo/package-json/nested/package.json': '{}',
  '/foo/package-json/package.json': '{"foo": {"somePackageJsonProperty": true}}'
};

describe('findConfigUp()', () => {
  let readFileAsync;
  let findUp;

  beforeEach(() => {
    readFileAsync = jest
      .spyOn(findConfigUp._utils, 'readFileAsync')
      .mockImplementation(jest.fn(path => mockFs[path]));
    findUp = jest
      .spyOn(findConfigUp._utils, 'findUp')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    readFileAsync.mockRestore();
    findUp.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof findConfigUp).toBe('function');
  });

  it('should return the contents of the provided "rawConfigFileName" filename if one was found up the filesystem tree', async () => {
    findUp.mockReturnValueOnce('/foo/raw-config/.foorc');

    const cfg = await findConfigUp({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo',
      cwd: '/foo/raw-config/nested/folder'
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should return the contents of the "package.json" with the given "packageJsonProperty" property if one was found up the filesystem tree', async () => {
    findUp
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('/foo/package-json/nested/folder/package.json')
      .mockReturnValueOnce('/foo/package-json/nested/package.json')
      .mockReturnValue('/foo/package-json/package.json');

    const cfg = await findConfigUp({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo',
      cwd: '/foo/package-json/nested/folder'
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should return the defaults if no file was found', async () => {
    findUp.mockReturnValue(null);

    const cfg = await findConfigUp({
      rawConfigFileName: '.foorc',
      packageJsonProperty: 'foo',
      cwd: '/foo/package-json/nested/folder',
      defaults: {someDefaultsProperty: true}
    });

    expect(cfg).toMatchSnapshot();
  });

  it('should not crash if no cwd was given', () => {
    findUp.mockReturnValue(null);

    expect(() =>
      findConfigUp({
        rawConfigFileName: '.foorc',
        packageJsonProperty: 'foo'
      })
    ).not.toThrow();
  });
});

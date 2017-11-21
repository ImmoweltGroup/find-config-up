// @flow

const utils = require('./utils.js');

describe('utils.findUp()', () => {
  it('should be a function', () => {
    expect(typeof utils.findUp).toBe('function');
  });
});

describe('utils.readFileAsync()', () => {
  it('should be a function', () => {
    expect(typeof utils.readFileAsync).toBe('function');
  });
});

describe('utils.resolvePackageJsonConfigPath()', () => {
  let findUp;
  let readJson;

  beforeEach(() => {
    findUp = jest.spyOn(utils, 'findUp').mockImplementation(jest.fn());
    readJson = jest.spyOn(utils, 'readJson').mockImplementation(jest.fn());
  });

  afterEach(() => {
    findUp.mockRestore();
    readJson.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof utils.resolvePackageJsonConfigPath).toBe('function');
  });

  it('should resolve a path to a package.json file up the tree with the given property name', async () => {
    findUp
      .mockReturnValueOnce('/foo/bar/baz/package.json')
      .mockReturnValueOnce('/foo/bar/package.json')
      .mockReturnValueOnce('/foo/package.json');
    readJson
      .mockReturnValueOnce({})
      .mockReturnValueOnce({})
      .mockReturnValueOnce({foo: {}});

    const path = await utils.resolvePackageJsonConfigPath(
      'foo',
      '/foo/bar/baz'
    );

    expect(path).toEqual('/foo/package.json');
  });

  it('should return undefined if no package.json was found up the tree', async () => {
    findUp.mockReturnValue(null);

    const path = await utils.resolvePackageJsonConfigPath(
      'foo',
      '/foo/bar/baz'
    );

    expect(path).toBe(undefined);
  });
});

describe('utils.readJson()', () => {
  let readFileAsync;

  beforeEach(() => {
    readFileAsync = jest
      .spyOn(utils, 'readFileAsync')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    readFileAsync.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof utils.readJson).toBe('function');
  });

  it('should call the readFileAsync method and parse the return value as JSON', async () => {
    readFileAsync.mockReturnValue('{"foo": "bar"}');
    const contents = await utils.readJson('/foo/bar.json');

    expect(contents).toEqual({foo: 'bar'});
  });
});

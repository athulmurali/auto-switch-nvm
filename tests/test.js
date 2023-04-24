const loadNodeVersionFromPackageJson = require('..');

describe('loadNodeVersionFromPackageJson', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.only('should use the version specified in package.json', () => {
    const packageJson = {
      engines: {
        node: '14.15.3',
      },
    };
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const nvmUseSpy = jest.spyOn(global.console, 'log');
    loadNodeVersionFromPackageJson();
    expect(nvmUseSpy).toHaveBeenCalledWith(expect.stringContaining('Now using node version 14.15.3'));
  });

  it('should print a warning if package.json has no engines.node version defined', () => {
    const packageJson = {};
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const consoleWarnSpy = jest.spyOn(global.console, 'warn');
    loadNodeVersionFromPackageJson();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('package.json has no .engines.node version defined'));
  });

  it('should print a warning if package.json .engines.node version has special characters', () => {
    const packageJson = {
      engines: {
        node: '~14.15.3',
      },
    };
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const consoleWarnSpy = jest.spyOn(global.console, 'warn');
    loadNodeVersionFromPackageJson();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('nvm does not support special characters (^, >, ~)'));
  });

  it('should print a warning if package.json .engines.node version is not compatible with nvm', () => {
    const packageJson = {
      engines: {
        node: '>=16.0.0 <17.0.0 || >=18.0.0 <19.0.0',
      },
    };
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const consoleWarnSpy = jest.spyOn(global.console, 'warn');
    loadNodeVersionFromPackageJson();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('is not compatible with nvm'));
  });

  it('should print a warning if package.json .engines.node version has wildcard', () => {
    const packageJson = {
      engines: {
        node: '14.x',
      },
    };
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const consoleWarnSpy = jest.spyOn(global.console, 'warn');
    loadNodeVersionFromPackageJson();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('is not compatible with nvm'));
  });

  it('should use the major version specified in package.json', () => {
    const packageJson = {
      engines: {
        node: '>=14',
      },
    };
    jest.mock(`${process.cwd()}/package.json`, () => packageJson, { virtual: true });
    const nvmUseSpy = jest.spyOn(global.console, 'log');
    loadNodeVersionFromPackageJson();
    expect(nvmUseSpy).toHaveBeenCalledWith(expect.stringContaining('Now using node version 14'));
  });
});
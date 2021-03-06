const { apply, changesConsideringParents } = require("./index");
const toVFile = require("to-vfile");
const mockConsole = require("jest-mock-console");
const fixtures = require("fixturez");
const f = fixtures(__dirname);

describe("package file apply bump", () => {
  let restoreConsole;
  beforeEach(() => {
    restoreConsole = mockConsole(["log", "dir"]);
  });
  afterEach(() => {
    restoreConsole();
  });

  it("bumps single js json", function* () {
    const jsonFolder = f.copy("pkg.js-single-json");

    const commands = [
      {
        dependencies: undefined,
        manager: "javascript",
        path: "./",
        pkg: "js-single-json-fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        "js-single-json-fixture": {
          path: "./",
          manager: "javascript",
        },
      },
    };

    yield apply({ commands, config, cwd: jsonFolder });
    const modifiedVFile = yield toVFile.read(
      jsonFolder + "/package.json",
      "utf-8"
    );
    expect(modifiedVFile.contents).toBe(
      "{\n" +
        '  "private": true,\n' +
        '  "name": "js-single-json-fixture",\n' +
        '  "description": "A single package at the root. No monorepo setup.",\n' +
        '  "version": "0.6.0"\n' +
        "}\n"
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps single rust toml", function* () {
    const rustFolder = f.copy("pkg.rust-single");

    const commands = [
      {
        dependencies: undefined,
        manager: "rust",
        path: "./",
        pkg: "rust-single-fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        "rust-single-fixture": {
          path: "./",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });
    const modifiedVFile = yield toVFile.read(
      rustFolder + "/Cargo.toml",
      "utf-8"
    );
    expect(modifiedVFile.contents).toBe(
      '[package]\nname = "rust-single-fixture"\nversion = "0.6.0"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi js json", function* () {
    const jsonFolder = f.copy("pkg.js-yarn-workspace");

    const commands = [
      {
        dependencies: ["yarn-workspace-base-pkg-b", "all"],
        manager: "javascript",
        path: "./",
        pkg: "yarn-workspace-base-pkg-a",
        type: "minor",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "javascript",
        path: undefined,
        pkg: "yarn-workspace-base-pkg-b",
        type: "minor",
        parents: ["yarn-workspace-base-pkg-a"],
      },
      {
        dependencies: undefined,
        manager: "javascript",
        path: undefined,
        pkg: "all",
        type: "minor",
        parents: ["yarn-workspace-base-pkg-a", "yarn-workspace-base-pkg-b"],
      },
    ];

    const config = {
      packages: {
        "yarn-workspace-base-pkg-a": {
          path: "./packages/pkg-a/",
          manager: "javascript",
          dependencies: ["yarn-workspace-base-pkg-b", "all"],
        },
        "yarn-workspace-base-pkg-b": {
          path: "./packages/pkg-b/",
          manager: "javascript",
          dependencies: ["all"],
        },
        all: { version: true },
      },
    };

    yield apply({ commands, config, cwd: jsonFolder });
    const modifiedPkgAVFile = yield toVFile.read(
      jsonFolder + "/packages/pkg-a/package.json",
      "utf-8"
    );
    expect(modifiedPkgAVFile.contents).toBe(
      "{\n" +
        '  "name": "yarn-workspace-base-pkg-a",\n' +
        '  "version": "1.1.0",\n' +
        '  "dependencies": {\n' +
        '    "yarn-workspace-base-pkg-b": "1.1.0"\n' +
        "  }\n" +
        "}\n"
    );

    const modifiedPkgBVFile = yield toVFile.read(
      jsonFolder + "/packages/pkg-b/package.json",
      "utf-8"
    );
    expect(modifiedPkgBVFile.contents).toBe(
      "{\n" +
        '  "name": "yarn-workspace-base-pkg-b",\n' +
        '  "version": "1.1.0"\n' +
        "}\n"
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi rust toml", function* () {
    const rustFolder = f.copy("pkg.rust-multi");

    const commands = [
      {
        dependencies: ["rust_pkg_b_fixture"],
        manager: "rust",
        path: "./pkg-a/",
        pkg: "rust_pkg_a_fixture",
        type: "minor",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "rust",
        path: "./pkg-b/",
        pkg: "rust_pkg_b_fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        rust_pkg_a_fixture: {
          path: "./pkg-a/",
          manager: "rust",
        },
        rust_pkg_b_fixture: {
          path: "./pkg-b/",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });

    const modifiedAPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-a/Cargo.toml",
      "utf-8"
    );
    expect(modifiedAPKGVFile.contents).toBe(
      "[package]\n" +
        'name = "rust_pkg_a_fixture"\n' +
        'version = "0.6.0"\n' +
        "\n" +
        "[dependencies]\n" +
        'rust_pkg_b_fixture = "0.9.0"\n'
    );

    const modifiedBPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-b/Cargo.toml",
      "utf-8"
    );
    expect(modifiedBPKGVFile.contents).toBe(
      "[package]\n" + 'name = "rust_pkg_b_fixture"\n' + 'version = "0.9.0"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi rust toml with object dep", function* () {
    const rustFolder = f.copy("pkg.rust-multi-object-dep");

    const commands = [
      {
        dependencies: ["rust_pkg_b_fixture"],
        manager: "rust",
        path: "./pkg-a/",
        pkg: "rust_pkg_a_fixture",
        type: "minor",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "rust",
        path: "./pkg-b/",
        pkg: "rust_pkg_b_fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        rust_pkg_a_fixture: {
          path: "./pkg-a/",
          manager: "rust",
        },
        rust_pkg_b_fixture: {
          path: "./pkg-b/",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });

    const modifiedAPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-a/Cargo.toml",
      "utf-8"
    );
    expect(modifiedAPKGVFile.contents).toBe(
      "[package]\n" +
        'name = "rust_pkg_a_fixture"\n' +
        'version = "0.6.0"\n' +
        "\n" +
        "[dependencies]\n" +
        'rust_pkg_b_fixture = { version = "0.9.0", path = "../rust_pkg_b_fixture" }\n'
    );

    const modifiedBPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-b/Cargo.toml",
      "utf-8"
    );
    expect(modifiedBPKGVFile.contents).toBe(
      "[package]\n" + 'name = "rust_pkg_b_fixture"\n' + 'version = "0.9.0"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi rust toml with dep missing patch", function* () {
    const rustFolder = f.copy("pkg.rust-multi-no-patch-dep");

    const commands = [
      {
        dependencies: ["rust_pkg_b_fixture"],
        manager: "rust",
        path: "./pkg-a/",
        pkg: "rust_pkg_a_fixture",
        type: "minor",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "rust",
        path: "./pkg-b/",
        pkg: "rust_pkg_b_fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        rust_pkg_a_fixture: {
          path: "./pkg-a/",
          manager: "rust",
        },
        rust_pkg_b_fixture: {
          path: "./pkg-b/",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });

    const modifiedAPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-a/Cargo.toml",
      "utf-8"
    );
    expect(modifiedAPKGVFile.contents).toBe(
      "[package]\n" +
        'name = "rust_pkg_a_fixture"\n' +
        'version = "0.6.0"\n' +
        "\n" +
        "[dependencies]\n" +
        'rust_pkg_b_fixture = "0.9"\n'
    );

    const modifiedBPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-b/Cargo.toml",
      "utf-8"
    );
    expect(modifiedBPKGVFile.contents).toBe(
      "[package]\n" + 'name = "rust_pkg_b_fixture"\n' + 'version = "0.9.0"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi rust toml as patch with object dep missing patch", function* () {
    const rustFolder = f.copy("pkg.rust-multi-object-no-patch-dep");

    const commands = [
      {
        dependencies: ["rust_pkg_b_fixture"],
        manager: "rust",
        path: "./pkg-a/",
        pkg: "rust_pkg_a_fixture",
        type: "patch",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "rust",
        path: "./pkg-b/",
        pkg: "rust_pkg_b_fixture",
        type: "patch",
        parents: [],
      },
    ];

    const config = {
      packages: {
        rust_pkg_a_fixture: {
          path: "./pkg-a/",
          manager: "rust",
        },
        rust_pkg_b_fixture: {
          path: "./pkg-b/",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });

    const modifiedAPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-a/Cargo.toml",
      "utf-8"
    );
    expect(modifiedAPKGVFile.contents).toBe(
      "[package]\n" +
        'name = "rust_pkg_a_fixture"\n' +
        'version = "0.5.1"\n' +
        "\n" +
        "[dependencies]\n" +
        'rust_pkg_b_fixture = { version = "0.8", path = "../rust_pkg_b_fixture" }\n'
    );

    const modifiedBPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-b/Cargo.toml",
      "utf-8"
    );
    expect(modifiedBPKGVFile.contents).toBe(
      "[package]\n" + 'name = "rust_pkg_b_fixture"\n' + 'version = "0.8.9"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });

  it("bumps multi rust toml as minor with object dep missing patch", function* () {
    const rustFolder = f.copy("pkg.rust-multi-object-no-patch-dep");

    const commands = [
      {
        dependencies: ["rust_pkg_b_fixture"],
        manager: "rust",
        path: "./pkg-a/",
        pkg: "rust_pkg_a_fixture",
        type: "minor",
        parents: [],
      },
      {
        dependencies: undefined,
        manager: "rust",
        path: "./pkg-b/",
        pkg: "rust_pkg_b_fixture",
        type: "minor",
        parents: [],
      },
    ];

    const config = {
      packages: {
        rust_pkg_a_fixture: {
          path: "./pkg-a/",
          manager: "rust",
        },
        rust_pkg_b_fixture: {
          path: "./pkg-b/",
          manager: "rust",
        },
      },
    };

    yield apply({ commands, config, cwd: rustFolder });

    const modifiedAPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-a/Cargo.toml",
      "utf-8"
    );
    expect(modifiedAPKGVFile.contents).toBe(
      "[package]\n" +
        'name = "rust_pkg_a_fixture"\n' +
        'version = "0.6.0"\n' +
        "\n" +
        "[dependencies]\n" +
        'rust_pkg_b_fixture = { version = "0.9", path = "../rust_pkg_b_fixture" }\n'
    );

    const modifiedBPKGVFile = yield toVFile.read(
      rustFolder + "/pkg-b/Cargo.toml",
      "utf-8"
    );
    expect(modifiedBPKGVFile.contents).toBe(
      "[package]\n" + 'name = "rust_pkg_b_fixture"\n' + 'version = "0.9.0"\n'
    );

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
    }).toMatchSnapshot();
  });
});

describe("list changes considering parents", () => {
  let restoreConsole;
  beforeEach(() => {
    restoreConsole = mockConsole(["log", "dir"]);
  });
  afterEach(() => {
    restoreConsole();
  });

  it("adds changes for dependency", () => {
    const assembledChanges = {
      releases: {
        all: {
          dependencies: undefined,
          manager: "javascript",
          path: undefined,
          pkg: "all",
          type: "minor",
        },
      },
    };

    const config = {
      packages: {
        "yarn-workspace-base-pkg-a": {
          path: "./packages/pkg-a/",
          manager: "javascript",
          dependencies: ["yarn-workspace-base-pkg-b", "all"],
        },
        "yarn-workspace-base-pkg-b": {
          path: "./packages/pkg-b/",
          manager: "javascript",
          dependencies: ["all"],
        },
        all: { version: true },
      },
    };

    const changes = changesConsideringParents({ assembledChanges, config });

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
      changes,
    }).toMatchSnapshot();
  });

  it("bumps higher due to dependency bump", () => {
    const assembledChanges = {
      releases: {
        "yarn-workspace-base-pkg-a": {
          dependencies: undefined,
          manager: "javascript",
          path: undefined,
          pkg: "all",
          type: "patch",
        },
        all: {
          dependencies: undefined,
          manager: "javascript",
          path: undefined,
          pkg: "all",
          type: "minor",
        },
      },
    };

    const config = {
      packages: {
        "yarn-workspace-base-pkg-a": {
          path: "./packages/pkg-a/",
          manager: "javascript",
          dependencies: ["yarn-workspace-base-pkg-b", "all"],
        },
        "yarn-workspace-base-pkg-b": {
          path: "./packages/pkg-b/",
          manager: "javascript",
          dependencies: ["all"],
        },
        all: { version: true },
      },
    };

    const changes = changesConsideringParents({ assembledChanges, config });

    expect({
      consoleLog: console.log.mock.calls,
      consoleDir: console.dir.mock.calls,
      changes,
    }).toMatchSnapshot();
  });
});

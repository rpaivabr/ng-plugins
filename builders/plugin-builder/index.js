"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_angular_1 = require("@angular-devkit/build-angular");
const architect_1 = require("@angular-devkit/architect");
const fs = require("fs");
const operators_1 = require("rxjs/operators");
let entryPointPath;
function buildPlugin(options, context, transforms = {}) {
    options['deleteOutputPath'] = false;
    validateOptions(options);
    const originalWebpackConfigurationFn = transforms.webpackConfiguration;
    transforms.webpackConfiguration = (config) => {
        patchWebpackConfig(config, options);
        return originalWebpackConfigurationFn ? originalWebpackConfigurationFn(config) : config;
    };
    const result = (0, build_angular_1.executeBrowserBuilder)(options, context, transforms);
    return result.pipe((0, operators_1.tap)(() => {
        patchEntryPoint('');
    }));
}
function patchEntryPoint(contents) {
    fs.writeFileSync(entryPointPath, contents);
}
function validateOptions(options) {
    const { pluginName, modulePath } = options;
    if (!modulePath) {
        throw Error('Please define modulePath!');
    }
    if (!pluginName) {
        throw Error('Please provide pluginName!');
    }
}
function patchWebpackConfig(config, options) {
    var _a;
    const { pluginName, sharedLibs } = options;
    // Make sure we are producing a single bundle
    delete config.entry.polyfills;
    delete config.entry['polyfills-es5'];
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;
    config.externals = {
        rxjs: 'rxjs',
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        '@angular/router': 'ng.router',
        tslib: 'tslib'
        // put here other common dependencies
    };
    if (sharedLibs) {
        config.externals = [config.externals];
        const sharedLibsArr = sharedLibs.split(',');
        sharedLibsArr.forEach(sharedLibName => {
            const factoryRegexp = new RegExp(`${sharedLibName}.ngfactory$`);
            config.externals[0][sharedLibName] = sharedLibName; // define external for code
            config.externals.push((_context, request, callback) => {
                if (factoryRegexp.test(request)) {
                    return callback(null, sharedLibName); // define external for factory
                }
                callback();
            });
        });
    }
    const ngCompilerPluginInstance = (_a = config === null || config === void 0 ? void 0 : config.plugins) === null || _a === void 0 ? void 0 : _a.find(x => x.constructor && x.constructor.name === 'AngularCompilerPlugin');
    if (ngCompilerPluginInstance) {
        ngCompilerPluginInstance._entryModule = options.modulePath;
    }
    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    if (config.entry) {
        entryPointPath = config.entry.main[0];
    }
    const [modulePath, moduleName] = options.modulePath.split('#');
    // const factoryPath = `${
    //   modulePath.includes('.') ? modulePath : `${modulePath}/${modulePath}`
    //   }.ngfactory`;
    const entryPointContents = `
    export * from '${modulePath}';
    import { ${moduleName} } from '${modulePath}';
    export default ${moduleName};
  `;
    patchEntryPoint(entryPointContents);
    if (config.output) {
        config.output.filename = `${pluginName}.js`;
        config.output.library = pluginName;
        config.output.libraryTarget = 'umd';
        // workaround to support bundle on nodejs
        config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    }
}
exports.default = (0, architect_1.createBuilder)(buildPlugin);

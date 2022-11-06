"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyExports = exports.updateExports = exports.computeExports = exports.getPackages = exports.getExports = void 0;
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = require("child_process");
var promises_1 = require("fs/promises");
var os_1 = require("os");
var path_1 = require("path");
var util_1 = require("util");
var args = process.argv.join(' ');
var TEST = args.includes('--test');
var PROFILE = TEST || args.includes('--profile');
var SILENT = args.includes('--silent');
var DRY = args.includes('--dry');
var permitted_extensions = ['ts', 'tsx', 'js', 'jsx'];
var matchExport = /@export.+['"]([\w\/_-]+)['"]/;
var exec = (0, util_1.promisify)(child_process_1.exec);
var __cwd = (0, child_process_1.execSync)("git rev-parse --show-toplevel").toString('utf8').trim();
function printExports(pkg) {
    if (SILENT)
        return;
    console.log('');
    console.log(chalk_1.default.yellow('exports'), '-', chalk_1.default.magenta(pkg.name));
    var exports = Object.entries(pkg.exports || {});
    for (var _i = 0, exports_1 = exports; _i < exports_1.length; _i++) {
        var _a = exports_1[_i], key = _a[0], value = _a[1];
        console.log('  ' + chalk_1.default.green((0, path_1.normalize)(key)), '->', (0, path_1.normalize)(value.default));
    }
}
function getExports() {
    return __awaiter(this, void 0, void 0, function () {
        var lines, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec("git grep \"@export\"", { cwd: __cwd })];
                case 1:
                    lines = (_a.sent()).stdout
                        .split(os_1.EOL).map(function (o) { return o.trim(); }).filter(function (o) { return o.length > 0; });
                    files = lines.map(function (o) {
                        var split = o.indexOf(':');
                        var _a = [o.slice(0, split), o.slice(split + 1)], filepath = _a[0], line = _a[1];
                        return { filepath: filepath, line: line };
                    })
                        .filter(function (o) { return permitted_extensions.includes(o.filepath.split('.').pop()); })
                        .filter(function (o) { return o.line.startsWith('/** @export'); });
                    return [2 /*return*/, files.filter(function (o) { return matchExport.test(o.line); }).map(function (o) {
                            var _a;
                            return __assign(__assign({}, o), { name: (_a = o.line.match(matchExport)) === null || _a === void 0 ? void 0 : _a[1] });
                        }).filter(function (o) { return o.name != undefined; })];
            }
        });
    });
}
exports.getExports = getExports;
function getPackages() {
    return __awaiter(this, void 0, void 0, function () {
        var lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec("git ls-files", { cwd: __cwd })];
                case 1:
                    lines = (_a.sent()).stdout
                        .split(os_1.EOL).map(function (o) { return o.trim(); }).filter(function (o) { return o.length > 0 && o.endsWith('package.json'); });
                    return [2 /*return*/, lines];
            }
        });
    });
}
exports.getPackages = getPackages;
function computeExports() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, packages, exports, __packages, __exports, packageExports;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getPackages(),
                        getExports(),
                    ])];
                case 1:
                    _a = _b.sent(), packages = _a[0], exports = _a[1];
                    __packages = packages
                        .map(function (o) {
                        return {
                            filepath: o,
                            dirname: (0, path_1.dirname)(o),
                            path: (0, path_1.resolve)(__cwd, o),
                        };
                    });
                    __exports = exports.map(function (o) {
                        var _a;
                        var __path = (0, path_1.resolve)(__cwd, o.filepath);
                        var packages = __packages.filter(function (v) { return o.filepath.startsWith(v.dirname); })
                            .map(function (v) {
                            return __assign(__assign({}, v), { dist: (0, path_1.relative)(v.dirname, o.filepath).length });
                        })
                            .sort(function (a, b) { return b.dist - a.dist; });
                        var pkg = (_a = packages.slice(-1)) === null || _a === void 0 ? void 0 : _a[0];
                        return __assign(__assign({}, o), { path: __path, package: pkg });
                    }).filter(function (o) { return o.package; });
                    packageExports = __packages.map(function (o) {
                        return __assign(__assign({}, o), { exports: Object.fromEntries(__exports
                                .filter(function (v) { return v.package.filepath === o.filepath; })
                                .map(function (v) { return [v.name, v.filepath]; })) });
                    }).filter(function (o) { return Object.keys(o.exports).length > 0; });
                    return [2 /*return*/, packageExports];
            }
        });
    });
}
exports.computeExports = computeExports;
function updateExports(packages) {
    if (packages === void 0) { packages = null; }
    return __awaiter(this, void 0, void 0, function () {
        var packageExports, _loop_1, _i, packageExports_1, pkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, computeExports()];
                case 1:
                    packageExports = _a.sent();
                    _loop_1 = function (pkg) {
                        var data, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _c = (_b = JSON).parse;
                                    return [4 /*yield*/, (0, promises_1.readFile)(pkg.path, 'utf8')];
                                case 1:
                                    data = _c.apply(_b, [_d.sent()]);
                                    if (packages !== null)
                                        if (!packages.includes(data.name))
                                            return [2 /*return*/, "continue"];
                                    data.exports = Object.fromEntries(Object.entries(pkg.exports).map(function (_a) {
                                        var name = _a[0], filepath = _a[1];
                                        return ['./' + name, { 'default': './' + (0, path_1.relative)(pkg.dirname, filepath) }];
                                    }));
                                    printExports(data);
                                    if (!!DRY) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, promises_1.writeFile)(pkg.path, JSON.stringify(data, null, 2))];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, packageExports_1 = packageExports;
                    _a.label = 2;
                case 2:
                    if (!(_i < packageExports_1.length)) return [3 /*break*/, 5];
                    pkg = packageExports_1[_i];
                    return [5 /*yield**/, _loop_1(pkg)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updateExports = updateExports;
// updateExports().then(console.log);
function DependencyExports(dependencies, watch) {
    if (watch === void 0) { watch = false; }
    updateExports(dependencies === '*' ? null : dependencies);
}
exports.DependencyExports = DependencyExports;

"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyExports = exports.Exports = void 0;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var chokidar_1 = __importDefault(require("chokidar"));
var readline_1 = require("readline");
var promises_1 = require("fs/promises");
var lodash_1 = require("lodash");
var json5_1 = __importDefault(require("json5"));
var chalk_1 = __importDefault(require("chalk"));
var args = process.argv.join(' ');
var TEST = args.includes('--test');
var PROFILE = TEST || args.includes('--profile');
var SILENT = args.includes('--silent');
if (!SILENT) {
    var finalLine_1 = false;
    process.on('exit', function () {
        if (!finalLine_1) {
            finalLine_1 = true;
            console.log('');
        }
    });
}
function printExports(pkg) {
    if (SILENT)
        return;
    console.log('');
    console.log(chalk_1.default.yellow('exports'), '-', chalk_1.default.magenta(pkg.name));
    var exports = Object.entries(pkg.exports || {});
    for (var _i = 0, exports_1 = exports; _i < exports_1.length; _i++) {
        var _a = exports_1[_i], key = _a[0], value = _a[1];
        console.log('  ' + chalk_1.default.green(key.slice(2)), '->', value.default.slice(2));
    }
}
function addExport(ctx, file, stats) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var cwd, exports, __package, input, rl, n, rl_1, rl_1_1, line, name_1, rel, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cwd = ctx.cwd, exports = ctx.exports, __package = ctx.__package;
                    input = (0, fs_1.createReadStream)(file);
                    rl = (0, readline_1.createInterface)({ input: input });
                    n = 0;
                    if (PROFILE)
                        console.time("addExport:loop (".concat(file, ")"));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    rl_1 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4 /*yield*/, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3 /*break*/, 5];
                    line = rl_1_1.value;
                    if (n++ > 10)
                        return [2 /*return*/];
                    if (line.startsWith('import')) {
                        n--;
                        return [3 /*break*/, 4];
                    }
                    if (line.startsWith('/**')) {
                        if (line.includes('@export')) {
                            name_1 = line.split("'").slice(1)[0];
                            rel = './' + (0, path_1.relative)((0, path_1.dirname)(__package), file);
                            exports[name_1 === '.' ? name_1 : './' + name_1] = {
                                default: rel,
                            };
                            return [2 /*return*/];
                        }
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(rl_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    if (PROFILE)
                        console.timeEnd("addExport:loop (".concat(file, ")"));
                    return [2 /*return*/];
            }
        });
    });
}
function getExports(ctx, dir, recursive) {
    if (recursive === void 0) { recursive = true; }
    return __awaiter(this, void 0, void 0, function () {
        var exports, dirs, files;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exports = ctx.exports;
                    if (!(recursive && dir.endsWith('src'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, getExports(ctx, (0, path_1.dirname)(dir), false)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (PROFILE)
                        console.time("getExports:readdir (".concat(dir, ")"));
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 3:
                    dirs = _a.sent();
                    if (PROFILE)
                        console.timeEnd("getExports:readdir (".concat(dir, ")"));
                    return [4 /*yield*/, Promise.all(dirs.map(function (subdir) { return __awaiter(_this, void 0, void 0, function () {
                            var res, stats;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (PROFILE)
                                            console.time(" - getExports:subdir (".concat(subdir, ")"));
                                        res = (0, path_1.resolve)(dir, subdir);
                                        return [4 /*yield*/, (0, promises_1.stat)(res)];
                                    case 1:
                                        stats = _a.sent();
                                        if (PROFILE)
                                            console.timeEnd(" - getExports:subdir (".concat(subdir, ")"));
                                        if (!(recursive && stats.isDirectory())) return [3 /*break*/, 3];
                                        return [4 /*yield*/, getExports(ctx, res)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3:
                                        if (!(0, path_1.extname)(res).startsWith('.ts')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, addExport(ctx, res, stats)];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, (0, path_1.basename)(res)];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    files = _a.sent();
                    // console.log(files);
                    return [2 /*return*/, exports];
            }
        });
    });
}
function getSource(cwd) {
    if ((0, fs_1.readdirSync)(cwd).includes('src')) {
        return cwd + '/src';
    }
    return cwd;
}
function updateExports(cwd) {
    var _this = this;
    var __package = (0, path_1.resolve)(cwd, 'package.json');
    getExports({
        cwd: cwd,
        __package: __package,
        exports: {},
    }, getSource(cwd)).then(function (exports) { return __awaiter(_this, void 0, void 0, function () {
        var pkg, _a, _b, originalExports;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = json5_1.default).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(__package, 'utf8')];
                case 1:
                    pkg = _b.apply(_a, [_c.sent()]);
                    originalExports = pkg.exports;
                    pkg.exports = exports;
                    if (Object.keys(pkg.exports).length === 0) {
                        delete pkg.exports;
                    }
                    if (!!(0, lodash_1.isEqual)(originalExports, pkg.exports)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.writeFile)(__package, JSON.stringify(pkg, null, 2))];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    printExports(pkg);
                    return [2 /*return*/];
            }
        });
    }); });
}
function watchExports(cwd) {
    var pending;
    var update = updateExports.bind(null, cwd);
    update();
    chokidar_1.default.watch([getSource(cwd), cwd + '/*']).on('all', function (event, path) {
        // console.log(path);
        if (pending)
            clearTimeout(pending);
        pending = setTimeout(update, 1000);
    });
}
function Exports(cwd, watch) {
    if (watch === void 0) { watch = false; }
    if (!cwd) {
        cwd = process.cwd();
    }
    if ((0, path_1.extname)(cwd)) {
        cwd = (0, path_1.dirname)(cwd);
    }
    // if (extname(cwd).includes('.j'))
    // console.log(cwd);
    if (watch) {
        return watchExports(cwd);
    }
    else {
        return updateExports(cwd);
    }
}
exports.Exports = Exports;
function getYarn() {
    return 'FORCE_COLOR=0 npx --location=project yarn ';
}
function DependencyExports(dependencies, watch) {
    if (watch === void 0) { watch = false; }
    if (PROFILE)
        console.time("DependencyExports");
    var _workspaces = (0, child_process_1.execSync)(getYarn() + 'workspaces info --json', {
        encoding: 'utf8'
    });
    if (_workspaces.startsWith('y')) {
        _workspaces = _workspaces.split('\n').filter(function (o) {
            if (o.startsWith(' ') || o.startsWith('{') || o.startsWith('}')) {
                return true;
            }
            return false;
        }).join('\n');
    }
    var workspaces = json5_1.default.parse(_workspaces);
    var found = new Set();
    if (dependencies === '*') {
        for (var key in workspaces) {
            if (key != 'exports') {
                found.add(key);
            }
        }
    }
    else {
        for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
            var dep = dependencies_1[_i];
            if (dep in workspaces) {
                if (dep != 'exports') {
                    found.add(dep);
                }
            }
        }
    }
    // const runs: Promise<any>[] = [];
    for (var _a = 0, _b = Array.from(found); _a < _b.length; _a++) {
        var dep = _b[_a];
        // runs.push((async () => {
        try {
            if (PROFILE)
                console.time("DependencyExports:run:execSync (".concat(dep, ")"));
            (0, child_process_1.execSync)(getYarn() + 'workspace ' + dep + ' ls', { encoding: 'utf8', stdio: 'pipe' });
            if (PROFILE)
                console.timeEnd("DependencyExports:run:execSync (".concat(dep, ")"));
        }
        catch (err) {
            if (PROFILE)
                console.timeEnd("DependencyExports:run:execSync (".concat(dep, ")"));
            var dir = err.stderr.split(/\r?\n/).find(function (o) { return o.startsWith('Directory'); });
            var loc = workspaces[dep].location;
            if (dir.includes(loc)) {
                var cwd = (0, path_1.resolve)(dir.split('y: ').pop());
                // console.log({ [dep]: cwd })
                if (watch) {
                    watchExports(cwd);
                }
                else {
                    updateExports(cwd);
                }
            }
        }
        // })());
    }
    // Promise.all(runs);
    if (PROFILE)
        console.timeEnd("DependencyExports");
}
exports.DependencyExports = DependencyExports;
// import chokidar from 'chokidar';
// import { createInterface } from 'readline';
// import { readdir, readFile, stat, writeFile } from 'fs/promises';
// import { execSync } from 'child_process';
// if (process.argv.includes('--watch')) {
//     let pending: any;
//     chokidar.watch(process.cwd() + '/src').on('all', (event, path) => {
//         // console.log(path);
//         if (pending) clearTimeout(pending);
//         pending = setTimeout(updateExports, 1000);
//     })
// } else {
//     updateExports(process.cwd());
// }

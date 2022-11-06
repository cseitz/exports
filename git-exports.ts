import chalk from 'chalk';
import { exec as _exec, execSync } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { EOL } from 'os';
import { basename, dirname, relative, resolve, normalize } from 'path';
import { promisify } from 'util';


const args = process.argv.join(' ');

const TEST = args.includes('--test');
const PROFILE = TEST || args.includes('--profile');
const SILENT = args.includes('--silent');
const DRY = args.includes('--dry');


const permitted_extensions = ['ts', 'tsx', 'js', 'jsx'];
const matchExport = /@export.+['"]([\w\/_-]+)['"]/;

const exec = promisify(_exec);
const __cwd = execSync(`git rev-parse --show-toplevel`).toString('utf8').trim();


function printExports(pkg: any) {
    if (SILENT) return;
    console.log('');
    console.log(chalk.yellow('exports'), '-', chalk.magenta(pkg.name));
    const exports: [string, { default: string }][] = Object.entries(pkg.exports || {});
    for (const [key, value] of exports) {
        console.log('  ' + chalk.green(normalize(key)), '->', normalize(value.default));
    }
}

export async function getExports() {
    const lines = (await exec(`git grep "@export"`, { cwd: __cwd })).stdout
        .split(EOL).map(o => o.trim()).filter(o => o.length > 0);

    const files = lines.map(o => {
        const split = o.indexOf(':');
        const [filepath, line] = [o.slice(0, split), o.slice(split + 1)];
        return { filepath, line }
    })
        .filter(o => permitted_extensions.includes(o.filepath.split('.').pop()!))
        .filter(o => o.line.startsWith('/** @export'));

    return files.filter(o => matchExport.test(o.line)).map(o => {
        return {
            ...o,
            name: o.line.match(matchExport)?.[1]!,
        }
    }).filter(o => o.name != undefined)
}

export async function getPackages() {
    const lines = (await exec(`git ls-files`, { cwd: __cwd })).stdout
        .split(EOL).map(o => o.trim()).filter(o => o.length > 0 && o.endsWith('package.json'));

    return lines;
}


export async function computeExports() {
    const [packages, exports] = await Promise.all([
        getPackages(),
        getExports(),
    ]);

    const __packages = packages
        .map(o => {
            return {
                filepath: o,
                dirname: dirname(o),
                path: resolve(__cwd, o),
            }
        });

    const __exports = exports.map(o => {
        const __path = resolve(__cwd, o.filepath);
        const packages = __packages.filter(v => o.filepath.startsWith(v.dirname))
            .map(v => {
                return {
                    ...v,
                    dist: relative(v.dirname, o.filepath).length
                }
            })
            .sort((a, b) => b.dist - a.dist);
        const pkg = packages.slice(-1)?.[0];
        return {
            ...o,
            path: __path,
            package: pkg,
        }
    }).filter(o => o.package);

    const packageExports = __packages.map(o => {
        return {
            ...o,
            exports: Object.fromEntries(__exports
                .filter(v => v.package.filepath === o.filepath)
                .map(v => [v.name, v.filepath])
            ),
        }
    }).filter(o => Object.keys(o.exports).length > 0);

    return packageExports;
}

export async function updateExports(packages: string[] | null = null) {
    const packageExports = await computeExports();

    for (const pkg of packageExports) {
        const data = JSON.parse(await readFile(pkg.path, 'utf8'));
        if (packages !== null) if (!packages.includes(data.name)) continue;
        data.exports = Object.fromEntries(Object.entries(pkg.exports).map(([name, filepath]) => {
            return ['./' + name, { 'default': './' + relative(pkg.dirname, filepath)}]
        }));
        printExports(data);
        if (!DRY) {
            await writeFile(pkg.path, JSON.stringify(data, null, 2));
        }
    }
}

// updateExports().then(console.log);

export function DependencyExports(dependencies: string[] | '*', watch = false) {
    updateExports(dependencies === '*' ? null : dependencies);
}

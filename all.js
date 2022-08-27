const { execSync } = require('child_process');
const { existsSync } = require('fs');

if (!existsSync(__dirname + '/dist')) {
    throw new Error('Exports is not yet built. Run `yarn workspace exports build`');
}

require(__dirname + '/dist').DependencyExports('*');
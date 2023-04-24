const chalk = require('chalk');
const semver = require('semver');
const fs = require('fs');

const { exec } = require('child_process');
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);


function chalkLog(color, message) {
  console.log(chalk[color](message));
}


// function nvmLs() {
//     return exec('nvm --version');
//   }

function nvmLs() {
    return new Promise((resolve, reject) => {
      exec('nvm ls', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stderr) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      });
    });
  }
 async function loadNodeVersionFromPackageJson() {
//   chalkLog('green', 'Loading...  loadNodeVersionFromPackageJson from ~/.zshrc');
  const packageJsonPath = `${process.cwd()}/package.json`;

  // Check if package.json file exists.
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    const nodeVersion = packageJson.engines?.node;

    if (!nodeVersion) {
      chalkLog('yellow', 'package.json has no .engines.node version defined');
      return;
    }

    const validRange = semver.validRange(nodeVersion);

    if (!validRange) {
      chalkLog('yellow', `Invalid node version range: ${nodeVersion}`);
      return;
    }

    const versions = Object.keys(await nvmLs());
    console.log(versions)
    let matchedVersion = null;

    for (const version of versions) {
      if (semver.satisfies(version, validRange)) {
        matchedVersion = version;
        break;
      }
    }

    if (matchedVersion) {
      chalkLog('green', `This directory has a package.json file with .engines.node (${nodeVersion})`);
      nvm_use(matchedVersion);
      // Record modification of node version.
      process.env.NODE_VERSION_MODIFIED = true;
      return;
    }

    chalkLog('yellow', `No matching node version found for range: ${nodeVersion}`);
    return;
  }

  if (process.env.NODE_VERSION_MODIFIED) {
    // Revert to default node version.
    chalkLog('green', 'Reverting to default node version.');
    nvm_use('default');
    process.env.NODE_VERSION_MODIFIED = false;
  }
}
loadNodeVersionFromPackageJson();
module.exports=loadNodeVersionFromPackageJson;
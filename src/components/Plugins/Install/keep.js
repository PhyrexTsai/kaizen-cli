const path = require('path');
const fsx = require('fs-extra');
const ExecuteCommand = require('../../../lib/ExecuteCommand');

module.exports = async function() {
  await ExecuteCommand('npm install @keep-network/tbtc.js');
  
  // update user's kaizen config
  const configPath = path.resolve('./', 'kaizen.json');
  const userConfig = fsx.existsSync(configPath) ? fsx.readJsonSync(configPath) : {}; 
  
  if(!userConfig.plugins) {
    userConfig.plugins = [];
  }

  if(userConfig.plugins.includes('keep') === false) {
    userConfig.plugins.push('keep');
  }

  fsx.outputJsonSync(path.resolve('./', 'kaizen.json'), userConfig);
}

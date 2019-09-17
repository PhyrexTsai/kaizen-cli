const Table = require('cli-table');
const Log = require('../../../lib/Log');
const Spinner = require('../../../lib/Spinner');
const ethereumHandler = require('./ethereum.js');
const wanchainHandler = require('./wanchain.js');
require('colors');

function builder(yargs) {
  return yargs
    .option('blockchain', {
      alias: 'b',
      type: 'string',
      describe: 'Blockchain'
    })
    .option('network', {
      alias: 'n',
      type: 'string',
      describe: 'Network of the blockchain'
    })
    .option('txhash', {
      alias: 't',
      type: 'string',
      describe: 'Address of the balance'
    })
    .example('kaizen blockchains tx --blockchain ethereum --network 1 --txhash 0x8457c253451ba31d1292d04083aa47d94b33017bd5ff75794d3381c708c23467')
    .demandOption(['blockchain', 'network', 'txhash'], 'Please enter the information to get the tx result');
}

async function handler(argv) {
  try {
    const { blockchain, network, txhash } = argv;
    let txresult = '';
    let table;
    
    switch (blockchain) {
      case 'ethereum':
        Spinner.start();
        txresult = await ethereumHandler(network, txhash);
        Spinner.stop();
        Log.SuccessLog(`The txhash ${txhash} information:`);
        table = new Table({
          head: ['Block Number'.green, 'From'.green, 'To'.green, 'Value'.green]
        });
        table.push([txresult.blockNumber, txresult.from, txresult.to, txresult.value]);
        console.log(table.toString());
        break;
      case 'wanchain':
        Spinner.start();
        txresult = await wanchainHandler(network, txhash);
        Spinner.stop();
        Log.SuccessLog(`The txhash ${txhash} information:`);
        table = new Table({
          head: ['Block Number'.green, 'From'.green, 'To'.green, 'Value'.green]
        });
        table.push([txresult.blockNumber, txresult.from, txresult.to, txresult.value]);
        console.log(table.toString());
        break;
      default:
        Log.NormalLog('blockchain not support yet');
    }

  } catch (error) {
    Spinner.stop();
    Log.ErrorLog('something went wrong!');
    console.error(error);
  }
}

module.exports = function (yargs) {
  const command = 'tx';
  const commandDescription = 'Get transaction hash information';
  yargs.command(command, commandDescription, builder, handler);
}

var program  = require('commander')
  , serve    = require('./pubsub/broker');

program
  .version('0.0.1')
  .option('--quiet', 'verbose')
  .parse(process.argv);

serve(program.quiet);
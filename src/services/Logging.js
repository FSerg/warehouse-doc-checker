// hi.js
import bunyan from 'bunyan';

let loglevel = 'debug';
if (process.env.NODE_ENV === 'production') {
  loglevel = 'error';
}

const log = bunyan.createLogger({
  name: 'Eatery',
  stream: process.stdout,
  level: loglevel
});
export default log;

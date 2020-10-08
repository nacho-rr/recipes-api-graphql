import 'reflect-metadata';

import { startServer } from './server';
import { connect } from './config/typeorm';

async function main() {
  connect();
  const app = await startServer();
  app.listen(3000, () => {
    console.log('Server on port', 3000)
  });
};

main();
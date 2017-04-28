'use strict';

const Hapi = require('hapi');
const DtracePlugin = require('../');


const server = new Hapi.Server();
server.connection({ port: 3000 });
server.register(DtracePlugin);

server.route({ method: 'get', path: '/', handler: (request, reply) => {
  reply('ok');
}});

server.start((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`server started at http://localhost:${server.info.port}`);
});

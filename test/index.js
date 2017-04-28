'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Plugin = require('../');


// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('hapi-dtrace', () => {
  it('can be registered with hapi', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(Plugin, (err) => {
      expect(err).to.not.exist();
      done();
    });
  });
});

describe('dtrace-probes', () => {
  it('do not interfere with the normal request lifecycle', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(Plugin, (err) => {
      expect(err).to.not.exist();

      server.route({ method: 'get', path: '/', handler: (request, reply) => {
        reply('ok');
      }});

      server.inject('/', (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});

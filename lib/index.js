'use strict';

// dtrace-provider loaded in registration
const Package = require('../package.json');


const internals = {
  //             request_id, method, path, headers
  probeParams: ['char *', 'char *', 'char *', 'json'],
  probeDetails: [
    {
      name: 'request',
      event: 'onRequest'
    },
    {
      name: 'pre-auth',
      event: 'onPreAuth'
    },
    {
      name: 'post-auth',
      event: 'onPostAuth'
    },
    {
      name: 'pre-handler',
      event: 'onPreHandler'
    },
    {
      name: 'post-handler',
      event: 'onPostHandler'
    },
    {
      name: 'pre-response',
      event: 'onPreResponse'
    }
  ]
};


module.exports = function (server, options, next) {
  try {
    const DTraceProvider = require('dtrace-provider');
    const provider = DTraceProvider.createDTraceProvider('hapi');
    internals.addProbes(server, provider);
    provider.enable();
  }
  catch (err) {
    return next(err);
  }

  next();
};

module.exports.attributes = {
  once: true,
  pkg: Package
};


// returns request_id, method, path, headers
internals.requestProbe = function (request, reply) {
  return [request.id, request.method, request.path, JSON.stringify(request.headers)];
};

internals.requestHandler = function (probe) {
  return (request, reply) => {
    probe.fire(internals.requestProbe, request, reply);
    reply.continue();
  };
};


internals.addProbes = function (server, provider) {
  internals.probeDetails.forEach((probeDetail) => {
    const args = [].concat([probeDetail.name], internals.probeParams);
    const probe = provider.addProbe.apply(provider, args);

    server.ext(probeDetail.event, internals.requestHandler(probe));
  });
};

# hapi-dtrace
Plugin for hapi that adds dtrace probes to the request lifecycle events.

## Usage

Register the plugin with a hapi server:

```js
const Hapi = require('hapi');
const HapiDTrace = require('hapi-dtrace');


const server = new Hapi.Server();
server.connection({ port: 3000 });
server.register(HapiDTrace);
```

Start the server and run dtrace to list the available probes in the hapi provider:

```
$ dtrace -l -P hapi*
ID   PROVIDER            MODULE                          FUNCTION NAME
4514  hapi67987   mod-0x104801970                           request request
4515  hapi67987   mod-0x104801970                          pre-auth pre-auth
4516  hapi67987   mod-0x104801970                         post-auth post-auth
4517  hapi67987   mod-0x104801970                       pre-handler pre-handler
4518  hapi67987   mod-0x104801970                      post-handler post-handler
4519  hapi67987   mod-0x104801970                      pre-response pre-response
```

## Available Probes

| Probe Name | Request Event | Arguments |
--------------------------------------------
| request | onRequest | (request.id, method, path, headers) |
| pre-auth | onPreAuth | (request.id, method, path, headers) |


## Example

In the /example folder is a _server.js_ that you can run that registers the plugin. After the server is running execute the `.d` script with the appropriate permissions. Next, use curl or a browser to make requests to the server and observe the request information logged from dtrace.

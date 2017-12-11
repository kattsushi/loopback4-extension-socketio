// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Component,
  ProviderMap,
  Server,
  CoreBindings,
  Application,
} from '@loopback/core';
import {inject, Constructor} from '@loopback/context';
import {SocketioBindings} from './keys';
import {SocketioServer} from './socketio.server';
import {SocketioSequence} from './socketio.sequence';
import {SocketioConfig} from './types';
import {ServerProvider} from './providers/server.provider';
/**
 * @class Socket.io Component
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Socketio Component for LoopBack 4.
 */
export class SocketioComponent implements Component {
  /**
   * Export SocketioProviders
   */
  providers: ProviderMap = {
    [SocketioBindings.SOCKETIO_SERVER]: ServerProvider,
  };
  /**
   * Export Socket.io Server
   */
  servers: {[name: string]: Constructor<Server>} = {
    SocketioServer,
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(SocketioBindings.CONFIG) config: SocketioConfig,
  ) {
    // Set default configuration for this component
    config = Object.assign({}, config, {
      host: '127.0.0.1',
      port: 3000,
    });
    // Bind host, port, and sequence
    app.bind(SocketioBindings.HOST).to(config.host);
    app.bind(SocketioBindings.PORT).to(config.port);
    if (config.sequence) {
      app.bind(SocketioBindings.SOCKETIO_SEQUENCE).toClass(config.sequence);
    } else {
      app.bind(SocketioBindings.SOCKETIO_SEQUENCE).toClass(SocketioSequence);
    }
  }
}

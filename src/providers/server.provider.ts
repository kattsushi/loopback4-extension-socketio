// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
//import {Provider} from '@loopback/context';
import * as socketio from 'socket.io';
import {createServer} from 'http';
/**
 * @class ServerProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
export class ServerProvider {
  private server = createServer();
  private io = socketio(this.server);
  public value() {
    return this.io;
  }
}

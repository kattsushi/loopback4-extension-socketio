// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {CoreBindings} from '@loopback/core';
/**
 * Binding keys used by this component.
 */
export namespace SocketioBindings {
  export const SOCKETIO_SERVER = 'socketio.server';
  export const SOCKETIO_SEQUENCE = 'socketio.sequence';
  export const SOCKETIO_CONTROLLER = 'socketio.controller';
  export const SOCKETIO_METHOD = 'socketio.method';
  export const GRPC_METHOD_NAME = 'socketio.method.name';
  export const CONTEXT = 'socketio.context';
  export const HOST = 'socketio.host';
  export const PORT = 'socketio.port';
  export const CONFIG = `${CoreBindings.APPLICATION_CONFIG}#socketio`;
  export const LB_SOCKETIO_HANDLER = 'loopback:socketio-service:handler';
}

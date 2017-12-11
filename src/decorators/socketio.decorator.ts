// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Reflector} from '@loopback/context';
import {SocketioBindings} from '../keys';
/**
 * @function gRPCService
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @param params
 * @license MIT
 * @description This decorator provides a way to
 * configure SocketIO Micro Services within LoopBack 4
 *
 * Example of usage:
 *
 * myproject/controllers/Greeter.ts
 *
 * class Greeter {
 *   @socketio('myEvent')
 *   public myEvent(data , socket) {
 *      socket.emit(data, {message: 'Hello ' + data.name});
 *   }
 * }
 */
export function socketio(event: string) {
  return function(target: object, propertyKey: string) {
    Reflector.defineMetadata(
      SocketioBindings.LB_SOCKETIO_HANDLER,
      event,
      target,
      propertyKey,
    );
  };
}

// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {socketio} from '../../..';
import {SocketioBindings} from '../../../src/keys';
import {Reflector} from '@loopback/context';

describe('@rpc decorator', () => {
  it('defines reflection metadata for rpc method', () => {
    class Greeter /*implements GreeterInterface*/ {
      @socketio('sayHello')
      sayHello(request) {
        return {message: `hello ${request.name}`};
      }
      Helper(): boolean {
        return true;
      }
    }
    const flags: {[key: string]: boolean} = {};
    const proto = Greeter.prototype;
    const controllerMethods: string[] = Object.getOwnPropertyNames(
      proto,
    ).filter(key => key !== 'constructor' && typeof proto[key] === 'function');
    for (const methodName of controllerMethods) {
      const enabled: boolean = Reflector.getMetadata(
        SocketioBindings.LB_SOCKETIO_HANDLER,
        proto,
        methodName,
      );
      if (enabled) flags[methodName] = enabled;
    }
    expect(flags).to.deepEqual({sayHello: true});
  });
});

// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {Application} from '@loopback/core';
import {SocketioConfig} from '../../';
import {socketio} from '../../src/decorators/socketio.decorator';
import io from 'socket.io-client';
import {SocketioComponent, SocketioBindings} from '../..';

describe('SocketioComponent', () => {
  // LoopBack GRPC Service
  it('creates a socketio service', async () => {
    // Define Greeter Service Implementation
    class Greeter /*implements GreeterInterface*/ {
      // Tell LoopBack that this is a Service RPC implementation
      @socketio('sayHello')
      sayHello(request) {
        const reply = {message: 'Hello ' + request.name};
        return reply;
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(Greeter);
    await app.start();
    // Make Socketio Client Call
    const result = await asyncCall({
      client: getSocketioClient(app),
      method: 'sayHello',
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World');
    await app.stop();
  });
  // LoopBack GRPC Service
  // it('creates a socketio service with custom sequence', async () => {
  //   // Define Greeter Service Implementation
  //   class Greeter /*implements GreeterInterface*/ {
  //     // Tell LoopBack that this is a Service RPC implementation
  //     @socketio('sayHello')
  //     sayHello(request) {
  //       const reply = {message: 'Hello ' + request.name};
  //       return reply;
  //     }
  //   }
  //   class MySequence implements SocketioSequenceInterface {
  //     constructor(
  //       @inject(SocketioBindings.CONTEXT) protected context,
  //       @inject(SocketioBindings.SOCKETIO_METHOD) protected method,
  //     ) {}
  //     async unaryCall(call: any): Promise<any> {
  //       // Do something before call
  //       const reply = await this.method(call.request);
  //       reply.message += ' Sequenced';
  //       // Do something after call
  //       return reply;
  //     }
  //   }
  //   // Load LoopBack Application
  //   const app: Application = givenApplication(MySequence);
  //   app.controller(Greeter);
  //   await app.start();
  //   // Make Socket.io Client Call
  //   const result = await asyncCall({
  //     client: getSocketioClient(app),
  //     method: 'sayHello',
  //     data: {name: 'World'},
  //   });
  //   expect(result.message).to.eql('Hello World Sequenced');
  //   await app.stop();
  // });
});
/**
 * Returns Socketio Enabled Application
 */
function givenApplication(sequence?): Application {
  const socketioConfig: SocketioConfig = {
    port: 0,
  };
  if (sequence) {
    socketioConfig.sequence = sequence;
  }
  return new Application({
    components: [SocketioComponent],
    socketio: socketioConfig,
  });
}
/**
 * Returns Socket IOe Client
 */
function getSocketioClient(app: Application) {
  const socket = io(`${app.getSync(SocketioBindings.HOST)}`);
  return socket;
}
/**
 * Callback to Promise Wrapper
 */
async function asyncCall(input): Promise<any> {
  return new Promise<any>((resolve, reject) =>
    input.client[input.method](input.data, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    }),
  );
}

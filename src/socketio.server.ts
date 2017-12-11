import {Application, CoreBindings, Server} from '@loopback/core';
import {Context, inject, Reflector} from '@loopback/context';
import {SocketioBindings} from './keys';
import {SocketioSequence} from './socketio.sequence';
const debug = require('debug')('loopback:grpc:server');
/**
 * @class GrpcServer
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description
 * This Class provides a LoopBack Server implementing GRPC
 */
export class SocketioServer extends Context implements Server {
  /**
   * @memberof Socketioerver
   * Creates an instance of SocketioServer.
   *
   * @param {Application} app The application instance (injected via
   * CoreBindings.APPLICATION_INSTANCE).
   * @param {Server} server The actual GRPC Server module (injected via
   * SocketioBindings.SOCKETIO_SERVER).
   * @param {SocketioserverConfig=} options The configuration options (injected via
   * SocketioBindings.CONFIG).
   *
   */
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) protected app: Application,
    @inject(SocketioBindings.SOCKETIO_SERVER) protected server: any,
    @inject(SocketioBindings.HOST) protected host: string,
    @inject(SocketioBindings.PORT) protected port: string,
  ) {
    super(app);
    for (const b of this.find('controllers.*')) {
      const controllerName = b.key.replace(/^controllers\./, '');
      const ctor = b.valueConstructor;
      if (!ctor) {
        throw new Error(
          `The controller ${controllerName} was not bound via .toClass()`,
        );
      }
      this._setupControllerMethods(ctor.prototype);
    }
  }

  async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.bind(`${this.host}:${this.port}`);
      this.server.start();
      resolve();
    });
  }

  async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.forceShutdown();
      resolve();
    });
  }

  private _setupControllerMethods(prototype: Function) {
    const handlers: {[key: string]: any} = {};
    const className = prototype.constructor.name || '<UnknownClass>';
    // If this class is defined within the proto file
    // then we search for rpc methods and register handlers.
    // if (proto[className] && proto[className].service) {
    const controllerMethods = Object.getOwnPropertyNames(prototype).filter(
      key => key !== 'constructor' && typeof prototype[key] === 'function',
    );
    for (const methodName of controllerMethods) {
      const fullName = `${className}.${methodName}`;
      const enabled: boolean = Reflector.getMetadata(
        SocketioBindings.LB_SOCKETIO_HANDLER,
        prototype,
        methodName,
      );
      if (!enabled) {
        return debug(`  skipping ${fullName} - socketio is not enabled`);
      }
      handlers[methodName] = this.setupSocketioCall(prototype, methodName);
    }
    // Regster SocketIO Service
    this.server.addService(this[className].service, handlers);
    // }
  }

  /**
   * @method setupGrpcCall
   * @author Miroslav Bajtos
   * @author Jonathan Casarrubias
   * @license MIT
   * @param prototype
   * @param methodName
   */
  private setupSocketioCall(prototype, methodName: string): any {
    const context: Context = this;
    return function(call: any, callback: (err, value?) => void) {
      handleUnary().then(
        result => callback(null, result),
        error => {
          debugger;
          callback(error);
        },
      );
      async function handleUnary(): Promise<any> {
        context.bind(SocketioBindings.CONTEXT).to(context);
        context
          .bind(SocketioBindings.SOCKETIO_METHOD)
          .to(prototype[methodName]);
        const sequence: SocketioSequence = await context.get(
          SocketioBindings.SOCKETIO_SEQUENCE,
        );
        return sequence.unaryCall(call);
      }
    };
  }
}

import {inject} from '@loopback/context';
import {SocketioBindings} from './keys';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface SocketioSequenceInterface {
  unaryCall(request: any /*grpc.ServerUnaryCall*/): Promise<any>;
}
/**
 * @class GrpcSequence
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC Sequence
 */
export class SocketioSequence /*implements GrpcSequenceInterface*/ {
  constructor(
    @inject(SocketioBindings.CONTEXT) protected context,
    @inject(SocketioBindings.SOCKETIO_METHOD) protected method,
  ) {}

  async unaryCall(call: any): Promise<any> {
    // Do something before call
    const reply = await this.method(call.request);
    // Do something after call
    return reply;
  }
}

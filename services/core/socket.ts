import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let ioInstance: Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export const initializeSocketIO = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  ioInstance = io;
};

export const ioConfig = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User Connected:${socket.id}`);
    console.log('connected to main room');
  });
};

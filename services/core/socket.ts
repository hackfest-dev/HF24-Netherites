import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const ioConfig = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User Connected:${socket.id}`);
    console.log('connected to main room');
  });
  // const search = io.of('/search');
  // search.on('connection', (socket: Socket) => {
  //   console.log('Connected to search room');
  // });

  // io.on('disconnect', (socket: Socket) => {
  //   console.log('disconnected from main room');
  // });
};

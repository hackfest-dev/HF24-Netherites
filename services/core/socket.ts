import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const ioConfig = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log('Connected to main room');

    // Optionally, you can join the main room here if needed
    socket.join('main room');
  });
};

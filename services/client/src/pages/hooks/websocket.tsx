import { useState, useEffect } from 'react';
import * as WebSocket from 'websocket';

function WebSocketClient() {

    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

    useEffect(() => {

        const client = new WebSocket.client();
        const url = 'ws://localhost:3000'; // Your WebSocket server URL

        client.on('connect', (connection: WebSocket.connection) => {
            console.log('WebSocket client connected');
            setConnectionStatus('Connected');

            connection.on('message', (message: WebSocket.IMessage) => {
                if (message.type === 'utf8') {

                    setReceivedMessages((prevMessages) => [
                        ...prevMessages,
                        message.utf8Data as string,
                    ]);
                }
            });

            connection.sendUTF('Hello, server!');
        });

        client.on('connectFailed', (error: Error) => {
            console.error('WebSocket connection failed:', error);
            setConnectionStatus('Connection Failed');
        });

        return () => {
            if (client) {
                client.abort();
            }
        };
    }, []);

    return (
        <div>
            <h1>WebSocket Client</h1>
            <p>Status: {connectionStatus}</p>
            <h2>Received Messages:</h2>
            <ul>
                {receivedMessages.map((message: string, index: number) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
}

export default WebSocketClient;

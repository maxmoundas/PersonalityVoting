import { useEffect } from 'react';
import socket from '../socket';

export const useSocket = (eventName, handler) => {
    useEffect(() => {
        socket.on(eventName, handler);

        return () => {
            socket.off(eventName, handler);
        };
    }, [eventName, handler]);

    return socket;
};

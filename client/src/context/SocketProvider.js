import { createContext, useContext, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [data, setData] = useState({});

    useSocket('eventName', (newData) => {
        setData(newData);
    });

    return <SocketContext.Provider value={data}>{children}</SocketContext.Provider>;
};

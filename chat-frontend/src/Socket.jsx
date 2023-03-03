import React, {useContext, useMemo} from "react";
import {io} from "socket.io-client";

const SocketContext = React.createContext(null);

export const useSocket =() =>{
    return React.useContext(SocketContext)
};

export const SocketProvider =(props) =>{
    const socket = useMemo(()=>
        io('http://localhost:5000'), 
        [])


        return (
            <SocketContext.Provider value={socket}>
                {props.children}
            </SocketContext.Provider>
        )
};
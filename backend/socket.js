import {Server} from 'socket.io';
let io;

module.exports = { 
    init: httpServer=>{
        io = new Server(httpServer);
        return io;
    },
    getIO:()=>{
        if(!io){
            throw new Error('Socket io is not available');
        }
        return io;
    }

}
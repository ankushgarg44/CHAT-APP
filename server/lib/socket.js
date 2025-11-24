// Socket.io instance - will be initialized by server.js
export let io;

// Map of userId to socket.id
export const userSocketMap = {};

// Function to initialize the socket instance
export function initializeSocket(ioInstance) {
    io = ioInstance;
}


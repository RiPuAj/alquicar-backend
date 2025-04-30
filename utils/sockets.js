export const disconnectSocket = (socket, message) => {
    socket.emit('error',{ message: message });
    socket.disconnect(true);
}
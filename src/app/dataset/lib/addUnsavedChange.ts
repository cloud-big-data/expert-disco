const addUnsavedChange = (
  change: Record<string, any>,
  socket?: SocketIOClient.Socket,
) => {
  socket?.emit('addUnsavedChange', change);
};

export default addUnsavedChange;

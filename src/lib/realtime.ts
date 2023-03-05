import ioClient from 'socket.io-client';
const ENDPOINT = 'http://192.168.178.24:3000';

const socket = ioClient(ENDPOINT);

export const io = socket;

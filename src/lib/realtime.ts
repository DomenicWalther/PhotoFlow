import ioClient from 'socket.io-client';
import getLocalIP from './utils/getLocalIP';
const ENDPOINT = getLocalIP() + ':3000';

const socket = ioClient(ENDPOINT);

export const io = socket;

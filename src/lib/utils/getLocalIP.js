import os from 'os';

const n = os.networkInterfaces();

function getLocalIP() {
	for (var k in n) {
		var inter = n[k];
		for (var j in inter) {
			if (inter[j].family === 'IPv4' && !inter[j].internal) return inter[j].address;
		}
	}
}

export default getLocalIP;

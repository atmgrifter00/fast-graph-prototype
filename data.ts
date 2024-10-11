import { tableFromArrays, tableToIPC } from 'apache-arrow';

export const CHANNELS = 4;
export const SAMPLE_SIZE = 20000;

const sampleArrayBuffer = new ArrayBuffer(4*CHANNELS*SAMPLE_SIZE);
const indexArrayBuffer = new ArrayBuffer(4*CHANNELS*SAMPLE_SIZE);
const sampleBuffer = new Float32Array(sampleArrayBuffer);
const indexBuffer = new Int32Array(indexArrayBuffer);

export const tableIPCData = ((): ArrayBuffer[] => {
	const data = [];
	for (let j = 0; j < 4; j++) {
		const getIPCTable = () => {
			for (let i = 0; i < CHANNELS; i++) {
				for (let x = 0; x < SAMPLE_SIZE; x++) {
					sampleBuffer[i*SAMPLE_SIZE + x] = Math.sin(x / 100) * Math.random() * 3 + (i * 3);
					indexBuffer[i*SAMPLE_SIZE + x] = x;
				}
			}
		
			return tableToIPC(tableFromArrays({
				sample: sampleBuffer,
				index: indexBuffer
			}), 'stream').buffer;
		};
		data.push(getIPCTable());
	}
	return data;
})();
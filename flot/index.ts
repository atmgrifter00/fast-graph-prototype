import { tableFromIPC } from 'apache-arrow';
import { tableIPCData, CHANNELS, SAMPLE_SIZE } from '../data';

const flotElement = document.getElementById('placeholder')!;
const d1 = [];
for (var i = 0; i < 14; i += 0.5) {
	d1.push([i, Math.sin(i)]);
}

const d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

// A null signifies separate line segments

const d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
const flot = $.plot(flotElement, [], { yaxis: { min: -3, max: 12, autoScale: 'none', }, xaxis: { min: 0, max: SAMPLE_SIZE }, zoom: { interactive: true }, pan: { interactive: true } });
const timeElement = document.getElementById('time_ms')!;
const dataPerSecElement = document.getElementById('data_per_sec')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;
let totalData = 0;
let currentTime = 0;
let previousTime = 0;

window.setInterval(() => {
	const plotData = tableIPCData[plotIndex];
	const table = tableFromIPC(plotData);
	const yData = table.data[0]?.children[0]?.values as Float32Array;
	const flotData = (() => {
		const data = [];
		for (let i = 0; i < CHANNELS ; i++) {
			data.push({
				flatdata: true,
				data: Array.from(yData).slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE)
			});
		}
		return data;
	})();
    currentTime = performance.now();
	previousTime = previousTime === 0 ? currentTime : previousTime;
	flot.setData(flotData);
	flot.setupGrid();
	flot.draw();
	totalData += SAMPLE_SIZE * CHANNELS;
	totalPlotTime += performance.now() - currentTime;
    totalRenders++;
    timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
	if (currentTime - previousTime > 1000) {
		dataPerSecElement.innerText = `Data per second: ${(totalData / (totalPlotTime / 1000)).toFixed(2)}`;
		previousTime = currentTime;
	}
	plotIndex = (plotIndex + 1) % 4;
}, 0);


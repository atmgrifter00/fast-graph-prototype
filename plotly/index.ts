import * as plotly from 'plotly.js-strict-dist-min';
import { tableFromIPC } from 'apache-arrow';
import { tableIPCData, CHANNELS, SAMPLE_SIZE } from '../data';

const tester = document.getElementById('tester');
const timeElement = document.getElementById('time_ms')!;
const dataPerSecElement = document.getElementById('data_per_sec')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;
let totalData = 0;
let previousTime = 0;


window.setInterval(() => {
	const plotData = tableIPCData[plotIndex];
	const table = tableFromIPC(plotData);
	const yData = table.data[0]?.children[0]?.values as Float32Array;
	const xData = table.data[0]?.children[1]?.values as Int32Array;
	const plotlyData = (() => {
		const data = [];
		for (let i = 0; i < CHANNELS; i++) {
			data.push({
				mode: 'lines',
				line: { width: 1 },
				x: xData.slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE),
				y: yData.slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE)
			});
		}
		return data;
	})();
    const currentTime = performance.now();
	plotly.newPlot( tester, 
		plotlyData, {
			margin: { t: 0 },
			yaxis: { autorange: false,
				range: [-3, 12]
			 },
			 xaxis: {
				autorange: true
			 }
		}
	);
	totalData += SAMPLE_SIZE * CHANNELS;
    totalPlotTime += performance.now() - currentTime;
    totalRenders++;
    timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
	previousTime = previousTime === 0 ? currentTime : previousTime;
	if (currentTime - previousTime > 1000) {
		dataPerSecElement.innerText = `Data per second: ${(totalData / (totalPlotTime / 1000)).toFixed(2)}`;
		previousTime = currentTime;
	}
	plotIndex = (plotIndex + 1) % 4;
}, 30);


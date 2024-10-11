import * as plotly from 'plotly.js-strict-dist-min';
import { tableFromIPC } from 'apache-arrow';
import { tableIPCData, CHANNELS, SAMPLE_SIZE } from '../data';

const tester = document.getElementById('tester');
const timeElement = document.getElementById('time_ms')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;

window.setInterval(() => {
	const plotData = tableIPCData[plotIndex];
	const table = tableFromIPC(plotData);
	const yData = table.data[0]?.children[0]?.values as Float32Array;
	const xData = table.data[0]?.children[1]?.values as Int32Array;
	const plotlyData = (() => {
		const data = [];
		for (let i = 0; i < CHANNELS; i++) {
			data.push({
				type: 'line',
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
				range: [-2, 12]
			 },
			 xaxis: {
				autorange: true
			 }
		}
	);
    totalPlotTime += performance.now() - currentTime;
    totalRenders++;
    timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
	plotIndex = (plotIndex + 1) % 4;
}, 30);


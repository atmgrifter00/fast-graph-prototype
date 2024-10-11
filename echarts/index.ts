import * as echarts from 'echarts';
import { CHANNELS, SAMPLE_SIZE, tableIPCData } from '../data';
import { tableFromIPC } from 'apache-arrow';

const myChart = echarts.init(document.getElementById('main'), null, { renderer: 'canvas' });
const timeElement = document.getElementById('time_ms')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;

window.setInterval(() => {
	const plotData = tableIPCData[plotIndex];
	const table = tableFromIPC(plotData);
	const yData = table.data[0]?.children[0]?.values as Float32Array;
	const xData = table.data[0]?.children[1]?.values as Int32Array;
	const echartsData = (() => {
		const data = [];
		for (let i = 0; i < CHANNELS; i++) {
			data.push({
				type: 'line',
                showSymbol: false,
				data: Array.from(yData).slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE),
			});
		}
		return data;
	})();

    const currentTime = performance.now();
	myChart.setOption({
        yAxis: { type: 'value', min: -2, max: 12 },
        xAxis: { data: Array.from(xData), min: 0, max: SAMPLE_SIZE },
        animation: false,
        series: echartsData,
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'inside'
            }
        ]
    });
    totalPlotTime += performance.now() - currentTime;
    totalRenders++;
    timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
	plotIndex = (plotIndex + 1) % 4;
}, 30);

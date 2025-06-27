import * as echarts from 'echarts';
import { CHANNELS, SAMPLE_SIZE, tableIPCData } from '../data';
import { tableFromIPC } from 'apache-arrow';

const myChart = echarts.init(document.getElementById('main'), null, { renderer: 'canvas' });
const timeElement = document.getElementById('time_ms')!;
const dataPerSecElement = document.getElementById('data_per_sec')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;
let previousTime = 0;
let totalData = 0;

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
                lineStyle: { width: 1 },
                areaStyle: { opacity: 0 },
                smooth: false,
                showSymbol: false,
				data: Array.from(yData).slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE),
			});
		}
		return data;
	})();

    const currentTime = performance.now();
	previousTime = previousTime === 0 ? currentTime : previousTime;
	myChart.setOption({
        yAxis: { type: 'value', min: -3, max: 12 },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true }, axisLabel: { interval: 1000 } },
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
    totalData += SAMPLE_SIZE * CHANNELS;
    totalPlotTime += performance.now() - currentTime;
    totalRenders++;
    timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
	if (currentTime - previousTime > 1000) {
		dataPerSecElement.innerText = `Data per second: ${(totalData / (totalPlotTime / 1000)).toFixed(2)}`;
		previousTime = currentTime;
	}
	plotIndex = (plotIndex + 1) % 4;
}, 30);

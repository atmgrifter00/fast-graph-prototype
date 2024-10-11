import { tableFromIPC } from "apache-arrow";
import { tableIPCData, SAMPLE_SIZE, CHANNELS } from "../data";

let graph = document.querySelector('#graph1');
const timeElement = document.getElementById('time_ms')!;
let plotIndex = 0;
let totalPlotTime = 0;
let totalRenders = 0;

let button = document.querySelector('#start');
button?.addEventListener('click', () => {
    window.setInterval(() => {
        const plotData = tableIPCData[plotIndex];
        const table = tableFromIPC(plotData);
        const yData = table.data[0]?.children[0]?.values;
        const webchartsData = (() => {
            const data = [];
            for (let i = 0; i < CHANNELS; i++) {
                data.push(yData.slice(i*SAMPLE_SIZE, (i+1)*SAMPLE_SIZE));
            }
            return data;
        })();
        const currentTime = performance.now();
        (graph as unknown).setData(webchartsData);
        totalPlotTime += performance.now() - currentTime;
        totalRenders++;
        timeElement.innerText = `Average render time: ${(totalPlotTime / totalRenders).toFixed(2)} ms`;
        plotIndex = (plotIndex + 1) % 4;
    }, 30);
});

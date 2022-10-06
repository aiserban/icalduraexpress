import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import DataLabels from 'chartjs-plugin-datalabels'

export function initChartDefaults() {
    const IncreaseLegendSpacing = {
        id: "increase-legend-spacing",
        beforeInit(chart: any) {
            // Get reference to the original fit function
            const originalFit = chart.legend.fit;
            // Override the fit function
            chart.legend.fit = function fit() {
                // Call original function and bind scope in order to use `this` correctly inside it
                originalFit.bind(chart.legend)();
                // Change the height as suggested in another answers
                this.height += 25;
            }
        }
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        DataLabels,
        IncreaseLegendSpacing,
    );

    ChartJS.defaults.set('plugins.datalabels', {
        color: 'black',
        font: {
            size: 14
        },
        anchor: 'end',
        align: 'top',
        offset: -2
    });

    ChartJS.defaults.animation = false;
    ChartJS.defaults.font.size = 14;
    ChartJS.defaults.font.weight = 'bold'
}
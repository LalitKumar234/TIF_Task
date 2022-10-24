import React, { useState } from 'react';
import { Chart } from 'primereact/chart';

function BarChart({data}) {

    let chartData = []
    //console.log(data)
    Object.values(data).forEach((currency) =>{
        chartData.push(currency)
        console.log(currency)
    });

    let chart = chartData.slice(1,6)

    const [basicData] = useState({
        labels: ['USD', 'INR', 'EUR', 'ARS', 'BBD'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: chart
            },
        ]
    });
    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        return {
            basicOptions,
        }
    }
    const { basicOptions } = getLightTheme();

    return (
        <div className="card">
            <h5>Vertical</h5>
            <Chart type="bar" data={basicData} options={basicOptions} />
        </div>
    )
}

export default BarChart
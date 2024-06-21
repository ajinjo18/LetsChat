import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { baseUrl } from '../../../utils/baseUrl';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BarChart = () => {
    const [dataPoints, setDataPoints] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${baseUrl}/admin/monthly`);
            const data = await response.json();
            const formattedData = data.map(item => ({
                label: new Date(0, item._id - 1).toLocaleString('en', { month: 'short' }),
                y: item.count
            }));
            setDataPoints(formattedData);
        }
        fetchData();
    }, []);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: {
            text: "Number of Users Created Each Month"
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column",
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: dataPoints
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default BarChart;

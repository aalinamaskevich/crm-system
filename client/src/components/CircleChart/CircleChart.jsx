import "./style.css";
import React from 'react';
import { Row } from "react-bootstrap";
import { RadialChart } from 'react-vis';

//data: angle, color, name
function CircleChart({ data, width, height, label }) {
    return (
        <div>
            <Row className="justify-content-between">
                <p className='fs-4 mt-3'>{label}</p>
            </Row>
            <Row className="justify-content-center">
                <RadialChart
                    colorType={'literal'}
                    showLabels
                    getLabel={d => d.name}
                    labelsRadiusMultiplier={1.1}
                    labelsStyle={{ fontSize: 16, fill: '#222' }}
                    width={width}
                    height={height}
                    data={data}
                />
            </Row>
        </div>
    );
}

export default CircleChart;
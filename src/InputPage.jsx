import React, { useCallback } from "react";
import InputForm from "./InputForm";
import { useTitle } from "./hooks";
import { useHistory } from 'react-router-dom';

export default function InputPage(props) {
    const history = useHistory();
    const convert = useCallback((initialColor) => {
        return initialColor.map((color) => {
            return [
                parseInt(color.substr(1,2), 16),
                parseInt(color.substr(3,2), 16),
                parseInt(color.substr(5,2), 16),
                255,
            ];
        });
    }, []);
    const onSubmit = useCallback((data, imageWidth, imageHeight, width, initialColor, iterationCount, sampleDistance) => {
        history.push({
            pathname: "/result",
            state: {
                data, imageWidth, imageHeight, width, initialColor: convert(initialColor), iterationCount, sampleDistance,
            },
        });
    }, [history, convert]);
    useTitle("Pixelator");
    
    return (
        <div className="container">
            <InputForm onSubmit={onSubmit} />
        </div>
    );
}
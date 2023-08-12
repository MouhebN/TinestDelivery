
import React, { useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({ onScan }) => {
    const [result, setResult] = useState("");

    const { ref } = useZxing({
        onResult(result) {
            console.log("QR Code scanned,", result.getText());
            setResult(result.getText());
            onScan(result.getText()); // Call the callback function with the scanned data
        },
    });

    console.log("Ref:", ref); // Add this line to check if the ref is defined

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <video ref={ref} style={{ maxWidth: "600px", marginBottom: '10px',}} />

            <div >
                {/*<p>{result}</p>*/}
            </div>
        </div>
    );
};



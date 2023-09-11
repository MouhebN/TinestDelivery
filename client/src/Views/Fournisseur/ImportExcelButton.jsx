import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../../App.css';
function ImportExcelButton({ onImport }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleImport = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                onImport(importedData);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    return (
        <div className="right-side">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button className="rechercher-button">Importer</button>
        </div>
    );
}

export default ImportExcelButton;
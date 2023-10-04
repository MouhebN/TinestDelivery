import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Importez XLSX ici

const ImportExcel = ({ onImport }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleImport = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Vous pouvez accéder aux données de la feuille ici
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Appelez la fonction onImport avec les données importées
        onImport(importedData);
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleImport}>Importer Excel</button>
    </div>
  );
};

export default ImportExcel;

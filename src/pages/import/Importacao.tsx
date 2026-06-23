import React, { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function Importacao() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importacao, setImportacao] = useState<
    {
      data: string;
      qtd_noites: string;
      hospede: string;
      acomodacao: string;
      valor: string;
      taxa_servico: string;
      taxa_limpeza: string;
    }[]
  >([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const result = results.data
            .filter((r: any) => r.Tipo == "Reserva")
            .map((r: any) => ({
              data: `${r["Data de início"].split("/")[1]}/${r["Data de início"].split("/")[0]}/${r["Data de início"].split("/")[2]}`,
              qtd_noites: r.Noites,
              hospede: r.Hóspede,
              acomodacao: r.Anúncio,
              valor: r.Valor,
              taxa_servico: r["Taxa de serviço"],
              taxa_limpeza: r["Taxa de limpeza"],
            }));
          setImportacao(result);
          console.log("CSV Parsed:", result);
          //   console.log("CSV Parsed:", results.data);
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
        },
      });
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Parsed:", rows);
      };
      reader.readAsBinaryString(file);
    } else {
      console.error("Formato não suportado. Use .csv ou .xlsx");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Importador CSV/Excel</h1>
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="px-4 py-2 border border-gray-300 rounded cursor-pointer"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Selecionar arquivo
        </button>
      </div>
      <table>
        <thead>
          <td>Data de início</td>
          <td>Noites</td>
          <td>Hóspede</td>
          <td>Anúncio</td>
          <td>Valor</td>
          <td>Taxa de serviço</td>
          <td>Taxa de limpeza</td>
        </thead>
        <tbody>
          {importacao.length > 0 &&
            importacao.map((i) => (
              <tr>
                <td>{i.data}</td>
                <td>{i.qtd_noites}</td>
                <td>{i.hospede}</td>
                <td>{i.acomodacao}</td>
                <td>{i.valor}</td>
                <td>{i.taxa_servico}</td>
                <td>{i.taxa_limpeza}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

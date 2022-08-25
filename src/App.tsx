import React from "react";
import "./App.css";
import Papa from "papaparse";
import { IEmployee } from "./types/employee";
import { parseEmployeeData } from "./utils/parseEmployeeData";

function App() {
  const uploadFile = (file: any) => {
    Papa.parse(file, {
      delimiter: ", ",
      skipEmptyLines: true,
      header: true,
      complete: function (responses) {
        const employees: (IEmployee | undefined)[] = responses.data.map(
          (employee) => {
            if (parseEmployeeData(employee) !== undefined) {
              return parseEmployeeData(employee);
            }
          }
        );
        console.log(employees);
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={(event) => uploadFile(event?.target?.files?.[0])}
      />
    </div>
  );
}

export default App;

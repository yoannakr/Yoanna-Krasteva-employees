import React from "react";
import "./App.css";

function App() {
  const uploadFile = (file: File | undefined) => {
    console.log(file);
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

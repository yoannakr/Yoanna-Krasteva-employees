import React, { useState } from "react";
import "./App.css";
import Papa from "papaparse";
import { IEmployee } from "./types/employee";
import { parseEmployeeData } from "./utils/parseEmployeeData";
import { groupBy } from "./utils/groupBy";
import { getTotalDaysDifferenceBetweenDates } from "./utils/getTotalDaysDifferenceBetweenDates";
import { IPair } from "./types/pair";
import PairEmployeesList from "./components/PairEmployeesList";

function App() {
  return (
    <div>
      <PairEmployeesList />
    </div>
  );
}

export default App;

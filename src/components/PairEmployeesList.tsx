import Papa from "papaparse";
import React, { useState } from "react";
import "../App.css";
import { IEmployee } from "../types/employee";
import { IPair } from "../types/pair";
import { getTotalDaysDifferenceBetweenDates } from "../utils/getTotalDaysDifferenceBetweenDates";
import { groupBy } from "../utils/groupBy";
import { parseEmployeeData } from "../utils/parseEmployeeData";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./PairEmployeesList.module.scss";
import { createGuid } from "../utils/createGuid";

const PairEmployeesList = () => {
  const [pairs, setPairs] = useState<IPair[]>([]);

  const getEmployeesSortedByDateFrom = (
    employees: IEmployee[]
  ): IEmployee[] => {
    return employees.sort(
      (firstEmployee: IEmployee, secondEmployee: IEmployee) => {
        return Number(firstEmployee.DateFrom) - Number(secondEmployee.DateFrom);
      }
    );
  };

  const getPairsSortedByDays = (pairs: IPair[]): IPair[] => {
    return pairs.sort((firstPair: IPair, secondPair: IPair) => {
      return secondPair.days - firstPair.days;
    });
  };

  const getExistingPair = (
    pairs: IPair[],
    currentEmployee: IEmployee,
    otherEmployee: IEmployee
  ): IPair | undefined => {
    return pairs.find(
      (pair) =>
        (pair.firstEmployeeId === currentEmployee.EmpID &&
          pair.secondEmployeeId === otherEmployee.EmpID) ||
        (pair.firstEmployeeId === otherEmployee.EmpID &&
          pair.secondEmployeeId === currentEmployee.EmpID)
    );
  };

  const getPairEmployeesForLongestPeriodByProject = (
    project: number,
    employees: IEmployee[]
  ): IPair | undefined => {
    const employeesSortedByDateFrom: IEmployee[] =
      getEmployeesSortedByDateFrom(employees);

    const tempEmployees = [...employeesSortedByDateFrom];

    const currentPairs: IPair[] = [];

    for (let i = 0; i < employeesSortedByDateFrom.length; i++) {
      const currentEmployee = employeesSortedByDateFrom[i];

      const otherEmployees: IEmployee[] = tempEmployees.filter(
        (otherEmployee) => otherEmployee.EmpID !== currentEmployee.EmpID
      );

      tempEmployees.shift();

      for (let j = 0; j < otherEmployees.length; j++) {
        const otherEmployee = otherEmployees[j];

        // crossing employees period
        if (currentEmployee.DateTo >= otherEmployee.DateFrom) {
          let totalDays: number = 0;

          if (currentEmployee.DateTo > otherEmployee.DateTo) {
            totalDays = getTotalDaysDifferenceBetweenDates(
              otherEmployee.DateFrom,
              otherEmployee.DateTo
            );
          } else {
            totalDays = getTotalDaysDifferenceBetweenDates(
              otherEmployee.DateFrom,
              currentEmployee.DateTo
            );
          }

          const existingPair = getExistingPair(
            currentPairs,
            currentEmployee,
            otherEmployee
          );

          if (existingPair) {
            existingPair.days += totalDays;
          } else {
            const pair: IPair = {
              id: createGuid(),
              firstEmployeeId: currentEmployee.EmpID,
              secondEmployeeId: otherEmployee.EmpID,
              projectId: project,
              days: totalDays,
            };

            currentPairs.push(pair);
          }
        }
      }
    }

    const pair: IPair = getPairsSortedByDays(currentPairs)[0];

    return pair;
  };

  const getPairEmployees = (employees: IEmployee[]) => {
    const groupByProject = groupBy(employees, (item) => item.ProjectID);

    groupByProject.forEach((values, key) => {
      const pairForProject = getPairEmployeesForLongestPeriodByProject(
        key,
        values
      );

      if (pairForProject !== undefined)
        setPairs((pairs) => [...pairs, pairForProject]);
    });
  };

  const uploadFile = (file: any) => {
    Papa.parse(file, {
      delimiter: ", ",
      skipEmptyLines: true,
      header: true,
      complete: function (responses) {
        const employees: IEmployee[] = responses.data.map((employee) =>
          parseEmployeeData(employee)
        );

        getPairEmployees(employees);
      },
    });
  };

  const columns: GridColDef[] = [
    { field: "firstEmployeeId", headerName: "Employee ID #1", flex: 1 },
    { field: "secondEmployeeId", headerName: "Employee ID #2", flex: 1 },
    { field: "projectId", headerName: "Project ID", flex: 1 },
    { field: "days", headerName: "Days worked", flex: 1 },
  ];

  return (
    <div className={styles.Container}>
      <div className={styles.UploadFile}>
        <span className={styles.Description}>Select csv file: </span>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={(event) => uploadFile(event?.target?.files?.[0])}
        />
      </div>

      <div className={styles.DataList}>
        <DataGrid
          rows={pairs}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default PairEmployeesList;

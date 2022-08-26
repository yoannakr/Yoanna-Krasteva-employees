import { IEmployee } from "../types/employee";

export const parseEmployeeData = (employeeData: any): IEmployee => {
  const employee: IEmployee = {
    EmpID: +employeeData.EmpID,
    ProjectID: +employeeData.ProjectID,
    DateFrom: new Date(employeeData.DateFrom),
    DateTo:
      employeeData.DateTo === "NULL"
        ? new Date()
        : new Date(employeeData.DateTo),
  };

  return employee;
};

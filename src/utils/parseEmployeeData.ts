import { IEmployee } from "../types/employee";

export const parseEmployeeData = (employeeData: any): IEmployee | undefined => {
  try {
    const employeeId = +employeeData.EmpID;
    const projectID = +employeeData.ProjectID;
    const dateFrom = new Date(employeeData.DateFrom);
    const dateTo =
      employeeData.DateTo === "NULL" ? null : new Date(employeeData.DateTo);

    // add validation

    const employee: IEmployee = {
      EmpID: +employeeData.EmpID,
      ProjectID: +employeeData.ProjectID,
      DateFrom: new Date(employeeData.DateFrom),
      DateTo:
        employeeData.DateTo === "NULL" ? null : new Date(employeeData.DateTo),
    };
    return employee;
  } catch (error) {
    return undefined;
  }
};

SELECT -- View all employees by id
	e.employee_id AS "ID", 
    CONCAT(e.first_name," ",e.last_name) AS "Emp. Name",
    rolesTable.role_title AS "Title", 
    rolesTable.salary AS "Salary", 
    departmentsTable.dept_name AS "Department", 
    CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employeeTable e
LEFT JOIN employeeTable m
ON m.role_ID = e.manager_ID
LEFT JOIN rolesTable
ON e.role_ID = rolesTable.role_id
LEFT JOIN departmentsTable
ON rolesTable.dept_ID = departmentsTable.dept_id 
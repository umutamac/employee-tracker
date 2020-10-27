DROP DATABASE IF EXISTS trackerDB;
CREATE database trackerDB;
USE trackerDB;

CREATE TABLE departmentsTable (
  dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30)
);
CREATE TABLE rolesTable (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30), 
  Salary DECIMAL,
  dept_ID INT,
  FOREIGN KEY (dept_ID) REFERENCES departmentsTable(dept_id)
  -- to hold reference to department role belongs to
);
CREATE TABLE employeeTable (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_ID INT,
  FOREIGN KEY(role_ID) REFERENCES rolesTable(role_id), 
  -- to hold reference to role employee has
  manager_ID INT,
  FOREIGN KEY(manager_ID) REFERENCES employeeTable(employee_id)
  /*to hold reference to another employee that manager of the current employee. 
  This field may be null if the employee has no manager*/
);

INSERT INTO departmentsTable (dept_name)
VALUES ("Sales"),("Manufacturing"),("HR");

INSERT INTO rolesTable (role_title, Salary, dept_ID)
VALUES ("Sales Manager",100000,(select dept_id from departmentsTable where dept_name = "Sales")),
("Sales Consultant",80000,(select dept_id from departmentsTable where dept_name = "Sales")),
("Engineering Manager",130000,(select dept_id from departmentsTable where dept_name = "Manufacturing")),
("Engineer",90000,(select dept_id from departmentsTable where dept_name = "Manufacturing")),
("Technician",70000,(select dept_id from departmentsTable where dept_name = "Manufacturing")),
("Hiring Manager",90000,(select dept_id from departmentsTable where dept_name = "HR"));

INSERT INTO employeeTable (first_name, last_name, role_ID, manager_ID)
VALUES ("James","Connor", (select role_id from rolesTable where role_title = "Engineering Manager"), NULL),
("Jess","Smith", (select role_id from rolesTable where role_title = "Sales Manager"), NULL),
("Mike","James", (select role_id from rolesTable where role_title="Sales Consultant"), (select role_id from rolesTable where role_title="Sales Manager")),
("Patrick","Star", (select role_id from rolesTable where role_title="Engineer"), (select role_id from rolesTable where role_title="Engineering Manager")),
("Matthew","Gallow", (select role_id from rolesTable where role_title="Technician"), (select role_id from rolesTable where role_title="Engineering Manager")),
("Lauren","Cruz", (select role_id from rolesTable where role_title="Hiring Manager"), NULL);

/* -- View all employees by id
SELECT 
	e.employee_id AS "ID", 
    CONCAT(e.first_name," ",e.last_name) AS "Emp. Name",
    rolesTable.role_title AS "Title", 
    rolesTable.Salary, 
    departmentsTable.dept_name AS "Department", 
    CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employeeTable e
LEFT JOIN employeeTable m
ON m.role_ID = e.manager_ID
LEFT JOIN rolesTable
ON e.role_ID = rolesTable.role_id
LEFT JOIN departmentsTable
ON rolesTable.dept_ID = departmentsTable.dept_id 
*/

/*
SELECT dept_name FROM departmentsTable AS "Departments";
*/

/*
SELECT d.dept_name, r.role_title FROM rolesTable r
LEFT JOIN departmentsTable d ON d.dept_id=r.dept_ID
*/

/*
SELECT role_title FROM rolesTable
*/

/*
SELECT CONCAT(first_name," ",last_name) FROM employeeTable WHERE manager_ID IS NOT NULL;
*/
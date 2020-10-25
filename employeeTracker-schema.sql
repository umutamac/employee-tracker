DROP DATABASE IF EXISTS trackerDB;
CREATE database trackerDB;

USE trackerDB;

CREATE TABLE departmentsTable (
  id INT NOT NULL,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (position)
);

CREATE TABLE rolesTable (
    id INT PRIMARY KEY,
    role_title VARCHAR(30), 
    salary DECIMAL,
    department_id INT -- to hold reference to department role belongs to
);

CREATE TABLE employeeTable (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) to hold employee first name,
  last_name VARCHAR(30) to hold employee last name,
  role_id INT, -- to hold reference to role employee has
  manager_id INT 
    /*to hold reference to another employee that manager of the current employee. 
    This field may be null if the employee has no manager*/
);



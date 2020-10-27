const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,  // Your port; if not 3306
    user: "root",
    password: "Raid98psu03jouF",
    database: "trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

const firstChosenAction = {
    name: "firstQuestion",
    type: "list",
    message: "What would you like to do?",
    choices: [
        "View all employees",
        "View all departments",
        "View roles by department",
        "Add an employee",
        "Add a role to a department",
        "Add a department"
    ]
}
function employeeRoleReturn() {
    let rolesArray = [];
    connection.query("SELECT * FROM rolesTable", function (err, res) {
        if (err) throw err;
        var string = JSON.stringify(res);
        var json = JSON.parse(string)
        for (i=0;i<json.length;i++){
            rolesArray[i] = json[i].role_title;
        }
    })
    return rolesArray
}
function deptReturn() {
    let deptArray = [];
    connection.query("SELECT * FROM departmentstable", function (err, res) {
        if (err) throw err;
        var string_d = JSON.stringify(res);
        var json_d = JSON.parse(string_d)
        for (i=0;i<json_d.length;i++){
            deptArray[i] = json_d[i].dept_name;
        }
    })
    return deptArray
}

const addEmployeeQuestion = [{
    name: "fname",
    type: "input",
    message: "First name of the employee:"
}, {
    name: "lname",
    type: "input",
    message: "Last name of the employee:"
}, {
    name: "employeeRole",
    type: "list",
    message: "Role name of the employee:",
    choices: employeeRoleReturn()
}, {
    name: "hasManager",
    type: "confirm",
    message: "Will the employee directly report to a manager?"
}]


async function start() {
    inquirer
        .prompt(firstChosenAction)
        .then(function (answer) {
            if (answer.firstQuestion === "View all employees") {
                var query = "SELECT e.employee_id AS ID, CONCAT(e.first_name,\" \",e.last_name) AS Name, ";
                query += "rolesTable.role_title AS Title, rolesTable.Salary, departmentsTable.dept_name AS Department, ";
                query += "CONCAT(m.first_name,\" \",m.last_name) AS Manager ";
                query += "FROM employeeTable AS e ";
                query += "LEFT JOIN employeeTable AS m ON m.role_ID = e.manager_ID ";
                query += "LEFT JOIN rolesTable ON e.role_ID = rolesTable.role_id ";
                query += "LEFT JOIN departmentsTable ON rolesTable.dept_ID = departmentsTable.dept_id ; ";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            }
            else if (answer.firstQuestion === "View all departments") {
                var query = "SELECT dept_name AS Departments FROM departmentsTable; ";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            }
            else if (answer.firstQuestion === "View roles by department") {
                var query = "SELECT d.dept_name AS Department, r.role_title AS Roles FROM rolesTable AS r ";
                query += "LEFT JOIN departmentsTable AS d ON d.dept_id=r.dept_ID; ";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            }
            else if (answer.firstQuestion === "Add an employee") {
                inquirer.prompt(addEmployeeQuestion)
                    .then(function (answer1) {
                        if (answer1.hasManager == false) {
                            var query1 = "INSERT INTO employeeTable (first_name, last_name, role_ID, manager_ID) "
                            query1 += "VALUES (?,?, (select role_id from rolesTable where role_title = ?),NULL); "
                            connection.query(query1, [
                                answer1.fname,
                                answer1.lname,
                                answer1.employeeRole
                            ], function (err, res) {
                                if (err) throw err;
                                console.log("Employee added!")
                                start();
                            }
                            )
                        }
                        else if (answer1.hasManager == true){
                            let managersArray = [];
                            connection.query("SELECT CONCAT(first_name,\" \",last_name) AS Manager FROM employeeTable WHERE manager_ID IS NULL", function (err, res) {
                                if (err) throw err;
                                var string_m = JSON.stringify(res);
                                var json_m = JSON.parse(string_m);
                                for (i=0;i<json_m.length;i++){
                                    managersArray[i] = json_m[i].Manager;
                                }
                            })
                            inquirer.prompt(
                                {
                                    name: "managerName",
                                    type: "list",
                                    message: "Who will the employee report to?",
                                    choices: managersArray
                                })
                                .then(function (answer2) {
                                    var query2 = "INSERT INTO employeeTable (first_name, last_name, role_ID, manager_ID) "
                                    query2 += "VALUES (?,?, (SELECT role_id FROM rolesTable WHERE role_title = ?), "
                                    query2 += "(SELECT  FROM  WHERE CONCAT(first_name,\" \",last_name) = ?) );"
                                    connection.query(query2, [
                                        answer1.fname,
                                        answer1.lname,
                                        answer1.employeeRole,
                                        answer2.managerName
                                    ], function (err, res) {
                                        if (err) throw err;
                                        start();
                                    }
                                    )
                                })
                        }
                    })
            }
            else if (answer.firstQuestion === "Add a role to a department") {
                inquirer.prompt({
                    name: "whichDept",
                    type: "list",
                    message: "Which department does the new role belong to?",
                    choices: deptReturn()
                },{
                    name: "roleName",
                    type: "input",
                    message: "What is the name of the new role?"                    
                },{
                    name: "roleSalary",
                    type: "input",
                    message: "What will be the salary?"                    
                }).then(function (answer) {
                    var query = "INSERT INTO rolesTable (role_title, Salary, dept_ID) "
                    query += "VALUES (?,?,(SELECT dept_id FROM departmentsTable WHERE dept_name = (?)))";
                    connection.query(query, [
                        answer.roleName,
                        answer.roleSalary,
                        answer.whichDept
                    ], function (err, res) {
                        if (err) throw err;
                        console.log("Role added!")
                        start();
                    })
                })
            }
            else if (answer.firstQuestion === "Add a department") {
                inquirer.prompt({
                    name: "addDept",
                    type: "input",
                    message: "What is the department name?",
                }).then(function (answer) {
                    var query = "INSERT INTO departmentsTable (dept_name) VALUES (?)";
                    connection.query(query, [answer.addDept], function (err, res) {
                        if (err) throw err;
                        console.log("Department added!")
                        start();
                    })
                })
            }
            else {
                connection.end();
                console.log("Connection has ended")
            }
        });
}

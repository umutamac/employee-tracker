const inquirer = require("inquirer");
var mysql = require("mysql");

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
    connection.query("SELECT role_title FROM rolesTable", function (err, res) {
        if (err) throw err;
        let rolesArray = [];
        res.map(roles => rolesArray.push(roles.role_title));
        console.log(rolesArray);
        return rolesArray;

    })
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

function start() {
    inquirer
        .prompt(firstChosenAction)
        .then(function (answer) {
            // console.log(answer);
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
                });
            }
            else if (answer.firstQuestion === "View all departments") {
                var query = "SELECT dept_name AS Departments FROM departmentsTable; ";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                });
            }
            else if (answer.firstQuestion === "View roles by department") {
                var query = "SELECT d.dept_name AS Department, r.role_title AS Roles FROM rolesTable AS r ";
                query += "LEFT JOIN departmentsTable AS d ON d.dept_id=r.dept_ID; ";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                });
            }
            else if (answer.firstQuestion === "Add an employee") {
                inquirer.prompt(addEmployeeQuestion)
                    .then(function (answer1) {
                        if (answer1.hasManager == false) {
                            var query1 = "INSERT INTO employeeTable (first_name, last_name, role_ID, manager_ID) "
                            query1 += "VALUES (?,?, (select role_id from rolesTable where role_title = ?),NULL); "
                            connection.query(query1, {
                                first_name: answer1.fname,
                                last_name: answer1.lname,
                                role_title: answer1.employeeRole
                            })
                        }
                        else {
                            inquirer.prompt(
                                {
                                    name: "managerName",
                                    type: "list",
                                    message: "Who will the employee report to?",
                                    choices: connection.query("SELECT CONCAT(first_name,\" \",last_name) FROM employeeTable WHERE manager_ID IS NOT NULL;")
                                })
                                .then(function (answer2) {
                                    var query2 = "INSERT INTO employeeTable (first_name, last_name, role_ID, manager_ID) "
                                    query2 += "VALUES (?,?, (SELECT role_id FROM rolesTable WHERE role_title = ?), "
                                    query2 += "(SELECT  FROM  WHERE CONCAT(first_name,\" \",last_name) = ?) );"
                                    connection.query(query2, {
                                        first_name: answer1.fname,
                                        last_name: answer1.lname,
                                        role_title: answer1.employeeRole,
                                        manager_name: answer2.managerName
                                    })
                                })
                        }
                    })
            }
            else if (answer.firstQuestion === "Add a role to a department") {
                console.log("Not working right now")
            }
            else if (answer.firstQuestion === "Add a department") {
                inquirer.prompt({
                    name: "addDept",
                    type: "inpt",
                    message: "What is the department name?",
                }).then(function (answer) {
                    var query = "INSERT INTO departmentsTable (dept_name) VALUES ?";
                    connection.query(query, {dept_name: answer.addDept}, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                    })
                })
            }
            else {
                connection.end();
                console.log("Connection has ended")
            }
        });
}

// function showUpdateOptions() {
//     inquirer
//         .prompt(updateAction)
//         .then(function (answer) {
//             if (answer.updateAction === "Update the role of an employee") {
//                 console.log("Not yet working")
//                 start();
//             } else {
//                 connection.end();
//                 console.log("Connection has ended")
//             }
//         });
// }
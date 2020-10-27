const inquirer = require("inquirer");
var mysql = require("mysql");
var viewAllquery = require("");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,  // Your port; if not 3306
  user: "root",
  password: "",
  database: "trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

const firstChosenAction = {
    name: "firstQuestion",
    type: "list",
    message: "What would you like to do?",
    choices: [
    "View department/role/employee",
    "Add department/role/employee",
    "Update employee information"]
}
const viewAction = {
    name: "viewChoices",
    type: "list",
    message: "What would you like to view?",
    choices: [
    "View all employees",
    "View employees by managers",
    "View all departments",
    "View roles by department"]
}
const addAction = {
    name: "addChoices",
    type: "list",
    message: "What would you like to add?",
    choices: [
    "Add an employee",
    "Add a role to a department",
    "Add a department"]
}
const updateAction = {
    name: "updateChoices",
    type: "list",
    message: "What would you like to update?",
    choices: [
    "Update the role of an employee",
    "Update the manager of an employee",
    "Delete an employee"]
}
const addEmployeeQuestion = [{
    name: "fname",
    type: "input",
    message: "First name of the employee:"
},{
    name: "lname",
    type: "input",
    message: "Last name of the employee:"
},{
    name: "salary",
    type: "input",
    message: "Salary of the employee:",
    validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
    }
} /*,{
    name: "employeeRole",
    type: "list",
    message: "Role name of the employee:",
    choices: //function to get roles from sql
}*/
]

function start() {
    inquirer
        .prompt(firstChosenAction)
        .then(function (answer) {
            if (answer.firstChosenAction === "View department/role/employee") {showViewOptions();}
            else if (answer.firstChosenAction === "Add department/role/employee") {showAddOptions();}
            else if (answer.firstChosenAction === "Update employee information") {showUpdateOptions();}
            else {connection.end();}
        });
}
function showViewOptions() {
    inquirer
        .prompt(viewAction)
        .then(function (answer) {
            if (answer.viewAction === "View all employees") {
                var query = "SELECT e.employee_id AS \"ID\", CONCAT(e.first_name,\" \",e.last_name) AS \"Emp. Name\", ";
                query += "rolesTable.role_title AS \"Title\", rolesTable.Salary, ";
                query += "departmentsTable.dept_name AS \"Department\", CONCAT(m.first_name,\" \",m.last_name) AS \"Manager\"";
                query += "FROM employeeTable e";  
                query += "LEFT JOIN employeeTable m ON m.role_ID = e.manager_ID"; 
                query += "LEFT JOIN rolesTable ON e.role_ID = rolesTable.role_id"; 
                query += "LEFT JOIN departmentsTable ON rolesTable.dept_ID = departmentsTable.dept_id ";    
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    console.table(res);
                });
                start();
            }
            else if (answer.viewAction === "View all departments") {
                var query = "SELECT dept_name FROM departmentsTable AS \"Departments\"";
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    console.table(res);
                });
                start();
            }
            else if (answer.viewAction === "View roles by department") {
                var query = "SELECT d.dept_name, r.role_title FROM rolesTable r";
                query += "LEFT JOIN departmentsTable d ON d.dept_id=r.dept_ID";
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    console.table(res);
                });
                start();
            }
            else {
                connection.end();
                console.log("Connection has ended")
            }
        });
}
function showAddOptions() {
    inquirer
        .prompt(addAction)
        .then(function (answer) {
            if (answer.addAction === "Add an employee") {
                inquirer.prompt(addEmployeeQuestion)
                    .then(function (answer) {
                        // when finished prompting, insert a new item into the db with that info
                        // connection.query(
                        //   "INSERT INTO auctions SET ?",
                        //   {
                        //     first_name: answer.fname,
                        //     last_name: answer.lname,
                        //     starting_bid: answer.startingBid || 0,
                        //     highest_bid: answer.startingBid || 0
                        //   },
                    });
            }
            else if (answer.addAction === "Add a role to a department") {

                start();
            }
            else if (answer.addAction === "Add a department") {
                inquirer.prompt({
                    name: "addDept",
                    type: "inpt",
                    message: "What is the department name?",
                }).then(function (answer) {
                    var query = "INSERT INTO departmentsTable (dept_name) VALUES ?";
                    connection.query(query, answer, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                    })
                })
                start();
            } else {
                connection.end();
                console.log("Connection has ended")
            }
        })
}
function showUpdateOptions() {
    inquirer
        .prompt(updateAction)
        .then(function (answer) {
            if (answer.updateAction === "Update the role of an employee") {
                updateRole();
            } else {
                connection.end();
                console.log("Connection has ended")
            }
        });
}
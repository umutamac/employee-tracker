const inquirer = require("inquirer");
var mysql = require("mysql");

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

function start() {
    inquirer
        .prompt(firstChosenAction)
        .then(function (answer) {
            if (answer.firstChosenAction === "View department/role/employee") {
                showViewOptions();
            }
            else if (answer.firstChosenAction === "Add department/role/employee") {
                showAddOptions();
            }
            else if (answer.firstChosenAction === "Update employee information") {
                showUpdateOptions();
            }
            else {
                connection.end();
            }
        });
}

function showViewOptions() {
    inquirer
        .prompt(viewAction)
        .then(function (answer) {
            if (answer.viewAction === "View all employees") {
                showViewOptions();
                start();
            }
            else if (answer.viewAction === "View employees by managers") {
                showAddOptions();
                start();
            }
            else if (answer.viewAction === "View all departments") {
                showUpdateOptions();
                start();
            }
            else if (answer.viewAction === "View roles by department") {
                showUpdateOptions();
                start();
            }
            else {
                connection.end();
            }
        });
}
function showAddOptions() {
    inquirer
        .prompt(addAction)
        .then(function (answer) {
            if (answer.addAction === "Add an employee") {
                addEmployee();
            }
            else if (answer.addAction === "Add a role to a department") {
                addRole();
            }
            else if (answer.addAction === "Add a department") {
                addDept();
            }
            else {
                connection.end();
            }
        });
}
function showUpdateOptions() {
    inquirer
        .prompt(updateAction)
        .then(function (answer) {
            if (answer.updateAction === "Update the role of an employee") {
                updateRole();
            }
            else if (answer.updateAction === "Update the manager of an employee") {
                updateManager();
            }
            else if (answer.updateAction === "Delete an employee") {
                deleteEmployee();
            }
            else {
                connection.end();
            }
        });
}
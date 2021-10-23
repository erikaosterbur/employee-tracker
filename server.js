const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

function init() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'startQuestion',
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        },
    ])
    .then(response => {
        if (response.startQuestion === "View All Employees") {
            getEmployees();
        }
        else if (response.startQuestion === "Add Employee") {
            addEmployee();
        }
        else if (response.startQuestion === "Update Employee Role") {
            updateEmployee();
        }
        else if (response.startQuestion === "View All Roles") {
            getRoles();
        }
        else if (response.startQuestion === "Add Role") {
            addRole();
        }
        else if (response.startQuestion === "View All Departments") {
            getDepartments();
        }
        else if (response.startQuestion === "Add Department") {
            addDepartment();
        }
        else return;
    })
};

function getDepartments() {
    db.query("SELECT * FROM departments", function (err, results){
        if( err ) {
          console.log("Error")
        }
        else console.table(results);
        init();
    })
};

function getEmployees() {
    db.query("SELECT * FROM employee", function (err, results) {
      if (err) {
        console.log("Error")
      }
      else console.table(results);
      init();
    })
};

function getRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
      if ( err ) {
        console.log("Error")
      }
      else console.table(results);
      init();
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'addDepartment'
        },
    ])
    .then(response => {
        db.query("INSERT INTO departments (department_name) VALUES (?)", [response.addDepartment], (err, result) => {
          if ( err ) {
            console.log("Error")
          }
          else console.log("Department added");
          init();
        })
    })
};

function addRole () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'addRoleName'
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'addRoleSalary'
        },
        {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'addRoleDepartment',
            choices: ['']
        },
    ])
    .then(response => {
        db.query("INSERT INTO roles (title, salary) VALUES (?, ?)", [response.addRoleName, response.addRoleSalary], (err, result) => {
          if ( err ) {
            console.log("Error")
          }
          else console.log("Role added");
          init();
        })
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'addFirstName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'addLastName'
        },
        {
            type: 'list',
            message: "What is the employee's role",
            name: 'addEmployeeRole',
            choices: ['']
        },
        {
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'addEmployeeManager',
            choices: ['']
        },
    ])
    .then(response => {
        db.query("INSERT INTO employee (first_name, last_name) VALUES (?, ?)", [response.addFirstName, response.addLastName], (err, result) => {
          if ( err ) {
            console.log("Error")
          }
          else console.log("Employee added");
          init();
        })
    })
    
};

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee's role do you want to update?",
            name: 'updateEmployee',
            choices: ['']
        },
        {
            type: 'list',
            message: "Which role do you want to assign the selected employee?",
            name: 'updateRole',
            choices: ['']
        }
    ])
    .then(
        db.query()
    )
};

init();
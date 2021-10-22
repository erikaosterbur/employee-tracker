const inquirer = require('inquirer');

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

function start() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'startQuestion',
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        },
    ]);
}

//if view all departments: id, name
db.get()

//if view all employees: id, first name, last name, title, department, salary, manager
db.get()

//if view all roles: id, title, department, salary
db.get()

//if add department: What is the name of the department? (input)
inquirer.prompt([
    {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'addDepartment'
    },
]);

//if add role: What is the name of the role? (input) What is the salary of the role? (input) Which department does the role belong to? (list)
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
]);

//if add employee: What is the employee's first name? (input) What is the employee's last name? (input) What is the employee's role? (list) Who is the employee's manager? (list)
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
]);

//if update employee role: Which employee's role do you want to update? (list) Which role do you want to assign the selected employee? (list)
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
]);









start();
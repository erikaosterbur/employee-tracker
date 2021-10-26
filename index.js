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
    console.log(`Connected to the database.`)
)
        

init = () => {
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
        else db.end();
    })
};

getDepartments = () => {
    db.query("SELECT * FROM departments ORDER BY id ASC", function (err, results){
        if( err ) {
          return console.log("Error")
        }
        console.table(results);
        init();
    })
};

getEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employee e ON employee.manager_id = e.id ORDER BY id ASC;", (err, results) => {
            if (err) {
                return console.log(err);
              }
            console.table(results);
      init();
    })
};

getRoles = () => {
    db.query("SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY id ASC", function (err, results) {
      if ( err ) {
        return console.log("Error")
      }
        console.table(results);
      init();
    })
};

addDepartment = () => {
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
            return console.log("Error")
          }
          else console.log("Department added");
          init();
        })
    })
};

addRole = () => {
    let departmentsDB = new Promise(function(resolve, reject) {
        db.query("SELECT * FROM departments", function (err, results) {
            if (err) {
                reject(new Error("Error"));
            } else {
                resolve(results);
            }
        })
    })
    departmentsDB
    .then(values => {
        let departments = values.map(function (department) {
            return department.department_name;
        });
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
                choices: departments
            },
        ])
        .then(response => {        
            let chosenDepartment = response.addRoleDepartment;
            let departmentIndex = values.findIndex(function (department) {
            return chosenDepartment === department.department_name;
            })
            let thisDepartmentId = values[departmentIndex].id;
            db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [response.addRoleName, response.addRoleSalary, thisDepartmentId], (err, result) => {
                if ( err ) {
                    console.log("Error")
                }
                else console.log("Role added");
                    init()
                })
        })
    })
    .catch( err => {
        console.log(err);
    })
};

addEmployee = () => {
    let rolesDB = new Promise(function(resolve, reject) {
        db.query("SELECT id, title FROM roles", function (err, results) {
            if (err) {
                reject(new Error("Error"));
            } else {
                resolve(results);
            }
        })
    })

    let employeeDB = new Promise(function(resolve, reject) {
        db.query("SELECT * FROM employee WHERE manager_id IS NULL", function (err, results) {
            if (err) {
                reject(new Error("Error"));
            } else {
                resolve(results);
            }
        })
    })


    Promise.all([rolesDB, employeeDB])
        .then(values => {
            let roles = values[0].map(function (role) {
                return role.title;
            });
            let managers = values[1].map(function (manager) {
                return manager.first_name + ' ' + manager.last_name;
            })
            managers.push("None");
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
                choices: roles
            },
            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'addEmployeeManager',
                choices: managers
            },
            ])
            .then(response => {
                let chosenRole = response.addEmployeeRole;
                let roleIndex = values[0].findIndex(function (role) {
                    return chosenRole === role.title;
                })
                let thisRoleId = values[0][roleIndex].id;

                let chosenManager = response.addEmployeeManager;
                let managerIndex = values[1].findIndex(function (manager) {
                    return chosenManager === manager.first_name + ' ' + manager.last_name;
                })
                let thisManagerId = (managerIndex === -1) ? null : values[1][managerIndex].id;

                db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.addFirstName, response.addLastName, thisRoleId, thisManagerId], (err, result) => {
                    if ( err ) {
                        console.log("Error")
                    }
                    else console.log("Employee added");
                    init();
                })
            })
        })
        .catch( err => {
            console.log(err)
        })
};


updateEmployee = () => {

    let employeeDB = new Promise(function(resolve, reject) {
        db.query("SELECT * FROM employee", function (err, results) {
            if (err) {
                reject(new Error("Error"));
            } else {
                resolve(results);
            }
        })
    })

    let rolesDB = new Promise(function(resolve, reject) {
        db.query("SELECT id, title FROM roles", function (err, results) {
            if (err) {
                reject(new Error("Error"));
            } else {
                resolve(results);
            }
        })
    })

    Promise.all([employeeDB, rolesDB])
        .then(values => {
            let employees = values[0].map(function (employee) {
                return employee.first_name + ' ' + employee.last_name;
            })
            let roles = values[1].map(function (role) {
                return role.title;
            });

            inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                name: 'updateEmployee',
                choices: employees
            },
            {
                type: 'list',
                message: "Which role do you want to assign the selected employee?",
                name: 'updateRole',
                choices: roles
            }
            ])
            .then(responses => {
                let chosenEmployee = responses.updateEmployee;
                    let employeeIndex = values[0].findIndex(function (employee) {
                        return chosenEmployee === employee.first_name + ' ' + employee.last_name;
                    })
                    let thisEmployeeId = values[0][employeeIndex].id;
    
                    let chosenRole = responses.updateRole;
                    let roleIndex = values[1].findIndex(function (role) {
                        return chosenRole === role.title;
                    })
                    let thisRoleId = values[1][roleIndex].id;
    
                    db.query("UPDATE employee SET role_id = (?) WHERE id = (?)", [thisRoleId, thisEmployeeId], (err, result) => {
                        if ( err ) {
                            console.log("Error")
                        }
                        else console.log("Employee updated");
                        init();
                    })
            })
        })
};

init();
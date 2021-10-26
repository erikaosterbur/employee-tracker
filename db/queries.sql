USE employees_db;

--getDepartment function
SELECT * ORDER BY id ASC FROM departments

--getEmployees function
SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(e.first_name, ' ', e.last_name) AS manager ORDER BY id ASC
FROM employee
JOIN roles ON employee.role_id = roles.id 
JOIN departments ON roles.department_id = departments.id 
LEFT JOIN employee e ON employee.manager_id = e.id

--getRoles function
SELECT roles.id, roles.title, roles.salary, departments.department_name ORDER BY id ASC 
FROM roles 
JOIN departments ON roles.department_id = departments.id

--insert new department into database
INSERT INTO departments (department_name) VALUES (response.addDepartment)

--insert new role into database
INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)

--addEmployee function
SELECT id, title FROM roles
SELECT * FROM employee WHERE manager_id IS NULL






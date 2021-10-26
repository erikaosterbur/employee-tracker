USE employees_db;

SELECT employee.id, employee.first_name, employee.last_name, title, salary, department_name AS department, CONCAT(e.first_name, ' ', e.last_name) AS manager 
FROM employee 
JOIN roles ON employee.id = roles.id 
JOIN departments ON department_id = departments.id 
LEFT JOIN employee e ON employee.manager_id = e.id




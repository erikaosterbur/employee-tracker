USE employees_db; 

SELECT *
FROM roles
JOIN departments ON roles.department_id = departments.id;

SELECT *
FROM employee
JOIN roles ON employee.roles_id = roles.id;

SELECT * 
FROM employee
JOIN employee on employee.manager_id = employee.id;


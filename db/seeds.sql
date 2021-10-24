USE employees_db;

INSERT INTO departments (department_name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 4),
        ("Salesperson", 80000, 4),
        ("Lead Engineer", 150000, 1),
        ("Software Engineer", 120000, 1),
        ("Account Manager", 160000, 2),
        ("Accountant", 125000, 2),
        ("Legal Team Lead", 250000, 3),
        ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jenny", "Jones", 1, null),
        ("Alice", "Anderson", 2, 1),
        ("Penny", "Piper", 3, null),
        ("Kelly", "Krook", 4, 3),
        ("Rita", "Rodriguez", 5, null),
        ("Nancy", "Nickels", 6, 5),
        ("Tracy", "Towns", 7, null),
        ("Betty", "Brown", 8, 7);



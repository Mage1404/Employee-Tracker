INSERT INTO department
    (id, name)
VALUES
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, 'Sales Lead', 100000, 1),
    (2, 'Lead Engineer', 150000, 2),
    (3, 'Account Manager', 160000, 3),
    (4, 'Legal Team Lead', 250000, 4),
    (5, 'Sale Person', 80000, 1),
    (6, 'Software Engineer', 120000, 2),
    (7, 'Accountant', 125000, 3),
    (8, 'Lawyer', 190000, 4);

INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'A', 1, NULL),
    (2, 'Mike', 'B', 5, 1),
    (3, 'Asheley', 'C', 2, NULL),
    (4, 'Kevin', 'D', 6, 3),
    (5, 'Kunal', 'E', 3, NULL),
    (6, 'Malia', 'F', 7, 5),
    (7, 'Sarah', 'G', 4, NULL),
    (8, 'Tom', 'H', 8, 7);

DROP TABLE IF EXISTS employeename;
CREATE TABLE employeename AS
SELECT id, concat(first_name, ' ', last_name) AS manager_name
FROM employee;

/*SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employeename.manager_name
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN employeename ON employee.manager_id = employeename.id;
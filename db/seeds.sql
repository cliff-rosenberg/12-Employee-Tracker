USE employee_tracker_db;
INSERT INTO department (name)
VALUES ("Accounting"),
  ("Engineering"),
  ("HR"),
  ("IT"),
  ("Management");
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 75000.00, 1),
  ("Engineer", 120000.00, 2),
  ("Generalist", 45000.00, 3),
  ("Software Developer", 100000.00, 4),
  ("Manager", 165000.00, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Robert", "Brill", 05, NULL),
  ("Angela", "Lincoln", 05, NULL),
  ("Thomas", "Phillips", 01, 001),
  ("Norberto", "Acuna", 04, 002),
  ("Sara", "Foster", 03, 002);

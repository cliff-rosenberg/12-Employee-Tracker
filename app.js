// SPDX-License-Identifier: MIT
// packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');// using 'promise' based MySQL
const table = require('console.table');

// load some cool ASCII art stuff
const figlet = require('figlet');
let connection;

// boilerplate for MySQL database connection
// now using 'promise' based syntax
async function connect() {
  connection = await mysql.createConnection({
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_tracker_db'
      });
    console.log('Connected to employee_tracker database...');
  };

  // simple ASCII banner using Figlet
const doAscii = () => {
  console.log(figlet.textSync('Employee', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));
  console.log(figlet.textSync('Tracker', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));
};//end doAscii()

// Main Menu prompts array
// ordered as given in README.md project docs
const mainMenu = [
    {
      name: "menuchoice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Employees",
        "View All Roles",
        "Add A Department",
        "Add Role",
        "Add An Employee",
        "Update Employee Role",
        "Quit",
      ]
    }
  ];//end main menu

// View All Departments function
const viewAllDepartments = async () => {
  try {
    const results = await connection.query('SELECT d.id AS "Dept. ID", d.name AS "Dept. Name" FROM department d');
  console.log(`
  
----------Department List----------
`)
  console.table(results[0]);
  console.log(`
--------End Department List---------
`);
  menuMain();
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
};//end viewAllDepartments()

// View All Roles function
const viewAllRoles = async () => {
  // using table aliases to make query more readable
  // https://dev.mysql.com/doc/refman/8.0/en/select.html
  const query =`SELECT d.name AS "Department", r.title AS "Role", r.id AS "Role ID#", r.salary AS "Salary" 
  FROM role r 
  JOIN department d ON r.department_id = d.id;`
  try {
    const results = await connection.query(query);
  console.log(`
  
----------View All Roles---------
`)
  console.table(results[0]);
  console.log(`
---------End Role List----------
`);
  menuMain();
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
};//end viewAllRoles()

// View All Employees function
const viewAllEmployees = async () => {
  // using table aliases to make query more readable
  // https://dev.mysql.com/doc/refman/8.0/en/select.html
  const query =`SELECT em.id AS "Employee Id#", em.first_name AS "First Name", em.last_name AS "Last Name", r.title AS "Title", d.name AS "Department", r.salary AS "Salary", CONCAT(IFNULL(mgr.first_name, ''), ' ', IFNULL(mgr.last_name, 'N/A')) AS "Manager"
  FROM employee em
  LEFT JOIN role r
	ON em.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee mgr
	ON mgr.id = em.manager_id;
  `;
  try {
    const results = await connection.query(query);
  console.log(`
  
----------Employee List----------
`)
  console.table(results[0]);
  console.log(`
--------End Employee List---------
`);
  menuMain();
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
};// end viewAllEmployees

// Add A Department function
const addDepartment = () => {
  console.log('Add A Department function...');
  return;
};

// Add Roles function
const addRole = () => {
  console.log('Add Roles function...');
  return;
};

// Add An Employee function
const addEmployee = () => {
  console.log('Add An Employee function...');
  return;
};

// Update Employee Role function
const updateEmployeeRole = () => {
  console.log('Update Employee Role function...');
  return;
};

// main menu function for app
const menuMain = async () => {
      const response = await inquirer.prompt(mainMenu);
      // main menu choices do functions
      //let myInput = response.menuchoice;
      switch (response.menuchoice) {
        case 'View All Employees': 
          viewAllEmployees();
          break;
        case 'Add An Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add A Department':
          addDepartment();
          break;
        case 'Quit':
          quitApp();
        }
};//end of menuMain()

// simple function to end app
const quitApp = () => {
  console.log('Exiting app...');
  process.exit();
};//end quitApp()

// sets MySQL connction,
// displays ASCII banner,
// then calls main menu function
const doApp = async () => {
  await connect();
  doAscii();//ASCII banner
  menuMain();
};//end doApp()

// ****
// Start the app here
// ****
doApp();

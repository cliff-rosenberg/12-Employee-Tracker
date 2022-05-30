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
};

// Main Menu prompts array
const mainMenu = [
    {
      name: "menuchoice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add An Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add A Department",
        "Quit",
      ]
    }
  ];//end main menu

// View All Employees function
const viewAllEmployees = async () => {
  try {
    const results = await connection.query('SELECT id, first_name, last_name FROM employee');
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

// View All Roles function
const viewAllRoles = async () => {
  try {
    const results = await connection.query('SELECT department.name AS Department, role.title AS Role, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;');
  console.log(`
  
----------View All Roles----------`)
  console.table(results[0]);
  console.log(`
---------End Role List----------`);
  menuMain();
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
};

// Add Roles function
const addRole = () => {
  console.log('Add Roles function...');
  return;
};

// View All Departments function
const viewAllDepartments = async () => {
  try {
    const results = await connection.query('SELECT * FROM department');
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
};

// Add A Department function
const addDepartment = () => {
  console.log('Add A Department function...');
  return;
};

// main function for app
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
  };// end of menuMain()

const quitApp = () => {
  console.log('Exiting app...');
  process.exit();
};

const doApp = async () => {
  await connect();
  doAscii();//ASCII banner
  menuMain();
};//end doApp()

// ****
// Start the app here
// ****
doApp();

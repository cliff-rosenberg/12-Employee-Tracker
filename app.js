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
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));
  console.log(figlet.textSync('Tracker', {
    font: 'Ogre',
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
  //console.log('View All Employees function...');
  try {
    const results = await connection.query('SELECT id, first_name, last_name FROM employee');
  console.log(`
  
  ----------Employee List----------
  `)
  console.table(results[0]);
  console.log(`
  ---------End Employee List----------
  `);
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
const viewAllRoles = () => {
  console.log('View All Roles function...');
  return;
};

// Add Roles function
const addRole = () => {
  console.log('Add Roles function...');
  return;
};

// View All Departments function
const viewAllDepartments = () => {
  console.log('View All Departments function...');
  return;
};

// Add A Department function
const addDepartment = () => {
  console.log('Add A Department function...');
  return;
};

// main function for app
const menuMain = async () => {
    let myInput;//has to be here due to scope issues with do/while  
    do {
      const response = await inquirer.prompt(mainMenu);
      // main menu choices do functions
      myInput = response.menuchoice;
        if (myInput === 'View All Employees') {
          viewAllEmployees();
          }
        if (myInput === 'Add An Employee') {
          addEmployee();
          }
        if (myInput === 'Update Employee Role') {
          updateEmployeeRole();
          }
        if (myInput === 'View All Roles') {
          viewAllRoles();
          }
        if (myInput === 'Add Role') {
          addRole();
          }
        if (myInput=== 'View All Departments') {
          viewAllDepartments();
          }
        if (myInput === 'Add A Department') {
          addDepartment();
          }
        }
        while (myInput != "Quit");
        console.log('Exiting app...');
        process.exit();
  };// end of doApp()

const doApp = async () => {
  await connect();
  doAscii();//ASCII banner
  menuMain();
};

// ****
// Start the app here
// ****
doApp();

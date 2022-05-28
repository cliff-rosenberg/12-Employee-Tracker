// SPDX-License-Identifier: MIT
// packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2')
const table = require('console.table');

// load some cool ASCII art stuff
const art = require('ascii-art');

// boilerplate for MySQL database connection
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to employee_tracker_db database.`)
  );

// a function to do some ASCIII art :)
const doAscii = async (msg) => {
    try {
        let rendered = await art.font(msg, 'doom').completed()
        //rendered is the ascii
        return rendered;
        }
        catch(err){
        //err is an error
        console.log(err);
        }
};

// only works right now for words that are of similar length,
// due to promise resolution timings
const tryAscii = () => {
    let message = 'Employee Tracker';
    const strArray = message.split(' ');
    for (let i = 0; i < strArray.length; i++) {
    doAscii(strArray[i]).then(rendered => {
        console.log(rendered);
    });
    };
};

tryAscii();

// Main Menu prompts
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
const viewAllEmployees = () => {
  console.log('View All Employees function...');
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
const doApp = async () => {
    //let myInput;
    do {
      const response = await inquirer.prompt(mainMenu);
        if (response.choices === 'View All Employees') {
          viewAllEmployees();
          }
        if (response.choices === 'Add An Employee') {
          addEmployee();
          }
        if (response.choices === 'Update Employee Role') {
          updateEmployeeRole();
          }
        if (response.choices === 'View All Roles') {
          viewAllRoles();
          }
        if (response.choices === 'Add Role') {
          addRole();
          }
        if (response.choices === 'View All Departments') {
          viewAllDepartments();
          }
        if (response.choices === 'Add A Department') {
          addDepartment();
          }
        }
        while (myInput !="Quit");
        console.log('Exiting app...');
  };// end of doApp()

// ****
// Start the app here
// ****
doApp();

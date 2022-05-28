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

// main function for app
const doApp = async () => {
    //let myInput;
    do {
      const response = await inquirer.prompt(mainMenu);
        if (response.choices === 'View All Employees') {
          // TODO: View All Employees
          }
        if (response.choices === 'Add An Employee') {
          // TODO: Add An Employee
          }
        if (response.choices === 'Update Employee Role') {
          // TODO: Update Employee Role
          }
        if (response.choices === 'View All Roles') {
          // TODO: View All Roles
          }
        if (response.choices === 'Add Role') {
          // TODO: Add Role
          }
        if (response.choices === 'View All Departments') {
          // TODO: View All Departments
          }
        if (response.choices === 'Add A Department') {
          // TODO: Add A Department
          }
        }
        while (myInput !="Quit");
  };// end of doApp()

// ****
// Start the app here
// ****
doApp();

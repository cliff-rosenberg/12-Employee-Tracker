// SPDX-License-Identifier: MIT
// packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');// using 'promise' based MySQL
const table = require('console.table');

// load some cool ASCII art stuff
const figlet = require('figlet');

// instantiate MySQL connection object
//  as global scope for use where needed
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
      console.log('Now connected to employee_tracker database...');
};//end MySQL connection setup

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
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
  menuMain();//back to Main Menu
};//end viewAllDepartments()

// View All Roles function
const viewAllRoles = async () => {
  // using table aliases to make query more readable, see docs at
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
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  };
  menuMain();//back to Main Menu
};//end viewAllRoles()

// View All Employees function
const viewAllEmployees = async () => {
  // using table aliases to make query more readable, see docs at
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
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  };
  menuMain();//back to Main Menu
};// end viewAllEmployees

// Add A Department function
const addDepartment = () => {
  console.log('Add A Department function...');
  return;
};

// Add Roles function
const addRole = async () => {
  //declared here to avoid scope issues
  let deptList;
  let deptExist;
  // get department roles
  try {
    deptExist = await connection.query('SELECT id, name FROM department');
    // destructuring madness??
    deptList = deptExist[0].map(({ id, name }) => ({ value: id, name: `${id} ${name} `}));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  //console.table(deptList);
  //set up prompts for Inquirer
  let resp = await inquirer.prompt(
    [
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the name of the new role: "
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of this role?"
      },
      {
        name: "selectedDept",
        type: "list",
        message: "Which department does this role belong to?",
        choices: deptList
      }
    ]
  );
  // update 'role' table with new data
  try {
    const result = await connection.query(`INSERT INTO role SET ?`, {
      title: resp.roleTitle,
      salary: resp.roleSalary,
      department_id: resp.selectedDept
    });
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  menuMain();//back to Main Menu
};//end addRoles()

// Add An Employee function
const addEmployee = async () => {
  // declared here to avoid scope issues
  let managers;
  let mgrList;
  let empRoles;
  let roleChoices;
  // get list of managers in databse
  try {
    managers = await connection.query('SELECT e.id, e.first_name, e.last_name FROM employee e WHERE role_id = 5');
    // destructuring madness??
    // NOTE: for Inquirer 'choices' to work, must be mapped to 'value:' and 'name:',
    // the 'name:' field being displayed while the 'value:' field is what is returned
    mgrList = managers[0].map(({ id, first_name, last_name }) => ({ value: id, name: `${first_name} ${last_name} `}));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  // get roles for employees
  try {
    empRoles = await connection.query(`SELECT id, title FROM role WHERE title <> 'Manager'`);
    // more destructuring
    // NOTE: for Inquirer 'choices' to work, must be mapped to 'value:' and 'name:',
    // the 'name:' field being displayed while the 'value:' field is what is returned
    roleChoices = empRoles[0].map(({ id, title }) => ({
      value: id, name: `${title}`
    }));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  
  // get new employee information
  const resp = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      color: 'red',
      message: "Enter First Name: "

    },
    {
      name: "last_name",
      type: "input",
      message: "Enter Last Name: "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role?",
      choices: roleChoices
    },
    {
      name: "manager",
      type: "list",
      message: "Who is their manager?",
      choices: mgrList
    }
  ]);
  //console.table(resp);
  // put new Employee data into database
  try {
    const result = await connection.query(`INSERT INTO employee SET ?`, {
      first_name: resp.first_name,
      last_name: resp.last_name,
      role_id: resp.role,
      manager_id: resp.manager
    });
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  menuMain();//back to Main Menu
};

// Update Employee Role function
const updateEmployeeRole = () => {
  console.log('Update Employee Role function...');
  return;
};

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
];//end main menu choices

// main menu function for app
const menuMain = async () => {
      const resp = await inquirer.prompt(mainMenu);
      // main menu Inquirer choices to functions
      switch (resp.menuchoice) {
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

// SPDX-License-Identifier: MIT
// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');// using 'promise' based MySQL
const table = require('console.table');

// Load some cool ASCII art stuff
const figlet = require('figlet');

// Instantiate MySQL connection object
//  as global scope for use where needed
let connection;

// Boilerplate for MySQL database connection,
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
      console.log('\n', '\x1b[7m', 'Connected to employee_tracker_db database...', '\x1b[0m', '\n');
};//** end MySQL connection setup

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
};// ** end doAscii() **

// View All Departments function
const viewAllDepartments = async () => {
  try {
    const results = await connection.query('SELECT d.id AS "Dept. ID", d.name AS "Dept. Name" FROM department d');
  console.log('\n', '\x1b[36m', '---------- Department List ----------', '\x1b[0m', '\n');
  console.table(results[0]);
  console.log('\n', '\x1b[32m', '-------- End Department List --------', '\x1b[0m', '\n');
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  }
  menuMain();//back to Main Menu
};// ** end viewAllDepartments() **

// View All Roles function
const viewAllRoles = async () => {
  // using table aliases to make query more readable, see docs at
  // https://dev.mysql.com/doc/refman/8.0/en/select.html
  const query =`SELECT d.name AS "Department", r.title AS "Role", r.id AS "Role ID#", r.salary AS "Salary" 
  FROM role r 
  JOIN department d ON r.department_id = d.id;`
  // lookup data from 'roles' table and join on role.department_id, deparment.id
  try {
    const results = await connection.query(query);
    // display all results in a table form
    console.log('\n', '\x1b[36m', '-------- Viewing All Roles --------', '\x1b[0m', '\n')
    console.table(results[0]);
    console.log('\n', '\x1b[32m', '---------- End Role List ----------', '\x1b[0m', '\n');
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  };
  menuMain();//back to Main Menu
};// ** end viewAllRoles() **

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
  // display the lookup results in a table here
  try {
    const results = await connection.query(query);
    // display the lookup results in a table here
    console.log('\n', '\x1b[36m', '---------- Employee List ----------', '\x1b[0m', '\n')
    console.table(results[0]);
    console.log('\n', '\x1b[32m', '-------- End Employee List --------', '\x1b[0m', '\n');
  }
  catch (err) {
    console.log(`ERROR - ${err}`);
  };
  menuMain();//back to Main Menu
};// ** end viewAllEmployees() **

// Add A Department function
const addDepartment = async () => {
  //declared here to avoid scope issues
  let deptExist;
  let deptArray = [];
  // get department name list from 'department' table
  try {
    deptExist = await connection.query('SELECT name FROM department');
    // This puts the object values from database query into 2D array
    // so Inquirer can 'validate:' the Department name being entered,
    // making sure it does not already exist in the table
    deptExist[0].forEach((names) => {
      deptArray.push(names.name);
      });
  } catch(err) {
    console.log(`ERROR - ${err}`);
  };
  console.log('\n', '\x1b[36m', '---- Existing Department Names ----', '\x1b[0m', '\n');
  deptArray.forEach((department) => {
    console.log(department);
  })
  console.log('\n', '\x1b[33m', '--------------- END ---------------', '\x1b[0m', '\n')
  // prompt to enter new Department name
  resp = await inquirer.prompt(
    [
      {
        name: 'newDept',
        type: 'input',
        message: 'Enter the new Department name: ',
        validate(value) {
          const test = deptArray.includes(value);
          if (test) {
              return "This Department ID is alread used. Please select a different name."
          } else {
              return true;
          }
        }
      },
    ]
  );//end Inquirer
  // update 'department' table in database with new Department name
  try {
    const result = await connection.query('INSERT INTO department SET ?',
  {
    name: resp.newDept,
  }
  );
  console.log('\n', '\x1b[32m', '---- New Department Added ----', '\x1b[0m', '\n');
  } catch(err) {
    console.log(`ERROR - ${err}`);
  };
  menuMain();//back to Main Menu
};// ** end addDepartment() **

// Add Roles function
const addRole = async () => {
  //declared here to avoid scope issues
  let deptList;
  let deptExist;
  // Get department names list from 'department' table
  try {
    deptExist = await connection.query('SELECT id, name FROM department');
    // destructuring madness??
    // NOTE: for Inquirer 'choices' to work, must be mapped to 'value:' and 'name:',
    // the 'name:' field being displayed while the 'value:' field is what is returned
    deptList = deptExist[0].map(({ id, name }) => ({ value: id, name: `${id} ${name} `}));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
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
  );// end Inquirer loop
  // Update 'role' table in database with new data
  try {
    const result = await connection.query(`INSERT INTO role SET ?`, {
      title: resp.roleTitle,
      salary: resp.roleSalary,
      department_id: resp.selectedDept
    });
  } catch(err) {
    console.log(`ERROR - ${err}`);
  };
  console.log('\n', '\x1b[32m', '------ New Role was added ------', '\x1b[0m', '\n');
  menuMain();//back to Main Menu
};// ** end addRole() **

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
      message: "Enter employee first name: "
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter employee last name: "
    },
    {
      name: "role",
      type: "list",
      message: "Choose their role:",
      choices: roleChoices
    },
    {
      name: "manager",
      type: "list",
      message: "Choose their manager:",
      choices: mgrList
    }
    ]);
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
  };
  menuMain();//back to Main Menu
};// ** end addEmployee() **

// Update Employee Role function
const updateEmployeeRole = async () => {
  let employees;
  let empChoices;
  let empRoles;
  let roleChoices;
  // get list of employees in databse
  try {
    employees = await connection.query('SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id FROM employee e');
    // destructuring results
    // NOTE: for Inquirer 'choices' to work, must be mapped to 'value:' and 'name:',
    // the 'name:' field being displayed while the 'value:' field is what is returned
    empChoices = employees[0].map(({ id, first_name, last_name }) => ({ value: id, name: `${first_name} ${last_name} `}));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  }
  // get roles for employees
  try {
    empRoles = await connection.query(`SELECT id, title FROM role`);
    // more destructuring
    // NOTE: for Inquirer 'choices' to work, must be mapped to 'value:' and 'name:',
    // the 'name:' field being displayed while the 'value:' field is what is returned
    roleChoices = empRoles[0].map(({ id, title }) => ({
      value: id, name: `${title}`
    }));
  } catch(err) {
    console.log(`ERROR - ${err}`);
  };

  // get new employee role info
  const resp = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: "Choose employee name:",
      choices: empChoices
    },
    {
      name: "role",
      type: "list",
      message: "Choose their new role:",
      choices: roleChoices
    }
    ]);//end inquirer

    // update employee role
  try {
    const result = connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`,
    [
    resp.role,
    resp.employee
    ]);
    console.log('\n', '\x1b[32m', '---- Employee Role was updated ----', '\x1b[0m', '\n');
  } catch(err) {
    console.log(`ERROR - ${err}`);
  };
  // ** end database update
  menuMain();//back to Main Menu
};// ** end updateEmployeeRole() **

// Main menu function for app
const menuMain = async () => {
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
        new inquirer.Separator(),
        "Quit",
        new inquirer.Separator(),
      ]
    }
  ];// **end main menu choices
  const resp = await inquirer.prompt(mainMenu);
  // maps main menu Inquirer choices to functions
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
};// ** end of menuMain() **

// simple function to end app
const quitApp = () => {
  console.log('\n', 'Exiting app...', '\n');
  process.exit();//exits app here
};// ** end quitApp() **

// sets MySQL connction,
// displays ASCII banner,
// then calls main menu function
const initApp = async () => {
  await connect();// MySQL database connection setup
  doAscii();//ASCII banner
  menuMain();//call Main Menu function
};// ** end doApp() **

// **********************
// * Start the app here *
// **********************
initApp();

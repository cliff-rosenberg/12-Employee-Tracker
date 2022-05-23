// load necessary modules
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
    console.log(`Connected to the classlist_db database.`)
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

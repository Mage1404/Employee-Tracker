const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();
const employeerole = ['Sales Lead', 'Lead Engineer', 'Account Manager', 'Legal Team Lead', 'Sale Person', 'Accountant', 'Lawyer'];
const managerlist = ['null', 'John A', 'Asheley C', 'Kunal E', 'Sarah G'];
const departmentlist = ['Sales', 'Engineering', 'Finance', 'Legal'];
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

function actionlist() {
  inquirer.prompt(
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do? (User arrow keys)',
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }).then(({ action }) => {
      if (action == 'View All Employees') {
      const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employeename.manager_name
                  FROM employee 
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN employeename ON employee.manager_id = employeename.id;`;
      db.query(sql, (err, answers) => {
        console.table(answers);
        actionlist();
      });
      } else if (action == 'Add Employee') {
        inquirer.prompt([
          {
            type: 'input',
            name: 'firstname',
            message: 'What is your employee first name? (required)',
            validate: nameInput => {
              if (nameInput) {
                return true;
              } else {
                console.log('Please enter the firstname!');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'lastname',
            message: 'What is your employee last name? (required)',
            validate: nameInput => {
              if (nameInput) {
                return true;
              } else {
                console.log('Please enter the lastname!');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'role',
            message: 'What is your employee role? (required)',
            choices: employeerole
          },
          {
            type: 'list',
            name: 'manager',
            message: 'who is your employee manager? (required)',
            choices: managerlist
          }
        ]).then(answers => {
          const role = (employeerole.indexOf(answers.role) + 1);
          const managerid = managerlist.indexOf(answers.manager);
          console.log(role);
          const sql = `INSERT INTO employee
                      (first_name, last_name, role_id, manager_id)
                      VALUES
                      ('${answers.firstname}', '${answers.lastname}', ${role}, ${managerid});`;
          db.query(sql, (err, answers) => {
            console.log('——————————————————');
            console.log('New employee added');
            console.log('——————————————————');
            actionlist();
        });
        });
      } else if (action == 'Update Employee Role') {
        actionlist();
      } else if (action == 'View All Roles') {
        const sql = `SELECT * FROM role`;
        db.query(sql, (err, answers) => {
          console.table(answers);
          actionlist();
        });
      } else if (action == 'Add Role') {
        inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is title of this role? (required)',
            validate: role => {
              if (role) {
                return true;
              } else {
                console.log('Please enter the title!');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is your new role salary? (required)',
            validate: salary => {
              if (salary) {
                return true;
              } else {
                console.log('Please enter the salary!');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'department',
            message: 'which department does this role belong to? (required)',
            choices: departmentlist
          }
        ]).then(answers => {
          const role = (departmentlist.indexOf(answers.department) + 1);
          const sql = `INSERT INTO role
                      (title, salary, department_id)
                      VALUES
                      ('${answers.title}', '${answers.salary}', ${role});`;
          db.query(sql, (err, answers) => {
            console.log('——————————————');
            console.log('New role added');
            console.log('——————————————');
            actionlist();
        });
        });
      } else if (action == 'View All Departments') {
        const sql = `SELECT * FROM department`;
        db.query(sql, (err, answers) => {
          console.table(answers);
          actionlist();
        });
      } else if (action == 'Add Department') {
        inquirer.prompt(
          {
            type: 'input',
            name: 'name',
            message: 'What is your new department name? (required)',
            validate: nameInput => {
              if (nameInput) {
                return true;
              } else {
                console.log('Please enter the department name!');
                return false;
              }
            }
          }).then(answers => {
            const sql = `INSERT INTO department
                        (name)
                        VALUES
                        (${answers.name}),`
            db.query(sql, (err, answers) => {
            console.log('——————————————');
            console.log('New department added');
            console.log('——————————————');
            actionlist();
          })});
      } else if (action == 'Quit') {
        console.log('——————————————');
        console.log('Stop Server');
        console.log('——————————————');
        process.exit();
      }
    });
};





// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log('------------------');
    console.log(' Employee Manager ');
    console.log('------------------');
    actionlist();
  });
});


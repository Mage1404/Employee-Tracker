const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});


function actionlist() {
  var employeegroup = [];
  var managergroup = ['null'];
  var rolegroup = [];
  var departmentgroup = [];
  const employeesql = `SELECT concat(first_name, ' ', last_name) AS name FROM employee;`;
  const rolesql = `SELECT title FROM role;`;
  const departmentlist = `SELECT name FROM department;`;
  db.query(employeesql, (err, answers) => {
    for (var i = 0; i < answers.length; i++) {
      employeegroup.push(answers[i].name);
      managergroup.push(answers[i].name);
    } 
    db.query(rolesql, (err, answers) => {
      for (var i = 0; i < answers.length; i++) {
        rolegroup.push(answers[i].title);
      }
      db.query(departmentlist, (err, answers) => {
        for (var i = 0; i < answers.length; i++) {
          departmentgroup.push(answers[i].name);
        }
        inquirer.prompt(
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do? (User arrow keys)',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
          })
          .then(({ action }) => {
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
                  choices: rolegroup
                },
                {
                  type: 'list',
                  name: 'manager',
                  message: 'who is your employee manager? (required)',
                  choices: managergroup
                }
              ]).then(answers => {
                const role = (rolegroup.indexOf(answers.role) + 1);
                console.log(answers.manager);
                const managerid = managergroup.indexOf(answers.manager);
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
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'name',
                  message: 'Which employee do you want to update (required)',
                  choices: employeegroup
                },
                {
                  type: 'list',
                  name: 'role',
                  message: 'What role do you want to assign to this employee (required)',
                  choices: rolegroup
                }
              ]).then(answers => {
                const employeeid = (employeegroup.indexOf(answers.name) + 1);
                const roleid = (rolegroup.indexOf(answers.role) + 1);
                const sql = `UPDATE employee
                            SET role_id = ${roleid}
                            WHERE id = ${employeeid};`;
                db.query(sql, (err, answers) => {
                  console.log('——————————————————');
                  console.log(' employee updated  ');
                  console.log('——————————————————');
                  actionlist();
              });
              });
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
                  choices: departmentgroup
                }
              ]).then(answers => {
                const role = (departmentgroup.indexOf(answers.department) + 1);
                employeerole.push(answers.title);
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
                  departmentgroup.push(answers.name);
                  const sql = `INSERT INTO department
                              (name)
                              VALUES
                              ('${answers.name}');`
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
      })
    })
  })
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


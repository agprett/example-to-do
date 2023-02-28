const Sequelize = require('sequelize')
const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
        rejectUnauthorized: false
    }
  }
})

module.exports = {
  getTasks: (req, res) => {
    sequelize.query(`SELECT * FROM tasks`)
      .then(dbRes => {
        let lowPriorityComp = []
        let mediumPriorityComp = []
        let highPriorityComp = []

        let lowPriority = []
        let mediumPriority = []
        let highPriority = []

        let tasks = dbRes[0]

        tasks.forEach(task => {
          if(task.status) {
            switch (task.priority) {
              case 'High':
                highPriorityComp.push(task)
                break;
              case 'Medium':
                mediumPriorityComp.push(task)
                break;
              case 'Low':
                lowPriorityComp.push(task)
                break;
            }
          } else {
            switch (task.priority) {
              case 'High':
                highPriority.push(task)
                break;
              case 'Medium':
                mediumPriority.push(task)
                break;
              case 'Low':
                lowPriority.push(task)
                break;
            }
          }
        })

        let resTasks =  [...highPriority, ...mediumPriority, ...lowPriority, ...highPriorityComp, ...mediumPriorityComp, ...lowPriorityComp]

        res.status(200).send(resTasks)
      })
  },

  addTask: (req, res) => {
    if(!!'name' in req.body && !!'priority' in req.body){
      return res.status(400).send('New tasks need a name and a priority')
    }

    const {name, priority} = req.body

    sequelize.query(`INSERT INTO tasks (name, priority)
      VALUES ('${name}', '${priority}');`
    )
      .then(() => {
        res.sendStatus(200)
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  updateTask: (req, res) => {
    if(!!'id' in req.body && !!'status' in req.body){
      return res.status(400).send('You must have and id and status to update')
    }

    let {status} = req.body
    const id = +req.body.id
    
    status === 'complete' ? status = true : status = false
    
    sequelize.query(`UPDATE tasks
    SET status = ${status}
    WHERE task_id = ${id};
    `)
    .then(() => res.status(200).send('Status updated!'))
    .catch(err => {
      console.log(err)
      res.status(500).status('Internal server error.')
    })
  },
  
  deleteTask: (req, res) => {
    if(!!'id' in req.params) {
      return res.status(400).send('You must choose a task to delete.')
    }
    
    const id = +req.params.id

    sequelize.query(`DELETE FROM tasks
      WHERE task_id = ${id};
    `)
      .then(() => res.status(200).send('Task deleted.'))
      .catch(err => {
        console.log(err)
        res.status(500).send('Unable to delete task.')
      })
  }

  // seed: (req, res) => {
  //   sequelize.query(`CREATE TABLE tasks (
  //       task_id SERIAL PRIMARY KEY,
  //       name VARCHAR(50),
  //       priority VARCHAR(50),
  //       status BOOL DEFAULT false
  //     );
      
  //     INSERT INTO tasks (name, priority)
  //     VALUES ('Pay bills', 'medium'),
  //       ('Get groceries', 'low'),
  //       ('Sweep floor', 'low');
  //     `
  //   ).then(() => {
  //     res.sendStatus(200)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     res.sendStatus(500)
  //   })
  // }
}
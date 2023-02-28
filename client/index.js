const taskDisplay = document.getElementById('task-display')
const newTaskForm = document.getElementById('new-task-form')

const updateTask = (id, checked) => {
  let status

  if(checked) {
    status = 'complete'
  } else {
    status = 'incomplete'
  }

  axios.put(`/api/tasks`, {status, id})
    .then(() => {
      getTasks()
    })
}

const deleteTask = (id) => {
  axios.delete(`/api/tasks/${id}`)
    .then(() => {
      getTasks()
    })
}

const buildTask = (task) => {
  const taskDiv = document.createElement('div')
  taskDiv.classList.add('task')

  const statusBox = document.createElement('input')
  statusBox.setAttribute('type', 'checkbox')
  statusBox.classList.add('task-completed')

  if(task.status){
    statusBox.setAttribute('checked', 'true')
  }

  taskDiv.appendChild(statusBox)

  taskDiv.innerHTML += `<p class="task-name">${task.name}</p>
    <p class="task-priority">${task.priority}</p>
    <img
      class='trash-can'
      src='https://www.freeiconspng.com/thumbs/trash-can-icon/trash-can-icon-26.png'
      alt='trash'
    />`

  taskDisplay.appendChild(taskDiv)

  const boxes = document.getElementsByClassName('task-completed')

  const lastBox = boxes[boxes.length - 1]

  lastBox.addEventListener('change', (event) => updateTask(task.task_id, event.target.checked))

  const cans = document.getElementsByClassName('trash-can')

  const lastCan = cans[cans.length - 1]

  lastCan.addEventListener('click', () => deleteTask(task.task_id))
}

const getTasks = () => {
  axios.get('/api/tasks')
    .then(res => {
      const tasks = res.data

      taskDisplay.innerHTML =  ''

      tasks.forEach(task => {
        buildTask(task)
      });
    })
}

const addTask = (event) => {
  event.preventDefault()

  const name = document.getElementById('new-task-name')
  const priority = document.getElementById('new-task-priority')

  const body = {name: name.value, priority: priority.value}

  axios.post('/api/tasks', body)
    .then(() => {
      alert('Task added!')
      getTasks()
    })
}

newTaskForm.addEventListener('submit', addTask)

getTasks()
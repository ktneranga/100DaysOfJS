//initial references
// const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
// let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//function on window load
window.onload = () => {
  updateNote = "";

  console.log(tasksList);

  //Object.keys returns an arrau iterartor
  count = Object.keys(localStorage.length);
  displayTasks();
};

//function to display tasks

const tasksList = [
  // {
  //   task: "sample task 1",
  //   isComplete: 0,
  // },
  // {
  //   task: "sample task 1",
  //   isComplete: 0,
  // },
  // {
  //   task: "sample task 1",
  //   isComplete: 0,
  // },
];

const addTaskHandler = () => {
  const taskInput = document.getElementById("task-input").value;

  if (document.getElementById("task-input").getAttribute("updateIndex")) {
    const index = document
      .getElementById("task-input")
      .getAttribute("updateIndex");

    tasksList[index].task = taskInput;

    document.getElementById("task-input").removeAttribute("updateIndex");
  } else {
    tasksList.push({
      task: taskInput,
      isComplete: 0,
    });
  }
  displayTasks();
};

const addTaskToList = (task, index) => {
  //create task div
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.setAttribute("key", index);
  taskDiv.innerHTML = `
  <p id="${index}" class="taskText">${task.task}</p>
  <button id="edit" class="edit"><i class="fa-solid fa-pen"></i></button>
  <button id="delete" class="delete"><i class="fa-solid fa-trash"></i></button>
  `;

  tasksDiv.appendChild(taskDiv);
  document.getElementById("task-input").value = "";

  if (task.isComplete == 1) {
    document.getElementById(index).style.textDecoration = "line-through";
  }
};

const removeElement = (key) => {
  tasksList.splice(key, 1);
  displayTasks();
};

const editTask = (key) => {
  let task = tasksList[key].task;
  document.getElementById("task-input").value = task;
  document.getElementById("task-input").setAttribute("updateIndex", key);
};

const completeTask = (key) => {
  tasksList[key].isComplete = 1;
  displayTasks();
};

// taskDiv.appendChildo(editButton);

const displayTasks = () => {
  tasksDiv.innerHTML = "";
  if (tasksList.length == 0) {
    document.getElementById("tasks").style.display = "none";
  } else {
    document.getElementById("tasks").style.display = "block";
    tasksList.forEach((task, index) => {
      addTaskToList(task, index);
    });
  }
};

//crate a click event listener

document.addEventListener("click", (e) => {
  const taskElement = e.target.closest(".task");
  let taskKey;
  if (taskElement) {
    taskKey = taskElement.getAttribute("key");
  }
  const classList = e.target.classList;

  console.log(classList);

  switch (true) {
    case classList.contains("delete") || classList.contains("fa-trash"):
      removeElement(taskKey);
      break;

    case classList.contains("edit") || classList.contains("fa-pen"):
      editTask(taskKey);
      break;

    case classList.contains("taskText") || classList.contains("task"):
      completeTask(taskKey);

    default:
      break;
  }
});

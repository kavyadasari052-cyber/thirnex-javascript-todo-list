const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } 
    else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="complete-checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <span>${task.text}</span>

            <button class="edit-btn" data-id="${task.id}">
                Edit
            </button>

            <button class="delete-btn" data-id="${task.id}">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}

// CREATE - Add new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add task button
addTaskBtn.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", function(event) {

    const id = Number(event.target.dataset.id);

    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

// COMPLETE / UNCOMPLETE
taskList.addEventListener("change", function(event) {

    if (event.target.classList.contains("complete-checkbox")) {

        const id = Number(event.target.dataset.id);

        const task = tasks.find(task => task.id === id);

        if (task) {
            task.completed = event.target.checked;

            saveTasks();
            renderTasks();
        }
    }
});

// FILTERS
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Initial display
renderTasks();

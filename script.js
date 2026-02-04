const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const taskProgress = document.querySelector("#taskProgress");
const filterButtons = document.querySelectorAll(".task-filter button");

const tasks = [];
let activeFilter = "all";

const updateStats = () => {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  taskCount.textContent = `${total} tarefa${total === 1 ? "" : "s"}`;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
  taskProgress.textContent = `${percentage}% concluído`;
};

const renderTasks = () => {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "active") {
      return !task.done;
    }
    if (activeFilter === "done") {
      return task.done;
    }
    return true;
  });

  if (filteredTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "task-list__empty";
    empty.textContent =
      activeFilter === "done"
        ? "Nenhuma tarefa concluída ainda."
        : activeFilter === "active"
          ? "Você está em dia! Nenhuma tarefa ativa."
          : "Nenhuma tarefa ainda. Hora de começar ✨";
    taskList.appendChild(empty);
    updateStats();
    return;
  }

  filteredTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-list__item";
    if (task.done) {
      item.classList.add("is-done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.className = "task-list__checkbox";
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-list__text";
    text.textContent = task.text;

    const badge = document.createElement("span");
    badge.className = "task-list__badge";
    badge.textContent = task.done ? "feito" : "em andamento";

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(badge);
    taskList.appendChild(item);
  });

  updateStats();
};

const setFilter = (filter) => {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });
  renderTasks();
};

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) {
    return;
  }
  tasks.unshift({ text: value, done: false });
  taskInput.value = "";
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

setFilter("all");

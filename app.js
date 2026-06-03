const STORAGE_KEY = "vanilla-todos";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const message = document.getElementById("message");

const currentDateText = document.getElementById("currentDateText");
const prevDateBtn = document.getElementById("prevDateBtn");
const nextDateBtn = document.getElementById("nextDateBtn");

const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const weekTitle = document.getElementById("weekTitle");
const weekList = document.getElementById("weekList");

const filterButtons = document.querySelectorAll(".filter-btn");

let todos = loadTodos();
let selectedDate = getDateString(new Date());
let currentFilter = "all";

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateText(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function showMessage(text) {
  message.textContent = text;

  setTimeout(() => {
    message.textContent = "";
  }, 2000);
}

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    date: selectedDate,
  };

  todos.push(newTodo);
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodos();
  render();
}

function editTodo(id) {
  const targetTodo = todos.find((todo) => todo.id === id);

  if (!targetTodo) {
    return;
  }

  const editedText = prompt("수정할 내용을 입력하세요.", targetTodo.text);

  if (editedText === null) {
    return;
  }

  if (editedText.trim() === "") {
    showMessage("수정할 내용은 비워둘 수 없습니다.");
    return;
  }

  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        text: editedText.trim(),
      };
    }

    return todo;
  });

  saveTodos();
  render();
}

function getFilteredTodos() {
  let filteredTodos = todos.filter((todo) => todo.date === selectedDate);

  if (currentFilter === "active") {
    filteredTodos = filteredTodos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    filteredTodos = filteredTodos.filter((todo) => todo.completed);
  }

  return filteredTodos;
}

function renderTodos() {
  todoList.innerHTML = "";
  currentDateText.textContent = formatDateText(selectedDate);

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<li class="empty-text">등록된 Todo가 없습니다.</li>`;
    return;
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    const todoText = document.createElement("span");
    todoText.className = todo.completed ? "todo-text completed" : "todo-text";
    todoText.textContent = todo.text;

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = todo.completed ? "취소" : "완료";
    completeBtn.addEventListener("click", () => toggleTodo(todo.id));

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => editTodo(todo.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    todoItem.appendChild(todoText);
    todoItem.appendChild(completeBtn);
    todoItem.appendChild(editBtn);
    todoItem.appendChild(deleteBtn);

    todoList.appendChild(todoItem);
  });
}

function getMonday(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();

  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);

  return date;
}

function getWeekDates(dateString) {
  const monday = getMonday(dateString);
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
}

function countTodosByDate(dateString) {
  return todos.filter((todo) => todo.date === dateString).length;
}

function renderWeekView() {
  weekList.innerHTML = "";

  const weekDates = getWeekDates(selectedDate);
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];

  weekTitle.textContent = `${firstDate.getMonth() + 1}월 ${firstDate.getDate()}일 ~ ${
    lastDate.getMonth() + 1
  }월 ${lastDate.getDate()}일`;

  const todayString = getDateString(new Date());
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

  weekDates.forEach((date, index) => {
    const dateString = getDateString(date);
    const todoCount = countTodosByDate(dateString);

    const dayButton = document.createElement("button");
    dayButton.className = "week-day";

    if (dateString === selectedDate) {
      dayButton.classList.add("selected");
    }

    if (dateString === todayString) {
      dayButton.classList.add("today");
    }

    dayButton.innerHTML = `
      <div class="day-name">${dayNames[index]}</div>
      <div class="day-number">${date.getDate()}</div>
      <div class="todo-count">${todoCount}개</div>
    `;

    dayButton.addEventListener("click", () => {
      selectedDate = dateString;
      render();
    });

    weekList.appendChild(dayButton);
  });
}

function moveDate(dayAmount) {
  const date = new Date(selectedDate);
  date.setDate(date.getDate() + dayAmount);
  selectedDate = getDateString(date);
  render();
}

function moveWeek(weekAmount) {
  const date = new Date(selectedDate);
  date.setDate(date.getDate() + weekAmount * 7);
  selectedDate = getDateString(date);
  render();
}

function render() {
  renderWeekView();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (todoText === "") {
    showMessage("할 일을 입력해주세요.");
    return;
  }

  addTodo(todoText);
  todoInput.value = "";
});

prevDateBtn.addEventListener("click", () => {
  moveDate(-1);
});

nextDateBtn.addEventListener("click", () => {
  moveDate(1);
});

prevWeekBtn.addEventListener("click", () => {
  moveWeek(-1);
});

nextWeekBtn.addEventListener("click", () => {
  moveWeek(1);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    currentFilter = button.dataset.filter;

    renderTodos();
  });
});

render();
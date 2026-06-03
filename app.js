// localStorage에 저장할 key 이름
const STORAGE_KEY = "vanilla-todos";

// HTML 요소 가져오기
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const message = document.getElementById("message");
const currentDateText = document.getElementById("currentDateText");
const prevDateBtn = document.getElementById("prevDateBtn");
const nextDateBtn = document.getElementById("nextDateBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const weekDaysContainer = document.getElementById("weekDays");
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const weekRangeText = document.getElementById("weekRangeText");

// Todo 데이터와 현재 상태
let todos = loadTodos();
let selectedDate = getDateString(new Date());
let currentFilter = "all";
let weekOffset = 0;

// Date 객체를 YYYY-MM-DD 문자열로 변환
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 화면에 보여줄 날짜 형식 만들기
function formatDateText(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  };

  return date.toLocaleDateString("ko-KR", options);
}

// 해당 주의 월요일 Date 객체 반환
function getMondayOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

// weekOffset에 해당하는 주의 날짜 배열(월~일) 반환
function getWeekDates() {
  const baseMonday = getMondayOfWeek(new Date());
  baseMonday.setDate(baseMonday.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseMonday);
    d.setDate(baseMonday.getDate() + i);
    return d;
  });
}

// selectedDate가 속한 주로 weekOffset 동기화
function syncWeekOffset() {
  const thisMonday = getMondayOfWeek(new Date());
  const selMonday = getMondayOfWeek(new Date(selectedDate + "T00:00:00"));
  weekOffset = Math.round((selMonday - thisMonday) / (7 * 24 * 60 * 60 * 1000));
}

// 주간 뷰 렌더링
function renderWeekView() {
  const weekDates = getWeekDates();
  const start = getDateString(weekDates[0]);
  const end = getDateString(weekDates[6]);
  weekRangeText.textContent = `${start} ~ ${end}`;
  const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
  const todayString = getDateString(new Date());
  weekDaysContainer.innerHTML = "";

  weekDates.forEach((date) => {
    const dateString = getDateString(date);
    const count = todos.filter((t) => t.date === dateString).length;

    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (dateString === todayString) cell.classList.add("today");
    if (dateString === selectedDate) cell.classList.add("selected");

    const countText = count > 0 ? count : "";
    cell.innerHTML = `
      <span class="day-name">${DAY_NAMES[date.getDay()]}</span>
      <span class="day-number">${date.getDate()}</span>
      <span class="day-count">${countText}</span>
    `;

    cell.addEventListener("click", () => {
      selectedDate = dateString;
      renderWeekView();
      renderTodos();
    });

    weekDaysContainer.appendChild(cell);
  });
}

// localStorage에서 Todo 불러오기
function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

// localStorage에 Todo 저장하기
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 안내 메시지 표시
function showMessage(text) {
  message.textContent = text;

  setTimeout(() => {
    message.textContent = "";
  }, 2000);
}

// Todo 추가
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    date: selectedDate,
  };

  todos.push(newTodo);
  saveTodos();
  renderWeekView();
  renderTodos();
}

// Todo 삭제
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderWeekView();
  renderTodos();
}

// Todo 완료 상태 변경
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
  renderTodos();
}

// Todo 수정
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
  renderTodos();
}

// 현재 날짜와 필터에 맞는 Todo만 가져오기
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

// Todo 목록 화면 출력
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

// Todo 입력 폼 제출 이벤트
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

// 이전 날짜로 이동
prevDateBtn.addEventListener("click", () => {
  const date = new Date(selectedDate + "T00:00:00");
  date.setDate(date.getDate() - 1);
  selectedDate = getDateString(date);
  syncWeekOffset();
  renderWeekView();
  renderTodos();
});

// 다음 날짜로 이동
nextDateBtn.addEventListener("click", () => {
  const date = new Date(selectedDate + "T00:00:00");
  date.setDate(date.getDate() + 1);
  selectedDate = getDateString(date);
  syncWeekOffset();
  renderWeekView();
  renderTodos();
});

// 이전 주차로 이동
prevWeekBtn.addEventListener("click", () => {
  weekOffset--;
  renderWeekView();
});

// 다음 주차로 이동
nextWeekBtn.addEventListener("click", () => {
  weekOffset++;
  renderWeekView();
});

// 필터 버튼 클릭 이벤트
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    currentFilter = button.dataset.filter;

    renderTodos();
  });
});

// 처음 페이지가 열렸을 때 화면 출력
renderWeekView();
renderTodos();
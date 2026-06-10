import { useEffect, useMemo, useState } from "react";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import WeekNavigator from "./components/WeekNavigator.jsx";

const TODOS_STORAGE_KEY = "vanilla-todos";
const SELECTED_DATE_STORAGE_KEY = "selected-date";
const WEEK_START_DATE_STORAGE_KEY = "week-start-date";
const FILTER_STORAGE_KEY = "todo-filter";

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateString, amount) {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + amount);
  return getDateString(date);
}

function getMonday(dateString) {
  const date = parseDate(dateString);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff);

  return getDateString(date);
}

function formatDateText(dateString) {
  const date = parseDate(dateString);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function safeParseTodos() {
  try {
    const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch {
    return [];
  }
}

function App() {
  const today = getDateString(new Date());

  const [todos, setTodos] = useState(() => safeParseTodos());

  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem(SELECTED_DATE_STORAGE_KEY) || today;
  });

  const [weekStartDate, setWeekStartDate] = useState(() => {
    const savedWeekStartDate = localStorage.getItem(WEEK_START_DATE_STORAGE_KEY);
    return savedWeekStartDate || getMonday(today);
  });

  const [filter, setFilter] = useState(() => {
    return localStorage.getItem(FILTER_STORAGE_KEY) || "all";
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_STORAGE_KEY, selectedDate);
    setWeekStartDate(getMonday(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem(WEEK_START_DATE_STORAGE_KEY, weekStartDate);
  }, [weekStartDate]);

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
  }, [filter]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timerId = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timerId);
  }, [message]);

  const weekDates = useMemo(() => {
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStartDate, i));
    }

    return dates;
  }, [weekStartDate]);

  const filteredTodos = useMemo(() => {
    let result = todos.filter((todo) => todo.date === selectedDate);

    if (filter === "active") {
      result = result.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    return result;
  }, [todos, selectedDate, filter]);

  const handleAddTodo = (text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      date: selectedDate,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setMessage("");
  };

  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  const handleEditTodo = (id, editedText) => {
    const trimmedText = editedText.trim();

    if (!trimmedText) {
      setMessage("수정할 내용은 비워둘 수 없습니다.");
      return false;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: trimmedText,
            }
          : todo
      )
    );

    setMessage("");
    return true;
  };

  const handleMoveDate = (amount) => {
    setSelectedDate((prevDate) => addDays(prevDate, amount));
  };

  const handleMoveWeek = (amount) => {
    const nextWeekStartDate = addDays(weekStartDate, amount * 7);
    setWeekStartDate(nextWeekStartDate);
    setSelectedDate(nextWeekStartDate);
  };

  const countTodosByDate = (dateString) => {
    return todos.filter((todo) => todo.date === dateString).length;
  };

  return (
    <main className="min-h-screen bg-[#f4f1ff] px-5 py-12 text-[#222]">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(103,43,224,0.15)] sm:p-8">
        <h1 className="mb-2 text-3xl font-bold text-[#672be0]">Todo List</h1>
        <p className="mb-6 text-gray-500">
          날짜별 할 일을 깔끔하게 관리해보세요.
        </p>

        <WeekNavigator
          today={today}
          weekDates={weekDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onMoveWeek={handleMoveWeek}
          countTodosByDate={countTodosByDate}
        />

        <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#f7f4ff] p-4">
          <button
            type="button"
            onClick={() => handleMoveDate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#672be0] text-3xl text-white"
            aria-label="이전 날짜"
          >
            ‹
          </button>

          <div className="text-center">
            <p className="mb-1 text-xs text-gray-500">선택된 날짜</p>
            <h2 className="text-lg font-bold sm:text-xl">
              {formatDateText(selectedDate)}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => handleMoveDate(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#672be0] text-3xl text-white"
            aria-label="다음 날짜"
          >
            ›
          </button>
        </div>

        <TodoInput onAddTodo={handleAddTodo} />

        <p className="mb-3 min-h-6 text-sm text-red-600">{message}</p>

        <FilterTabs filter={filter} onChangeFilter={setFilter} />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
        />
      </section>
    </main>
  );
}

export default App;
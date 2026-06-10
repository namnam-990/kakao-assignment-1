import { useState } from "react";

function TodoItem({ todo, onDeleteTodo, onToggleTodo, onEditTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(todo.text);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(todo.text);
  };

  const handleSubmitEdit = (event) => {
    event.preventDefault();

    const isSuccess = onEditTodo(todo.id, editValue);

    if (isSuccess) {
      setIsEditing(false);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 p-3 sm:flex-nowrap">
      {isEditing ? (
        <form onSubmit={handleSubmitEdit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-[#672be0]"
            autoFocus
          />

          <button
            type="submit"
            className="rounded-xl bg-[#1971c2] px-3 py-2 text-sm text-white"
          >
            저장
          </button>

          <button
            type="button"
            onClick={handleCancelEdit}
            className="rounded-xl bg-gray-500 px-3 py-2 text-sm text-white"
          >
            취소
          </button>
        </form>
      ) : (
        <>
          <span
            className={`min-w-0 flex-1 break-all ${
              todo.completed ? "text-gray-400 line-through" : ""
            }`}
          >
            {todo.text}
          </span>

          <button
            type="button"
            onClick={() => onToggleTodo(todo.id)}
            className="rounded-xl bg-[#2f9e44] px-3 py-2 text-sm text-white"
          >
            {todo.completed ? "취소" : "완료"}
          </button>

          <button
            type="button"
            onClick={handleStartEdit}
            className="rounded-xl bg-[#1971c2] px-3 py-2 text-sm text-white"
          >
            수정
          </button>

          <button
            type="button"
            onClick={() => onDeleteTodo(todo.id)}
            className="rounded-xl bg-[#e03131] px-3 py-2 text-sm text-white"
          >
            삭제
          </button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
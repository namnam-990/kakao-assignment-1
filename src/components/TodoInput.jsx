import { useState } from "react";

function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onAddTodo(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2 flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="할 일을 입력하세요"
        autoComplete="off"
        className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-[#672be0]"
      />

      <button
        type="submit"
        className="rounded-2xl bg-[#672be0] px-5 font-bold text-white"
      >
        추가
      </button>
    </form>
  );
}

export default TodoInput;
import TodoItem from "./TodoItem.jsx";

function TodoList({ todos, onDeleteTodo, onToggleTodo, onEditTodo }) {
  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">
        등록된 Todo가 없습니다.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onEditTodo={onEditTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
"use client";

import { NewTodoForm } from "./_components/NewTodoForm";
import { TodoList } from "./_components/TodoList";

export default function Dashboard() {
  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Todo Dashboard</h1>
      <NewTodoForm />
      <TodoList />
    </div>
  );
}

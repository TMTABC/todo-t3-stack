"use client";

import Header from "@/components/header";
import { NewTodoForm } from "./_components/NewTodoForm";
import { TodoList } from "./_components/TodoList";
import { Separator } from "@/components/ui/separator";
import { TodoChart } from "./_components/TodoCharts";

const breadcrumbs = [{ label: "Todo", href: "#" }, { label: "List" }];

export default function Dashboard() {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Todo List</h1>
        <Separator orientation="horizontal" className="mb-4 mr-2" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <NewTodoForm />
          </div>
          <div className="space-y-4">
            <TodoChart />
          </div>
        </div>
        <div className="mt-4">
          <TodoList />
        </div>
      </div>
    </>
  );
}

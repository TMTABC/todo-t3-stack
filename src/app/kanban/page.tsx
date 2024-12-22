/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { TodoItem } from "../_components/TodoItem";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, columnStyles } from "@/lib/utils";

const breadcrumbs = [{ label: "Todo", href: "/" }, { label: "Kanban" }];

interface IfetchedData {
  status: string;
  description: string;
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
export default function Kanban() {
  const { data: fetchedData, isLoading } = api.post.getAll.useQuery();
  const utils = api.useUtils();
  const UpdateStatusMutation = api.post.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });
  const [data, setData] = useState<{
    columns: Record<string, { id: number; title: string; taskIds: number[] }>;
    tasks: Record<number, IfetchedData>;
    columnOrder: string[];
  } | null>(null);

  const onDragEnd = (result: DropResult) => {
    console.log(result);
    if (!data) return;

    const { destination, source, draggableId } = result;
    if (!destination) return;

    const start = data.columns[source.droppableId] ?? [];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds ?? []);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId as unknown as number);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    UpdateStatusMutation.mutate({
      id: Number(draggableId),
      status: destination?.droppableId,
    });

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart?.id]: newStart,
        [newFinish?.id]: newFinish,
      },
    });
  };

  // Transform fetched data
  useEffect(() => {
    if (fetchedData) {
      const tasks = fetchedData.reduce(
        (acc, task) => {
          acc[task.id] = { ...task };
          return acc;
        },
        {} as Record<number, IfetchedData>,
      );

      const columns = {
        todo: {
          id: "todo",
          title: "To Do",
          taskIds: fetchedData
            .filter((task) => task.status === "todo")
            .map((task) => task.id),
        },
        inProgress: {
          id: "inProgress",
          title: "In Progress",
          taskIds: fetchedData
            .filter((task) => task.status === "inProgress")
            .map((task) => task.id),
        },
        completed: {
          id: "completed",
          title: "Completed",
          taskIds: fetchedData
            .filter((task) => task.status === "completed")
            .map((task) => task.id),
        },
      };

      setData({
        tasks,
        columns,
        columnOrder: ["todo", "inProgress", "completed"],
      });
    }
  }, [fetchedData]);

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Kanban</h1>
        <Separator orientation="horizontal" className="mb-4 mr-2" />

        <div className="p-4">
          {isLoading || !data ? (
            <div className="flex space-x-4">
              {["To Do", "In Progress", "Completed"].map((title, index) => (
                <Card key={index} className="w-60 bg-gray-100">
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-6 w-32" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-10 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex space-x-5"
                  >
                    {data.columnOrder.map((columnId, index) => {
                      const column = data.columns[columnId];
                      const tasks = column?.taskIds.map(
                        (taskId) => data.tasks[taskId],
                      );
                      const { color } = columnStyles[columnId] ?? {
                        color: "bg-gray-100",
                      };

                      return (
                        <Draggable
                          draggableId={`${column?.id}`}
                          index={index}
                          key={column?.id}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className=""
                            >
                              <Card className={cn(color)}>
                                <CardHeader {...provided.dragHandleProps}>
                                  <CardTitle className="text-lg font-bold">
                                    {column?.title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Droppable
                                    droppableId={`${column?.id}`}
                                    type="task"
                                  >
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                      >
                                        {tasks?.map((task, index) => (
                                          <Draggable
                                            key={task?.id}
                                            draggableId={`${task?.id}`}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                              >
                                                {!!task && (
                                                  <TodoItem
                                                    showStatus={false}
                                                    todo={task}
                                                  />
                                                )}
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </>
  );
}

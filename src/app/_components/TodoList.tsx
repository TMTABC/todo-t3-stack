import { api } from "@/trpc/react";
import { TodoItem } from "./TodoItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonDemo() {
  return (
    <div className="my-4 flex items-center">
      <Skeleton className="h-15 w-full" />
    </div>
  );
}

export function TodoList() {
  const { data, isFetching } = api.post.getAll.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div>
            <SkeletonDemo />
            <SkeletonDemo />
            <SkeletonDemo />
          </div>
        ) : (
          <ul className="space-y-2">
            {!!data && data.length > 0 ? (
              data.map((item) => <TodoItem key={item.id} todo={item} />)
            ) : (
              <p className="text-sm text-gray-500">
                No todos available. Add one to get started!
              </p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

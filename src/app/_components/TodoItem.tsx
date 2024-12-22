import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";

interface ITodoItemProps {
  todo: {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function TodoItem({ todo }: ITodoItemProps) {
  const DeleteMutation = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      toast({
        title: "Deleted succesfully",
        variant:'default'
      },);
    },
  });
  const utils = api.useUtils();
  const { toast } = useToast();
  const handleDelete = () => {
    DeleteMutation.mutate({
      id: todo.id,
    });
  };
  return (
    <li className="flex items-center justify-between rounded bg-white p-2 shadow">
      <div className="flex items-center space-x-2">
        {todo.id} -
        <label
          htmlFor={`todo`}
          //   className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
        >
          {todo?.name}
        </label>
      </div>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </li>
  );
}

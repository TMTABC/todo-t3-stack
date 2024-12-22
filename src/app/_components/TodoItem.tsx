import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, columnStyles } from "@/lib/utils";

interface ITodoItemProps {
  todo: {
    name: string;
    id: number;
    status: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  };
  showStatus?: boolean;
}

export function TodoItem({ todo, showStatus = true }: ITodoItemProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  // State for dialogs
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [name, setNewName] = React.useState(todo.name);
  const [description, setNewDescription] = React.useState(todo.description);
  const [status, setNewStatus] = React.useState(todo.status);

  const DeleteMutation = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      toast({
        title: "Deleted successfully",
        variant: "default",
      });
      setDeleteDialogOpen(false);
    },
  });

  const UpdateMutation = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      toast({
        title: "Updated successfully",
        variant: "default",
      });
      setEditDialogOpen(false);
    },
  });

  const handleDelete = () => {
    DeleteMutation.mutate({
      id: todo.id,
    });
  };

  const handleEdit = () => {
    UpdateMutation.mutate({
      id: todo.id,
      name,
      description,
      status,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(); // Format the date as needed
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{todo.name}</CardTitle>
            <CardDescription>{todo.description}</CardDescription>
          </div>

          <div className="flex space-x-2">
            {showStatus && (
              <div
                className={cn(
                  "uppercase", // Always apply this class
                  "rounded-md", // Add border radius,
                  "p-2",
                  columnStyles[status].color
                )}
              >
                {todo?.status}
              </div>
            )}

            {/* Edit Icon - Opens edit dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Todo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="name">Task Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description</label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select
                      value={status}
                      onValueChange={(e) => setNewStatus(e)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="inProgress">
                            In progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="todo">Todo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={UpdateMutation.isPending}
                    loadingText="Updating..."
                    onClick={handleEdit}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Icon - Opens delete confirmation dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this task?
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={DeleteMutation.isPending}
                    loadingText="Deleting"
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Updated Time */}
        <div className="mt-2 text-sm text-gray-500">
          Updated at: {formatDate(todo.updatedAt)}
        </div>
      </CardHeader>
    </Card>
  );
}

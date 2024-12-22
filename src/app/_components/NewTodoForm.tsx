import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function NewTodoForm() {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { toast } = useToast();
  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setDescription("");
      toast({
        title: "Added successfully",
        variant: "default",
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name,description });
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Create a New Todo</CardTitle>
          <CardDescription>
            Organize your tasks by adding a new todo item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Todo Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter the name of your task"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                placeholder="Enter a brief description of your task"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setName("");
              setDescription("");
            }}
          >
            Clear
          </Button>
          <Button type="submit" loading={createPost.isPending} loadingText="Adding...">Add Todo</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

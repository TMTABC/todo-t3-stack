import { api } from "@/trpc/react";
import { TodoItem } from "./TodoItem";

export function TodoList() {
    const {data}=api.post.getAll.useQuery()
  return (
    <ul className="mt-4 space-y-2">
       {
        !!data && data?.length>0 ?<>
        {
            data?.map((item)=><TodoItem key={item.id} todo={item} />)
        }
        </>:"No todo added"
       }
       
      
     
    </ul>
  );
}

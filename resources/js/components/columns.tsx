import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Task = {
  id: string
  user: string,
  action: Object
}

export type User = {
  id: string
  name: string
  role: string
  action: Object
}


export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "Task Id",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <>
          <Button variant="outline">View</Button>
          
        </>
      )
    }
  },
]

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "section",
    header: "Section"
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original
      return (
        <>
          <Button variant="outline">Edit</Button>
          
        </>
      )
    }
  },
]
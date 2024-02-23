import {v4 as uuidv4} from "uuid"
import { ToDo } from "./ToDo"

const possibleColors = getComputedStyle(document.documentElement)

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

import { InvalidatedProjectKind } from "typescript"

export interface IProject{
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 
}

export function getInitials (string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1);
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1);
    }
    return initials;
};



export class Project implements IProject{
    //To satisfy the interface
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 

    //Internal properties
    cost: number = 0
    progress: number = 0
    id: string
    initials: string
    backgroundColor: number
    todos: ToDo[] = []

    constructor(data: IProject, id = uuidv4()){

        for (const key in data){
            this[key] = data[key]
        }

        this.initials = getInitials(this.name)
        this.backgroundColor = Math.ceil(Math.random()*6)

        try
            {this.finishDate.toISOString()}
        catch
            {this.finishDate = new Date (this.finishDate.toString().split("T")[0])}
    
        // this.name = data.name;
        // this.description = data.description;
        // this.status = data.status;
        // this.userRole = data.userRole;
        // this.finishDate = data.finishDate;
        this.id = id;
    }
    //

    getToDo(toDoName: string){
        const toDo = this.todos.find((toDo)=>{
            return toDo.name === toDoName
        })
        return toDo;
    }

    deleteToDo(toDoName: string){
        const toDo = this.getToDo(toDoName)
        if(!toDo) {return}
        //toDo.ui.remove()

        const remaining = this.todos.filter((toDo) =>{
            return toDo.name !== toDoName
        })
        this.todos = remaining
    }

    deleteAllToDos(){
        this.todos = []
    }


    
        
}
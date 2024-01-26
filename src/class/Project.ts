import {v4 as uuidv4} from "uuid"

const possibleColors = getComputedStyle(document.documentElement)

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"
export type ToDoStatus = "Done" | "WiP" | "Unstarted"
export type UserName = "User 1" | "User 2" | "User 3"

import { InvalidatedProjectKind } from "typescript"

export interface IProject{
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 
}

var getInitials = function (string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1);
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1);
    }
    return initials;
};

export interface IToDo{
    name: string
    description: string
    status: ToDoStatus
    assignedTo: UserName
    finishDate: Date
}

export class ToDo implements IToDo{
    name: string
    description: string
    status: ToDoStatus
    assignedTo: UserName
    finishDate: Date

    ui:HTMLElement | null
    backgroundColor: number

    setBackgroundColor(){
    if(this.status === "Done"){
        this.backgroundColor = 0
    }
    if(this.status === "WiP"){
        this.backgroundColor = 1
    }

    if(this.status === "Unstarted"){
        this.backgroundColor = 2
        
    }
    } 

    constructor(data){
        for (const key in data){
            this[key] = data[key]
        }

        try
            {this.finishDate.toISOString()}
        catch
            {this.finishDate = new Date (this.finishDate.toString().split("T")[0])}

        this.setBackgroundColor()  
        this.setUI()
          
    }

    

    

    setUI() {
        if(this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div");
        this.ui.className = "todo-item"
        //this.ui.style.backgroundColor = possibleColors.getPropertyValue("--task"+this.backgroundColor)
        this.ui.style.display = "flex"
        this.ui.style.justifyContent = "space-between"
        this.ui.style.alignItems = "center"
        this.ui.innerHTML = `
        <div>
        <div style="display: flex; column-gap: 15px; align-items: center; padding: 0px;">
        <span class="material-symbols-outlined" style="padding: 10px; background-color: ${possibleColors.getPropertyValue("--task"+this.backgroundColor)}; border-radius: 10px;">
                                                construction
        </span>
        <p name = 'name'>
            ${this.name}
        </p>
        </div>
        </div>
        <p name = 'date' ; style="text-wrap: nowrap; margin-left: 10px;"> ${this.finishDate.toISOString().split("T")[0]}</p>
        </div>`
        }
}

export class Project implements IProject{
    //To satisfy the interface
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 

    //Internal properties
    ui: HTMLElement | null
    cost: number = 0
    progress: number = 0
    id: string
    initials: string
    backgroundColor: number
    todos: ToDo[] = []

    constructor(data: IProject){

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
        this.id = uuidv4();
        this.setUI();
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
        toDo.ui.remove()

        const remaining = this.todos.filter((toDo) =>{
            return toDo.name !== toDoName
        })
        this.todos = remaining
    }

    deleteAllToDos(){
        this.todos = []
    }

    setUI() {
        if(this.ui instanceof HTMLDivElement) {return}
        this.ui = document.createElement("div");
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
        <p class = "project-initials" style="font-size: 20px; aspect-ratio: 1; width: 30px; text-align: center; border-radius: 100%; padding: 12px; background-color: ${possibleColors.getPropertyValue('--random'+this.backgroundColor)}; text-transform: uppercase; ")>${this.initials}</p>
        <div>
            <h5 id="project-name">${this.name}</h2>
            <p id="project-description">${this.description}</p>
        </div>   
        </div>
        <div class="card-content">
        <div class = "card-property">
            <p class = "property-name">Status</p>
            <p>${this.status}</p>
        </div>
        <div class = "card-property">
            <p class = "property-name">Role</p>
            <p>${this.userRole}</p>
        </div>
        <div class = "card-property">
            <p class = "property-name">Cost</p>
            <p>$${this.cost}</p>
        </div>
        <div class = "card-property">
            <p class = "property-name">Estimated Progress</p>
            <p> ${this.progress}</p>
        </div>
        </div>`
        }

    
        
}
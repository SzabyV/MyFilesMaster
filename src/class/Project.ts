import {v4 as uuidv4} from "uuid"

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

import { InvalidatedProjectKind } from "typescript"

export interface IProject{
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 
}

export class Project implements IProject{
    //To satisfy the interface
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date 

    //Internal properties
    ui: HTMLElement
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject){

        for (const key in data){
            this[key] = data[key]
        }
        // this.name = data.name;
        // this.description = data.description;
        // this.status = data.status;
        // this.userRole = data.userRole;
        // this.finishDate = data.finishDate;
        this.id = uuidv4();
        this.setUI();

        
        

    }

    setUI() {
        if(this.ui) {return}
        this.ui = document.createElement("div");
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
        <p class = "project-initials">HC</p>
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
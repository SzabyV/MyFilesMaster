export type ToDoStatus = "Done" | "WiP" | "Unstarted"
export type UserName = "User 1" | "User 2" | "User 3"

const possibleColors = getComputedStyle(document.documentElement)

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
        
        <p name = 'date' ; style="text-wrap: nowrap; margin-left: 10px;"> ${this.finishDate.toISOString().split("T")[0]}</p>
        </div>`
        }
}
import { IProject, IToDo, Project, ProjectStatus, ToDo, UserRole, ToDoStatus, UserName } from "./Project";
import { addOrEditTask,createErrorMessage,checkDate, toggleModal, editTaskModalEvent } from "./Functions";
import { updateDocument } from "../firebase";



const possibleColors = getComputedStyle(document.documentElement) 

export class ProjectsManager{
    list: Project[] = []
    onProjectCreated = (project: Project) => {} 
    onProjectDeleted = (id:string) => {} 
    /*
    constructor(){
        
        
            this.newProject({
                name: "Project Name",
                description: "Description",
                status: "Active",
                userRole: "Architect",
                finishDate: new Date("2023-12-08"),
            })
        
    }
    */

    filterProjects(value:string){
        const filteredProjects = this.list.filter((project)=>{
            return project.name.includes(value)
        })
        return filteredProjects
    }

    newProject(data: IProject, id?:string,){
        const projectNames = this.list.map((project) => {return project.name})
        const nameInUse = projectNames.includes(data.name)
        if(nameInUse){
            throw new Error(`A project witht the name "${data.name}" already exists`)
        }

        const project = new Project (data, id);
        if(project.ui){

            project.ui.addEventListener("click",()=>{
                const projectsPage = document.getElementById("projects-page")
                const detailsPage = document.getElementById("project-details")
                if(!projectsPage || !detailsPage) {return}
                //projectsPage.style.display = "none"
                //detailsPage.style.display = "flex"
                this.setDetailsPage(project)
                this.setTasksList(project)
            })

            
        }
        this.list.push(project);
        this.onProjectCreated(project)
        return project;
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) {return}
        const names = detailsPage.querySelectorAll("[data-project-info = 'name']")
        if(names) {names.forEach((name) => name.textContent = project.name)}
        const descriptions = detailsPage.querySelectorAll("[data-project-info = 'description']")
        if(descriptions) {descriptions.forEach((description) =>description.textContent = project.description)}
        const status = detailsPage.querySelector("[data-project-info = 'status']")
        if(status) {status.textContent = project.status}
        const cost = detailsPage.querySelector("[data-project-info = 'cost']")
        if(cost) {cost.textContent = "$" + project.cost as string}
        const userRole = detailsPage.querySelector("[data-project-info = 'userRole']")
        if(userRole) {userRole.textContent = project.userRole}
        const finishDate = detailsPage.querySelector("[data-project-info = 'finishDate']") as HTMLElement
        if(finishDate) {finishDate.textContent = project.finishDate.toISOString().split("T")[0]}
        const initials = detailsPage.querySelector("[data-project-info = 'project-initials']") as HTMLElement
        if(initials) {
            initials.textContent = project.initials as string
            initials.style.backgroundColor = possibleColors.getPropertyValue('--random'+project.backgroundColor);
            
        }
        const progress = detailsPage.querySelector("[data-project-info = 'progress']") as HTMLElement
        if(progress) {progress.innerHTML = "<div data-project-info='progress-bar' style='width: 80%; background-color: green; padding: 4px 0;'></div>" + project.progress as string;
            const progressBar = detailsPage.querySelector("[data-project-info = 'progress-bar']") as HTMLElement
            progressBar.style.width = project.progress as string + "%";
        }


    }

    private setTasksList(project:Project)
    {
        const taskList = document.getElementById("task-list") as HTMLElement
        project.todos.forEach(element=> {
            if(element.ui){
                taskList.append(element.ui)
                element.ui.addEventListener("click",()=>editTaskModalEvent(element))
            }
        });
        
    }

    

    getProject(id:string){
        const project = this.list.find((project)=>{
            return project.id === id
        })
        return project;
    }

    editProject(id:string, data: IProject){ 
        //this.deleteProject(id)
        //this.newProject(data)

        const project = this.getProject(id)
        //const oldProject = project
        if(project)
        {
            project[id] = id
            for (const key in data){
                //if(!project[key] === data[key])
                    project[key] = data[key]
                    updateDocument<Partial<IProject>>("/projects", id, data)
                
            }
            //need to delete old project, because id is unique
            //this.deleteProject(id)

        //const project = this.getProjectByName(data.name as string) as Project
            this.setDetailsPage(project)
            //project.ui = null
            //project.ui.remove() // vmiert nem torli ki a ui-t
            //project.setUI()
            /*
            if(project.ui)
                project.ui.addEventListener("click",()=>{
                    const projectsPage = document.getElementById("projects-page")
                    const detailsPage = document.getElementById("project-details")
                    if(!projectsPage || !detailsPage) {return}
                    projectsPage.style.display = "none"
                    detailsPage.style.display = "flex"
                    this.setDetailsPage(project)
                    this.setTasksList(project)
                })
                */
            this.list.push(project)
            if(project.ui)
                this.ui.append(project.ui)
        }
        else{
            console.log("project not found")
        }
    }

    deleteProject(id:string) {
        const project = this.getProject(id)
        if(!project) {return}
        if(project.ui)
            project.ui.remove()

        const remaining = this.list.filter((project) =>{
            return project.id !== id
        })
        this.list = remaining
        this.onProjectDeleted(id)
    }

    getProjectByName(name:string){
        const project = this.list.find((project)=>{
            return project.name === name
        })
        return project;
    }

    getTotalCost(){
        const initialValue = 0;
        const costs = this.list.map((project) => {return project.cost});
        const totalCost = costs.reduce((accumulator,currentValue)=> accumulator + currentValue, initialValue,);
        return totalCost;
    }

    


    addNewTask(id:string, task: ToDo){
        const project = this.getProject(id) as Project
        project.todos.push(task)

        const detailsPage = document.getElementById("project-details")
        
        if(detailsPage instanceof HTMLElement && detailsPage.style.display === "flex")
        {
            
            const taskList = document.getElementById("task-list") as HTMLElement
            if(task.ui)
                taskList.append(task.ui)

            //create edit event
            const toDoForm=document.getElementById("todos-form")
            if(toDoForm){
                toDoForm.setAttribute("taskName",task.name)
                const header = toDoForm.querySelector("h2")
                if(header)
                    header.innerHTML= "Edit Task"
                    if(task.ui)
                        task.ui.addEventListener("click",()=>editTaskModalEvent(task))
            }
        }
        
    }

    editTask(id:string, taskName: string, data: IToDo){
        const project = this.getProject(id)
        if(project){
            const toDo = project.getToDo(taskName)
            if(toDo){
                for (const key in data){
                    toDo[key] = data[key]
                }
        
                try
                    {toDo.finishDate.toISOString()}
                catch
                    {toDo.finishDate = new Date (toDo.finishDate.toString().split("T")[0])}
        
                toDo.setBackgroundColor()
                const uiName= toDo.ui?.querySelector("[name = 'name']") as HTMLElement
                if(uiName)
                    uiName.textContent = toDo.name as string
                const uiDate = toDo.ui?.querySelector("[name = 'date']") as HTMLElement
                if(uiDate)
                    uiDate.textContent = toDo.finishDate.toISOString().split("T")[0] as string
                const uiIcon = toDo.ui?.querySelector(".material-symbols-outlined") as HTMLElement
                if(uiIcon)
                    uiIcon.style.backgroundColor = possibleColors.getPropertyValue("--task"+toDo.backgroundColor)
                
                //toDo.ui?.remove()
                //toDo.ui = null  
                //toDo.setUI()
                //this.setTasksList(project)
            }
        }
    }

    exportToJSON(fileName: string = "projects") { // tasks' status and assignedTo properties get exported as "null"
        const json = JSON.stringify(this.list, null,2)
        const blob = new Blob ([json],{type:"application/json"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "application/json"
        const reader = new FileReader()
        reader.addEventListener("load", () =>{
            const json = reader.result
            if(!json){ return}
            const projects: Project[] = JSON.parse(json as string)
            const iProjects: IProject[] = JSON.parse(json as string)

            var i = 0
            for(const iProject of iProjects){
                //const project = projects[i]
                const projectNames = this.list.map((project) => {return project.name})
                const nameInUse = projectNames.includes(iProject.name)
                try {
                    if(!nameInUse){
                    //const toDoes2: IToDo[] = JSON.parse(project.todos as string)
                        this.newProject(iProject)
                        const project = this.getProjectByName(iProject.name)
                        if(project){
                            const iToDoes = project.todos as IToDo[]
                            project.todos = []
                            if(iProject && iToDoes.length>0)
                            for (const IToDo of iToDoes)
                                {
                                    const toDo = new ToDo(IToDo)
                                    this.addNewTask(project.id,toDo)
                                }
                        }
                    
                    i=i+1
                    }
                    else{
                        const project = this.getProjectByName(iProject.name)
                        if(project instanceof Project){
                            this.editProject(project.id, iProject)
                            const iToDoes = project.todos as IToDo[]
                            if(iProject && iToDoes.length>0)
                            for (const IToDo of iToDoes)
                                {
                                    const toDo = new ToDo(IToDo)
                                    this.addNewTask(project.id,toDo)
                                }
                            }
                    }
                }
                catch(error){
                    console.warn("Error" + error);
                }
            }
        })
        input.addEventListener("change", ()=>{
        const filesList = input.files
        if(!filesList) {return}
        reader.readAsText(filesList[0])
    })
    input.click()
    }
}


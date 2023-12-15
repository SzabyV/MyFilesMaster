import { IProject, Project } from "./Project";
//import { createErrorMessage } from "..";

export class ProjectsManager{
    list: Project[] = []
    ui: HTMLElement

    constructor(container:HTMLElement){
        this.ui = container
    }

    newProject(data: IProject){
        const projectNames = this.list.map((project) => {return project.name})
        const nameInUse = projectNames.includes(data.name)
        if(nameInUse){
            throw new Error(`A project witht the name "${data.name}" already exists`)
        }

        const project = new Project (data);

        project.ui.addEventListener("click",()=>{
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if(!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
        })

        this.list.push(project);
        this.ui.append(project.ui)
        return project;
    }

    getProject(id:string){
        const project = this.list.find((project)=>{
            return project.id === id
        })
        return project;
    }

    deleteProject(id:string) {
        const project = this.getProject(id)
        if(!project) {return}
        project.ui.remove()

        const remaining = this.list.filter((project) =>{
            return project.id !== id
        })
        this.list = remaining
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

    exportToJSON(fileName: string = "projects") {
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
            const projects:IProject[] = JSON.parse(json as string)
            for(const project of projects){
                try {
                    this.newProject(project)
                }
                catch(error){
                    //createErrorMessage(error)
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
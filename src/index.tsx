import * as THREE from "three"
import * as OBC from "openbim-components"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Router from "react-router-dom"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"

import {IProject, Project, ProjectStatus, UserRole} from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager";
import { ProjectDetails } from "./react-components/ProjectDetails"
import { UsersPage } from "./react-components/UsersPage"
import { ViewerProvider } from "./react-components/IFCViewer"
import { getCollection } from "./firebase"

const projectsManager = new ProjectsManager()
const projectsCollection = getCollection<IProject>("/projects")

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <>
    <Router.BrowserRouter>
        <ViewerProvider>
            <Sidebar />
            <Router.Routes>
                <Router.Route path = "/" element={<ProjectsPage projectsManager={projectsManager}/>}></Router.Route>
                <Router.Route path = "/project/:id"   element = {<ProjectDetails projectsManager={projectsManager} />}></Router.Route>
                <Router.Route path = "/users" element = {<UsersPage/>}></Router.Route>
            </Router.Routes>
        </ViewerProvider>
    </Router.BrowserRouter>
    </>


)
/*
var modalShown = false;
var errorShown = false;
/*/
/*/

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager= new ProjectsManager()
if(projectsListUI.innerHTML === ""){

    const projectData: IProject = {
        name: "Project Name",
        description: "Description",
        status: "Active",
        userRole: "Architect",
        finishDate: new Date("2023-12-08"),
    }
    
    const project = projectsManager.newProject(projectData);
    
}
if(newProjectButton){
newProjectButton.addEventListener("click", () => toggleModal("new-project-modal"));
}
else{
    console.warn("project button was not found, man!");
}


export function fillOutModal(id: string, projectData: Project){
    const projectForm = document.getElementById(id+"-form");
    if(projectForm && projectForm instanceof HTMLFormElement){

        
            //const formData = new FormData(projectForm);
            //const projectData = projectsManager.getProject(projectId) as Project
            if(projectData){
                const name = projectForm.querySelector("name = name") as HTMLElement
                name.textContent = projectData.name

                const description = projectForm.querySelector("name = description") as HTMLElement
                description.textContent = projectData.description

                const role = projectForm.querySelector("name = userRole") as HTMLSelectElement
                role.value = projectData.userRole

                const status = projectForm.querySelector("name = status") as HTMLSelectElement
                status.value = projectData.status

                const date = projectForm.querySelector("name = finishDate") as HTMLInputElement
                date.valueAsDate = projectData.finishDate


                //projectForm.setAttribute("name") = 
            }
        
}}

function submitOrCancelModal (id: string) { //"new-project
    const projectForm = document.getElementById(id+"-form");
    
    if(projectForm && projectForm instanceof HTMLFormElement){


        projectForm.addEventListener("submit",(event) =>{
            event.preventDefault();
            const formData = new FormData(projectForm);     
        
            const projectData: IProject = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                status: formData.get("status") as ProjectStatus,
                userRole: formData.get("userRole") as UserRole,
                finishDate: checkDate(formData),
            }
            

        

            if(projectData.name.length > 5)
            {
                try{
                    const project = projectsManager.newProject(projectData);
                    projectForm.reset();
                    toggleModal(id+"-modal");
                    console.log(project);
                }catch(error){
                    createErrorMessage(error);
                
                    //alert(error)
            }
            
            }
            else{createErrorMessage("Name is too short");}
        })

        const projectFormCancel = projectForm.querySelector(".form-button-container .cancel");
        if(projectFormCancel && projectFormCancel instanceof HTMLButtonElement){
            projectFormCancel.addEventListener("click",(event) =>{
                projectForm.reset();
                toggleModal(id+"-modal");
                console.log("form has been cancelled");
            })
        }
    }
}

submitOrCancelModal("new-project")

const exportProjectBtn= document.getElementById("export-projects-btn")
if(exportProjectBtn){
    exportProjectBtn.addEventListener("click",()=>{
        projectsManager.exportToJSON()
    })
}

const importProjectBtn = document.getElementById("import-projects-btn")
if(importProjectBtn){
    importProjectBtn.addEventListener("click", ()=>{
        projectsManager.importFromJSON()
    })
}


*/






    
            
        

    


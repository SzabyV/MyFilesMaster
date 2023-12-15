import {IProject, Project, ProjectStatus, UserRole} from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager";
//this method calls a button from our main html file
const newProjectButton = document.getElementById("new-project-button")

var modalShown = false;
var errorShown = false;
/*/
const showModal = (id:string) =>{
    
    const modal = document.getElementById(id);
    if(modal && modal instanceof HTMLDialogElement){
    modal.showModal();
    } else{
        console.warn("the provided modal was not found, man. ID: ",id)
    }
}
/*/

const toggleModal = (id:string) =>{
    
    const modal = document.getElementById(id);
    if(modal && modal instanceof HTMLDialogElement){
        if(modalShown === true){
            modal.close();
            modalShown = false;
        }
        else{
            modal.showModal();
            modalShown = true;
        }
    }
    else{
        console.warn("the provided modal was not found, man. ID: ",id)
    }
}

export function createErrorMessage(error) {
    const errorPopup = document.getElementById("error-popup") as HTMLDialogElement;
    errorPopup.showModal();
    const errorMessage = errorPopup.querySelector("p") as HTMLElement;
    errorMessage.innerText=error;
    const okButton = errorPopup.querySelector("button") as HTMLElement;
    okButton.addEventListener("click",(event) =>{
        event.preventDefault();
        errorPopup.close();
    })
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager= new ProjectsManager(projectsListUI)
if(projectsListUI.innerHTML === ""){

    const projectData: IProject = {
        name: "Project Name",
        description: "Description",
        status: "active",
        userRole: "architect",
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

function ProjectInfo(name, description,status, userRole, finishDate){
    this.name = name;
    this.description= description;
    this.status= status;
    this.userRole= userRole;
    this.finishDate= finishDate;
}



const projectForm = document.getElementById("new-project-form");
if(projectForm && projectForm instanceof HTMLFormElement){
    projectForm.addEventListener("submit",(event) =>{
        event.preventDefault();
        const formData = new FormData(projectForm);
        
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate")as string),
        }
        try{
            const project = projectsManager.newProject(projectData);
            projectForm.reset();
            toggleModal("new-project-modal");
            console.log(project);
        }catch(error){
            createErrorMessage(error);
          
            //alert(error)
        }
    })

    const projectFormCancel = document.querySelector(".form-button-container .cancel");
    if(projectFormCancel && projectFormCancel instanceof HTMLButtonElement){
        projectFormCancel.addEventListener("click",(event) =>{
            projectForm.reset();
            toggleModal("new-project-modal");
            console.log("form has been cancelled");
        })
    }
}

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

const projectsPageBtn = document.getElementById("projects-page-btn")
if(projectsPageBtn){
    projectsPageBtn.addEventListener("click",()=>{
        const projectsPage = document.getElementById("projects-page") as HTMLElement
        const detailsPage = document.getElementById("project-details") as HTMLElement
        projectsPage.style.display = "flex"
        detailsPage.style.display = "none"
})
}


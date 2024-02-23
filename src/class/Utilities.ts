import { ProjectsManager } from "./ProjectsManager";
import { Project } from "./Project";
import {ToDo, IToDo, ToDoStatus, UserName} from "./ToDo"

var modalShown = false;
var errorShown = false;

export function checkDate(formData: FormData){
    var finishDate: Date
    if(!isNaN(new Date(formData.get("finishDate")as string))){
        finishDate = new Date(formData.get("finishDate")as string)
    }
    else{
        finishDate = new Date("01/01/2050")
    }
    return finishDate
}

export function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export const toggleModal = (id:string) =>{
    
    const modal = document.getElementById(id);
    if(modal && modal instanceof HTMLDialogElement){
        modalShown= modal.checkVisibility()
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

export function addOrEditTask(event, projectsManager: ProjectsManager)
{   const toDoForm=document.getElementById("todos-form") as HTMLFormElement
    //new or edit
    const keyword = toDoForm.querySelector("h2")?.innerHTML.replace( " Task","")
    const taskName = toDoForm.getAttribute("taskName") as string
    if(toDoForm){
        event.preventDefault();
        const projectName = document.querySelector("[data-project-info = 'name']") as HTMLElement
        const project = projectsManager.getProjectByName(projectName.textContent as string) as Project

        const formData = new FormData(toDoForm);
        const toDoData: IToDo = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("todo-status") as ToDoStatus,
            assignedTo: formData.get("assigned-to") as UserName,
            finishDate: checkDate(formData),
        }
        var task:ToDo
        if(taskName === "")
            task = new ToDo(toDoData)
        else{
            task = project.getToDo(taskName) as ToDo
            //if (task !instanceof ToDo)
                //createErrorMessage("task was not found, man!");
        }
        
        
            
        

        if(toDoData.name.length > 5)
        {
            try{
                if(keyword === "New"){
                    
                    projectsManager.addNewTask(project.id, task)
                    
                }
                if(keyword === "Edit"){
                    
                    projectsManager.editTask(project.id, task.name, toDoData)
                    
                }
                toDoForm.reset();
                toggleModal("todos-modal");
                console.log(task);
                
            }catch(error){
                createErrorMessage(error);
            
        }
        
        }
        else{createErrorMessage("Name is too short");}
    }
    
}

export function editTaskModalEvent(task: ToDo){
    const toDoForm=document.getElementById("todos-form")
    
    toggleModal("todos-modal")
    if(toDoForm && toDoForm instanceof HTMLFormElement)
    {
        toDoForm.setAttribute("taskName",task.name)

        toDoForm.setAttribute("taskName",task.name)
        const header = toDoForm.querySelector("h2")
        if(header)
            header.innerHTML= "Edit Task"

        const formName = toDoForm.querySelector("[name = name]") as HTMLInputElement
        formName.value = task.name

        const formDescription = toDoForm.querySelector("[name = description]") as HTMLTextAreaElement    
        formDescription.value = task.description //textContent

        const formRole = toDoForm.querySelector("[name = assigned-to]") as HTMLSelectElement
        formRole.value = task.assignedTo

        const formStatus = toDoForm.querySelector("[name = todo-status]") as HTMLSelectElement
        formStatus.value = task.status

        const formDate = toDoForm.querySelector("[name = finishDate] ") as HTMLInputElement
        formDate.valueAsDate = task.finishDate
}
}
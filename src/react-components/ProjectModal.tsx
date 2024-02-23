import * as React from "react"
import { IProject, Project, ProjectStatus, UserRole } from "../class/Project"
import * as Utilities from "../class/Utilities"
import { ProjectsManager } from "../class/ProjectsManager"
//import { resetModal } from "./ProjectDashboardCard"
import * as Firebase from "../firebase";

interface Props{
    id: string,
    project: Project | null,
    projectsManager: ProjectsManager
    onClose: ()=>void
}

export function ProjectModal(props:Props){

    
    let projectForm: HTMLFormElement | null

    function fillOutModal(){
        const projectData = props.project
        console.log(projectForm)
        if(projectForm && projectForm instanceof HTMLFormElement){
                console.log("Fill Out Modal")
                if(projectData){
                    const name = projectForm.querySelector("#name") as HTMLInputElement
                    name.value = projectData.name
    
                    const description = projectForm.querySelector("#description") as HTMLElement
                    description.textContent = projectData.description
    
                    const role = projectForm.querySelector("#userRole") as HTMLSelectElement
                    role.value = projectData.userRole
    
                    const status = projectForm.querySelector("#status") as HTMLSelectElement
                    status.value = projectData.status
    
                    const date = projectForm.querySelector("#finishDate") as HTMLInputElement
                    date.valueAsDate = projectData.finishDate 
                }
    }}

    React.useEffect(()=>{
        projectForm = document.getElementById(props.id+"-project-form") as HTMLFormElement
        Utilities.toggleModal(props.id+"-project-modal")
        //console.log(props.project)
        if(props.project){
            fillOutModal()
            if(projectForm && projectForm instanceof HTMLFormElement){
                const buttonContainer = projectForm.querySelector(".form-delete-button-container") as HTMLElement
                if(buttonContainer && buttonContainer instanceof HTMLElement){
                    const deleteBtn = document.createElement("button")
                    deleteBtn.className = "delete button" 
                    deleteBtn.type = "button"
                    deleteBtn.innerHTML = "Delete"
                    deleteBtn.onclick = onDeleteClick
                    deleteBtn.style.visibility = "visible"
                    deleteBtn.style.backgroundColor = "red"
                    buttonContainer.append(deleteBtn)
                }
            }
        }

            //<button onClick={()=>onProjectDelete(props.project.id)} type="button" className="delete">Delete</button>
    },[])

    function onFormCancel(event: React.FormEvent){
        
        if(projectForm && projectForm instanceof HTMLFormElement){
            projectForm.reset();
            Utilities.toggleModal(props.id+"-project-modal");
            console.log("form has been cancelled");
            props.onClose() 
        }
    }

    async function onFormSubmit(event: React.FormEvent){
        if(projectForm && projectForm instanceof HTMLFormElement){
            event.preventDefault();
            const formData = new FormData(projectForm);     
        
            const projectData: IProject = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                status: formData.get("status") as ProjectStatus,
                userRole: formData.get("userRole") as UserRole,
                finishDate: Utilities.checkDate(formData),
            }
            if(projectData.name.length > 5)
            {
                try{
                    if(!(props.project instanceof Project)){
                      props.projectsManager.newProject(projectData)
                      await Firebase.createDocument<IProject>("/projects", projectData)}
                    else{props.projectsManager.editProject(props.project.id, projectData)}
                    projectForm.reset();
                    Utilities.toggleModal(props.id+"-project-modal");
                    props.onClose() 
                }catch(error){
                    Utilities.createErrorMessage(error);
                    console.log(error)
                }
            }
            else{Utilities.createErrorMessage("Name is too short");}
        }
    }

    function onDeleteClick(){
        if(props.project){
            Utilities.toggleModal(props.id+"-project-modal")

            props.projectsManager.deleteProject(props.project.id)
            props.onClose()
          }
    }

    return(
        <dialog id={`${props.id}-project-modal`}>
          <form id={`${props.id}-project-form`}>
            <h2>{Utilities.capitalizeFirstLetter(props.id)} Project</h2>
            <div className="input-list">
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">home_work</span>
                  <label>Name</label>
                </div>
                <input id="name" name = "name" type="text" />
                <p className="tip">TIP: write something memorable</p>
              </div>
              <div className="form-field-container" />
              <div className="icon-text">
                <span className="material-symbols-outlined">description</span>
                <label>Description</label>
              </div>
              <textarea
                id="description"
                name = "description"
                cols={30}
                rows={5}
                placeholder="Give your description"
                defaultValue={""}
              />
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">engineering</span>
                  <label>Role</label>
                </div>
                <select id="userRole" name = "userRole">
                  <option>Architect</option>
                  <option>Engineer</option>
                  <option>Developer</option>
                </select>
              </div>
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">
                    question_mark
                  </span>
                  <label>Status</label>
                </div>
                <select id="status" name ="status" >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Finished</option>
                </select>
              </div>
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                  <label>Date</label>
                </div>
                <input
                  id="finishDate"
                  name = "finishDate"
                  type="date"
                  className="date"
                  min="2018-01-01"
                  max="2058-12-31"
                />
              </div>
            </div>
            <div className="form-button-container" style={{display : "flex", justifyContent:"space-between"}}>
              <div className="form-delete-button-container" ></div>
              <div className="form-submit-cancel-button-container">
                <button onClick={(event)=>onFormCancel(event)} type="button" className="cancel">
                    Cancel
                </button>
                <button onClick={(event)=>onFormSubmit(event)} type="submit" className="ok">
                    Accept
                </button>
              </div>
            </div>
          </form>
        </dialog>
    )
}
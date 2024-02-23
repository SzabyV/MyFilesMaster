import * as React from "react"
import { Project,IProject, ProjectStatus, UserRole } from "../class/Project";
import { checkDate, createErrorMessage } from "../class/Functions"
import { ProjectsManager } from "../class/ProjectsManager";

interface Props{
    project: Project,
    projectsManager: ProjectsManager
}
var modalShown = false;



const possibleColors = getComputedStyle(document.documentElement)

export function ProjectDashboardCard(props:Props){

  function onEditClick(id: string){
    const modal = document.getElementById(id);
    if(modal && modal instanceof HTMLDialogElement){
      if(modal.checkVisibility()){
          modal.close();
          modalShown = false;
      }
      else{
          modal.showModal();
      }
  }
  else{
      console.warn("the provided modal was not found, man. ID: ",id)
  }
  }

  const onFormSubmit = ((event: React.FormEvent) => {
    event.preventDefault();
    const projectForm = document.getElementById("edit-project-form")
    if(!(projectForm && projectForm instanceof HTMLFormElement)){return}
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
                const project = props.projectsManager.editProject(props.project.id,projectData);
                projectForm.reset();
                const modal = document.getElementById("new-project-modal")
                if(!(modal && modal instanceof HTMLDialogElement)){return}
                modal.close()
                console.log(project);
            }catch(error){
                createErrorMessage(error);
            
                //alert(error)
        }
        
        }
        else{createErrorMessage("Name is too short");}
      })
    return (
      <>
        <div className="dashboard-card" style = {{
           flexGrow : 0
        }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
              
            }}
          >
            <p
              className="project-initials"
              data-project-info="project-initials"
              style={{
                backgroundColor: possibleColors.getPropertyValue(
                  "--random" + props.project.backgroundColor
                ),
              }}
            >
              {props.project.initials}
            </p>
            <button onClick = {()=> onEditClick("edit-project-modal")}id="edit-project-btn" className="btn-secondary">
              <p style={{ width: "100%" }}>Edit</p>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div>
              <h2 data-project-info="name">{props.project.name}</h2>
              <p data-project-info="description">{props.project.description}</p>
            </div>
            <div
              style={{
                display: "flex",
                columnGap: 30,
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#969696",
                    fontSize: "var(--font-small)",
                  }}
                >
                  Status
                </p>
                <p data-project-info="status">{props.project.status}</p>
              </div>
              <div>
                <p
                  style={{
                    color: "#969696",
                    fontSize: "var(--font-small)",
                  }}
                >
                  Cost
                </p>
                <p data-project-info="cost">{`${props.project.cost} Euros`}</p>
              </div>
              <div>
                <p
                  style={{
                    color: "#969696",
                    fontSize: "var(--font-small)",
                  }}
                >
                  Role
                </p>
                <p data-project-info="userRole">{props.project.userRole}</p>
              </div>
              <div>
                <p
                  style={{
                    color: "#969696",
                    fontSize: "var(--font-small)",
                  }}
                >
                  Finish Date
                </p>
                <p data-project-info="finishDate">
                  {props.project.finishDate.toISOString().split("T")[0]}
                </p>
              </div>
            </div>
            <div
              data-project-info="progress"
              style={{
                backgroundColor: "#404040",
                borderRadius: 9999,
                overflow: "auto",
                textAlign: "center",
              }}
            >
              <div
                data-project-info="progress-bar"
                style={{
                  width: props.project.progress,
                  backgroundColor: "green",
                  padding: "4px 0",
                }}
              />
              {props.project.progress * 100}%
            </div>
          </div>
        </div>

        <dialog id="edit-project-modal">
          <form id="edit-project-form">
            <h2>New Project</h2>
            <div className="input-list">
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">home_work</span>
                  <label>Name</label>
                </div>
                <input name="name" type="text" />
                <p className="tip">TIP: write something memorable</p>
              </div>
              <div className="form-field-container" />
              <div className="icon-text">
                <span className="material-symbols-outlined">description</span>
                <label>Description</label>
              </div>
              <textarea
                name="description"
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
                <select name="userRole">
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
                <select name="status">
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
                  name="finishDate"
                  type="date"
                  className="date"
                  min="2018-01-01"
                  max="2058-12-31"
                />
              </div>
            </div>
            <div className="form-button-container">
              <button type="button" className="cancel">
                Cancel
              </button>
              <button type="submit" className="ok">
                Accept
              </button>
            </div>
          </form>
        </dialog>
      </>
    );
}
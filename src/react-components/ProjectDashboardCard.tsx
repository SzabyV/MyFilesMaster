import * as React from "react"
import { Project,IProject, ProjectStatus, UserRole } from "../class/Project";
import { checkDate, createErrorMessage } from "../class/Utilities"
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectModal } from "./ProjectModal";
import * as Utilities from "../class/Utilities"

interface Props{
    project: Project,
    projectsManager: ProjectsManager
}
var modalShown = false;




const possibleColors = getComputedStyle(document.documentElement)

export function ProjectDashboardCard(props:Props){

  const [showModalComponent, setShowModalComponent] = React.useState(false);

  function onEditClick(){
    setShowModalComponent(true)
  }

  function closeModal(){
    setShowModalComponent(false)
  }

  React.useEffect(()=>{},[])

    return (
      <>
        <div className="dashboard-card" style = {{
           flexGrow : 1
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
            <button onClick = {()=> onEditClick()}id="edit-project-btn" className="btn-secondary">
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
        {showModalComponent && <ProjectModal id = "edit" project = {props.project} projectsManager={props.projectsManager} onClose = {()=>closeModal()}></ProjectModal>}
      </>
    );
}
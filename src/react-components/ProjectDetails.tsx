import * as React from "react"
import { ProjectsManager } from "../class/ProjectsManager"
import * as Router from "react-router-dom"
import { Project } from "../class/Project"
import { ProjectDashboardCard } from "./ProjectDashboardCard"
import { ToDosDashboardCard } from "./ToDosDashboardCard"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument } from "../firebase"

interface Props {
  projectsManager: ProjectsManager
}

const possibleColors = getComputedStyle(document.documentElement)

export function ProjectDetails(props:Props){
  const routeParams = Router.useParams<{id: string}>()
  const id = routeParams.id
  if(!id) {return (<p>Project ID is needed to seet his page</p>)}
  const project = props.projectsManager.getProject(id)

  if(!project) {return (<p>The project with ID {id} was not found</p>)}

  const navigateTo = Router.useNavigate()
  props.projectsManager.onProjectDeleted = async (id) => {
    await deleteDocument("/projects",id)
    navigateTo("/")
  }
  

  if(project && project instanceof Project)
    return (
      <div className="page" id="project-details" style={{ display: "flex" }}>
        <header>
          <div>
            <h2 data-project-info="name">{project.name}</h2>
            <p style={{ color: "#969696" }} data-project-info="description">
              {project.description}
            </p>
          </div>
        </header>
        <div className="main-page-content">
          
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <ProjectDashboardCard project = {project} projectsManager={props.projectsManager}></ProjectDashboardCard> 
          <ToDosDashboardCard></ToDosDashboardCard>  
          </div>
          <IFCViewer></IFCViewer>
        </div>
       
        
      </div>
    );

}
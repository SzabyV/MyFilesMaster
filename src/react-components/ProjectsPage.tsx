import * as React from "react"
import { checkDate, toggleModal, createErrorMessage } from "../class/Functions"
import {IProject, ProjectStatus, UserRole, Project} from "../class/Project"
import { ProjectsManager } from "../class/ProjectsManager"
import { ProjectCard } from "./ProjectCard"
import * as Router from "react-router-dom"
import { SearchBox } from "./SearchBox"
import * as Firestore  from "firebase/firestore"
import { firebaseDB } from "../firebase"
import { getCollection } from "../firebase"

var modalShown = false;

const projectsCollection = getCollection<IProject>("/projects")

interface Props {
    projectsManager: ProjectsManager
}

export function ProjectsPage(props:Props){
    
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
    

    const getFirestoreProjects = async () => {
        //projectsCollection = Firestore.collection(firebaseDB, "/projects") as Firestore.CollectionReference<IProject>
        const firebaseProject = await Firestore.getDocs(projectsCollection)
        for( const doc of firebaseProject.docs){
            const data = doc.data()

            const projectData : IProject = {
                ...data,
                finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate()
            }
            try{
                props.projectsManager.newProject(projectData, doc.id)
            }
            catch(error){
                props.projectsManager.editProject(doc.id, projectData)
            }
            
        }
    }

    React.useEffect(()=>{
        getFirestoreProjects()
    },[])

    const projectCards = projects.map((project)=> {
        return(
        <Router.Link to = {`/project/${project.id}`} key={project.id}>
            <ProjectCard project = {project} />
        </Router.Link>
        )
    })

    React.useEffect(()=> {
        console.log("Projects state updated", projects)
    }, [projects])

    const onNewProjectClick = (id:string) =>{
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

    const onFormSubmit = (event: React.FormEvent) =>{
        event.preventDefault();
        const projectForm = document.getElementById("new-project-form")
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
                Firestore.addDoc(projectsCollection, projectData)
                const project = props.projectsManager.newProject(projectData);
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
    }

    const onExportBtnClick = () =>{
        props.projectsManager.exportToJSON()

    }

    const onImportBtnClick = () =>{
        props.projectsManager.importFromJSON()
    }


 const onProjectSearch = (value:string) =>{
    
    setProjects(props.projectsManager.filterProjects(value))
 }   
    
 return(
    <div className="page" id="projects-page">
        <dialog id="new-project-modal">
            <form onSubmit = {(e) =>onFormSubmit(e)}id="new-project-form">
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
                    <span className="material-symbols-outlined">question_mark</span>
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
                    <span className="material-symbols-outlined">calendar_month</span>
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
  <header>
    <h2>Projects</h2>
    <SearchBox onChange = {(value) => onProjectSearch(value)}></SearchBox>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button onClick = {onImportBtnClick} id="import-projects-btn" className="transparent-background-btn">
        <span className="material-symbols-outlined">download</span>
      </button>
      <button  onClick = {onExportBtnClick} id="export-projects-btn" className="transparent-background-btn">
        <span className="material-symbols-outlined">upload</span>
      </button>
      <button onClick={()=>onNewProjectClick("new-project-modal")}
        id="new-project-button"
        style={{ display: "flex", gap: 10, alignItems: "center" }}
      >
        <span className="material-symbols-outlined">add_business</span>
        New Project
      </button>
    </div>
  </header>
  {
    projects.length > 0 ? <div id="projects-list"> {projectCards} </div> : <p>There are no projects to display!</p>
  }
  

</div>

 )
}
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import {IProject, Project, ProjectStatus, UserRole, IToDo, ToDo, ToDoStatus, UserName} from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager";
import { createErrorMessage, checkDate, toggleModal, addOrEditTask } from "./class/Functions";
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

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager= new ProjectsManager(projectsListUI)
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

const projectsPageBtn = document.getElementById("projects-page-btn")
if(projectsPageBtn){
    projectsPageBtn.addEventListener("click",()=>{
        const projectsPage = document.getElementById("projects-page") as HTMLElement
        const detailsPage = document.getElementById("project-details") as HTMLElement
        const usersPage = document.getElementById("users-page") as HTMLElement
        projectsPage.style.display = "flex"
        detailsPage.style.display = "none"
        usersPage.style.display = "none"
        const taskList = document.getElementById("task-list") as HTMLElement
        taskList.innerHTML = ""
})
}

const usersPageBtn = document.getElementById("users-page-btn")
if(usersPageBtn){
    usersPageBtn.addEventListener("click",()=>{
        const projectsPage = document.getElementById("projects-page") as HTMLElement
        const detailsPage = document.getElementById("project-details") as HTMLElement
        const usersPage = document.getElementById("users-page") as HTMLElement
        projectsPage.style.display = "none"
        detailsPage.style.display = "none"
        usersPage.style.display = "flex"
        
        const taskList = document.getElementById("task-list") as HTMLElement
        taskList.innerHTML = ""
    })
}


const editProjectBtn = document.getElementById("edit-project-btn")
//var projectName: HTMLElement
//var project: Project
const projectForm=document.getElementById("edit-project-form")
if(editProjectBtn){
    editProjectBtn.addEventListener("click", () => {
        toggleModal("edit-project-modal")
        const projectName = document.querySelector("[data-project-info = 'name']") as HTMLElement
        const project = projectsManager.getProjectByName(projectName.textContent as string) as Project


        if(projectForm && projectForm instanceof HTMLFormElement && project instanceof Project){

            //const formData = new FormData(projectForm);
            
                const formName = projectForm.querySelector("[name = name]") as HTMLInputElement
                formName.value = project.name

                const formDescription = projectForm.querySelector("[name = description]") as HTMLTextAreaElement    
                formDescription.value = project.description

                const formRole = projectForm.querySelector("[name = userRole]") as HTMLSelectElement
                formRole.value = project.userRole

                const formStatus = projectForm.querySelector("[name = status]") as HTMLSelectElement
                formStatus.value = project.status

                const formDate = projectForm.querySelector("[name = finishDate] ") as HTMLInputElement
                formDate.valueAsDate = project.finishDate

            }
    });

    if(projectForm && projectForm instanceof HTMLFormElement)
    {
        projectForm.addEventListener("submit",(event) =>{
            event.preventDefault();
            const projectName = document.querySelector("[data-project-info = 'name']") as HTMLElement
            const project = projectsManager.getProjectByName(projectName.textContent as string) as Project
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
                    projectsManager.editProject(project.id, projectData)
                    projectForm.reset();
                    toggleModal("edit-project-modal");
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
                toggleModal("edit-project-modal");
                console.log("form has been cancelled");
            })
        }
            
        
    }
    else{
        console.warn("project button was not found, man!");
    }
}



const addToDosBtn = document.getElementById ("add-todos-btn")
const toDoForm=document.getElementById("todos-form")
if (addToDosBtn)
{       
    if(toDoForm && toDoForm instanceof HTMLFormElement)
    {
        addToDosBtn.addEventListener("click",() =>{
            toggleModal("todos-modal")
            const header = toDoForm.querySelector("h2")
            if(header)
                header.innerHTML= "New Task"
            toDoForm.setAttribute("taskName","")
        })

        
        toDoForm.addEventListener("submit", (event) => addOrEditTask(event, projectsManager))
        //toDoForm.removeEventListener("submit", (event) => addOrEditTask(event, null, projectsManager))
        const toDoFormCancel = toDoForm.querySelector(".form-button-container .cancel");
        if(toDoFormCancel && toDoFormCancel instanceof HTMLButtonElement){
            toDoFormCancel.addEventListener("click",(event) =>{
                toDoForm.reset();
                toggleModal("todos-modal");
                console.log("form has been cancelled");
            })
        }
    }
}

//ThreeJS viewer

const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true})
viewerContainer.append(renderer.domElement)


function resizeviewer(){
    const containerDimensions = viewerContainer.getBoundingClientRect()

    const computedStyle = window.getComputedStyle(viewerContainer)
    const padding = computedStyle.getPropertyValue("padding")

    const containerWidth = containerDimensions.width - parseInt(padding, 10)*2
    const containerHeight = containerDimensions.height - parseInt(padding, 10)*2
    const aspectRatio = containerWidth/containerHeight

    renderer.setSize(containerWidth,containerHeight)

    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeviewer)

resizeviewer()



const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry,material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.4

scene.add(cube, directionalLight, ambientLight)

const cameraControls = new OrbitControls(camera, viewerContainer)


function renderScene(){
    renderer.render(scene, camera)
    requestAnimationFrame(renderScene)
}

renderScene()

const axes = new THREE.AxesHelper()
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")
scene.add(axes,grid)

const gui = new GUI()
const cubeControls = gui.addFolder("Cube")

cubeControls.add(cube.position, "x",-10,10,.1)
cubeControls.add(cube.position, "y",-10,10,.1)
cubeControls.add(cube.position, "z",-10,10,.1)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material,"color")

const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 1 )
scene.add( directionalLightHelper)

const lightControls = gui.addFolder("Light")

lightControls.add(directionalLight.position, "x",-10,10,.1)
lightControls.add(directionalLight.position, "y",-10,10,.1)
lightControls.add(directionalLight.position, "z",-10,10,.1)

lightControls.add(directionalLight.rotation, "x",-3.14,3.14,.01)
//lightControls.add(directionalLight.rotation, "y",-3.14,3.14,.01)
lightControls.add(directionalLight.rotation, "z",-3.14,3.14,.01)

lightControls.add(directionalLight, "intensity", 0,1,.05)
lightControls.addColor(directionalLight, "color")











    
            
        
       
    


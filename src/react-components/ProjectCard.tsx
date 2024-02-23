import * as React from "react"
import { Project } from "../class/Project"
import { getInitials } from "../class/Project"
import * as Router from "react-router-dom"

const possibleColors = getComputedStyle(document.documentElement)

interface Props {
    project: Project
}



export function ProjectCard(props:Props){

    const onProjectClick = () => {
    
    }

    return(
            <div className="project-card" onClick = {()=> onProjectClick()}>
                <div className="card-header">
                    <p
                    className="project-initials"
                    style={{
                        fontSize: 20,
                        aspectRatio: 1,
                        width: 30,
                        textAlign: "center",
                        borderRadius: "100%",
                        padding: 12,
                        backgroundColor: possibleColors.getPropertyValue("--random"+[props.project.backgroundColor]),
                        textTransform: "uppercase"
                    }}
                    >
                    {getInitials(props.project.name)}
                    </p>
                    <div>
                    <h5 id="project-name">{props.project.name}</h5>
                    <p id="project-description">{props.project.description}</p>
                    </div>
                </div>
                <div className="card-content">
                    <div className="card-property">
                    <p className="property-name">Status</p>
                    <p>{props.project.status}</p>
                    </div>
                    <div className="card-property">
                    <p className="property-name">User Role</p>
                    <p>{props.project.userRole}</p>
                    </div>
                    <div className="card-property">
                    <p className="property-name">Cost</p>
                    <p>{props.project.cost}</p>
                    </div>
                    <div className="card-property">
                    <p className="property-name">Estimated Progress</p>
                    <p>{props.project.progress}</p>
                    </div>
                </div>
            </div>
            
    )
}
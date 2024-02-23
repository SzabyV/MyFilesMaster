import * as React from "react"
import * as Router from "react-router-dom"

export function Sidebar(){
    return(
        <aside id="sidebar">
        <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company Logo"/>
        <ul id="nav-buttons">
            <Router.Link to="/">
            <li id="projects-page-btn">
                <span className="material-symbols-outlined" >
                    apartment
                </span>
                Projects
            </li>
            </Router.Link>
            <Router.Link to="/users">
            <li id="users-page-btn">
                <span className="material-symbols-outlined">
                    group
                    </span>
                    Users
            </li>
            </Router.Link>
        </ul>
    </aside>
    )
}


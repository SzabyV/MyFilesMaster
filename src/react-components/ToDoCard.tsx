import * as React from "react"

const possibleColors = getComputedStyle(document.documentElement)

export function ToDoCard(){
    return(
        <div>
            <div
                style={{ display: "flex", columnGap: 15, alignItems: "center", padding: 0 }}
            >
                <span
                className="material-symbols-outlined"
                style={{ padding: 10, backgroundColor: possibleColors.getPropertyValue("--task"+this.backgroundColor), borderRadius: 10 }}
                >
                construction
                </span>
                <p className="name">Name</p>
            </div>
            <p className="date" style={{ textWrap: "nowrap", marginLeft: 10 }}>
                Date
            </p>
        </div>
    )
}
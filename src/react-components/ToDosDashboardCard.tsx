import * as React from "react"
var modalShown = false;

function onAddToDoButtonClick(id:string){
    const modal = document.getElementById(id);
    if (modal && modal instanceof HTMLDialogElement) {
      if (modal.checkVisibility()) {
        modal.close();
        modalShown = false;
      } else {
        modal.showModal();
      }
    } else {
      console.warn("the provided modal was not found, man. ID: ", id);
    }
}

export function ToDosDashboardCard(){
    return(<>

<div className="dashboard-card">
              <div style={{ display: "flex", gap: 30 }}>
                <h4>To-Do</h4>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    columnGap: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: 10,
                    }}
                  >
                    <span className="material-symbols-outlined">search</span>
                    <input
                      type="text"
                      placeholder="Search To-Do's by name"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span
                    onClick = {()=> onAddToDoButtonClick("todos-modal") }
                    className="material-symbols-outlined todo-item"
                    id="add-todos-btn"
                  >
                    add
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "30px 0px",
                }}
                id="task-list"
              ></div>
            </div>
    <dialog id="todos-modal">
          <form id="todos-form">
            
            <h2>New Task</h2>
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
                <select name="assigned-to">
                  <option>User 1</option>
                  <option>User 2</option>
                  <option>User 3</option>
                </select>
              </div>
              <div className="form-field-container">
                <div className="icon-text">
                  <span className="material-symbols-outlined">
                    question_mark
                  </span>
                  <label>Status</label>
                </div>
                <select name="todo-status">
                  <option>Done</option>
                  <option>WiP</option>
                  <option>Unstarted</option>
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
        </>)
}
import * as React from "react"

export function UsersPage(){
    return(
        <div className="page" id="users-page" style={ {display: "flex"}}>
  <dialog id="new-user-modal">
    <form>
      <h2>New User</h2>
      <div className="input-list">
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">person</span>
            <label>First Name</label>
          </div>
          <input type="text" />
        </div>
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">person</span>
            <label>Last Name</label>
          </div>
          <input type="text" />
        </div>
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">person</span>
            <label>Username</label>
          </div>
          <input type="text" />
        </div>
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">calendar_month</span>
            <label>Start Date</label>
          </div>
          <input
            type="date"
            className="date"
            min="2018-01-01"
            max="2018-12-31"
          />
        </div>
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">engineering</span>
            <label>Role</label>
          </div>
          <select>
            <option>Architect</option>
            <option>Engineer</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <div className="icon-text">
            <span className="material-symbols-outlined">question_mark</span>
            <label>Assigned Projects</label>
          </div>
          <select > //multiple=""
            <option>Hospital</option>
            <option>Plaza</option>
            <option>School</option>
          </select>
        </div>
      </div>
      <div className="form-button-container">
        <button className="cancel">Cancel</button>
        <button className="ok">Accept</button>
      </div>
    </form>
  </dialog>
  <header>
    <h2>Users</h2>
    <div>
      <button style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="material-symbols-outlined">person_add</span>
        New User
      </button>
    </div>
  </header>
  <div className="user-list">
    <div className="table-header">
      <p>User</p>
      <p>First Name</p>
      <p>Last Name</p>
      <p>Username</p>
      <p>Start Date</p>
      <p>Role</p>
      <p>Assigned Projects</p>
      <p />
    </div>
    <div className="user">
      <img src="https://img.thedailybeast.com/image/upload/dpr_2.0/c_crop,h_1280,w_1280,x_0,y_0/c_limit,w_128/d_placeholder_euli9k,fl_lossy,q_auto/v1677776984/brian-cox_fxi9tg" />
      <p>Roy</p>
      <p>Logan</p>
      <p>KingLogan</p>
      <p>1950-01-01</p>
      <p>Developer</p>
      <p>Hospital,Plaza,School</p>
      <button>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <div className="user">
      <img
        src="https://industrialscripts.com/wp-content/uploads/2021/09/Kendall-Roy-Original-Character.jpg"
        alt=""
      />
      <p>Roy</p>
      <p>Kendall</p>
      <p>$$OG_KennyBuoy$$</p>
      <p>2005-01-01</p>
      <p>Engineer</p>
      <p>School</p>
      <button>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <div className="user">
      <img
        src="https://media-cldnry.s-nbcnews.com/image/upload/newscms/2021_42/3513350/211018-sarah-snook-ew-1212p.jpg"
        alt=""
      />
      <p>Roy</p>
      <p>Siobhan</p>
      <p>PrincessShiv</p>
      <p>2005-01-01</p>
      <p>Architect</p>
      <p>Plaza</p>
      <button>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <div className="user">
      <img
        src="https://static.spin.com/files/2018/08/roman-roy-succession-1533564730.jpg"
        alt=""
      />
      <p>Roy</p>
      <p>Roman</p>
      <p>Whatever?IDontCARE</p>
      <p>2005-01-01</p>
      <p>Architect</p>
      <p>Hospital</p>
      <button>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
  </div>
</div>

    )
}
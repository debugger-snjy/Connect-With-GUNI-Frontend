import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

function InternalMenuBar() {

    let navigateTo = useNavigate();
    let location = useLocation();

    let user = "";

    if (sessionStorage.getItem("user")) {
        user = JSON.parse(sessionStorage.getItem("user"))
        // Logger("Internal : ", user)
    }
    else {
        // Logger("Logout User !!")
        navigateTo("/")
    }

    // Function to call when the user clicks on the logout button
    const logoutUser = () => {
        sessionStorage.clear()
    }

    return (
        <>
            <div className="row mt-3 menuBar">
                <div className="col-xsm-12 col-sm-12 col-md-12 col-lg-5 col-xl-6 col-xxl-7 mt-2">
                    <span id='userName' className='menutextStyle'>Welcome {user.enrollNo} - {user.name.split(" ")[0]} {user.role === "faculty" ? user.gender === "female" ? "Mam" : "Sir" : ""} 👋</span>
                </div>
                <div className="col-xsm-12 col-sm-12 col-md-12 col-lg-7 col-xl-6 col-xxl-5 text-left" >
                    <div className="row flex-row-reverse">
                        <div className={`col-md-12 col-lg-3 menutextStyle mt-2`}><Link to="/" onClick={logoutUser}>Logout</Link></div>
                        {user.role === "student" && <div className="col-md-12 col-lg-3 menutextStyle mt-2"><Link to={`/dashboard/${sessionStorage.getItem("role")}/marksheets`}>Marksheets</Link></div>}
                        <div className={`col-md-12 col-lg-3 menutextStyle mt-2`}><Link to={`/dashboard/${sessionStorage.getItem("role")}/profile`}>View Profile</Link></div>
                        {user.role === "student" && <div className="col-md-12 col-lg-3 menutextStyle mt-2"><Link to={`/dashboard/${sessionStorage.getItem("role")}/fees`}>Fee Receipts</Link></div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default InternalMenuBar

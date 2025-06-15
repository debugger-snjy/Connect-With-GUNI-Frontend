import React, { useContext, useEffect, useState } from 'react'
import NoteContext from "../Context/NoteContext"
import { useNavigate } from 'react-router-dom';
import InternalMenuBar from './InternalMenuBar';
import NavBreadcrumb from "../Components/NavBreadcrumb"
import maleUser from "../Images/user_male1.png"
import femaleUser from "../Images/user_female1.png"

function ViewProfile() {

    let navigateTo = useNavigate()

    // Using the function to get the data from the context
    const contextData = useContext(NoteContext);
    const [userData, setuserData] = useState({})

    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("token") || !sessionStorage.getItem("role") === "admin") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        // Checking for the session storage items
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }
        else {
            getInfoAPI(sessionStorage.getItem("token"))
        }

    }, [])

    // Calling the API to get the User Info : 
    const getInfoAPI = async (token) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getuser`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        // Variable to handle the API Response
        const userDataResponse = await response.json()

        console.log(userDataResponse)

        setuserData(userDataResponse.data.user)

        // Sending the response Data
        return userDataResponse.data.user
    }

    return (
        <>
            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <NavBreadcrumb />

            <div className="avatar">
                <div className="avatar-container">
                    {userData.gender === "male" && <img className="avatar-image"
                        src={maleUser}
                        alt="Male Avatar" />}

                    {userData.gender === "female" && <img className="avatar-image"
                        src={femaleUser}
                        alt="Female Avatar" />}
                </div>
            </div>

            <h2 className='text-white text-center'>Hello {userData.name} {userData.role === "faculty" ? userData.gender === "female" ? "Mam" : "Sir" : ""} 👋</h2>

            <div className="container mt-5">
                <div className="table-responsive">
                    <table className="table text-center table-dark text-wrap table-hover" cellSpacing={"10px"}>
                        <thead>
                            <tr>
                                <th className='p-4 fs-5' colSpan={2}>Your Profile</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Object.keys(userData).map((field, index) => {

                                let fieldname = field;

                                if (field === "date") {
                                    fieldname = "Account Created";
                                }
                                else if (field === "enrollNo") {
                                    fieldname = "Enrollment Number";
                                }
                                else if (field === "facultyShortForm") {
                                    fieldname = "Faculty Short Form"
                                }
                                else if (field === "cabinLocation") {
                                    fieldname = "Cabin Location"
                                }

                                if (field == "__v" || field == "_id" || field == "attendanceData") {
                                }
                                else {
                                    return (
                                        <tr scope="row" key={index}>
                                            <th className='w-45 p-4 fs-5' style={{ textAlign: "right" }}>{fieldname[0].toUpperCase() + fieldname.slice(1).toLowerCase()}</th>
                                            <th className='w-55 p-4 fs-5' style={{ textAlign: "left" }}>{userData[field]}</th>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


        </>
    )
}

export default ViewProfile

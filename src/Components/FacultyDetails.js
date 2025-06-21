import React, { useContext, useEffect, useState } from 'react'
import InternalMenuBar from './InternalMenuBar'
import NavBreadcrumb from './NavBreadcrumb'
import femaleFaculty from "../Images/female_faculty.png"

import maleFaculty from "../Images/male_faculty.png"
import { useLocation } from 'react-router-dom'
import NoteContext from '../Context/NoteContext'

// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

function FacultyDetails() {

    let location = useLocation()
    // Using the Context API
    const contextData = useContext(NoteContext);

    const userrole = sessionStorage.getItem("role")
    const [userFaculty, setuserFaculty] = useState([])

    let femaleFacultyIcon = femaleFaculty;
    let maleFacultyIcon = maleFaculty;

    // Calling the API to get the User Info : 
    const getFacultiesInfo = async (token) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faculty/fetch/all`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
            },
        });

        // Variable to handle the API Response
        const facultyData = await response.json()

        Logger(facultyData)

        // Sending the response Data
        return facultyData.data
    }

    useEffect(() => {
        getFacultiesInfo().then((data) => {
            Logger(data)
            setuserFaculty(data)
            contextData.updateRecentlyAccessed('Faculty Info', `${location.pathname}`);
        })
    }, [])

    return (
        <>
            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <NavBreadcrumb />

            <div className="row allOperations mb-5 mt-4 text-white  ">
                <div className="container">
                    <div className="row gy-4 px-2">
                        {
                            userFaculty.map((faculty, index) => {

                                return (
                                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={index}>
                                        <div className="card itemCard">
                                            <img src={faculty.gender === "female" ? femaleFacultyIcon : maleFacultyIcon} className="card-img-top itemImg" alt="Materials" />
                                            <div className="card-body">
                                                <p className="card-text itemName mb-1">{faculty.name}</p>
                                                <p className="card-text small itemName fs-5 fw-normal">{faculty.dept} - {faculty.designation}</p>
                                                <div className="accordion" id={`facultyAccordion${index}`}>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header">
                                                            <button className="accordion-button facultyAccordion-Button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                                More Info
                                                            </button>
                                                        </h2>
                                                        <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample" style={{ "backgroundColor": "darkgrey" }}>
                                                            <div className="accordion-body text-black">

                                                                <table className=''>
                                                                    <tbody>
                                                                        {/* Printing the Email */}
                                                                        <tr>
                                                                            <td className='p-1'><i className="fa-solid fa-envelope fa-lg" style={{ "color": "#000000" }}></i></td>
                                                                            <td className='p-1'><a href={`mailto:${faculty.email}`} target={'_blank'} ><strong style={{ verticalAlign: "text-bottom" }}> {faculty.email}</strong></a></td>
                                                                        </tr>

                                                                        {/* Printing the Contact Number */}
                                                                        <tr>
                                                                            <td className='p-1'><i className="fa-solid fa-phone fa-lg" style={{ "color": "#000000" }}></i></td>
                                                                            <td className='p-1'><a href={`tel:${faculty.phone}`} target={'_blank'} ><strong style={{ verticalAlign: "text-bottom" }}> {faculty.phone}</strong></a></td>
                                                                        </tr>

                                                                        {/* Printing the Cabin Location */}
                                                                        <tr>
                                                                            <td className='p-1'><i className="fa-solid fa-location-dot fa-lg" style={{ "color": "#000000" }}></i></td>
                                                                            <td className='p-1'><strong style={{ verticalAlign: "text-bottom" }}> {faculty.cabinLocation}</strong></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )

                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FacultyDetails

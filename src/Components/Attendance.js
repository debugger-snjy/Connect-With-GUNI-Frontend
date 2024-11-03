import React, { useContext, useEffect, useState } from 'react'
import InternalMenuBar from './InternalMenuBar'
import NavBreadcrumb from './NavBreadcrumb'
import NoteContext from '../Context/NoteContext';
import { useLocation } from 'react-router-dom';

function Attendance() {

    // Using the Context API
    const contextData = useContext(NoteContext);
    let location = useLocation()

    const [userAttendance, setuserAttendance] = useState([])

    // Calling the API to get the User Info : 
    const getInfoAPI = async (token) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`http://localhost:5000/api/auth/getuser`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        // Variable to handle the API Response
        const userData = await response.json()

        console.log(userData)

        // Sending the response Data
        return userData
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        getInfoAPI(token).then((data) => {
            console.log(data.user.attendanceData)
            setuserAttendance(data.user.attendanceData)
        })

        contextData.updateRecentlyAccessed('Attendance', `${location.pathname}`);

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

            <div className="accordion" id="accordionExample">
                <div className="row mb-5 mt-4 text-white">
                    <div className="container">
                        <div className="row gy-4 px-2">
                            {
                                userAttendance.map((subjectAttendance, index) => {
                                    console.log(subjectAttendance);
                                    let subjectName = Object.keys(subjectAttendance);
                                    console.log(subjectName);

                                    // Map and accumulate JSX elements for each subject
                                    let subjectElements = subjectName.map((subject) => {
                                        console.log(subject);

                                        let dates = Object.keys(subjectAttendance[subject]);
                                        console.log(dates);
                                        let status = Object.values(subjectAttendance[subject]);
                                        console.log(status);

                                        // Generate a unique identifier for each subject's accordion
                                        const accordionId = `accordion-${index}-${subject}`;
                                        const contentId = `content-${index}-${subject}`;

                                        let attendancePercent = parseFloat(status[status.length - 1].toFixed(3));
                                        return (
                                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={`col-${index}-${subject}`}>
                                                <div className={`accordion-item m-2`} key={`item-${index}-${subject}`}>
                                                    <h2 className="accordion-header">
                                                        <button className={`accordion-button menutextStyle text-black ${index === 0 ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${accordionId}`}
                                                            aria-expanded={index === 0 ? 'true' : 'false'} aria-controls={accordionId}>
                                                            📚 {subject}
                                                        </button>
                                                    </h2>
                                                    <div id={accordionId} className="accordion-collapse collapse" data-bs-parent={`#accordion-${index}`}>
                                                        <div id={contentId} className="accordion-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                                            <div className={`menutextStyle rounded-3 mx-5 text-center my-2 ${attendancePercent > 75 ? 'bg-success text-white' : attendancePercent > 55 ? 'bg-warning text-white' : 'bg-danger text-black'}`} style={{ border: "2px solid black", boxShadow: "inset 0px 0px 5px 1px black" }}>
                                                                {dates[dates.length - 1].toLowerCase() === "attendance" ? "Attendance" : ""} : {attendancePercent ? attendancePercent + "%" : ""}
                                                            </div>
                                                            <table className="table table-striped table-dark table-hover w-100 text-center">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope='col'>Date</th>
                                                                        <th scope='col'>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        dates.map((date, subIndex) => {
                                                                            if (date != "attendance") {
                                                                                return (
                                                                                    <tr key={`date-${index}-${subject}-${subIndex}`}>
                                                                                        <th>{date}</th>
                                                                                        <th>{status[subIndex]}</th>
                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });

                                    // Return the accumulated JSX elements
                                    return (
                                        <React.Fragment key={`subjectElements-${index}`}>
                                            {subjectElements}
                                        </React.Fragment>
                                    );
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Attendance

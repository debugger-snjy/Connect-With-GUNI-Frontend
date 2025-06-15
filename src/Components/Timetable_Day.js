import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NavBreadcrumb from './NavBreadcrumb'
import InternalMenuBar from './InternalMenuBar'
import NoteContext from '../Context/NoteContext';
import labIcon from "../Images/lab.png"
import lectureIcon from "../Images/lecture.png"
import professorIcon from "../Images/professor.png"
import subjectIcon from "../Images/subjectIcon.png"
import locationIcon from "../Images/location.png"
import underconstruction from "../Images/UnderConstruction.png"

function Timetable_Day(props) {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    let days = ["monday", "tuesday", "wednesday", "thrusday", "friday", "saturday", "sunday"];
    let today = days[props.day]

    const [daytimetableRecord, setDayTimetableRecord] = useState([]);
    const [showContent, setShowContent] = useState(false);

    // Using the Context API
    const contextData = useContext(NoteContext);

    if (!sessionStorage.getItem("user") && !sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "student") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        // Checking for the session storage items
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "student") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        contextData.updateRecentlyAccessed(`Timetable - ${today}`, `${location.pathname}`);

        FetchStudentTimetableAPI()

        const timer = setTimeout(() => {
            setShowContent(true);
        }, 2000);

        return () => clearTimeout(timer);

    }, [])

    // Function to Fetch the Student Data in the Database
    const FetchStudentTimetableAPI = async () => {

        const userSem = parseInt(JSON.parse(sessionStorage.getItem("user")).sem)
        const userBatch = JSON.parse(sessionStorage.getItem("user")).batch
        const userDivision = JSON.parse(sessionStorage.getItem("user")).division

        // Calling the Add Student API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/timetable/fetch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "sem": userSem, "batch": userBatch, "division": userDivision })
        });

        // Variable to handle the API Response
        const fetchTimteableResponse = await response.json()

        console.log(fetchTimteableResponse)

        if (fetchTimteableResponse.data.length > 0) {
            setDayTimetableRecord(fetchTimteableResponse.data[0].data[today.toString()])
        }

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

            <div className="container-fluid mb-5 mt-4">

                <div className="day">
                    <div className="row removepadding removemargin">
                        <div className="col-1 prevbtn removepadding removemargin">
                            <abbr title={`${days[(props.day - 1) < 0 ? 6 : props.day - 1][0].toUpperCase() + days[(props.day - 1) < 0 ? 6 : props.day - 1].slice(1).toLowerCase()}`}>
                                <a href={`${location.pathname.replace(today.toString(), days[(props.day - 1) < 0 ? 6 : props.day - 1])}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                                    </svg>
                                </a>
                            </abbr></div>
                        {/* <div className="col-10 removepadding removemargin">Timetable <br/> [ Sem {JSON.parse(sessionStorage.getItem("user")).sem} Division {JSON.parse(sessionStorage.getItem("user")).division} - {JSON.parse(sessionStorage.getItem("user")).batch} ] <br /> <span className='text-text-capitalize'>{today}</span></div> */}
                        <div className="col-10 removepadding removemargin">Timetable [ Sem {JSON.parse(sessionStorage.getItem("user")).sem} ] {JSON.parse(sessionStorage.getItem("user")).batch} Batch - (<span className='text-capitalize'>{today}</span>)</div>
                        <div className="col-1 nextbtn removepadding removemargin">
                            <abbr title={`${days[(props.day + 1) > 6 ? 0 : props.day + 1][0].toUpperCase() + days[(props.day + 1) > 6 ? 0 : props.day + 1].slice(1).toLowerCase()}`}>
                                <a href={`${location.pathname.replace(today.toString(), days[(props.day + 1) > 6 ? 0 : props.day + 1])}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="White" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                    </svg></a>
                            </abbr>
                        </div>
                    </div>
                </div>

                <div className="container-fluid dayDescription">
                    {
                        Object.keys(daytimetableRecord).map((period, index) => {
                            console.log(period)
                            console.log(daytimetableRecord[period])

                            return (
                                <div className="card bg-white m-3 timetableCard" key={`${index}`}>
                                    <div className="card-body">
                                        <div className="row gx-5">
                                            {
                                                (typeof daytimetableRecord[period] === "object") ?
                                                    <>
                                                        <div className="col-lg-3 col-xl-2 justify-content-center align-items-center">
                                                            <div className="p-2 lectureTime">{period}</div>
                                                        </div>
                                                        <div className="col-lg-2 col-xl-2 otherDetails">
                                                            <div className="p-2"><img className='px-2' height={"30px"} src={daytimetableRecord[period].lecLab === "LAB" ? labIcon : lectureIcon} /> {daytimetableRecord[period].lecLab}</div>
                                                        </div>
                                                        <div className="col-lg-2 col-xl-2 otherDetails">
                                                            <div className="p-2"><img className='px-2' height={"30px"} src={professorIcon} />{daytimetableRecord[period].faculty}</div>
                                                        </div>
                                                        <div className="col-lg-2 col-xl-2 otherDetails">
                                                            <div className="p-2"><img className='px-2' height={"30px"} src={subjectIcon} />{daytimetableRecord[period].subject}</div>
                                                        </div>
                                                        <div className="col-lg-3 col-xl-2 otherDetails">
                                                            <div className="p-2"><img className='px-2' height={"30px"} src={locationIcon} />{daytimetableRecord[period].location}</div>
                                                        </div>
                                                    </>
                                                    : <>
                                                        <div className="col-lg-3 col-xl-3 justify-content-center align-items-center">
                                                            <div className="p-2 lectureTime">{period}</div>
                                                        </div>
                                                        <div className="col-lg-6 col-xl-6 otherDetails">
                                                            <div className="p-2 text-center">{daytimetableRecord[period]}</div>
                                                        </div>
                                                        <div className="col-lg-3 col-xl-3 otherDetails">
                                                            <div className="p-2 text-center"></div>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {showContent && <h2 className='text-danger text-capitalize text-center'>
                        {(daytimetableRecord === "" || daytimetableRecord.length === 0) && <img src={underconstruction} height={"200px"} />}
                        <br />
                        {(daytimetableRecord === "" || daytimetableRecord.length === 0) && "No Timetable is Available Right Now !!"}
                    </h2>}
                </div>
            </div>
        </>
    )
}

export default Timetable_Day

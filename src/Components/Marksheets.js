import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../Context/NoteContext'
import InternalMenuBar from './InternalMenuBar'
import NavBreadcrumb from './NavBreadcrumb'

import underconstruction from "../Images/UnderConstruction.png"
import marksheetImg from "../Images/marksheetImg.png"

function Marksheets() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const [MarksheetRecords, setMarksheetRecords] = useState([])

    // Using the Context API
    const contextData = useContext(NoteContext);

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

        // Adding this in the recent Accessed
        contextData.updateRecentlyAccessed('Marksheets', `${location.pathname}`);

        // Moving the Page to the Top
        contextData.moveToTop()

        FetchMarksheetAPI()

    }, [])


    // Function to Fetch the Marksheet Data in the Database
    const FetchMarksheetAPI = async () => {

        let user = JSON.parse(sessionStorage.getItem("user"))

        // Calling the Add Marksheet API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/marksheet/fetch/sem/${user.sem}/enroll/${user.enrollNo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllStudentMarksheets = await response.json()

        console.log(fetchAllStudentMarksheets)

        if (fetchAllStudentMarksheets.success) {
            // If the API call is successful then set the Marksheet Records
            setMarksheetRecords(fetchAllStudentMarksheets.data)
            contextData.showAlert("Success", "Fetched All Marksheets Successfully", "alert-success")
        }
        else {
            // If the API call is not successful then show the error
            contextData.showAlert("Failed", "Error Fetching Marksheets", "alert-danger")
        }
    }

    function formatDate(marksheetDate) {
        const date = new Date(marksheetDate)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`)
        return `${year}-${month}-${day}`;
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

            {/* All the Cards */}
            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {
                            MarksheetRecords && MarksheetRecords.map((marksheet, index) => {

                                const keys = Object.keys(marksheet);
                                console.log("Marksheet : ",marksheet)

                                marksheet.marksheetDate = formatDate(marksheet.marksheetDate)

                                return (

                                    <React.Fragment key={marksheet._id}>
                                        {/* Marksheet Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={marksheet._id}>
                                            <div className="card itemCard">
                                                <img src={marksheetImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#MarksheetInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#MarksheetInfoModal${index}`}>
                                                    <p className="card-text itemName">Marksheet - Semester {marksheet.marksheetSem}</p>
                                                    {/* <p className="card-text small itemName fs-5 fw-normal">{marksheet.marksheetEnroll} ₹ {marksheet.marksheetSem} [ Sem {marksheet.marksheetAmount} ]</p> */}
                                                    <p className="card-text small itemName fs-5 fw-normal">Enrollment Number : {marksheet.marksheetEnroll} </p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col fw-bold">Date : {marksheet.marksheetDate}</div>
                                                        <div className="col fw-bold" style={{textAlign : "right"}}>Result : {marksheet.marksheetResult}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Marksheet Info Modal */}
                                        <div className="modal fade dark-modal" id={`MarksheetInfoModal${index}`} tabIndex="-1" aria-labelledby={`MarksheetInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`MarksheetInfoModal${index}Label`}>Marksheet Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let fieldname = "Marksheet " + data.split("marksheet")[1]
                                                                        console.log(data, " --> ", marksheet[data])
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData" || data.toLowerCase() === "marksheetlectures") { }
                                                                        else if (data === "marksheetData") {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td colSpan={2} className='p-3'>
                                                                                        <table className='table table-dark table-striped table-bordered my-2'>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td colSpan={7} align='center'><h5>Subject Wise Report [Semester {marksheet.marksheetSem}]</h5></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align='center' className='fw-bold'>Sr. No</td>
                                                                                                    <td align='center' className='fw-bold'>Subject Code</td>
                                                                                                    <td align='center' className='fw-bold'>Subject Name</td>
                                                                                                    <td align='center' className='fw-bold'>Course Credit Earned</td>
                                                                                                    <td align='center' className='fw-bold'>Grade Points Earned</td>
                                                                                                    <td align='center' className='fw-bold'>Course Grade Earned	</td>
                                                                                                    <td align='center' className='fw-bold'>Credit Points Earned</td>
                                                                                                </tr>
                                                                                                {/* Changing the index from 4 to 3 and vice versa for better viewing and representation */}
                                                                                                {
                                                                                                    marksheet.marksheetData.map((subject, index) => {
                                                                                                        return (
                                                                                                            <tr key={index}>
                                                                                                                <td align='center'>{index + 1}</td>
                                                                                                                <td align='center'>{subject[0]}</td>
                                                                                                                <td align='center'>{subject[1]}</td>
                                                                                                                <td align='center'>{subject[2]}</td>
                                                                                                                <td align='center'>{subject[4]}</td>
                                                                                                                <td align='center'>{subject[3]}</td>
                                                                                                                <td align='center'>{subject[5]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{fieldname}</td>
                                                                                    <td>{marksheet[data]}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="modal-footer bg-dark">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }

                        {<h2 className='text-light text-capitalize text-center'>
                            {!MarksheetRecords && <img src={underconstruction} height={"200px"} />}
                            <br />
                            {!MarksheetRecords && "No Marksheets are Available Right Now !!"}
                        </h2>}

                    </div>
                </div>
            </div>

        </>
    )
}

export default Marksheets

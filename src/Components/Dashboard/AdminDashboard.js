import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "../../CSS/Dashboard.css"

import adminImg from "../../Images/admin_admin.png"
import studentImg from "../../Images/admin_students.png"
import facultyImg from "../../Images/admin_faculty.png"
import uploadMaterialImg from "../../Images/admin_upload_material.png"
import remainderImg from "../../Images/remainder.png"
import attendanceImg from "../../Images/admin_attendance.png"
import subjectImg from "../../Images/admin_subjects.png"
import feesImg from "../../Images/admin_fees.png"
import timetableImg from "../../Images/admin_timetable.png"
import marksheetImg from "../../Images/admin_marksheet01.png"
import recentAccessImg from "../../Images/recentaccessed.png"
import announcementImg from "../../Images/announcements.png"
import myannouncementImg from "../../Images/announcementIcon03.png"

import NoteContext from '../../Context/NoteContext'
import InternalMenuBar from '../InternalMenuBar'
import NavBreadcrumb from '../NavBreadcrumb'
import AnnouncementItem from '../Items/AnnouncementItem'
import Logger from '../../Utils/Logger'

function AdminDashboard() {

    const openAdminOperations = () => {
        Logger("This is a Admin Operations");
        navigateTo(`${location.pathname}/admin_operations`)
    }

    const openStudentOperations = () => {
        Logger("This is a Student Operations");
        navigateTo(`${location.pathname}/student_operations`)
    }

    const openFacultyOperations = () => {
        Logger("This is a Faculty Operations");
        navigateTo(`${location.pathname}/faculty_operations`)
    }

    const openUploadMaterials = () => {
        Logger("This is a Upload Materials");
        navigateTo(`${location.pathname}/materials_operations`)
    }

    const openUploadAttendance = () => {
        Logger("This is a Upload Attendance");
        navigateTo(`${location.pathname}/attendance_operations`)
    }

    const openSubjectOperations = () => {
        Logger("This is a Subject Operations");
        navigateTo(`${location.pathname}/subject_operations`)
    }

    const openTimetableOperations = () => {
        Logger("This is a Timetable Operations");
        navigateTo(`${location.pathname}/timetable_operations`)
    }

    const openFeesOperations = () => {
        Logger("This is a Fees Operations");
        navigateTo(`${location.pathname}/fees_operations`)
    }

    const openMarksheetOperations = () => {
        Logger("This is a Marksheet Operations");
        navigateTo(`${location.pathname}/marksheet_operations`)
    }

    const openRecentAccessed = () => {
        Logger("This is a Recent Accessed");
        navigateTo(`${location.pathname}/recently_accessed`)
    }

    // Function to move the user to remainders page
    const openRemainders = () => {
        Logger("This is a Remainders Pages")
        navigateTo(`${location.pathname}/remainders`)
    }

    const openAnnouncements = () => {
        Logger("This is a Announcements");
        navigateTo(`${location.pathname}/announcements`)
    }

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    const [announcements, setAnnouncements] = useState([])

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

        // contextData.updateRecentlyAccessed('Dashboard', `${location.pathname}`);
        getAllAnnouncement()

    }, [])

    // Function to get All the Announcements
    const getAllAnnouncement = async () => {

        let userSem, userDiv, userBatch;

        if (sessionStorage.getItem("role") === "student") {
            userSem = parseInt(JSON.parse(sessionStorage.getItem("user")).sem)
            userDiv = JSON.parse(sessionStorage.getItem("user")).division
            userBatch = JSON.parse(sessionStorage.getItem("user")).batch

            userSem = userSem ? userSem : "all";
            userDiv = isNaN(userDiv) ? userDiv : "all";
            userBatch = isNaN(userBatch) ? userBatch : "all";
        }
        else {
            userSem = "all"
            userDiv = "all"
            userBatch = "all"
        }

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/announcement/fetch/sem/${userSem}/div/${userDiv}/batch/${userBatch}`, {
            method: "GET", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Variable to handle the API Response
        const announcementResponse = await response.json()

        Logger(announcementResponse)

        if (announcementResponse.success) {
            // If the response is successful then set the notes in the state
            setAnnouncements(announcementResponse.data);
        }
        else {
            // If the response is not successful then show the error message
            contextData.showAlert("Failed", "Error Fetching the Announcements", "alert-danger")
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

            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2 justify-content-center">
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openAdminOperations}>
                                <img src={adminImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Admin Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openStudentOperations}>
                                <img src={studentImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Student Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openFacultyOperations}>
                                <img src={facultyImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Faculty Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openUploadMaterials}>
                                <img src={uploadMaterialImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Upload Materials</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openUploadAttendance}>
                                <img src={attendanceImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Upload Attendance</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openSubjectOperations}>
                                <img src={subjectImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Subject Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openTimetableOperations}>
                                <img src={timetableImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Timetable Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openFeesOperations}>
                                <img src={feesImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Fees Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openMarksheetOperations}>
                                <img src={marksheetImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Marksheet Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openRecentAccessed}>
                                <img src={recentAccessImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Recently Accessed</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openAnnouncements}>
                                <img src={myannouncementImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">My Announcements</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={openRemainders}>
                                <img src={remainderImg} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Remainders</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <div className="container-fluid">
                <div className="d-flex flex-wrap align-items-center justify-content-center">
                    <div className="my-1">
                        <img src={announcementImg} alt="Announcement" height={"100px"} />
                    </div>
                    <div className="my-1 flex-grow-1 announcementText text-black">Announcements ({announcements.length})</div>
                </div>
                <div className='allAnnouncements mt-3'>
                    {
                        announcements.map((announcement) => {

                            Logger(announcement)

                            return (
                                <div key={announcement._id}>
                                    <AnnouncementItem title={announcement.announcementTitle} description={announcement.announcementDescription} announcementBy={announcement.announcementBy} date={announcement.announcementDate} links={announcement.additionalLinks} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}

export default AdminDashboard
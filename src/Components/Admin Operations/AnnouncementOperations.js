import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import announcementImg from "../../Images/announcementIcon03.png"
import AnnouncementItem from '../Items/AnnouncementItem';
// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function AnnouncementOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    const [AnnouncementRecords, setAnnouncementRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditAnnouncementRecord, setEditAnnouncementRecord] = useState({})

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
        contextData.updateRecentlyAccessed('Announcement Operations', `${location.pathname}`);

        FetchAnnouncementAPI();

    }, [])

    const isSecureLink = (link) => {
        return link.startsWith("https://") || link.startsWith("http://");
    };

    // Function to Add the Announcement Data in the Database
    const AddAnnouncementAPI = async (event) => {

        const addAnnouncementForm = document.getElementById("AddAnnouncementForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const role = sessionStorage.getItem("role")

        const announcementTitle = document.getElementById("announcementTitle").value;
        const announcementDescription = document.getElementById("announcementDescription").value;
        const announcementSem = (typeof document.getElementById("announcementSem").value === Number ? parseInt(document.getElementById("announcementSem").value) : document.getElementById("announcementSem").value);
        const announcementDivision = document.getElementById("announcementDivision").value;
        const announcementBatch = document.getElementById("announcementBatch").value;
        const announcementBy = role === "admin" ? "Admin" : role === "faculty" ? JSON.parse(sessionStorage.getItem("user")).name : "";
        const announcementLinkTitle = document.getElementById("announcementLinkTitle").value;
        let announcementLink = document.getElementById("announcementLink").value;

        if (!isSecureLink(announcementLink)) {
            announcementLink = "http://" + announcementLink
        }

        let additionalLinks = {};
        additionalLinks[announcementLinkTitle] = announcementLink

        if (announcementTitle === "" || announcementDescription === "" || announcementSem === "" || announcementDivision === "" || announcementBatch === "" || announcementBy === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Announcement API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/announcement/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: announcementTitle,
                    description: announcementDescription,
                    sem: announcementSem,
                    division: announcementDivision,
                    batch: announcementBatch,
                    announcedBy: announcementBy,
                    links: additionalLinks,
                })
            });

            // Variable to handle the API Response
            const addAnnouncementResponse = await response.json()

            Logger(addAnnouncementResponse)

            if (addAnnouncementResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addAnnouncementCloseBtn").click()
                document.getElementById("addAnnouncementModel").style.display = "none"
                contextData.showAlert("Success", addAnnouncementResponse.message, "alert-success")
                addAnnouncementForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchAnnouncementAPI()
            }
            else {
                contextData.showAlert("Failed", addAnnouncementResponse.message, "alert-danger")
            }
        }
    }

    // Function to Fetch the Announcement Data in the Database
    const FetchAnnouncementAPI = async () => {
        // Calling the Add Announcement API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/announcement/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAnnouncementsResponse = await response.json()

        Logger(fetchAnnouncementsResponse)

        if (fetchAnnouncementsResponse.success) {
            setAnnouncementRecords(fetchAnnouncementsResponse.data)
        }
    }

    // Function to Delete the Announcement Data : 
    const DeleteAnnouncementAPI = async (announcementId) => {
        // Calling the Add Announcement API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/announcement/delete/${announcementId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteAnnouncementResponse = await response.json()

        Logger(deleteAnnouncementResponse)

        if (deleteAnnouncementResponse.success) {
            // After a successful submission, hide the modal
            contextData.showAlert("Success", deleteAnnouncementResponse.message, "alert-success")
        }
        else {
            contextData.showAlert("Failed", deleteAnnouncementResponse.message, "alert-danger")
        }

        // Again Fetching the Records to refresh the records
        FetchAnnouncementAPI()

    }

    // Function to Edit the Announcement Data : 
    // TODO Remaining
    const EditAnnouncementAPI = async (announcementId) => {

        const editAnnouncementForm = document.getElementById("EditAnnouncementForm")

        Logger(EditAnnouncementRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const role = sessionStorage.getItem("role")
        const updatedannouncementTitle = document.getElementById("updatedannouncementTitle").value;
        Logger(updatedannouncementTitle)

        const updatedannouncementDescription = document.getElementById("updatedannouncementDescription").value;
        Logger(updatedannouncementDescription)

        const updatedannouncementSem = (typeof document.getElementById("updatedannouncementSem").value === Number ? parseInt(document.getElementById("updatedannouncementSem").value) : document.getElementById("updatedannouncementSem").value);
        Logger(updatedannouncementSem)

        const updatedannouncementDivision = document.getElementById("updatedannouncementDivision").value;
        Logger(updatedannouncementDivision)

        const updatedannouncementBatch = document.getElementById("updatedannouncementBatch").value;
        Logger(updatedannouncementBatch)

        const updatedannouncementBy = role === "admin" ? "Admin" : role === "faculty" ? JSON.parse(sessionStorage.getItem("user")).name : "";
        Logger(updatedannouncementBy)

        const updatedannouncementLinkTitle = document.getElementById("updatedannouncementLinkTitle").value;
        Logger(updatedannouncementLinkTitle)

        let updatedannouncementLink = document.getElementById("updatedannouncementLink").value;
        Logger(updatedannouncementLink)

        if (!isSecureLink(updatedannouncementLink)) {
            updatedannouncementLink = "http://" + updatedannouncementLink
        }

        let additionalLinks = {};
        additionalLinks[updatedannouncementLinkTitle] = updatedannouncementLink

        if (updatedannouncementTitle === "" || updatedannouncementDescription === "" || updatedannouncementSem === "" || updatedannouncementDivision === "" || updatedannouncementBatch === "" || updatedannouncementBy === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Announcement API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/announcement/update/${announcementId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: updatedannouncementTitle,
                    description: updatedannouncementDescription,
                    sem: updatedannouncementSem,
                    division: updatedannouncementDivision,
                    batch: updatedannouncementBatch,
                    announcedBy: updatedannouncementBy,
                    links: additionalLinks,
                })
            });

            // Variable to handle the API Response
            const editAnnouncementResponse = await response.json()

            if (editAnnouncementResponse.success) {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editAnnouncementResponse.message, "alert-success")
                editAnnouncementForm.reset();
                document.getElementById("editAnnouncementcloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchAnnouncementAPI()
            }
            else {
                contextData.showAlert("Failed", editAnnouncementResponse.message, "alert-danger")
            }
        }
    }

    const onChange = (event) => {
        if (event.target.name === "announcementLinkTitle" || event.target.name === "announcementLink") {
            // If the user is updating link or link title, update additionalLinks object
            setEditAnnouncementRecord({
                ...EditAnnouncementRecord,
                additionalLinks: {
                    ...EditAnnouncementRecord.additionalLinks,
                    [event.target.name === "announcementLinkTitle" ? "title" : "link"]: event.target.value
                }
            });
        } else {
            // For other fields, update as before
            setEditAnnouncementRecord({
                ...EditAnnouncementRecord,
                [event.target.name]: event.target.value
            });
        }

        Logger("Record : ", EditAnnouncementRecord)
    };

    const applyFilter = () => {

        const searchTitle = document.getElementById("filterTitle").value;
        const searchDivision = document.getElementById("filterDivision").value;
        const searchBatch = document.getElementById("filterBatch").value;
        const searchSem = document.getElementById("filterSem").value;
        const searchAnnouncementBy = document.getElementById("filterAnnouncementBy").value;

        let titleMatches;
        let divisionMatches;
        let semMatches;
        let batchMatches;
        let announcementByMatches;

        const filteredResult = AnnouncementRecords.filter((item) => {
            if (searchDivision !== "") {
                divisionMatches = item.announcementDivision.includes(searchDivision);
            }
            if (searchSem !== "") {
                semMatches = item.announcementSem.includes(searchSem);
            }
            if (searchTitle !== "") {
                titleMatches = item.announcementTitle.includes(searchTitle);
            }
            if (searchBatch !== "") {
                batchMatches = item.announcementBatch.includes(searchBatch);
            }
            if (searchAnnouncementBy !== "") {
                announcementByMatches = item.announcementBy.includes(searchAnnouncementBy);
            }

            return (divisionMatches || searchDivision === "") && (semMatches || searchSem === "") && (titleMatches || searchTitle === "") && (batchMatches || searchBatch === "") && (announcementByMatches || searchAnnouncementBy === "");
        });

        setFilteredRecords(filteredResult)
    }

    const clearAllFilters = () => {
        document.getElementById("filterForm").reset()
        setFilteredRecords([])
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

            {/* Filter Section */}
            <div className="my-2">
                <div id='filterContainer' className='bg-light p-3 m-2 mt-4' style={{ borderRadius: "10px" }}>
                    <form id='filterForm'>
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterTitle" className="form-label text-black fw-bold">Title</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterTitle" name="filterTitle" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDivision" className="form-label text-black fw-bold">Division</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDivision" name="filterDivision" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterBatch" className="form-label text-black fw-bold">Batch</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterBatch" name="filterBatch" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterSem" className="form-label text-black fw-bold">Semester</label>
                                {/* <input type="number" className="form-control text-white fw-bold" id="filterSem" name="filterSem" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required /> */}
                                <select className="form-select fw-bold" id="filterSem" defaultValue={""} style={{ backgroundColor: "#1e1e1e", color: "white" }} onChange={() => { applyFilter() }} required >
                                    <option value={""}>SELECT</option>
                                    <option value={"1"}>1</option>
                                    <option value={"2"}>2</option>
                                    <option value={"3"}>3</option>
                                    <option value={"4"}>4</option>
                                    <option value={"5"}>5</option>
                                    <option value={"6"}>6</option>
                                    <option value={"7"}>7</option>
                                    <option value={"8"}>8</option>
                                    <option value={"9"}>9</option>
                                    <option value={"10"}>10</option>
                                    <option value={"all"}>all</option>
                                </select>

                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterAnnouncementBy" className="form-label text-black fw-bold">Announcement By</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterAnnouncementBy" name="filterAnnouncementBy" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3 text-center">
                                <label id="filterRecordsCount" className='text-center form-label fw-bold' style={{ "color": FilteredRecords.length === 0 ? "darkred" : "darkgreen" }}>{FilteredRecords.length} Records Found From Your Search !</label>
                                <button type='button' className="w-100 text-center btn btn-danger fw-bold border-2 border-black" onClick={clearAllFilters}>Clear Filter</button>
                            </div>
                        </div>
                        {/* <div className="row mt-3">
                            <div className="col"><button className='btn border-2 border-black btn-success w-100 fw-bold text-white' type="button">Apply Filters</button></div>
                            <div className="col"><button className='btn border-2 border-black btn-danger w-100 fw-bold text-white' type="button" onClick={() => { document.getElementById("filterContainer").style.display = "none" }}>Close Filters</button></div>
                        </div> */}
                    </form>
                </div>
            </div>

            <div className='allAnnouncements mt-3 px-2'>

                {/* Displaying all the Cards and the Modal Info */}
                {
                    FilteredRecords.length === 0 && AnnouncementRecords.map((announcement, index) => {

                        {/* const keys = Object.keys(announcement); */ }
                        Logger(announcement)

                        return (

                            <React.Fragment key={announcement._id}>

                                {/* Announcement Card */}
                                <AnnouncementItem
                                    title={announcement.announcementTitle}
                                    description={announcement.announcementDescription}
                                    announcementBy={announcement.announcementBy}
                                    date={announcement.announcementDate}
                                    links={announcement.additionalLinks}
                                    editdelete={true}
                                    announcementdata={announcement}
                                    index={index}
                                    deleteAPI={DeleteAnnouncementAPI}
                                    editAPI={EditAnnouncementAPI}
                                    EditAnnouncementRecord={EditAnnouncementRecord}
                                    setEditAnnouncementRecord={setEditAnnouncementRecord}
                                    announcement={announcement}
                                />

                            </React.Fragment>
                        )
                    })
                }
                {
                    FilteredRecords.length !== 0 && FilteredRecords.map((announcement, index) => {

                        {/* const keys = Object.keys(announcement); */ }
                        Logger(announcement)

                        return (

                            <React.Fragment key={announcement._id}>

                                {/* Announcement Card */}
                                <AnnouncementItem
                                    title={announcement.announcementTitle}
                                    description={announcement.announcementDescription}
                                    announcementBy={announcement.announcementBy}
                                    date={announcement.announcementDate}
                                    links={announcement.additionalLinks}
                                    editdelete={true}
                                    announcementdata={announcement}
                                    index={index}
                                    deleteAPI={DeleteAnnouncementAPI}
                                    editAPI={EditAnnouncementAPI}
                                    EditAnnouncementRecord={EditAnnouncementRecord}
                                    setEditAnnouncementRecord={setEditAnnouncementRecord}
                                    announcement={announcement}
                                />

                            </React.Fragment>
                        )
                    })
                }

                <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addAnnouncementModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Announcement</button>

                {/* Add Announcement Model */}
                <div className="modal fade dark-modal" id="addAnnouncementModel" aria-labelledby="addAnnouncementModelLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header bg-dark text-light">
                                <h1 className="modal-title fs-5" id="addAnnouncementModelLabel">Add Announcement Form</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddAnnouncementForm").reset(); }}></button>
                            </div>

                            {/* Form For Adding the Announcement Data */}
                            <form id='AddAnnouncementForm'>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="announcementTitle" className="form-label">Announcement Title <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementTitle" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementDescription" className="form-label">Announcement Description <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementDescription" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementSem" className="form-label">Announcement Sem <span className="requiredAsterisk">*</span></label>
                                        <select className="form-select text-black fw-bold" id="announcementSem" defaultValue={"all"} required >
                                            <option value={"1"}>1</option>
                                            <option value={"2"}>2</option>
                                            <option value={"3"}>3</option>
                                            <option value={"4"}>4</option>
                                            <option value={"5"}>5</option>
                                            <option value={"6"}>6</option>
                                            <option value={"7"}>7</option>
                                            <option value={"8"}>8</option>
                                            <option value={"9"}>9</option>
                                            <option value={"10"}>10</option>
                                            <option value={"all"}>all</option>
                                        </select>

                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementDivision" className="form-label">Announcement Division <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementDivision" defaultValue={"all"} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementBatch" className="form-label">Announcement Batch <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementBatch" defaultValue={"all"} required />
                                    </div>
                                    <div className="mt-4 mb-2">
                                        <hr className='hrStyle' />
                                    </div>
                                    <div className="mb-0">
                                        <label htmlFor="additionalLinks" className="form-label fs-5 fw-bolder ">Additional Links</label>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementLinkTitle" className="form-label">Link Title</label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementLinkTitle" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="announcementLink" className="form-label">Link</label>
                                        <input type="text" className="form-control text-black fw-bold" id="announcementLink" />
                                    </div>
                                </div>
                                <div className="modal-footer bg-dark">
                                    <button type="button" className="btn btn-danger" id="addAnnouncementCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddAnnouncementForm").reset(); }}>Close</button>
                                    <button type="submit" className="btn btn-success" onClick={AddAnnouncementAPI}>Submit Form</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

                {/* Edit Announcement Model */}
                <div className="modal fade dark-modal" id="editAnnouncementModel" tabIndex="-1" aria-labelledby="editAnnouncementModelLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header bg-dark text-light">
                                <h1 className="modal-title fs-5" id="editAnnouncementModelLabel">Edit Announcement Form</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" id="editAnnouncementcloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditAnnouncementForm").reset(); }}></button>
                            </div>

                            {/* Form For Adding the Announcement Data */}
                            <form id='EditAnnouncementForm'>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementTitle" className="form-label">New Announcement Title <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="updatedannouncementTitle" name="announcementTitle" onChange={onChange} value={EditAnnouncementRecord.announcementTitle ?? ''} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementDescription" className="form-label">New Announcement Description <span className="requiredAsterisk">*</span></label>
                                        <input type="text" className="form-control text-black fw-bold" id="updatedannouncementDescription" name="announcementDescription" onChange={onChange} value={EditAnnouncementRecord.announcementDescription ?? ''} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementSem" className="form-label">New Announcement Sem <span className="requiredAsterisk">*</span></label>
                                        <select className="form-select text-black fw-bold" id="updatedannouncementSem" name="announcementSem" onChange={onChange} value={EditAnnouncementRecord.announcementSem ?? ''} required >
                                            <option value={"1"}>1</option>
                                            <option value={"2"}>2</option>
                                            <option value={"3"}>3</option>
                                            <option value={"4"}>4</option>
                                            <option value={"5"}>5</option>
                                            <option value={"6"}>6</option>
                                            <option value={"7"}>7</option>
                                            <option value={"8"}>8</option>
                                            <option value={"9"}>9</option>
                                            <option value={"10"}>10</option>
                                            <option value={"all"}>all</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementDivision" className="form-label">New Announcement Division <span className="requiredAsterisk">*</span></label>
                                        <select className="form-select text-black fw-bold" id="updatedannouncementDivision" name="announcementDivision" onChange={onChange} value={EditAnnouncementRecord.announcementDivision ?? ''} required >
                                            <option value={"1"}>1</option>
                                            <option value={"2"}>2</option>
                                            <option value={"3"}>3</option>
                                            <option value={"4"}>4</option>
                                            <option value={"5"}>5</option>
                                            <option value={"6"}>6</option>
                                            <option value={"7"}>7</option>
                                            <option value={"8"}>8</option>
                                            <option value={"9"}>9</option>
                                            <option value={"10"}>10</option>
                                            <option value={"all"}>all</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementBatch" className="form-label">New Announcement Batch <span className="requiredAsterisk">*</span></label>
                                        <select className="form-select text-black fw-bold" id="updatedannouncementBatch" name="announcementBatch" onChange={onChange} value={EditAnnouncementRecord.announcementBatch ?? ''} required >
                                            <option value={"1"}>1</option>
                                            <option value={"2"}>2</option>
                                            <option value={"3"}>3</option>
                                            <option value={"4"}>4</option>
                                            <option value={"5"}>5</option>
                                            <option value={"6"}>6</option>
                                            <option value={"7"}>7</option>
                                            <option value={"8"}>8</option>
                                            <option value={"9"}>9</option>
                                            <option value={"10"}>10</option>
                                            <option value={"all"}>all</option>
                                        </select>
                                    </div>
                                    <div className="mt-4 mb-2">
                                        <hr className='hrStyle' />
                                    </div>
                                    <div className="mb-0">
                                        <label htmlFor="additionalLinks" className="form-label fs-5 fw-bolder ">Additional Links</label>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementLinkTitle" className="form-label">Link Title</label>
                                        <input type="text" className="form-control text-black fw-bold" id="updatedannouncementLinkTitle" name="announcementLinkTitle" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="updatedannouncementLink" className="form-label">Link</label>
                                        <input type="text" className="form-control text-black fw-bold" id="updatedannouncementLink" name="announcementLink" />
                                    </div>
                                </div>
                                <div className="modal-footer bg-dark">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditAnnouncementForm").reset(); }}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={() => { EditAnnouncementAPI(EditAnnouncementRecord._id) }}>Submit Form</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnnouncementOperations

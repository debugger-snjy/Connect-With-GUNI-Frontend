import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import facultyMaleImg from "../../Images/male_faculty.png"
import facultyFemaleImg from "../../Images/female_faculty.png"
// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function FacultyOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    const [FacultyRecords, setFacultyRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditFacultyRecord, setEditFacultyRecord] = useState([])

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
        contextData.updateRecentlyAccessed('Faculty Operations', `${location.pathname}`);

        FetchFacultyAPI();

    }, [])


    // Function to Add the Faculty Data in the Database
    const AddFacultyAPI = async (event) => {

        const addFacultyForm = document.getElementById("AddFacultyForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const facultyId = document.getElementById("facultyId").value;
        const facultydept = document.getElementById("facultydept").value;
        const facultydesignation = document.getElementById("facultydesignation").value;
        const facultyShortForm = document.getElementById("facultyShortForm").value;
        const facultycabinLocation = document.getElementById("facultycabinLocation").value;
        const facultyemail = document.getElementById("facultyemail").value;
        const facultypassword = document.getElementById("facultypassword").value;
        const facultyname = document.getElementById("facultyname").value;
        const facultyphone = document.getElementById("facultyphone").value;
        const facultygender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderFemale").checked ? "female" : "";
        const role = sessionStorage.getItem("role")

        if (facultyId === "" || facultydept === "" || facultydesignation === "" || facultyShortForm === "" || facultycabinLocation === "" || facultyemail === "" || facultypassword === "" || facultyname === "" || facultyphone === "" || facultygender === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Faculty API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faculty/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    facultyId: facultyId,
                    phone: facultyphone,
                    name: facultyname,
                    password: facultypassword,
                    email: facultyemail,
                    gender: facultygender,
                    dept: facultydept,
                    designation: facultydesignation,
                    role: role,
                    facultyShortForm: facultyShortForm,
                    cabinLocation: facultycabinLocation,
                })
            });

            // Variable to handle the API Response
            const addFacultyResponse = await response.json()

            Logger(addFacultyResponse)

            if (addFacultyResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addFacultyCloseBtn").click()
                document.getElementById("addFacultyModel").style.display = "none"
                contextData.showAlert("Success", addFacultyResponse.message, "alert-success")
                addFacultyForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchFacultyAPI()
            }
            else {
                contextData.showAlert("Failed", addFacultyResponse.message, "alert-danger")
            }
        }
    }

    // Function to Fetch the Faculty Data in the Database
    const FetchFacultyAPI = async () => {
        // Calling the Add Faculty API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faculty/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchFacultiesResponse = await response.json()

        Logger(fetchFacultiesResponse)

        if (fetchFacultiesResponse.success) {
            // If the response is successful, then set the Faculty Records
            setFacultyRecords(fetchFacultiesResponse.data)
            setFilteredRecords([]) // Resetting the filtered records
        }
        else {
            // If the response is not successful, then show the alert
            contextData.showAlert("Failed", fetchFacultiesResponse.message, "alert-danger")
        }
    }

    // Function to Delete the Faculty Data : 
    const DeleteFacultyAPI = async (facultyId) => {
        // Calling the Add Faculty API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faculty/delete/${facultyId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteFacultyResponse = await response.json()

        Logger(deleteFacultyResponse)

        if (deleteFacultyResponse.success) {
            // If the response is successful, then show the alert
            contextData.showAlert("Success", deleteFacultyResponse.message, "alert-success")
        }
        else {
            // If the response is not successful, then show the alert
            contextData.showAlert("Failed", deleteFacultyResponse.message, "alert-danger")
        }

        // Again Fetching the Records to refresh the records
        FetchFacultyAPI()

    }

    // Function to Edit the Faculty Data : 
    const EditFacultyAPI = async (facultyId) => {

        const editFacultyForm = document.getElementById("EditFacultyForm")

        Logger(EditFacultyRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const updatedfacultyId = document.getElementById("updatedfacultyId").value;
        const updatedfacultydept = document.getElementById("updatedfacultydept").value;
        const updatedfacultydesignation = document.getElementById("updatedfacultydesignation").value;
        const updatedfacultyShortForm = document.getElementById("updatedfacultyShortForm").value;
        const updatedfacultycabinLocation = document.getElementById("updatedfacultycabinLocation").value;
        const updatedfacultyemail = document.getElementById("updatedfacultyemail").value;
        const updatedfacultypassword = document.getElementById("updatedfacultypassword").value;
        const updatedfacultyname = document.getElementById("updatedfacultyname").value;
        const updatedfacultyphone = document.getElementById("updatedfacultyphone").value;
        const updatedfacultygender = document.getElementById("updatedgenderMale").checked ? "male" : document.getElementById("updatedgenderFemale").checked ? "female" : "";
        const userrole = sessionStorage.getItem("role")

        if (updatedfacultyId === "" || updatedfacultydept === "" || updatedfacultydesignation === "" || updatedfacultyShortForm === "" || updatedfacultycabinLocation === "" || updatedfacultyemail === "" || updatedfacultypassword === "" || updatedfacultyname === "" || updatedfacultyphone === "" || updatedfacultygender === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Edit Faculty API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faculty/update/${facultyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    facultyId: updatedfacultyId,
                    dept: updatedfacultydept,
                    designation: updatedfacultydesignation,
                    facultyShortForm: updatedfacultyShortForm,
                    cabinLocation: updatedfacultycabinLocation,
                    email: updatedfacultyemail,
                    password: updatedfacultypassword,
                    name: updatedfacultyname,
                    phone: updatedfacultyphone,
                    gender: updatedfacultygender,
                    role: userrole,
                })
            });

            // Variable to handle the API Response
            const editFacultyResponse = await response.json()

            if (editFacultyResponse.success) {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editFacultyResponse.message, "alert-success")
                editFacultyForm.reset();
                document.getElementById("editFacultycloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchFacultyAPI()
            }
            else {
                contextData.showAlert("Failed", editFacultyResponse.message, "alert-danger")
            }
        }
    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditFacultyRecord({
            ...EditFacultyRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        Logger("EditAdmin : ", EditFacultyRecord)

    }

    const applyFilter = () => {

        const searchFacultyID = document.getElementById("filterFacultyID").value;
        const searchName = document.getElementById("filterName").value;
        const searchDept = document.getElementById("filterDept").value;
        const searchShortForm = document.getElementById("filterShortForm").value;
        const searchCabinLocation = document.getElementById("filterCabinLocation").value;
        const searchDesignation = document.getElementById("filterDesignation").value;

        let facultyIdMatches;
        let nameMatches;
        let deptMatches;
        let shortFormMatches;
        let cabinLocationMatches;
        let designationMatches;

        const filteredResult = FacultyRecords.filter((item) => {
            if (searchFacultyID !== "") {
                facultyIdMatches = item.facultyId.toString() === searchFacultyID || searchFacultyID === '';

            }
            if (searchName !== "") {
                nameMatches = item.name.includes(searchName)
            }
            if (searchShortForm !== "") {
                shortFormMatches = item.facultyShortForm.includes(searchShortForm)
            }
            if (searchDept !== "") {
                deptMatches = item.dept.includes(searchDept);
            }
            if (searchDesignation !== "") {
                designationMatches = item.designation.includes(searchDesignation);
            }
            if (searchCabinLocation !== "") {
                cabinLocationMatches = item.cabinLocation.includes(searchCabinLocation)
            }

            return (facultyIdMatches || searchFacultyID === "") && (nameMatches || searchName === "") && (deptMatches || searchDept === "") && (shortFormMatches || searchShortForm === "") && (cabinLocationMatches || searchCabinLocation === "") && (designationMatches || searchDesignation === "");
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
                                <label htmlFor="filterFacultyID" className="form-label text-black fw-bold">Faculty ID</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterFacultyID" name="filterFacultyID" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDept" className="form-label text-black fw-bold">Department</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDept" name="filterDept" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterShortForm" className="form-label text-black fw-bold">Faculty Short Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterShortForm" name="filterShortForm" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterCabinLocation" className="form-label text-black fw-bold">Cabin Location</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterCabinLocation" name="filterCabinLocation" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDesignation" className="form-label text-black fw-bold">Designation</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDesignation" name="filterDesignation" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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

            {/* All the Cards */}
            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {/* Displaying all the Cards and the Modal Info */}
                        {
                            FilteredRecords.length === 0 && FacultyRecords.map((faculty, index) => {

                                const keys = Object.keys(faculty);
                                Logger(faculty)

                                return (

                                    <React.Fragment key={faculty._id}>
                                        {/* Faculty Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={faculty._id}>
                                            <div className="card itemCard">
                                                <img src={faculty.gender === "male" ? facultyMaleImg : facultyFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#FacultyInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#FacultyInfoModal${index}`}>
                                                    <p className="card-text itemName">{faculty.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{faculty.facultyId} [ {faculty.designation} - {faculty.dept} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editFacultyModel" onClick={() => { setEditFacultyRecord(faculty) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Faculty</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteFacultyAPI(faculty._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Faculty</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Faculty Info Modal */}
                                        <div className="modal fade dark-modal" id={`FacultyInfoModal${index}`} tabIndex="-1" aria-labelledby={`FacultyInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`FacultyInfoModal${index}Label`}>Faculty Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addFacultycloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", faculty[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{faculty[data]}</td>
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

                        {
                            FilteredRecords.length !== 0 && FilteredRecords.map((faculty, index) => {

                                const keys = Object.keys(faculty);
                                Logger(faculty)

                                return (

                                    <React.Fragment key={faculty._id}>
                                        {/* Faculty Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={faculty._id}>
                                            <div className="card itemCard">
                                                <img src={faculty.gender === "male" ? facultyMaleImg : facultyFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#FacultyInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#FacultyInfoModal${index}`}>
                                                    <p className="card-text itemName">{faculty.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{faculty.facultyId} [ {faculty.designation} - {faculty.dept} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editFacultyModel" onClick={() => { setEditFacultyRecord(faculty) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Faculty</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteFacultyAPI(faculty._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Faculty</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Faculty Info Modal */}
                                        <div className="modal fade dark-modal" id={`FacultyInfoModal${index}`} tabIndex="-1" aria-labelledby={`FacultyInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`FacultyInfoModal${index}Label`}>Faculty Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addFacultycloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", faculty[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{faculty[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addFacultyModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Faculty</button>

                        {/* Add Faculty Model */}
                        <div className="modal fade dark-modal" id="addFacultyModel" aria-labelledby="addFacultyModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addFacultyModelLabel">Add Faculty Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddFacultyForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Faculty Data */}
                                    <form id='AddFacultyForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="facultyId" className="form-label">Faculty Id</label>
                                                <input type="number" className="form-control text-black fw-bold" id="facultyId" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultydept" className="form-label">Department</label>
                                                <select className="form-select text-black fw-bold" id="facultydept" required >
                                                    <option value={"CE"}>Computer Engineering (CE)</option>
                                                    <option value={"IT"}>Information Technology (IT)</option>
                                                    <option value={"CE-AI"}>Computer Engineering - Artificial Intelligence (CE-AI)</option>
                                                    <option value={"Diploma"}>Diploma (Diploma)</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultydesignation" className="form-label">Designation</label>
                                                <input type="text" className="form-control text-black fw-bold" id="facultydesignation" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultyShortForm" className="form-label">Faculty Short Form</label>
                                                <input type="text" className="form-control text-black fw-bold" id="facultyShortForm" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultycabinLocation" className="form-label">Cabin Location</label>
                                                <input type="text" className="form-control text-black fw-bold" id="facultycabinLocation" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultyemail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="facultyemail" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultypassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="facultypassword" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultyname" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="facultyname" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultygender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="facultygender" id="genderMale" />
                                                    <label className="form-check-label" htmlFor="genderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="facultygender" id="genderFemale" />
                                                    <label className="form-check-label" htmlFor="genderFemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="facultyphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="facultyphone" maxLength={10} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addFacultyCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddFacultyForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddFacultyAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Faculty Model */}
                        <div className="modal fade dark-modal" id="editFacultyModel" tabIndex="-1" aria-labelledby="editFacultyModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editFacultyModelLabel">Edit Faculty Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editFacultycloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditFacultyForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Faculty Data */}
                                    <form id='EditFacultyForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultyId" className="form-label">Faculty Id</label>
                                                <input type="number" className="form-control text-black fw-bold" id="updatedfacultyId" name="facultyId" onChange={onChange} value={EditFacultyRecord.facultyId} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultydept" className="form-label">Department</label>
                                                <select className="form-select text-black fw-bold" id="updatedfacultydept" name="dept" onChange={onChange} value={EditFacultyRecord.dept} required >
                                                    <option value={"CE"}>Computer Engineering (CE)</option>
                                                    <option value={"IT"}>Information Technology (IT)</option>
                                                    <option value={"CE-AI"}>Computer Engineering - Artificial Intelligence (CE-AI)</option>
                                                    <option value={"Diploma"}>Diploma (Diploma)</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultydesignation" className="form-label">Designation</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedfacultydesignation" name="designation" onChange={onChange} value={EditFacultyRecord.designation} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultyShortForm" className="form-label">Faculty Short Form</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedfacultyShortForm" name="facultyShortForm" onChange={onChange} value={EditFacultyRecord.facultyShortForm} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultycabinLocation" className="form-label">Cabin Location</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedfacultycabinLocation" name="cabinLocation" onChange={onChange} value={EditFacultyRecord.cabinLocation} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultyemail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="updatedfacultyemail" name="email" onChange={onChange} value={EditFacultyRecord.email} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultypassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="updatedfacultypassword" name="password" onChange={onChange} value={EditFacultyRecord.password} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultyname" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedfacultyname" name="name" onChange={onChange} value={EditFacultyRecord.name} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultygender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderMale" value="male" onChange={onChange} checked={EditFacultyRecord.gender == "male" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderFemale" value="female" onChange={onChange} checked={EditFacultyRecord.gender == "female" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedfacultyphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="updatedfacultyphone" maxLength={10} name="phone" onChange={onChange} value={EditFacultyRecord.phone} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditFacultyForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditFacultyAPI(EditFacultyRecord._id) }}>Submit Form</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default FacultyOperations

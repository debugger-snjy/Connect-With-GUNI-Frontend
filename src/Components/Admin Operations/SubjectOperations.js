import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import subjectImg from "../../Images/subject03.png"
// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function SubjectOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const [SubjectRecords, setSubjectRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditSubjectRecord, setEditSubjectRecord] = useState([])

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
        contextData.updateRecentlyAccessed('Subject Operations', `${location.pathname}`);

        // Moving the Page to the Top
        contextData.moveToTop()

        FetchSubjectAPI()

    }, [])


    // Function to Add the Subject Data in the Database
    const AddSubjectAPI = async (event) => {

        const addSubjectForm = document.getElementById("AddSubjectForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const subjectsem = document.getElementById("subjectsem").value;
        const subjectName = document.getElementById("subjectName").value;
        const subjectShortForm = document.getElementById("subjectShortForm").value;
        const subjectCode = document.getElementById("subjectCode").value;
        const subjectFaculties = document.getElementById("subjectFaculties").value;

        if (subjectsem === "" || subjectName === "" || subjectShortForm === "" || subjectCode === "" || subjectFaculties === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Subject API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subject/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sem: subjectsem,
                    subjectName: subjectName,
                    subjectShortForm: subjectShortForm,
                    subjectCode: subjectCode,
                    faculties: subjectFaculties,
                })
            });

            // Variable to handle the API Response
            const addSubjectResponse = await response.json()

            Logger(addSubjectResponse)

            if (addSubjectResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addSubjectCloseBtn").click()
                contextData.showAlert("Success", addSubjectResponse.message, "alert-success")
                addSubjectForm.reset();

                // Moving the Page to the Top
                contextData.moveToTop()

                // Fetching the Records Again for the Updated Records
                FetchSubjectAPI()
            }
            else {
                contextData.showAlert("Failed", addSubjectResponse.message, "alert-danger")
            }
        }
    }

    // Function to Fetch the Subject Data in the Database
    const FetchSubjectAPI = async () => {
        // Calling the Add Subject API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subject/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchSubjectResponse = await response.json()

        Logger(fetchSubjectResponse)

        if (fetchSubjectResponse.success) {
            // If the response is successful, set the SubjectRecords state
            setSubjectRecords(fetchSubjectResponse.subjects);
            setFilteredRecords([]); // Reset filtered records when fetching new data
        }
        else {
            // If the response is not successful, show an alert
            contextData.showAlert("Failed", fetchSubjectResponse.message, "alert-danger")
        }
    }

    // Function to Delete the Subject Data : 
    const DeleteSubjectAPI = async (subjectId) => {
        // Calling the Add Subject API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subject/delete/${subjectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteSubjectResponse = await response.json()

        Logger(deleteSubjectResponse)

        if (deleteSubjectResponse.success) {
            // If the response is successful, show an alert
            contextData.showAlert("Success", deleteSubjectResponse.message, "alert-success")
        }
        else {
            // If the response is not successful, show an alert
            contextData.showAlert("Failed", deleteSubjectResponse.message, "alert-danger")
        }

        // Moving the Page to the Top
        contextData.moveToTop()

        // Again Fetching the Records to refresh the records
        FetchSubjectAPI()

    }

    // Function to Edit the Subject Data : 
    const EditSubjectAPI = async (subjectId) => {

        const editSubjectForm = document.getElementById("EditSubjectForm")

        // event.preventDefault(); // Prevent the form from submitting
        Logger(EditSubjectRecord)

        // Access form fields by their Ids
        const updatesubjectsem = document.getElementById("updatesubjectsem").value;
        const updatesubjectName = document.getElementById("updatesubjectName").value;
        const updatesubjectShortForm = document.getElementById("updatesubjectShortForm").value;
        const updatesubjectCode = document.getElementById("updatesubjectCode").value;
        const updatesubjectFaculties = document.getElementById("updatesubjectFaculties").value;

        // Logger(updateduserrole)

        if (updatesubjectsem == "" || updatesubjectName == "" || updatesubjectShortForm == "" || updatesubjectCode == "" || updatesubjectFaculties == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Edit Subject API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subject/update/${subjectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sem: updatesubjectsem,
                    subjectName: updatesubjectName,
                    subjectShortForm: updatesubjectShortForm,
                    subjectCode: updatesubjectCode,
                    faculties: updatesubjectFaculties,
                })
            });

            // Variable to handle the API Response
            const editSubjectResponse = await response.json()

            Logger(editSubjectResponse)

            if (editSubjectResponse.success) {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editSubjectResponse.message, "alert-success")
                editSubjectForm.reset();
                document.getElementById("editSubjectcloseBtn").click()

                // Moving the Page to the Top
                contextData.moveToTop()

                // Fetching the Records Again for the Updated Records
                FetchSubjectAPI()
            }
            else {
                contextData.showAlert("Failed", editSubjectResponse.message, "alert-danger")
            }
        }

    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditSubjectRecord({
            ...EditSubjectRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        Logger("EditSubject : ", EditSubjectRecord)

    }

    const applyFilter = () => {

        const searchSubjectShortForm = document.getElementById("filterSubjectShortForm").value;
        const searchSubjectName = document.getElementById("filterName").value;
        const searchSem = document.getElementById("filterSem").value;
        const searchSubjectCode = document.getElementById("filterSubjectCode").value;
        const searchFaculties = document.getElementById("filterFaculty").value;

        let subjectShortFormMatches;
        let semMatches;
        let facultiesMatches;
        let subjectCodeMatches;
        let subjectNameMatches;

        const filteredResult = SubjectRecords.filter((item) => {
            if (searchSubjectShortForm !== "") {
                subjectShortFormMatches = item.subjectShortForm.includes(searchSubjectShortForm);
            }
            if (searchSem !== "") {
                semMatches = item.sem.toString() === searchSem || searchSem === '';
            }
            if (searchFaculties !== "") {
                facultiesMatches = item.faculties.includes(searchFaculties);
            }
            if (searchSubjectCode !== "") {
                subjectCodeMatches = item.subjectCode.toLowerCase().includes(searchSubjectCode);
            }
            if (searchSubjectName !== "") {
                subjectNameMatches = item.subjectName.toLowerCase().includes(searchSubjectName)
            }

            return (subjectShortFormMatches || searchSubjectShortForm === "") && (semMatches || searchSem === "") && (facultiesMatches || searchFaculties === "") && (subjectCodeMatches || searchSubjectCode === "") && (subjectNameMatches || searchSubjectName === "");
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
                                <label htmlFor="filterSubjectShortForm" className="form-label text-black fw-bold">Subject Short Form</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterSubjectShortForm" name="filterSubjectShortForm" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterSem" className="form-label text-black fw-bold">Sem</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterSem" name="filterSem" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterSubjectCode" className="form-label text-black fw-bold">Subject Code</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterSubjectCode" name="filterSubjectCode" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterFaculty" className="form-label text-black fw-bold">Faculty</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterFaculty" name="filterFaculty" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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

                        {
                            FilteredRecords.length === 0 && SubjectRecords.map((subject, index) => {

                                const keys = Object.keys(subject);
                                {/* Logger(subject) */ }

                                return (

                                    <React.Fragment key={subject._id}>
                                        {/* Subject Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={subject._id}>
                                            <div className="card itemCard">
                                                <img src={subjectImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#SubjectInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#SubjectInfoModal${index}`}>
                                                    <p className="card-text itemName">{subject.subjectName}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{subject.subjectCode} {subject.subjectShortForm} [ Sem {subject.sem} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editSubjectModel" onClick={() => { setEditSubjectRecord(subject) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Subject</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteSubjectAPI(subject._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Subject</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject Info Modal */}
                                        <div className="modal fade dark-modal" id={`SubjectInfoModal${index}`} tabIndex="-1" aria-labelledby={`SubjectInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`SubjectInfoModal${index}Label`}>Subject Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addSubjectcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        Logger(data, " --> ", subject[data])
                                                                        if (data.toLowerCase() === "faculties") {
                                                                            Logger(subject[data])
                                                                        }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData" || data.toLowerCase() === "subjectlectures") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{data.toLowerCase() === "faculties" ? subject[data].join(", ") : subject[data]}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((subject, index) => {

                                const keys = Object.keys(subject);
                                {/* Logger(subject) */ }

                                return (

                                    <React.Fragment key={subject._id}>
                                        {/* Subject Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={subject._id}>
                                            <div className="card itemCard">
                                                <img src={subjectImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#SubjectInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#SubjectInfoModal${index}`}>
                                                    <p className="card-text itemName">{subject.subjectName}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{subject.subjectCode} {subject.subjectShortForm} [ Sem {subject.sem} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editSubjectModel" onClick={() => { setEditSubjectRecord(subject) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Subject</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteSubjectAPI(subject._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Subject</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject Info Modal */}
                                        <div className="modal fade dark-modal" id={`SubjectInfoModal${index}`} tabIndex="-1" aria-labelledby={`SubjectInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`SubjectInfoModal${index}Label`}>Subject Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addSubjectcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        Logger(data, " --> ", subject[data])
                                                                        if (data.toLowerCase() === "faculties") {
                                                                            Logger(subject[data])
                                                                        }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData" || data.toLowerCase() === "subjectlectures") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{data.toLowerCase() === "faculties" ? subject[data].join(", ") : subject[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addSubjectModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Subject</button>

                        {/* Add Subject Model */}
                        <div className="modal fade dark-modal" id="addSubjectModel" aria-labelledby="addSubjectModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addSubjectModelLabel">Add Subject Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddSubjectForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Subject Data */}
                                    <form id='AddSubjectForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="subjectsem" className="form-label">Semester</label>
                                                <input type="number" className="form-control text-black fw-bold" id="subjectsem" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectName" className="form-label">Subject Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="subjectName" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectShortForm" className="form-label">Subject Short Form</label>
                                                <input type="text" className="form-control text-black fw-bold" id="subjectShortForm" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectCode" className="form-label">Subject Code</label>
                                                <input type="text" className="form-control text-black fw-bold" id="subjectCode" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectFaculties" className="form-label">Faculties</label>
                                                <input type="text" className="form-control text-black fw-bold" id="subjectFaculties" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addSubjectCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddSubjectForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddSubjectAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Subject Model */}
                        <div className="modal fade dark-modal" id="editSubjectModel" tabIndex="-1" aria-labelledby="editSubjectModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editSubjectModelLabel">Edit Subject Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editSubjectcloseBtn" aria-label="Close" onClick={() => { document.getElementById("AddSubjectForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Subject Data */}
                                    <form id='EditSubjectForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="subjectsem" className="form-label">Semester</label>
                                                <input type="number" className="form-control text-black fw-bold" id="updatesubjectsem" onChange={onChange} name="sem" value={EditSubjectRecord.sem} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectName" className="form-label">Subject Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatesubjectName" onChange={onChange} name="subjectName" value={EditSubjectRecord.subjectName} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectShortForm" className="form-label">Subject Short Form</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatesubjectShortForm" onChange={onChange} name="subjectShortForm" value={EditSubjectRecord.subjectShortForm} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectCode" className="form-label">Subject Code</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatesubjectCode" onChange={onChange} name="subjectCode" value={EditSubjectRecord.subjectCode} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subjectFaculties" className="form-label">Faculties</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatesubjectFaculties" onChange={onChange} name="faculties" value={EditSubjectRecord.faculties} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditSubjectForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditSubjectAPI(EditSubjectRecord._id) }}>Submit Form</button>
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

export default SubjectOperations

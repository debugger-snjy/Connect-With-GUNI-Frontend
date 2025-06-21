import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import studentMaleImg from "../../Images/student_male_image.png"
import studentFemaleImg from "../../Images/student_female_image.png"
import closeBtn from "../../Images/close_btn.png"
// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function StudentOperations() {
    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const [StudentRecords, setStudentRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditStudentRecord, setEditStudentRecord] = useState([])

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
        contextData.updateRecentlyAccessed('Student Operations', `${location.pathname}`);

        FetchStudentAPI()

    }, [])


    // Function to Add the Student Data in the Database
    const AddStudentAPI = async (event) => {

        const addStudentForm = document.getElementById("AddStudentForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const userenroll = document.getElementById("userenroll").value
        const userbatch = document.getElementById("userbatch").value
        const userdivision = document.getElementById("userdivision").value
        const usersem = parseInt(document.getElementById("usersem").value)
        const useremail = document.getElementById("useremail").value
        const userpassword = document.getElementById("userpassword").value
        const username = document.getElementById("username").value
        const usergender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderfemale").checked ? "female" : "";
        const userphone = parseInt(document.getElementById("userphone").value)
        const userrole = sessionStorage.getItem("role")

        if (userenroll === "" || userbatch === "" || userdivision === "" || usersem === "" || useremail === "" || userpassword === "" || username === "" || usergender === "" || userphone === "" || userrole === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Student API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enrollNo: userenroll,
                    batch: userbatch,
                    division: userdivision,
                    sem: usersem,
                    email: useremail,
                    password: userpassword,
                    name: username,
                    gender: usergender,
                    phone: userphone,
                    role: userrole
                })
            });

            // Variable to handle the API Response
            const addStudentResponse = await response.json()

            Logger(addStudentResponse)

            if (addStudentResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addStudentCloseBtn").click()
                contextData.showAlert("Success", addStudentResponse.message, "alert-success")
                addStudentForm.reset();

                contextData.moveToTop()

                // Fetching the Records Again for the Updated Records
                FetchStudentAPI()
            }
            else {
                contextData.showAlert("Failed", addStudentResponse.message, "alert-danger")
            }
        }
    }

    // Function to Fetch the Student Data in the Database
    const FetchStudentAPI = async () => {
        // Calling the Add Student API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchStudentResponse = await response.json()

        Logger(fetchStudentResponse)

        if (fetchStudentResponse.success) {
            setStudentRecords(fetchStudentResponse.data)
        }
    }

    // Function to Delete the Student Data : 
    const DeleteStudentAPI = async (studentId) => {
        // Calling the Add Student API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/delete/${studentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteStudentResponse = await response.json()

        Logger(deleteStudentResponse)

        if (deleteStudentResponse.success) {
            contextData.showAlert("Success", deleteStudentResponse.message, "alert-success")
        }
        else {
            contextData.showAlert("Failed", deleteStudentResponse.message, "alert-danger")
        }

        // Again Fetching the Records to refresh the records
        FetchStudentAPI()

    }

    // Function to Edit the Student Data : 
    const EditStudentAPI = async (studentId) => {

        const editStudentForm = document.getElementById("EditStudentForm")

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const updateduserenroll = document.getElementById("updateduserenroll").value;
        const updateduseremail = document.getElementById("updateduseremail").value;
        const updatedusersemster = parseInt(document.getElementById("updatedusersemster").value);
        const updateduserbatch = document.getElementById("updateduserbatch").value;
        const updateduserdivision = document.getElementById("updateduserdivision").value;
        const updateduserpassword = document.getElementById("updateduserpassword").value;
        const updatedusername = document.getElementById("updatedusername").value;
        const updatedusergender = document.getElementById("updatedgenderMale").checked ? "male" : document.getElementById("updatedgenderFemale").checked ? "female" : "";
        const updateduserphone = parseInt(document.getElementById("updateduserphone").value);

        // Logger(updateduserrole)

        if (updateduserenroll == "" || updateduseremail == "" || updatedusersemster == "" || updateduserbatch == "" || updateduserdivision == "" || updateduserpassword == "" || updatedusername == "" || updatedusergender == "" || updateduserphone == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Edit Student API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/update/${studentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enrollNo: updateduserenroll,
                    email: updateduseremail,
                    sem: updatedusersemster,
                    batch: updateduserbatch,
                    division: updateduserdivision,
                    password: updateduserpassword,
                    name: updatedusername,
                    gender: updatedusergender,
                    phone: updateduserphone,
                })
            });

            // Variable to handle the API Response
            const editStudentResponse = await response.json()

            Logger(editStudentResponse)

            if (editStudentResponse.success) {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editStudentResponse.message, "alert-success")
                editStudentForm.reset();
                document.getElementById("editStudentcloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchStudentAPI()
            }
            else {
                contextData.showAlert("Failed", editStudentResponse.message, "alert-danger")
            }
        }

    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditStudentRecord({
            ...EditStudentRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        Logger("EditStudent : ", EditStudentRecord)

    }

    // const applyFilter = (e) => {
    //     // If the filter value is empty, reset to the original records
    //     Logger(e.target.value)
    //     if (e.target.value === "") {
    //         FetchStudentAPI(); // Assuming FetchStudentAPI() fetches the original records
    //         Logger("No")
    //         setFilteredRecords(StudentRecords)

    //     } else {
    //         let filteredRecords;
    //         Logger("Yes")


    //         // Apply the filter based on the target name
    //         switch (e.target.name) {
    //             case "filterEnroll":
    //                 filteredRecords = StudentRecords.filter((record) =>
    //                     record.enrollNo.includes(e.target.value)
    //                 );
    //                 break;
    //             case "filterSem":
    //                 filteredRecords = StudentRecords.filter((record) => {
    //                     return record.sem.toString() === e.target.value
    //                 });
    //                 break;
    //             case "filterDivision":
    //                 filteredRecords = StudentRecords.filter((record) =>
    //                     record.division.includes(e.target.value)
    //                 );
    //                 break;
    //             case "filterBatch":
    //                 filteredRecords = StudentRecords.filter((record) =>
    //                     record.batch.includes(e.target.value)
    //                 );
    //                 break;
    //             default:
    //                 filteredRecords = StudentRecords;
    //         }

    //         // Update the state with the filtered records
    //         setFilteredRecords(filteredRecords);
    //     }
    // };

    const applyFilter = () => {

        const searchEnroll = document.getElementById("filterEnroll").value;
        const searchSem = document.getElementById("filterSem").value;
        const searchDivision = document.getElementById("filterDivision").value;
        const searchBatch = document.getElementById("filterBatch").value;
        const searchName = document.getElementById("filterName").value;

        let enrollMatches;
        let semMatches;
        let divisionMatches;
        let batchMatches;
        let nameMatches;

        const filteredResult = StudentRecords.filter((item) => {
            if (searchEnroll !== "") {
                enrollMatches = item.enrollNo.includes(searchEnroll);
            }
            if (searchSem !== "") {
                semMatches = item.sem.toString() === searchSem || searchSem === '';
            }
            if (searchDivision !== "") {
                divisionMatches = item.division.includes(searchDivision);
            }
            if (searchBatch !== "") {
                batchMatches = item.batch.includes(searchBatch);
            }
            if (searchName !== "") {
                nameMatches = item.name.includes(searchName)
            }

            return (enrollMatches || searchEnroll === "") && (semMatches || searchSem === "") && (divisionMatches || searchDivision === "") && (batchMatches || searchBatch === "") && (nameMatches || searchName === "");
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
                                <label htmlFor="filterEnroll" className="form-label text-black fw-bold">Enrollment Number</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterEnroll" name="filterEnroll" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterSem" className="form-label text-black fw-bold">Semester</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterSem" name="filterSem" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDivision" className="form-label text-black fw-bold">Division</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDivision" name="filterDivision" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterBatch" className="form-label text-black fw-bold">Batch</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterBatch" name="filterBatch" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                            FilteredRecords.length === 0 && StudentRecords.map((student, index) => {

                                const keys = Object.keys(student);
                                {/* Logger(student) */ }

                                return (

                                    <React.Fragment key={student._id}>
                                        {/* Student Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={student._id}>
                                            <div className="card itemCard">
                                                <img src={student.gender === "male" ? studentMaleImg : studentFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#StudentInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#StudentInfoModal${index}`}>
                                                    <p className="card-text itemName">{student.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{student.enrollNo} [ Sem {student.sem} - Class {student.division}]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editStudentModel" onClick={() => { setEditStudentRecord(student) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Student</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteStudentAPI(student._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Student</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Student Info Modal */}
                                        <div className="modal fade dark-modal" id={`StudentInfoModal${index}`} tabIndex="-1" aria-labelledby={`StudentInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`StudentInfoModal${index}Label`}>Student Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addStudentcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", student[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{student[data]}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((student, index) => {

                                const keys = Object.keys(student);
                                {/* Logger(student) */ }

                                return (

                                    <React.Fragment key={student._id}>
                                        {/* Student Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={student._id}>
                                            <div className="card itemCard">
                                                <img src={student.gender === "male" ? studentMaleImg : studentFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#StudentInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#StudentInfoModal${index}`}>
                                                    <p className="card-text itemName">{student.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">{student.enrollNo} [ Sem {student.sem} - Class {student.division}]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editStudentModel" onClick={() => { setEditStudentRecord(student) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Student</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteStudentAPI(student._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Student</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Student Info Modal */}
                                        <div className="modal fade dark-modal" id={`StudentInfoModal${index}`} tabIndex="-1" aria-labelledby={`StudentInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`StudentInfoModal${index}Label`}>Student Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addStudentcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", student[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{student[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addStudentModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Student</button>

                        {/* Add Student Model */}
                        <div className="modal fade dark-modal" id="addStudentModel" aria-labelledby="addStudentModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addStudentModelLabel">Add Student Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddStudentForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Student Data */}
                                    <form id='AddStudentForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="userenroll" className="form-label">Enrollment Number</label>
                                                <input type="number" className="form-control text-black fw-bold" id="userenroll" aria-describedby="emailHelp" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="userbatch" className="form-label">Batch</label>
                                                <input type="text" className="form-control text-black fw-bold" id="userbatch" aria-describedby="emailHelp" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="userdivision" className="form-label">Division</label>
                                                <input type="text" className="form-control text-black fw-bold" id="userdivision" aria-describedby="emailHelp" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="usersem" className="form-label">Semester</label>
                                                <input type="number" className="form-control text-black fw-bold" id="usersem" aria-describedby="emailHelp" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="useremail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="useremail" aria-describedby="emailHelp" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="userpassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="userpassword" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="username" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="usergender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="usergender" id="genderMale" />
                                                    <label className="form-check-label" htmlFor="genderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="usergender" id="genderfemale" />
                                                    <label className="form-check-label" htmlFor="genderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="userphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="userphone" maxLength={10} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addStudentCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddStudentForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddStudentAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Student Model */}
                        <div className="modal fade dark-modal" id="editStudentModel" tabIndex="-1" aria-labelledby="editStudentModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editStudentModelLabel">Edit Student Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editStudentcloseBtn" aria-label="Close" onClick={() => { document.getElementById("AddStudentForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Student Data */}
                                    <form id='EditStudentForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updateduserenroll" className="form-label">Enrollment Number</label>
                                                <input type="number" className="form-control text-black fw-bold" id="updateduserenroll" name="enrollNo" aria-describedby="emailHelp" onChange={onChange} value={EditStudentRecord.enrollNo} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduseremail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="updateduseremail" name="email" aria-describedby="emailHelp" onChange={onChange} value={EditStudentRecord.email} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedusersemster" className="form-label">Semester</label>
                                                <input type="number" className="form-control text-black fw-bold" id="updatedusersemster" name="semester" aria-describedby="emailHelp" onChange={onChange} value={EditStudentRecord.sem} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduserbatch" className="form-label">Batch</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateduserbatch" name="batch" aria-describedby="emailHelp" onChange={onChange} value={EditStudentRecord.batch} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduserdivision" className="form-label">Division</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateduserdivision" name="division" aria-describedby="emailHelp" onChange={onChange} value={EditStudentRecord.division} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduserpassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="updateduserpassword" name="password" onChange={onChange} value={EditStudentRecord.password} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedusername" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedusername" name="name" onChange={onChange} value={EditStudentRecord.name} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedusergender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderMale" value="male" onChange={onChange} checked={EditStudentRecord.gender == "male" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderFemale" value="female" onChange={onChange} checked={EditStudentRecord.gender == "female" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduserphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="updateduserphone" name="phone" maxLength={10} onChange={onChange} value={EditStudentRecord.phone} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditStudentForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditStudentAPI(EditStudentRecord._id) }}>Submit Form</button>
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

export default StudentOperations
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';
import marksheetImg from "../../Images/marksheetImg.png"

function MarksheetOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const [MarksheetRecords, setMarksheetRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditMarksheetRecord, setEditMarksheetRecord] = useState([])

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
        contextData.updateRecentlyAccessed('Marksheet Operations', `${location.pathname}`);

        // Moving the Page to the Top
        contextData.moveToTop()

        FetchMarksheetAPI()

    }, [])


    // Function to Add the Marksheet Data in the Database
    const AddMarksheetAPI = async (event) => {

        const addMarksheetForm = document.getElementById("AddMarksheetForm")

        event.preventDefault(); // Prevent the form from submitting

        const marksheetMarksheetSem = document.getElementById("marksheetSem").value;
        const marksheetEnroll = document.getElementById("enroll").value;
        const marksheetDate = document.getElementById("date").value;
        const marksheetResult = document.getElementById("result").value;
        const marksheetGrade = document.getElementById("grade").value;

        // Dynamic subjects
        const marksheetData = [];
        let remaining = false;

        for (let i = 1; i <= subjectCount; i++) {
            const code = document.getElementById(`code${i}`).value;
            const subjectName = document.getElementById(`subject${i}`).value;
            const credits = document.getElementById(`credits${i}`).value;
            const grade = document.getElementById(`grade${i}`).value;
            const score = document.getElementById(`score${i}`).value;
            const total = document.getElementById(`total${i}`).value;

            if (code === "" || subjectName === "" || credits === NaN || grade === "" || score === NaN || total === NaN) {
                contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
                remaining = true;
            }
            else {
                marksheetData.push([code, subjectName, parseInt(credits), grade, parseInt(score), parseInt(total)]);
            }

            Logger("Row Added !")
        }

        if ((marksheetMarksheetSem === "" || marksheetEnroll === "" || marksheetDate === "" || marksheetResult === "" || marksheetGrade === "") && !remaining) {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            const formData = {
                "sem": marksheetMarksheetSem,
                "date": new Date(marksheetDate).toLocaleString(),
                "enroll": marksheetEnroll,
                "result": marksheetResult,  // You might need to determine this based on your logic
                "grade": marksheetGrade,     // You might need to calculate this based on your logic
                "data": marksheetData,
            };

            Logger("Add Marksheet Data : ", formData)

            // Calling the Add Marksheet API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/marksheet/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            // Variable to handle the API Response
            const addMarksheetResponse = await response.json()

            Logger(addMarksheetResponse)

            if (addMarksheetResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addMarksheetcloseBtn").click()
                document.getElementById("addMarksheetModel").style.display = "none"
                contextData.showAlert("Success", addMarksheetResponse.message, "alert-success")
                addMarksheetForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchMarksheetAPI()
            }
            else {
                contextData.showAlert("Failed", addMarksheetResponse.message, "alert-danger")
            }
        }

    }

    // Function to Fetch the Marksheet Data in the Database
    const FetchMarksheetAPI = async () => {
        // Calling the Add Marksheet API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/marksheet/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchMarksheetResponse = await response.json()

        Logger(fetchMarksheetResponse)

        if (fetchMarksheetResponse.success) {
            // Setting the Marksheet Records
            setMarksheetRecords(fetchMarksheetResponse.data)
            setFilteredRecords([]) // Resetting the filtered records

            // Showing the Alert Message that Marksheet Fetched
            contextData.showAlert("Success", fetchMarksheetResponse.message, "alert-success")
        }
        else {
            // Showing the Alert Message that Marksheet Fetched
            contextData.showAlert("Failed", fetchMarksheetResponse.message, "alert-danger")
        }
    }

    // Function to Delete the Marksheet Data : 
    const DeleteMarksheetAPI = async (marksheetId) => {
        // Calling the Add Marksheet API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/marksheet/delete/${marksheetId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteMarksheetResponse = await response.json()

        Logger(deleteMarksheetResponse)

        if (deleteMarksheetResponse.success) {
            // Showing the Alert Message that Marksheet Deleted
            contextData.showAlert("Success", deleteMarksheetResponse.message, "alert-success")
        }
        else {
            // Showing the Alert Message that Marksheet Deleted
            contextData.showAlert("Failed", deleteMarksheetResponse.message, "alert-danger")
        }

        // Moving the Page to the Top
        contextData.moveToTop()

        // Again Fetching the Records to refresh the records
        FetchMarksheetAPI()

    }

    // Function to Edit the Marksheet Data : 
    const EditMarksheetAPI = async (marksheetId) => {

        const editMarksheetForm = document.getElementById("EditMarksheetForm")

        const updatedmarksheetMarksheetSem = document.getElementById("updatedmarksheetSem").value;
        const updatedmarksheetEnroll = document.getElementById("updatedenroll").value;
        const updatedmarksheetDate = document.getElementById("updateddate").value;
        const updatedmarksheetResult = document.getElementById("updatedresult").value;
        const updatedmarksheetGrade = document.getElementById("updatedgrade").value;

        // Dynamic subjects
        const updatedmarksheetData = [];
        let remaining = false;

        for (let i = 1; i <= subjectCount; i++) {
            const updatedcode = document.getElementById(`updatedCode${i}`).value;
            const updatedsubjectName = document.getElementById(`updatedSubject${i}`).value;
            const updatedcredits = document.getElementById(`updatedCredits${i}`).value;
            const updatedgrade = document.getElementById(`updatedGrade${i}`).value;
            const updatedscore = document.getElementById(`updatedScore${i}`).value;
            const updatedtotal = document.getElementById(`updatedTotal${i}`).value;

            if (updatedcode === "" || updatedsubjectName === "" || updatedcredits === NaN || updatedgrade === "" || updatedscore === NaN || updatedtotal === NaN) {
                contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
                remaining = true;
            }
            else {
                updatedmarksheetData.push([updatedcode, updatedsubjectName, parseInt(updatedcredits), updatedgrade, parseInt(updatedscore), parseInt(updatedtotal)]);
            }

            Logger("Row Added !")
        }

        if ((updatedmarksheetMarksheetSem === "" || updatedmarksheetEnroll === "" || updatedmarksheetDate === "" || updatedmarksheetResult === "" || updatedmarksheetGrade === "") && !remaining) {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            const editFormData = {
                "sem": updatedmarksheetMarksheetSem,
                "date": new Date(updatedmarksheetDate).toLocaleString(),
                "enroll": updatedmarksheetEnroll,
                "result": updatedmarksheetResult,
                "grade": updatedmarksheetGrade,
                "data": updatedmarksheetData,
            };

            Logger("Edit Marksheet Data : ", editFormData)

            // Calling the Add Marksheet API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/marksheet/update/${marksheetId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editFormData)
            });

            // Variable to handle the API Response
            const editMarksheetResponse = await response.json()

            Logger(editMarksheetResponse)

            if (editMarksheetResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("editMarksheetcloseBtn").click()
                document.getElementById("editMarksheetModel").style.display = "none"
                contextData.showAlert("Success", editMarksheetResponse.message, "alert-success")
                editMarksheetForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchMarksheetAPI()
            }
            else {
                contextData.showAlert("Failed", editMarksheetResponse.message, "alert-danger")
            }
        }

    }

    function formatDate(marksheetDate) {
        const date = new Date(marksheetDate)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        Logger(`${year}-${month}-${day}`)
        return `${year}-${month}-${day}`;
    }

    let subjectCount = 1;

    const addSubject = () => {
        subjectCount++;

        const subjectDetails = document.getElementById("subjectDetails");
        const newSubjectRow = document.createElement("tr");
        newSubjectRow.classList.add("subject-row");

        newSubjectRow.innerHTML = `
            <td>
                <div class="mb-1">
                    ${subjectCount}
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="text" class="form-control text-black fw-bold" id="code${subjectCount}" name="code[]" required />
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="text" class="form-control text-black fw-bold" id="subject${subjectCount}" name="subject[]" required />
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="number" class="form-control text-black fw-bold" id="credits${subjectCount}" name="credits[]" required />
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="number" class="form-control text-black fw-bold" id="score${subjectCount}" name="score[]" required />
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="text" class="form-control text-black fw-bold" id="grade${subjectCount}" name="grade[]" required />
                </div>
            </td>
            <td>
                <div class="mb-1">
                    <input type="number" class="form-control text-black fw-bold" id="total${subjectCount}" name="total[]" required />
                </div>
            </td>
        `;

        subjectDetails.appendChild(newSubjectRow);
    }

    const applyFilter = () => {

        const searchEnroll = document.getElementById("filterEnroll").value;
        const searchSem = document.getElementById("filterSem").value;
        const searchGrade = document.getElementById("filterGrade").value;
        const searchResult = document.getElementById("filterResult").value;
        const searchGradeGreaterThan = document.getElementById("filterGradeGreaterThan").value;

        let enrollMatches;
        let semMatches;
        let gradeMatches;
        let resultMatches;
        let GradeGreaterThanMatches;

        const filteredResult = MarksheetRecords.filter((item) => {
            if (searchEnroll !== "") {
                enrollMatches = item.marksheetEnroll.includes(searchEnroll);
            }
            if (searchSem !== "") {
                semMatches = item.marksheetSem.toString() === searchSem || searchSem === '';
            }
            if (searchGrade !== "") {
                gradeMatches = item.marksheetGrade.toString() === searchGrade || searchGrade === '';
            }
            if (searchResult !== "") {
                resultMatches = item.marksheetResult.includes(searchResult);
            }
            if (searchGradeGreaterThan !== "") {
                GradeGreaterThanMatches = item.marksheetGrade >= parseFloat(searchGradeGreaterThan)
            }
            return (enrollMatches || searchEnroll === "") && (semMatches || searchSem === "") && (gradeMatches || searchGrade === "") && (resultMatches || searchResult === "") && (searchGradeGreaterThan === "" || GradeGreaterThanMatches);
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
                                <label htmlFor="filterSem" className="form-label text-black fw-bold">Semester</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterSem" name="filterSem" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterGrade" className="form-label text-black fw-bold">Grade</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterGrade" name="filterGrade" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterGradeGreaterThan" className="form-label text-black fw-bold">Grade Greater Than</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterGradeGreaterThan" name="filterGradeGreaterThan" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            {/* <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterGradeBetween" className="form-label text-black fw-bold">Grade Greater Than</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterGradeBetweenMin" name="filterGradeBetweenMin" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                                <input type="text" className="form-control text-white fw-bold" id="filterGradeBetweenMax" name="filterGradeBetweenMax" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div> */}
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterResult" className="form-label text-black fw-bold">Result</label>
                                <select className="form-select fw-bold" id="filterResult" style={{ backgroundColor: "#1e1e1e", color: "white" }} onChange={() => { applyFilter() }} required >
                                    <option value={""}>SELECT</option>
                                    <option value={"PASS"}>PASS</option>
                                    <option value={"FAIL"}>FAIL</option>
                                </select>
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
                            FilteredRecords.length === 0 && MarksheetRecords.map((marksheet, index) => {

                                const keys = Object.keys(marksheet);
                                Logger(marksheet)

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
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editMarksheetModel" onClick={() => { setEditMarksheetRecord(marksheet) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Marksheet</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteMarksheetAPI(marksheet._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Marksheet</button></div>
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
                                                                        Logger(data, " --> ", marksheet[data])
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

                        {
                            FilteredRecords.length !== 0 && FilteredRecords.map((marksheet, index) => {

                                const keys = Object.keys(marksheet);
                                Logger(marksheet)

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
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editMarksheetModel" onClick={() => { setEditMarksheetRecord(marksheet) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Marksheet</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteMarksheetAPI(marksheet._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Marksheet</button></div>
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
                                                                        Logger(data, " --> ", marksheet[data])
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addMarksheetModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Marksheet</button>

                        {/* Add Marksheet Model */}
                        <div className="modal fade dark-modal" id="addMarksheetModel" tabIndex="-1" aria-labelledby="addMarksheetModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addMarksheetModelLabel">Add Marksheet Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddMarksheetForm").reset(); subjectCount = 1; }}></button>
                                    </div>

                                    {/* Form For Adding the Marksheet Data */}

                                    <div className="modal-body">

                                        <form id="AddMarksheetForm">

                                            <div className="row">
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="marksheetsem" className="form-label">Marksheet Semester</label>
                                                        <input type="number" className="form-control text-black fw-bold" id="marksheetSem" required />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="enroll" className="form-label">Enrollment:</label>
                                                        <input type="text" className="form-control text-black fw-bold" id="enroll" name="enroll" required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="date" className="form-label">Date:</label>
                                                        <input type="date" className="form-control text-black fw-bold" id="date" name="date" required />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="result" className="form-label">Result:</label>
                                                        {/* <input type="text" className="form-control text-black fw-bold" id="result" name="result" required /> */}
                                                        <select className="form-select text-black fw-bold text-capitalize" id='result' defaultValue={"PASS"}>
                                                            <option value="PASS" defaultChecked>PASS</option>
                                                            <option value="FAIL">FAIL</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="grade" className="form-label">Grade:</label>
                                                        <input type="number" className="form-control text-black fw-bold" step="0.01" id="grade" name="grade" required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 mb-2">
                                                <hr className='hrStyle' />
                                            </div>

                                            <h3 className='text-center'>SUBJECT WISE DETAILS</h3>

                                            <div className="subject-row">
                                                <table className='table table-dark table-striped table-bordered my-2'>
                                                    <tbody id='subjectDetails'>
                                                        <tr className='text-center'>
                                                            <th>No.</th>
                                                            <th>Code</th>
                                                            <th>Subject</th>
                                                            <th>Course Credit Earned</th>
                                                            <th>Grade Points Earned</th>
                                                            <th>Course Grade Earned</th>
                                                            <th>Credit Points Earned</th>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="mb-1 text-center">
                                                                    {subjectCount}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="text" className="form-control text-black fw-bold" id="code1" name="code[]" required />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="text" className="form-control text-black fw-bold" id="subject1" name="subject[]" required />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="number" className="form-control text-black fw-bold" id="credits1" name="credits[]" required />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="number" className="form-control text-black fw-bold" id="score1" name="score[]" required />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="text" className="form-control text-black fw-bold" id="grade1" name="grade[]" required />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-1">
                                                                    <input type="number" className="form-control text-black fw-bold" id="total1" name="total[]" required />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="modal-footer bg-dark">
                                                <button type="button" className="btn btn-primary" onClick={addSubject}>Add New Subject</button>
                                                <button type="button" className="btn btn-danger" id="addMarksheetcloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddMarksheetForm").reset(); subjectCount = 1; }} >Close</button>
                                                <button type="submit" className="btn btn-success" onClick={(e) => AddMarksheetAPI(e)}>Submit</button>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Marksheet Model */}
                        <div className="modal fade dark-modal" id="editMarksheetModel" tabIndex="-1" aria-labelledby="editMarksheetModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl modal-lg">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editMarksheetModelLabel">Edit Marksheet Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editMarksheetcloseBtn" aria-label="Close" onClick={() => { document.getElementById("AddMarksheetForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Marksheet Data */}
                                    <form id='EditMarksheetForm'>
                                        <div className="modal-body">

                                            <div className="row">
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="marksheetsem" className="form-label">Marksheet Semester</label>
                                                        <input type="number" className="form-control text-black fw-bold" id="updatedmarksheetSem" defaultValue={EditMarksheetRecord.marksheetSem} required />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="enroll" className="form-label">Enrollment:</label>
                                                        <input type="text" className="form-control text-black fw-bold" id="updatedenroll" name="enroll" defaultValue={EditMarksheetRecord.marksheetEnroll} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="date" className="form-label">Date:</label>
                                                        <input type="date" className="form-control text-black fw-bold" id="updateddate" name="date" defaultValue={EditMarksheetRecord.marksheetDate} required />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="result" className="form-label">Result:</label>
                                                        {/* <input type="text" className="form-control text-black fw-bold" id="updatedresult" name="result" required /> */}
                                                        <select className="form-select text-black fw-bold text-capitalize" id='updatedresult' defaultValue={EditMarksheetRecord.marksheetResult}>
                                                            <option value="PASS" defaultChecked>PASS</option>
                                                            <option value="FAIL">FAIL</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="mb-2">
                                                        <label htmlFor="grade" className="form-label">Grade:</label>
                                                        <input type="number" className="form-control text-black fw-bold" step="0.01" id="updatedgrade" name="grade" defaultValue={EditMarksheetRecord.marksheetGrade} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 mb-2">
                                                <hr className='hrStyle' />
                                            </div>

                                            <h3 className='text-center'>SUBJECT WISE DETAILS</h3>

                                            <div className="subject-row">
                                                <table className='table table-dark table-striped table-bordered my-2 w-100'>
                                                    <tbody id='subjectDetails'>
                                                        <tr className='text-center'>
                                                            <th>No.</th>
                                                            <th>Code</th>
                                                            <th>Subject</th>
                                                            <th>Course Credit Earned</th>
                                                            <th>Grade Points Earned</th>
                                                            <th>Course Grade Earned</th>
                                                            <th>Credit Points Earned</th>
                                                        </tr>

                                                        {/* Fetching into the Subjects */}
                                                        {
                                                            EditMarksheetRecord.marksheetData && EditMarksheetRecord.marksheetData.map((subjectFields, index) => {
                                                                Logger(subjectFields)

                                                                return (
                                                                    <tr>
                                                                        <td align='center'>{index + 1}</td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedCode${index + 1}`} name={`updatedCode${index + 1}`} defaultValue={subjectFields[0]} required />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedSubject${index + 1}`} name={`updatedSubject${index + 1}`} defaultValue={subjectFields[1]} required />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedCredits${index + 1}`} name={`updatedCredits${index + 1}`} defaultValue={subjectFields[2]} required />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedScore${index + 1}`} name={`updatedScore${index + 1}`} defaultValue={subjectFields[4]} required />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedGrade${index + 1}`} name={`updatedGrade${index + 1}`} defaultValue={subjectFields[3]} required />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control text-black fw-bold" id={`updatedTotal${index + 1}`} name={`updatedTotal${index + 1}`} defaultValue={subjectFields[5]} required />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="modal-footer bg-dark">
                                                <button type="button" className="btn btn-danger" id="editMarksheetcloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditMarksheetForm").reset(); subjectCount = 1; }} >Close</button>
                                                <button type="submit" className="btn btn-success" onClick={(e) => EditMarksheetAPI(EditMarksheetRecord._id)}>Submit</button>

                                            </div>
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

export default MarksheetOperations

import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import TimetableImg from "../../Images/timetableIcon.png"

function TimetableOperations() {
    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    const [TimetableRecords, setTimetableRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [editTimetableData, setEditTimetableData] = useState({})

    const [formData, setFormData] = useState({
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
    });

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
        contextData.updateRecentlyAccessed('Timetable Operations', `${location.pathname}`);

        FetchTimetableAPI();

    }, [])

    // Function to Fetch the Timetable Data in the Database
    const FetchTimetableAPI = async () => {
        // Calling the Add Timetable API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/timetable/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchTimetableResponse = await response.json()

        console.log(fetchTimetableResponse)

        if (fetchTimetableResponse.success) {
            // If the response is successful then set the records
            setTimetableRecords(fetchTimetableResponse.data)
        }
        else {
            // If the response is not successful then show the alert
            contextData.showAlert("Failed", fetchTimetableResponse.message, "alert-danger")
        }
    }

    // Function to Add the Timetable Data in the Database
    const AddTimetableAPI = async (event) => {

        const addTimetableForm = document.getElementById("AddTimetableForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const role = sessionStorage.getItem("role")

        const timetableSem = parseInt(document.getElementById("timetableSem").value)
        const timetableDivision = document.getElementById("timetableDivision").value;
        const timetableBatch = document.getElementById("timetableBatch").value;
        const timetableData = formData

        console.log("Data 1 : ", timetableSem)
        console.log("Data 2 : ", timetableDivision)
        console.log("Data 3 : ", timetableBatch)
        console.log("Data 4 : ", timetableData)

        console.log("Hello This is Add Timetable API")

        if (timetableSem === "" || timetableDivision === "" || timetableBatch === "" || timetableData === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Timetable API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/timetable/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sem: timetableSem,
                    batch: timetableBatch,
                    division: timetableDivision,
                    data: timetableData,
                })
            });

            // Variable to handle the API Response
            const addTimetableResponse = await response.json()

            console.log(addTimetableResponse)

            if (addTimetableResponse.success) {
                // After a successful submission, hide the modal
                document.getElementById("addTimetableCloseBtn").click()
                document.getElementById("addTimetableModel").style.display = "none"
                contextData.showAlert("Success", addTimetableResponse.message, "alert-success")
                addTimetableForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchTimetableAPI()
            }
            else {
                contextData.showAlert("Failed", addTimetableResponse.message, "alert-danger")
            }
        }
    }

    // Function to Delete the Timetable Data in the Database
    const DeleteTimetableAPI = async (timetableId) => {
        // Calling the Add Timetable API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/timetable/delete/${timetableId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteTimetableResponse = await response.json()

        console.log(deleteTimetableResponse)

        if (deleteTimetableResponse.success) {
            // Showing the Alert Message that Timetable Deleted
            contextData.showAlert("Success", deleteTimetableResponse.message, "alert-success")
        }
        else {
            // Showing the Alert Message that Timetable Deleted
            contextData.showAlert("Failed", deleteTimetableResponse.message, "alert-danger")
        }

        // Again Fetching the Records to refresh the records
        FetchTimetableAPI()
    }

    const EditTimetableAPI = async () => {
        // Calling the Add Timetable API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/timetable/edit/${editTimetableData._id}`, {
            method: "PUT",
            body: JSON.stringify({ "allData": editTimetableData }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const editTimetableResponse = await response.json()

        console.log(editTimetableResponse)

        if (editTimetableResponse.success) {
            // Showing the Alert Message that Timetable Deleted
            contextData.showAlert("Success", editTimetableResponse.message, "alert-success")
        }
        else {
            // Showing the Alert Message that Timetable Deleted
            contextData.showAlert("Failed", editTimetableResponse.message, "alert-danger")
        }

        // Again Fetching the Records to refresh the records
        FetchTimetableAPI()
    }

    const handleInputChange = (day, interval, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [day]: {
                ...prevData[day],
                [interval]: {
                    ...prevData[day][interval],
                    [field]: value,
                },
            },
        }));

        console.log("My Data : ", formData)
    };

    const handleEditInputChange = (day, interval, field, value) => {

        if (day && interval) {

            // Create a copy of the current state to avoid directly mutating state
            const updatedData = { ...editTimetableData };

            // Update the specific field in the copied state
            updatedData.data[day][interval][field] = value;

            // Set the updated state
            setEditTimetableData(updatedData); // Assuming you have a setState function called setEditTimetableData
        }
        else {
            // Create a copy of the current state to avoid directly mutating state
            const updatedData = { ...editTimetableData };

            updatedData[field] = value;

            setEditTimetableData(updatedData)
        }

        console.log("My Edited Data : ", editTimetableData)
    };

    const applyFilter = () => {

        const searchSem = document.getElementById("filterSem").value;
        const searchDivision = document.getElementById("filterDivision").value;
        const searchBatch = document.getElementById("filterBatch").value;

        let semMatches;
        let divisionMatches;
        let batchMatches;

        const filteredResult = TimetableRecords.filter((item) => {
            if (searchSem !== "") {
                semMatches = item.sem.toString() === searchSem || searchSem === '';
            }
            if (searchDivision !== "") {
                divisionMatches = item.division.includes(searchDivision);
            }
            if (searchBatch !== "") {
                batchMatches = item.batch.includes(searchBatch);
            }

            return (semMatches || searchSem === "") && (divisionMatches || searchDivision === "") && (batchMatches || searchBatch === "");
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

                        {/* All Timetable Records */}
                        {
                            FilteredRecords.length === 0 && TimetableRecords.map((timetable, index) => {

                                const keys = Object.keys(timetable);

                                return (

                                    <React.Fragment key={"timetable" + index}>
                                        {/* Timetable Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={timetable._id}>
                                            <div className="card itemCard">
                                                <span className="badge rounded-pill bg-dark card-text px-2 tags" style={{ position: "absolute", width: "100px", top: "5px", left: "5px", }}> <i className="fa-solid fa-sm fa-calendar" style={{ "color": "white" }}></i> {timetable.date.split(", ")[0]}</span>
                                                <span className="badge rounded-pill bg-dark card-text px-2 tags" style={{ position: "absolute", width: "100px", top: "5px", right: "5px", }}> <i className="fa-solid fa-sm fa-clock" style={{ "color": "white" }}></i> {timetable.date.split(", ")[1]}</span>
                                                <img src={TimetableImg} className="card-img-top itemImg" alt="Timetables" data-bs-toggle="modal" data-bs-target={`#TimetableInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#TimetableInfoModal${index}`}>
                                                    <p className="card-text small itemName fs-5 p-0 mt-1 m-0 fw-normal">Semester {timetable.sem} - {timetable.batch} Batch</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editTimetableModal" onClick={() => { setEditTimetableData(timetable) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Timetable</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteTimetableAPI(timetable._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Timetable</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timetable Info */}
                                        <div className="modal fade dark-modal" id={`TimetableInfoModal${index}`} tabIndex="-1" aria-labelledby={`TimetableInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`TimetableInfoModal${index}Label`}>Timetable Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addTimetablecloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark w-100'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        console.log(data, " --> ", timetable[data])
                                                                        if (data === "data") {
                                                                            const days = Object.keys(timetable["data"])
                                                                            console.log(days)

                                                                            const daysOfWeek = Object.keys(timetable["data"]);
                                                                            const timeIntervals = Array.from(
                                                                                new Set(
                                                                                    daysOfWeek.flatMap(day => Object.keys(timetable["data"][day]))
                                                                                )
                                                                            );

                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td colSpan={2}>
                                                                                        <table className='table table-dark table-hover text-center'>
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th colSpan={timeIntervals.length + 1}><h4><strong>Timetable [ Sem {timetable["sem"]} - Division {timetable["division"]} - Batch {timetable["batch"]} ]</strong> &#123; Date : {timetable["date"].split(", ")[0]} &#125;</h4></th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th>Days</th>
                                                                                                    {timeIntervals.map(interval => (
                                                                                                        <th key={interval}>{interval}</th>
                                                                                                    ))}
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {daysOfWeek.map(day => (
                                                                                                    <tr key={day} style={{ "verticalAlign": "middle" }}>
                                                                                                        <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                                                                                                        {timeIntervals.map((interval, index) => (
                                                                                                            <td key={index}>

                                                                                                                {(typeof timetable["data"][day][interval] === "string") ? (
                                                                                                                    <React.Fragment>
                                                                                                                        {timetable["data"][day][interval]}
                                                                                                                    </React.Fragment>
                                                                                                                ) : (
                                                                                                                    Object.values(timetable["data"][day][interval]).map((value, idx) => (
                                                                                                                        <React.Fragment key={idx}>
                                                                                                                            {idx > 0 && <br />}
                                                                                                                            {value}
                                                                                                                        </React.Fragment>
                                                                                                                    ))
                                                                                                                )}

                                                                                                            </td>
                                                                                                        ))}
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        else { }
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((timetable, index) => {

                                const keys = Object.keys(timetable);

                                return (

                                    <React.Fragment key={"timetable" + index}>
                                        {/* Timetable Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={timetable._id}>
                                            <div className="card itemCard">
                                                <span className="badge rounded-pill bg-dark card-text px-2 tags" style={{ position: "absolute", width: "100px", top: "5px", left: "5px", }}> <i className="fa-solid fa-sm fa-calendar" style={{ "color": "white" }}></i> {timetable.date.split(", ")[0]}</span>
                                                <span className="badge rounded-pill bg-dark card-text px-2 tags" style={{ position: "absolute", width: "100px", top: "5px", right: "5px", }}> <i className="fa-solid fa-sm fa-clock" style={{ "color": "white" }}></i> {timetable.date.split(", ")[1]}</span>
                                                <img src={TimetableImg} className="card-img-top itemImg" alt="Timetables" data-bs-toggle="modal" data-bs-target={`#TimetableInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#TimetableInfoModal${index}`}>
                                                    <p className="card-text small itemName fs-5 p-0 mt-1 m-0 fw-normal">Semester {timetable.sem} - {timetable.batch} Batch</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editTimetableModal" onClick={() => { setEditTimetableData(timetable) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Timetable</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteTimetableAPI(timetable._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Timetable</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timetable Info */}
                                        <div className="modal fade dark-modal" id={`TimetableInfoModal${index}`} tabIndex="-1" aria-labelledby={`TimetableInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`TimetableInfoModal${index}Label`}>Timetable Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addTimetablecloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark w-100'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        console.log(data, " --> ", timetable[data])
                                                                        if (data === "data") {
                                                                            const days = Object.keys(timetable["data"])
                                                                            console.log(days)

                                                                            const daysOfWeek = Object.keys(timetable["data"]);
                                                                            const timeIntervals = Array.from(
                                                                                new Set(
                                                                                    daysOfWeek.flatMap(day => Object.keys(timetable["data"][day]))
                                                                                )
                                                                            );

                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td colSpan={2}>
                                                                                        <table className='table table-dark table-hover text-center'>
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th colSpan={timeIntervals.length + 1}><h4><strong>Timetable [ Sem {timetable["sem"]} - Division {timetable["division"]} - Batch {timetable["batch"]} ]</strong> &#123; Date : {timetable["date"].split(", ")[0]} &#125;</h4></th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th>Days</th>
                                                                                                    {timeIntervals.map(interval => (
                                                                                                        <th key={interval}>{interval}</th>
                                                                                                    ))}
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {daysOfWeek.map(day => (
                                                                                                    <tr key={day} style={{ "verticalAlign": "middle" }}>
                                                                                                        <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                                                                                                        {timeIntervals.map((interval, index) => (
                                                                                                            <td key={index}>

                                                                                                                {(typeof timetable["data"][day][interval] === "string") ? (
                                                                                                                    <React.Fragment>
                                                                                                                        {timetable["data"][day][interval]}
                                                                                                                    </React.Fragment>
                                                                                                                ) : (
                                                                                                                    Object.values(timetable["data"][day][interval]).map((value, idx) => (
                                                                                                                        <React.Fragment key={idx}>
                                                                                                                            {idx > 0 && <br />}
                                                                                                                            {value}
                                                                                                                        </React.Fragment>
                                                                                                                    ))
                                                                                                                )}

                                                                                                            </td>
                                                                                                        ))}
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        else { }
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addTimetableModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Timetable</button>

                        {/* Add Timetable Model */}
                        <div className="modal fade dark-modal" id="addTimetableModel" tabIndex="-1" aria-labelledby="addTimetableModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addTimetableModelLabel">Add Timetable Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addTimetableCloseBtn" aria-label="Close" onClick={() => { document.getElementById("AddTimetableForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Timetable Data */}
                                    <div className="modal-body">
                                        <form id='AddTimetableForm'>

                                            <div className="mb-3">
                                                <label htmlFor="timetableSem" className="form-label">Timetable Sem <span className="requiredAsterisk">*</span></label>
                                                <input type="number" className="form-control text-black fw-bold" id="timetableSem" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="timetableDivision" className="form-label">Timetable Division <span className="requiredAsterisk">*</span></label>
                                                <input type="text" className="form-control text-black fw-bold" id="timetableDivision" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="timetableBatch" className="form-label">Timetable Batch <span className="requiredAsterisk">*</span></label>
                                                <input type="text" className="form-control text-black fw-bold" id="timetableBatch" required />
                                            </div>

                                            {Object.keys(formData).map((day) => (
                                                <div key={day}>
                                                    <h4 className='text-white text-center text-uppercase mt-3'>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                                                    <div className="my-0">
                                                        <hr className='hrStyle' style={{ height: "3px" }} />
                                                    </div>
                                                    {[
                                                        '9:05-9:55',
                                                        '9:55-10:45',
                                                        '10:55-12:35',
                                                        '12:35-1:25',
                                                        '1:25-3:05',
                                                        '3:05-4:00',
                                                    ].map((interval) => (
                                                        <div key={interval}>

                                                            <div className="row text-center justify-content-evenly align-items-center">
                                                                <div className="col-2">
                                                                    {interval}
                                                                </div>
                                                                <div className="col-2">
                                                                    <div className="mb-3">
                                                                        <label className="form-label" htmlFor={`${day}-${interval}-lec-lab`}>Lec/Lab</label>
                                                                        {/* <input className="form-control text-black fw-bold" type="text" id={`${day}-${interval}-lec-lab`} value={formData[day][interval]?.lecLab || ''} onChange={(e) =>
                                                                            handleInputChange(day, interval, 'lecLab', e.target.value)}
                                                                        /> */}
                                                                        <select
                                                                            className="form-select fw-bold"
                                                                            id={`${day}-${interval}-lec-lab`}
                                                                            value={formData[day][interval]?.lecLab || ''}
                                                                            onChange={(e) => handleInputChange(day, interval, 'lecLab', e.target.value)}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="LEC">LEC</option>
                                                                            <option value="LAB">LAB</option>
                                                                            {/* Add more options as needed */}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2">
                                                                    <div className="mb-3">
                                                                        <label className="form-label" htmlFor={`${day}-${interval}-subject`}>Subject</label>
                                                                        <input className="form-control text-black fw-bold" type="text" id={`${day}-${interval}-subject`} value={formData[day][interval]?.subject || ''} onChange={(e) =>
                                                                            handleInputChange(day, interval, 'subject', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-2">
                                                                    <div className="mb-3">
                                                                        <label className="form-label" htmlFor={`${day}-${interval}-location`}>Location</label>
                                                                        <input className="form-control text-black fw-bold" type="text" id={`${day}-${interval}-location`} value={formData[day][interval]?.location || ''} onChange={(e) =>
                                                                            handleInputChange(day, interval, 'location', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-2">
                                                                    <div className="mb-3">
                                                                        <label className="form-label" htmlFor={`${day}-${interval}-faculty`}>Faculty</label>
                                                                        <input className="form-control text-black fw-bold" type="text" id={`${day}-${interval}-faculty`} value={formData[day][interval]?.faculty || ''} onChange={(e) =>
                                                                            handleInputChange(day, interval, 'faculty', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            <div className="modal-footer bg-dark">
                                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddTimetableForm").reset(); }}>Close</button>
                                                <button type="submit" className="btn btn-success" onClick={(e) => { AddTimetableAPI(e) }}>Submit Form</button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Edit Timetable Model */}
                        <div className="modal fade dark-modal" id="editTimetableModal" tabIndex="-1" aria-labelledby="editTimetableModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl modal-lg">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editTimetableModalLabel">Edit Timetable Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editTimetablecloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditTimetableForm").reset(); setEditTimetableData({}) }}></button>
                                    </div>

                                    <div className="modal-body">
                                        {/* Form For Adding the Timetable Data */}
                                        <form id='EditTimetableForm'>
                                            <div className="mb-3">
                                                <label htmlFor="timetableSem" className="form-label">Timetable Sem <span className="requiredAsterisk">*</span></label>
                                                <input type="number" className="form-control text-black fw-bold" id="timetableSem" value={editTimetableData.sem || ""} onChange={(e) => handleEditInputChange("", "", 'sem', e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="timetableDivision" className="form-label">Timetable Division <span className="requiredAsterisk">*</span></label>
                                                <input type="text" className="form-control text-black fw-bold" id="timetableDivision" value={editTimetableData.division || ""} onChange={(e) => handleEditInputChange("", "", 'division', e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="timetableBatch" className="form-label">Timetable Batch <span className="requiredAsterisk">*</span></label>
                                                <input type="text" className="form-control text-black fw-bold" id="timetableBatch" value={editTimetableData.batch || ""} onChange={(e) => handleEditInputChange("", "", 'batch', e.target.value)} required />
                                            </div>

                                            {console.log("New Data is On", editTimetableData)}

                                            {editTimetableData.data &&
                                                Object.keys(editTimetableData.data).map((day) => (
                                                    <div key={day}>
                                                        <h4 className='text-white text-center text-uppercase mt-3'>
                                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                                        </h4>
                                                        <div className="my-0">
                                                            <hr className='hrStyle' style={{ height: "3px" }} />
                                                        </div>
                                                        {Object.keys(editTimetableData["data"][day]).map((interval) => (
                                                            <div key={interval}>
                                                                {console.log("My Data 1 | editTimetableData : ", editTimetableData)}
                                                                {console.log("My Data 2 | editTimetableData.data : ", editTimetableData.data)}
                                                                {console.log("My Data 3 | day : ", day)}
                                                                {console.log("My Data 4 | interval : ", interval)}
                                                                {console.log("My Data 5 | editTimetableData.data.day : ", editTimetableData["data"][day])}
                                                                {console.log("My Data 6 | editTimetableData.data.day.interval : ", editTimetableData["data"][day][interval])}
                                                                {console.log("My Data 7 | editTimetableData.data.day.interval.faculty : ", editTimetableData["data"][day][interval].faculty)}

                                                                <div className="row text-center justify-content-evenly align-items-center">
                                                                    {console.log("Data : ", editTimetableData.data[day][interval].faculty)}
                                                                    <div className="col-2">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor={`${day}-${interval}-lec-lab`}>
                                                                                Lec/Lab
                                                                            </label>
                                                                            <select
                                                                                className="form-select fw-bold"
                                                                                id={`${day}-${interval}-lec-lab`}
                                                                                defaultValue={editTimetableData["data"][day][interval]["lecLab"] || ""}
                                                                                onChange={(e) => handleEditInputChange(day, interval, 'lecLab', e.target.value)}
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="LEC">LEC</option>
                                                                                <option value="LAB">LAB</option>
                                                                                {/* Add more options as needed */}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor={`${day}-${interval}-subject`}>
                                                                                Subject
                                                                            </label>
                                                                            <input
                                                                                className="form-control text-black fw-bold"
                                                                                type="text"
                                                                                id={`${day}-${interval}-subject`}
                                                                                value={editTimetableData["data"][day][interval].subject || ""}
                                                                                onChange={(e) => handleEditInputChange(day, interval, 'subject', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor={`${day}-${interval}-location`}>
                                                                                Location
                                                                            </label>
                                                                            <input
                                                                                className="form-control text-black fw-bold"
                                                                                type="text"
                                                                                id={`${day}-${interval}-location`}
                                                                                value={editTimetableData["data"][day][interval].location || ""}
                                                                                onChange={(e) => handleEditInputChange(day, interval, 'location', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor={`${day}-${interval}-faculty`}>
                                                                                Faculty
                                                                            </label>
                                                                            <input
                                                                                className="form-control text-black fw-bold"
                                                                                type="text"
                                                                                id={`${day}-${interval}-faculty`}
                                                                                value={editTimetableData["data"][day][interval].faculty || ""}
                                                                                onChange={(e) => handleEditInputChange(day, interval, 'faculty', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}

                                            <div className="modal-footer bg-dark">
                                                <button type="button" id="EditTimetableFormCloseBtn" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditTimetableForm").reset(); setEditTimetableData({}) }}>Close</button>
                                                <button type="submit" className="btn btn-success" onClick={(e) => { EditTimetableAPI() }}>Submit Form</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default TimetableOperations

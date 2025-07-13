import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../../Context/NoteContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';

import addAdminImg from "../../Images/admin_add_icon.png"
import adminImg from "../../Images/admin_image.png"
import deleteAdminImg from "../../Images/admin_delete_icon.png"
import fetchAdminImg from "../../Images/admin_fetch_icon.png"
import updateAdminImg from "../../Images/admin_update_icon.png"

// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function AdminOperations() {
    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const [AdminRecords, setAdminRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditAdminRecord, setEditAdminRecord] = useState([])

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
        contextData.updateRecentlyAccessed('Admin Operations', `${location.pathname}`);

        // Moving the Page to the Top
        contextData.moveToTop()

        FetchAdminAPI();

    }, [])


    // Function to Add the Admin Data in the Database
    const AddAdminAPI = async (event) => {

        const addAdminForm = document.getElementById("AddAdminForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const username = document.getElementById("username").value
        // Logger(username)

        const useremail = document.getElementById("useremail").value
        // Logger(useremail)

        const userpassword = document.getElementById("userpassword").value
        // Logger(userpassword)

        const usergender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderFemale").checked ? "female" : "";
        // Logger(usergender)

        const userphone = document.getElementById("userphone").value
        // Logger(userphone)

        const userrole = sessionStorage.getItem("role")
        // Logger(userrole)


        if (username == "" || useremail == "" || userpassword == "" || usergender == "" || userphone == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Admin API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: userpassword,
                    gender: usergender,
                    phone: userphone,
                    email: useremail,
                    name: username,
                    role: userrole
                })
            });

            // Variable to handle the API Response
            const addAdminResponse = await response.json()

            Logger(addAdminResponse)

            if (addAdminResponse.success) {
                // After a successful submission, hide the modal
                // document.getElementById("addAdmincloseBtn").click()
                // document.getElementById("addAdminModel").style.display = "none"
                // contextData.showAlert("Success", addAdminResponse.message, "alert-success")
                // addAdminForm.reset();

                // After a successful submission, hide the modal
                document.getElementById("addAdminCloseBtn").click()
                document.getElementById("addAdminModel").style.display = "none"
                contextData.showAlert("Success", addAdminResponse.message, "alert-success")
                addAdminForm.reset();


                // Moving the Page to the Top
                contextData.moveToTop()

                // Fetching the Records Again for the Updated Records
                FetchAdminAPI()
            }
            else {
                contextData.showAlert("Failed", addAdminResponse.message, "alert-danger")
            }
        }
    }

    // Function to Fetch the Admin Data in the Database
    const FetchAdminAPI = async () => {
        // Calling the Add Admin API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/fetch/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAdminResponse = await response.json()

        Logger(fetchAdminResponse)

        if (fetchAdminResponse.success) {
            // Setting All Admins
            setAdminRecords(fetchAdminResponse.data)

            // Set only those not named Sanjay
            //setAdminRecords(AdminRecords.filter(item => !item.name.includes("Sanjay Sukhwani Admin")));
        }
    }

    // Function to Delete the Admin Data : 
    const DeleteAdminAPI = async (adminId) => {
        // Calling the Add Admin API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/delete/${adminId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteAdminResponse = await response.json()

        Logger(deleteAdminResponse)

        if (deleteAdminResponse.success) {
            // Showing the Alert Message that Admin Deleted
            contextData.showAlert("Success", deleteAdminResponse.message, "alert-success");
        }
        else {
            contextData.showAlert("Failed", deleteAdminResponse.message, "alert-danger");
        }

        // Moving the Page to the Top
        contextData.moveToTop()

        // Again Fetching the Records to refresh the records
        FetchAdminAPI()

    }

    // Function to Edit the Admin Data : 
    const EditAdminAPI = async (adminId) => {

        const editAdminForm = document.getElementById("EditAdminForm")

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const updatedusername = document.getElementById("updatedusername").value
        // Logger(updatedusername)

        const updateduseremail = document.getElementById("updateduseremail").value
        // Logger(updateduseremail)

        const updateduserpassword = document.getElementById("updateduserpassword").value
        // Logger(updateduserpassword)

        const updatedusergender = document.getElementById("updatedgenderMale").checked ? "male" : document.getElementById("updatedgenderFemale").checked ? "female" : "";
        // Logger(updatedusergender)

        const updateduserphone = document.getElementById("updateduserphone").value
        // Logger(updateduserphone)

        const updateduserrole = sessionStorage.getItem("role")
        // Logger(updateduserrole)

        //if (updatedusername == "" || updateduseremail == "" || updateduserpassword == "" || updatedusergender == "" || updateduserphone == "") {
        if (updatedusername == "" || updateduseremail == "" || updatedusergender == "" || updateduserphone == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Admin API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/update/${adminId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: updateduserpassword,
                    gender: updatedusergender,
                    phone: updateduserphone,
                    email: updateduseremail,
                    name: updatedusername,
                    role: updateduserrole
                })
            });

            // Variable to handle the API Response
            const editAdminResponse = await response.json()

            Logger(editAdminResponse)

            if (editAdminResponse.success) {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editAdminResponse.message, "alert-success")
                document.getElementById("editAdminModel").style.display = "none"
                editAdminForm.reset();
                document.getElementById("editAdmincloseBtn").click()

                // Moving the Page to the Top
                contextData.moveToTop()

                // Fetching the Records Again for the Updated Records
                FetchAdminAPI()
            }
            else {
                contextData.showAlert("Failed", editAdminResponse.message, "alert-danger")
            }
        }

    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditAdminRecord({
            ...EditAdminRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        Logger("EditAdmin : ", EditAdminRecord)

    }

    const applyFilter = () => {

        const searchName = document.getElementById("filterName").value;

        let nameMatches;

        const filteredResult = AdminRecords.filter((item) => {

            if (searchName !== "") {
                nameMatches = item.name.includes(searchName);
            }

            return (nameMatches || searchName === "");
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

            <div className="my-2">
                <div id='filterContainer' className='bg-light p-3 m-2 mt-4' style={{ borderRadius: "10px" }}>
                    <form id='filterForm'>
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                            FilteredRecords.length === 0 && AdminRecords.map((admin, index) => {

                                const keys = Object.keys(admin);
                                {/* Logger(admin) */ }

                                return (

                                    <React.Fragment key={admin._id}>
                                        {/* Admin Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={admin._id}>
                                            <div className="card itemCard">
                                                <img src={adminImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#AdminInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#AdminInfoModal${index}`}>
                                                    <p className="card-text itemName">{admin.name}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editAdminModel" onClick={() => { setEditAdminRecord(admin) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Admin</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteAdminAPI(admin._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Admin</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Info Modal */}
                                        <div className="modal fade dark-modal" id={`AdminInfoModal${index}`} tabIndex="-1" aria-labelledby={`AdminInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`AdminInfoModal${index}Label`}>Admin Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addAdmincloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", admin[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data==="password") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{admin[data]}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((admin, index) => {

                                const keys = Object.keys(admin);
                                {/* Logger(admin) */ }

                                return (

                                    <React.Fragment key={admin._id}>
                                        {/* Admin Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={admin._id}>
                                            <div className="card itemCard">
                                                <img src={adminImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#AdminInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#AdminInfoModal${index}`}>
                                                    <p className="card-text itemName">{admin.name}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editAdminModel" onClick={() => { setEditAdminRecord(admin) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Admin</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteAdminAPI(admin._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Admin</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Info Modal */}
                                        <div className="modal fade dark-modal" id={`AdminInfoModal${index}`} tabIndex="-1" aria-labelledby={`AdminInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`AdminInfoModal${index}Label`}>Admin Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addAdmincloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* Logger(data, " --> ", admin[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data==="password") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{admin[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addAdminModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Admin</button>

                        {/* Add Admin Model */}
                        <div className="modal fade dark-modal" id="addAdminModel" aria-labelledby="addAdminModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addAdminModelLabel">Add Admin Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddAdminForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Admin Data */}
                                    <form id='AddAdminForm'>
                                        <div className="modal-body">
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
                                                    <input className="form-check-input" type="radio" name="usergender" id="genderMale" required />
                                                    <label className="form-check-label" htmlFor="genderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="usergender" id="genderFemale" required />
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
                                            <button type="button" className="btn btn-danger" id="addAdminCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddAdminForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddAdminAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Admin Model */}
                        <div className="modal fade dark-modal" id="editAdminModel" tabIndex="-1" aria-labelledby="editAdminModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editAdminModelLabel">Edit Admin Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editAdmincloseBtn" aria-label="Close" onClick={() => { document.getElementById("AddAdminForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Admin Data */}
                                    <form id='EditAdminForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updateduseremail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="updateduseremail" name="email" aria-describedby="emailHelp" onChange={onChange} value={EditAdminRecord.email ?? ""} required />
                                            </div>
                                            <div className="mb-3 d-none">
                                                <label htmlFor="updateduserpassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="updateduserpassword" name="password" onChange={onChange} value={EditAdminRecord.password ?? ""} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedusername" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedusername" name="name" onChange={onChange} value={EditAdminRecord.name ?? ""} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedusergender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderMale" value="male" onChange={onChange} checked={EditAdminRecord.gender == "male" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderFemale" value="female" onChange={onChange} checked={EditAdminRecord.gender == "female" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateduserphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="updateduserphone" name="phone" maxLength={10} onChange={onChange} value={EditAdminRecord.phone ?? ""} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditAdminForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditAdminAPI(EditAdminRecord._id) }}>Submit Form</button>
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

export default AdminOperations

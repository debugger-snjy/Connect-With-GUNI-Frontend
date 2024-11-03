import React, { useContext, useEffect, useState } from 'react'
import InternalMenuBar from './InternalMenuBar'
import NavBreadcrumb from './NavBreadcrumb'

import feesImg from "../Images/fees.png"
import { useLocation } from 'react-router-dom'
import NoteContext from '../Context/NoteContext'

function Fees() {

    let location = useLocation()
    // Using the Context API
    const contextData = useContext(NoteContext);

    const userrole = sessionStorage.getItem("role")
    const [userFees, setuserFeesReceipts] = useState([])

    // Calling the API to get the User Info : 
    const getFeesReceipts = async (token) => {

        let user = JSON.parse(sessionStorage.getItem("user"))

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`http://localhost:5000/api/${userrole}/fetch/fees/sem/${user.sem}/enroll/${user.enrollNo}`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
            },
        });

        // Variable to handle the API Response
        const feesData = await response.json()

        console.log(feesData)

        // Sending the response Data
        return feesData
    }

    useEffect(() => {
        getFeesReceipts().then((data) => {
            console.log(data.studentFees)
            setuserFeesReceipts(data.studentFees)
            contextData.updateRecentlyAccessed('Fees Recipts', `${location.pathname}`);
        })
    }, [])

    function formatDate(feesDate) {
        const date = new Date(feesDate)
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

            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">
                        {
                            userFees.map((fees, index) => {

                                const keys = Object.keys(fees);
                                console.log(fees)

                                fees.feesDate = formatDate(fees.feesDate)

                                return (
                                    <React.Fragment key={fees._id}>
                                        {/* Fees Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={fees._id}>
                                            <div className="card itemCard">
                                                <img src={feesImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#FeesInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#FeesInfoModal${index}`}>
                                                    <p className="card-text itemName">{fees.feesTitle}</p>
                                                    {/* <p className="card-text small itemName fs-5 fw-normal">{fees.feesEnroll} ₹ {fees.feesSem} [ Sem {fees.feesAmount} ]</p> */}
                                                    <p className="card-text small itemName fs-5 fw-normal"> {fees.feesEnroll} - ₹{fees.feesAmount}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col">{fees.feesMode}</div>
                                                        <div className="col" style={{"textAlign" : "right"}}>{fees.feesDate}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fees Info Modal */}
                                        <div className="modal fade dark-modal" id={`FeesInfoModal${index}`} tabIndex="-1" aria-labelledby={`FeesInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`FeesInfoModal${index}Label`}>Fees Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addFeescloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        console.log(data, " --> ", fees[data])
                                                                        if (data.toLowerCase() === "faculties") {
                                                                            console.log(fees[data])
                                                                        }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData" || data.toLowerCase() === "feeslectures") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{data.toLowerCase() === "faculties" ? fees[data].join(", ") : fees[data]}</td>
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Fees

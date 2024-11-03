import React, { useContext, useEffect } from 'react'
import InternalMenuBar from './InternalMenuBar'
import NavBreadcrumb from './NavBreadcrumb'

import mondayImg from "../Images/monday.png"
import tuesdayImg from "../Images/tuesday.png"
import wednesdayImg from "../Images/wednesday.png"
import thrusdayImg from "../Images/thrusday.png"
import fridayImg from "../Images/friday.png"
import saturdayImg from "../Images/saturday.png"
import sundayImg from "../Images/sunday.png"
import { useLocation, useNavigate } from 'react-router-dom'
import NoteContext from '../Context/NoteContext'

function Timetable() {

    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    function openDay(day) {
        navigateTo(`${location.pathname}/${day}`)
    }

    useEffect(() => {

        contextData.updateRecentlyAccessed('Timetable Page', `${location.pathname}`);

    }, [])

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
                            <div className="card itemCard" onClick={() => { openDay("monday") }}>
                                <img src={mondayImg} className="card-img-top itemImg" alt="Monday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Monday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("tuesday") }}>
                                <img src={tuesdayImg} className="card-img-top itemImg" alt="Tuesday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Tuesday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("wednesday") }}>
                                <img src={wednesdayImg} className="card-img-top itemImg" alt="Wednesday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Wednesday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("thrusday") }}>
                                <img src={thrusdayImg} className="card-img-top itemImg" alt="Thrusday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Thrusday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("friday") }}>
                                <img src={fridayImg} className="card-img-top itemImg" alt="Friday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Friday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("saturday") }}>
                                <img src={saturdayImg} className="card-img-top itemImg" alt="Saturday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Saturday</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="card itemCard" onClick={() => { openDay("sunday") }}>
                                <img src={sundayImg} className="card-img-top itemImg" alt="Sunday" />
                                <div className="card-body">
                                    <p className="card-text itemName">Sunday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Timetable

import { useLocation, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react'
import NoteContext from '../Context/NoteContext'

import InternalMenuBar from './InternalMenuBar'
import axios from 'axios';
import MaterialItem from './Items/MaterialItem';
import NavBreadcrumb from './NavBreadcrumb';

function SubjectMaterial() {

    // Access the subjectname from the URL params
    const { subjectname } = useParams();

    let location = useLocation()

    // Using the Context API
    const contextData = useContext(NoteContext);

    const [materials, setMaterials] = useState([]);

    // Function to call the Fetch All Subject Materials API for the user !
    const fetchAllSubjectMaterials = async () => {

        const userSem = parseInt(JSON.parse(sessionStorage.getItem("user")).sem)
        console.log("Sem : ", userSem)

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/material/${subjectname}`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify({ "sem": userSem })
        });

        // Variable to handle the API Response and get the results
        const allSubjectMaterialData = await response.json()
        console.log(allSubjectMaterialData)
        console.log(allSubjectMaterialData.subjectMaterial)

        // Setting the data variable with the values we have
        setMaterials(allSubjectMaterialData.subjectMaterial)

        // Sending the response Data ---> No need to return the data
        // return allSubjectMaterialData
    }

    useEffect(() => {

        contextData.updateRecentlyAccessed(`Subject Material - ${subjectname}`, `${location.pathname}`);

        // Call the async function
        (async function () {
            await fetchAllSubjectMaterials();
        })();

        console.log(materials)

    }, []); // The empty dependency array means this effect runs once, similar to componentDidMount


    return (
        <>
            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <NavBreadcrumb />

            <div className="row subjects mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">
                        {
                            materials.map((material) => {
                                return (
                                    <MaterialItem key={material._id} filelink={material.file} type={material.type} title={material.title} date={material.date} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>


        </>
    )
}

export default SubjectMaterial

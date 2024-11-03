import React from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function SubjectItem(props) {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Function to move the user to materials page
    const movetoMaterial = (subjectname) => {
        console.log("Hello Subject : ",subjectname)
        navigateTo(`${location.pathname}/subject/${subjectname}`)
    }

    console.log(props.faculties)
    return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
            <div className="card itemCard" onClick={()=>{movetoMaterial(props.shortform)}}>
                <img src={props.image} className="card-img-top itemImg" alt="..." />
                <div className="card-body">
                    <h5 className="card-title text-black fw-bold">{props.name + " (" + props.shortform + ")"}</h5>
                    <p className="card-text text-black small fst-italic ">Faculties : {props.faculties.join(", ")}</p>
                </div>
            </div>
        </div>
    )
}

export default SubjectItem
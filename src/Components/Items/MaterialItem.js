import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import pdfIcon from "../../Images/pdfIcon.png"
import excelIcon from "../../Images/excelIcon.png"
import imageIcon from "../../Images/imageIcon.png"
import docIcon from "../../Images/docIcon.png"
import audioIcon from "../../Images/audioIcon.png"
import unknownIcon from "../../Images/unknownIcon.png"
import downloadIcon from "../../Images/downloadIcon.png"
import axios from 'axios'
import NoteContext from '../../Context/NoteContext';

// Importing the Logger Function to Log
import Logger from '../../Utils/Logger';

function MaterialItem(props) {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const contextData = useContext(NoteContext);

    let iconImage;

    if (props.type === 'image') {
        iconImage = imageIcon
    }
    if (props.type === 'pdf') {
        iconImage = pdfIcon
    }
    if (props.type === 'excel') {
        iconImage = excelIcon
    }
    if (props.type === 'doc') {
        iconImage = docIcon
    }
    if (props.type === 'audio') {
        iconImage = audioIcon
    }
    if (props.type === 'unknown') {
        iconImage = unknownIcon
    }

    const date = new Date(props.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const uploadDate = date.getDate() + " " + month + " " + date.getUTCFullYear()

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
            <div className="card itemCard">
                <span className="badge rounded-pill bg-dark card-text px-2 tags" style={{ position: "absolute", width: "107px", top: "5px", right: "5px", }}> <i className="fa-solid fa-sm fa-tags" style={{ "color": "white" }}></i> {uploadDate}</span>
                <img src={iconImage} className="card-img-top itemImg" alt="..." />
                <div className="card-body">
                    <h5 className="card-title text-black fw-bold">{props.title}</h5>
                </div>
                <div className="card-footer">
                    {/* <a href={props.filelink} download={props.title} className="btn btn-dark w-100">Download File</a> */}
                    {/* <button className="btn btn-dark w-100" onClick={() => { contextData.downloadFile(props.filelink, props.title,props.type) }}>Download File</button> */}
                    {/* {Logger(props.title)} */}
                    <a
                        className="btn btn-dark w-100"
                        href={`${process.env.REACT_APP_BACKEND_URL}/download?url=${encodeURIComponent(props.filelink)}&name=${encodeURIComponent(`${props.title}`)}`}
                    >
                        Download File
                    </a>
                </div>
            </div>
        </div>
    )
}

export default MaterialItem
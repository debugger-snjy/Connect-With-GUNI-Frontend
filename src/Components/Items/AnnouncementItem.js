import React from 'react'
import AnnouncementIcon from "../../Images/announcementIcon01.png"
import filelinkIcon from "../../Images/filelink.png"

function AnnouncementItem(props) {
    console.log("Links : ", props.links)

    let keyLinks = (!props.links) ? null : Object.keys(props.links);
    let keys = []

    if (props.editdelete) {
        keys = Object.keys(props.announcementdata)
    }

    return (
        <div className="row" key={"Announcement" + props.index}>
            <div className="col my-2">
                <div className="card">
                    <div className="card-body">
                        <div className="card-text" data-bs-toggle={props.editdelete == true ? "modal" : ""} data-bs-target={props.editdelete == true ? `#AnnouncementInfoModal${props.index}` : ""}>
                            <div className="d-flex align-items-center">
                                {/* <div className="p-0 "><img src={AnnouncementIcon} className='px-2' height={"30px"} /></div> */}
                                <div className="p-0 flex-grow-1">
                                    <div className='fw-bolder text-black align-middle' style={{ fontSize: "18px" }}><img src={AnnouncementIcon} height={"30px"} /> {props.title} [ <span className='text-black' style={{ fontSize: "16px" }}>By <span className="text-capitalize">{props.announcementBy}</span> - {props.date}</span> ] </div>

                                    <div className='fw-normal mt-1 mb-2'>{props.description}</div>
                                    {
                                        (!keyLinks) ?
                                            "" :
                                            <>
                                                {keyLinks.map((link, index) => {

                                                    return (
                                                        <div key={"AnnouncementLink" + props.index}><a id={"AnnouncementLink" + props.index} href={`${props.links[link]}`}> {link ? <img src={filelinkIcon} height={"20px"} /> : ""} {link}</a></div>
                                                    )
                                                })}

                                            </>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {props.editdelete && <div className="card-footer">
                        <div className="row">
                            <div className="col"><span data-bs-toggle="modal" data-bs-target="#editAnnouncementModel"><button className="btn btn-dark w-100 my-1" onClick={() => { props.setEditAnnouncementRecord(props.announcement) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> <span className="px-2">Edit Announcement</span></button></span></div>
                            <div className="col"><button className="btn btn-dark w-100 my-1" onClick={() => { props.deleteAPI(props.announcementdata._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> <span className="px-2" >Delete Announcement</span></button></div>
                        </div>
                    </div>}

                    {props.editdelete && <div className="modal fade dark-modal" id={`AnnouncementInfoModal${props.index}`} tabIndex="-1" aria-labelledby={`AnnouncementInfoModal${props.index}Label`} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-lg">
                            <div className="modal-content bg-dark text-light">
                                <div className="modal-header bg-dark text-light">
                                    <h1 className="modal-title fs-5" id={`AnnouncementInfoModal${props.index}Label`}>Announcement Info</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" id="addAnnouncementcloseBtn" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <table className='table table-dark'>
                                        <tbody>
                                            {
                                                keys.map((data, index) => {
                                                    if (data === "_id" || data === "__v") { }
                                                    else {
                                                        return (
                                                            data !== "additionalLinks" ?
                                                                <tr key={"ModalInfoTable" + index}>
                                                                    <td>{data.split("announcement")[1][0].toUpperCase() + data.split("announcement")[1].slice(1).toLowerCase()}</td>
                                                                    <td>{props.announcementdata[data]}</td>
                                                                </tr>
                                                                :
                                                                <tr key={"ModalInfoTable" + index}>
                                                                    <td>{keyLinks[0]} Link</td>
                                                                    <td>{keyLinks[0] ? <a href={`${props.announcementdata[data][keyLinks[0]]}`} target={'_blank'} >{props.announcementdata[data][keyLinks[0]]}</a> : "-"}</td>
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
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AnnouncementItem

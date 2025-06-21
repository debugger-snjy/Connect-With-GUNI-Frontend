import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../Context/NoteContext';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBreadcrumb from './NavBreadcrumb';
import InternalMenuBar from './InternalMenuBar';
import AddNote from './AddNote';
import NoteItem from './NoteItem';

// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

function Remainders() {

    let location = useLocation()

    // Using the function to get the data from the context
    const contextData = useContext(NoteContext);
    // Logger(contextData);

    // Destructuring Data
    // Removing updateNotes ==> as we have only to display notes right now
    // REMOVED and Transfered to <AddNote /> Component : Adding addNote => Using this we can add the notes in the userNotes state variable --> NO need of this as we have a component of it
    // Adding fetchAllNotes will fetch all the notes from the database !
    const { userNotes, fetchAllNotes, editNote } = contextData;

    // Navigator
    let navigateTo = useNavigate()

    // Calling the fetchAllNotes() :
    useEffect(() => {

        Logger(sessionStorage.getItem("token"));
        if (sessionStorage.getItem("token")) {
            fetchAllNotes()

            contextData.updateRecentlyAccessed('Remainders', `${location.pathname}`);

            Logger("Fetching");
        }
        else {
            contextData.updateRecentlyAccessed('Remainders - Error Page', `${location.pathname}`);

            navigateTo("/errorpage")
        }

    }, []);

    // Adding the Things for Edit Form Fields
    // Making a State to store the note until get submitted that WILL be written in the userNotes state & database later
    const [editedNote, setEditedNote] = useState({ id: "", editTitle: "", editDescription: "", editTags: "" })

    // Function to handle Adding Note on clicking Submit Button
    const handleEditNote = async (event) => {

        // This will prevent the page to get Reloaded (it is preventDefault not preventDefaults !)
        event.preventDefault();

        Logger("Edited Note : ", editedNote)

        // Calling the function editNote from NoteState and update the data in the database as well using API
        const responseData = await editNote(editedNote.id, editedNote.editTitle, editedNote.editDescription, editedNote.editTags)

        // When the User clicks on Edit Note Button and after editing the note in database we want to close the modal
        // So for that, we will use close button by using the ref=modalCloseRef
        modalCloseRef.current.click(); //=> Closes the modal

        // Showing the Alert Message
        if (responseData.success) {
            contextData.showAlert("Success", responseData.message, "alert-success")
        }
        else {
            contextData.showAlert("Error", responseData.message, "alert-danger")
        }
    }

    // Function to handle when the data in the input will be changed
    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditedNote({
            ...editedNote, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

    }

    const updatenote = (currentNote) => {
        Logger("Updating Note !!", currentNote);

        setEditedNote({
            id: currentNote._id,
            editTitle: currentNote.title,
            editDescription: currentNote.description,
            editTags: currentNote.tags
        })

        // Now, we can use the ref here and show/Open the modal by using the click() function ==> Refer the Docs on bootstrap Modal Theory
        modalOpenRef.current.click(); // Also Note that we have to use the current after the ref everytime !

        // Showing Alert Message :
        if (editedNote) {
            contextData.showAlert("Info", "Opening Edit Form . . ", "alert-info")
        }
        else {
            contextData.showAlert("Error", "Edit Form Cannot be Openend . . ", "alert-info")
        }
    }

    // By Using useRef, we can give reference to any one element !

    // We use this ref for showing/opening the modal
    const modalOpenRef = useRef(null);

    // We use this ref for hiding/closing the modal
    const modalCloseRef = useRef(null)

    return (
        <>

            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <NavBreadcrumb />

            <h1 className='my-3 mt-5 mx-3 text-center noteTitleText'>Yours Notes</h1>

            <div className='container-fluid text-white'>

                <div className="accordion" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item noteAccordionItem">
                        <h2 className="accordion-header">
                            <button className="accordion-button noteAccordion-Button noteAccordionHeaders menutextStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                Add New Note
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                                {/* Added the code that we have used in the Home.js */}
                                <AddNote />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item noteAccordionItem">
                        <h2 className="accordion-header">
                            <button className="accordion-button noteAccordion-Button noteAccordionHeaders menutextStyle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                My Notes
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                                <div className="container-fluid">
                                    {/* <h2>Your Notes</h2> */}
                                    <div className='row'>

                                        <div className={`container-fluid my-2 ${userNotes.length === 0 ? "" : "d-none"}`}>
                                            {/* If there are No Notes to display, then we will display the particular message */}
                                            <h5>
                                                {userNotes.length === 0 && "No Notes to Display, click on Add Note to add a Note"}
                                            </h5>
                                        </div>

                                        {/* Getting the notes from the Context API */}
                                        {/* Displaying the data individual from the Array */}
                                        {userNotes.map((note) => {
                                            {/*Adding the NoteItem Component Here & will pass the note data as props */ }
                                            {/* Logger(note._id) /// Checking */ }
                                            return (
                                                <NoteItem note={note} key={note._id} updatenote={updatenote} />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adding the Code for Edit Note Modal */}
                {/* Button to trigger modal */}
                {/* Making the button as reference and also hiding it*/}
                <button type="button" ref={modalOpenRef} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button>

                <div className="modal fade text-black" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ filter: "invert(1)" }}></button>
                            </div>
                            <div className="modal-body">
                                {/* Adding the Form Fields to update the Note */}
                                <form className='my-3' id='addNoteForm'>
                                    <div className="mb-3">
                                        <label htmlFor="editTitle" className="form-label">Note Title</label>
                                        {/* Added Minimum Length as 5 to Submit the Edit Form and also this field cann't be empty */}
                                        <input type="text" className="form-control noteField-note fw-bold text-black" name='editTitle' id="editTitle" minLength={5} required onChange={onChange} value={editedNote.editTitle} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editDescription" className="form-label">Description</label>
                                        {/* Added Minimum Length as 5 to Submit the Edit Form and also this field cann't be empty */}
                                        <textarea rows="5" className="form-control noteField-note fw-bold text-black" id="editDescription" name="editDescription" minLength={5} required onChange={onChange} value={editedNote.editDescription} ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editTags" className="form-label">Tags</label>
                                        <input type="text" className="form-control noteField-note fw-bold text-black" name="editTags" id="editTags" onChange={onChange} value={editedNote.editTags} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" ref={modalCloseRef} data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-success" onClick={handleEditNote} disabled={editedNote.editTitle.length < 5 || editedNote.editDescription.length < 5}>Edit Note</button>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </>
    )
}

export default Remainders
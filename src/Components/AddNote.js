import React, { useContext, useEffect, useState } from 'react'
import NoteContext from '../Context/NoteContext';
import { useNavigate } from 'react-router-dom';
// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

export default function AddNote() {

    const contextData = useContext(NoteContext);
    // Logger(contextData);
    // Destructuring Data
    // Here we only need a addNote function
    const { addNote } = contextData;

    // Making a State to store the note until get submitted that WILL be written in the userNotes state & database later
    const [tempNote, setTempNote] = useState({ title: "", description: "", tags: "" })

    // Navigator
    const navigateTo = useNavigate()

    // Changing the Page when user clicks logout button
    useEffect(() => {
        Logger(sessionStorage.getItem("token"));
        if (!sessionStorage.getItem("token")) {
            navigateTo("/")
        }
    }, [])

    // Function to handle Adding Note on clicking Submit Button
    const handleAddNote = async (event) => {

        // This will prevent the page to get Reloaded (it is preventDefault not preventDefaults !)
        event.preventDefault();

        // Finally after user clicks submit button, we will add the note into the CONTEXT Data and then through there in database as well
        // tempNote ==> will convert into permanent note

        // Both ways are correct
        Logger({ tempNote });
        const responseData = await addNote(tempNote.title, tempNote.description, tempNote.tags);

        // Reseting the Form
        document.getElementById("addNoteForm").reset()
        Logger(responseData);

        // TODO : A Big Loop Hole Solved
        // IMP : This will clear the tempNote and also will disable the Add Note
        // If not included the Add Note Button will be Enabled and if user clicks on that button wiht empty fields
        // It will save the note with the previous details again and again
        setTempNote({
            title: "",
            description: "",
            tags: ""
        })

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
        setTempNote({
            ...tempNote, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })
    }

    return (
        <div className="container-fluid">
            <h2 className='my-3'>Add a Note</h2>
            <form className='my-3' id='addNoteForm'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Note Title</label>
                    {/* Added Minimum Length as 5 to Submit the Form and also this field cann't be empty */}
                    <input type="text" className="form-control noteField-note" name='title' id="title" onChange={onChange} minLength={5} required />
                    <div id="tagHelp" className="form-text" style={{ fontSize: "12px", fontWeight: "bold", marginTop: "10px", color: "grey" }}> <i className="fa-solid fa-circle-exclamation fa-md" style={{ "color": "rgb(71, 74, 78)" }}></i> Kindly Add 5 or More Characters to Add a Note</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    {/* Added Minimum Length as 5 to Submit the Form and also this field cann't be empty */}
                    <textarea rows="5" className="form-control noteField-note" id="description" name="description" onChange={onChange} minLength={5} required></textarea>
                    <div id="tagHelp" className="form-text" style={{ fontSize: "12px", fontWeight: "bold", marginTop: "10px", color: "grey" }}> <i className="fa-solid fa-circle-exclamation fa-md" style={{ "color": "rgb(71, 74, 78)" }}></i> Kindly Add 5 or More Characters to Add a Note</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input type="text" className="form-control noteField-note" name='tags' id="tags" onChange={onChange} />
                    <div id="tagHelp" className="form-text" style={{ fontSize: "12px", fontWeight: "bold", marginTop: "10px", color: "grey" }}> <i className="fa-solid fa-circle-exclamation fa-md" style={{ "color": "rgb(71, 74, 78)" }}></i> If you want to add more than one tag, then use the <strong>commas</strong> in between. (Eg : Medicines,Home,Health are 3 different Tags)</div>
                </div>

                <div className="d-flex" style={{ justifyContent: "center" }}>
                    {/* We will disable the Button if the title and description are having length less than 5 */}
                    <button type="submit" className="btn btn-success mt-3 addNoteBtn" onClick={handleAddNote} disabled={tempNote.title.length < 5 || tempNote.description.length < 5}>Add Note</button>
                </div>
            </form>

            {/* Adding the Notes Component Here */}
            {/* This will be getting all the notes and displaying it on the page */}
        </div>

    )

}
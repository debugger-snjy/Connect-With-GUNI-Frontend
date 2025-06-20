import { useState } from "react";
import NoteContext from "./NoteContext";
import axios from "axios";

// Importing the Logger Function to Log
import Logger from "../Utils/Logger";

const NoteState = (props) => {

    // Getting the NOTES from the DATABASE :
    const mynotes = [];

    // const {Notes,updateNotes} = useState(mynotes); ===========>> LARGE MISTAKE !!!
    const [userNotes, setuserNotes] = useState(mynotes);

    const [userInfo, setuserInfo] = useState({});

    // Function to set the user and update the user
    const [user, setUser] = useState({ "_id": "", "name": "", "email": "", "date": "", "__v": 0 });

    // Making a Alert Use State Variable
    const [alert, setAlert] = useState(null);
    const showAlert = (title, message, type) => {
        setAlert({
            title: title,
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null)
        }, 5000);
    }

    // Function to Add a Note
    const addNote = async (title, description, tags) => {

        if (tags === "") {
            tags = "Default";
        }

        // ✅ Done TODO : Make an API Call Here !

        // Adding the API Call to add the notes into the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notes/add`, {
            method: "POST", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            body: JSON.stringify({ title, description, tags })
        });
        // parses JSON response into native JavaScript objects and using await as the function is asynchronus function
        const addNoteResponse = await response.json();

        // Checking
        Logger("New Note : ", addNoteResponse);

        // Now, adding all the notes in the userNotes state variable and will display all the notes from database !
        // This change is because we have added the msg and status field in the note response
        setuserNotes(userNotes.concat(addNoteResponse.data))

        Logger(userNotes);

        // Returning the response object as we have to show alert message
        return addNoteResponse;

        // fetchAllNotes()

        // Checking
        // Logger("Adding a new Note");

        // // Now, it will set the title,description and tags that we pass !
        // const newNote = {
        //     "user": "64a85e527a5925329325c7d9",
        //     "title": title,
        //     "description": description,
        //     "tags": tags,
        //     "date": "2023-07-08T22:30:56.453Z",
        //     "__v": 0
        // }

        // // Adding the note in the userNotes state variable
        // setuserNotes(userNotes.concat(newNote))
    }

    // Function to Edit a Note
    const editNote = async (id, title, description, tags) => {

        // ✅ Done TODO : Make an API Call Here !

        // Checking for the Values
        Logger(id);
        Logger(title);
        Logger(description);
        Logger(tags);
        // Logger(JSON.stringify({title,description,tags}))

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notes/update/${id}`, {
            method: "PUT", // As editnote is a PUT method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            body: JSON.stringify({ title, description, tags })
        })
        const editedNote = await response.json()

        Logger("Note is Edited !!");

        // fetchAllNotes();  // ====> We can do that but, it will increase the api requests because for update note, we call api for 2 time get API + fetch API

        // Copying the userNotes state variable and editing them
        let newuserNotes = JSON.parse(JSON.stringify(userNotes))

        for (let index = 0; index < newuserNotes.length; index++) {
            const element = newuserNotes[index];
            // Logger(element);
            // Finding the Note that we have to edit
            if (element._id === id) {
                Logger("Editing");
                // Editing title, description and tags
                // We cannot edit the state variable directly, we have to use the setuserNotes set state function
                // userNotes[index].title = title;
                // userNotes[index].description = description;
                // userNotes[index].tags = tags;
                newuserNotes[index].title = title;
                newuserNotes[index].description = description;
                newuserNotes[index].tags = tags;

                // Now, closing the Loops as we don't have any other note to edit
                break
            }
        }

        // Logger(newuserNotes); // Checking
        // Now, setting the newuserNotes in the userNote State Variable
        setuserNotes(newuserNotes)

        // Returning Response Data to show the Alert Message !
        return editedNote;
    }

    // Function to Delete a Note
    const deleteNote = async (id) => {

        // ✅ Done TODO : Make an API Call Here !
        // Adding the API Call to delete the notes from the database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notes/delete/${id}`, {
            method: "DELETE", // As deleteNote is a DELETE method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            // No need of body as we will not pass anything in the body
        });
        // parses JSON response into native JavaScript objects and using await as the function is asynchronus function
        const deletedNote = await response.json();

        Logger("Deleting the note !!", deletedNote);

        Logger(deletedNote);
        Logger(deletedNote["status"]);

        // Showing the Alert Message
        if (deletedNote.success)
            showAlert("Success", deletedNote.message, "alert-success")
        else
            showAlert("Error", deletedNote.message, "alert-danger")

        // let usersWithoutTim = userNotes.filter(user => user.name !== "Tim");
        // Using the filter function and using that we will not allow the note to be included
        let notesWithoutdeletedNote = userNotes.filter((note) => note._id !== id)

        // Adding the note in the userNotes state variable
        setuserNotes(notesWithoutdeletedNote)
    }

    // Function to Fetch all Note From the Database using the Backend API
    const fetchAllNotes = async () => {

        Logger("Fetching All Notes !");
        // ✅ Done TODO : Make an API Call Here !

        // Showing the Alert Message
        showAlert("Info", "Fetching Your Notes", "alert-info")

        // Adding the API Call to fetch all the notes
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notes/fetch/all`, {
            method: "GET", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            // No need of body as we will not pass anything in the body
        });
        // parses JSON response into native JavaScript objects and using await as the function is asynchronus function
        const allNotesFromDb = await response.json();

        // Checking
        // Logger(allNotesFromDb);

        // Now, adding all the notes in the userNotes state variable and will display all the notes from database !
        setuserNotes(allNotesFromDb.data)

        showAlert("Success", "Notes Fetched Successfully !", "alert-info")
    }

    // Function to fetch the user Details
    const fetchUser = async () => {

        Logger("Fetching User Info !");
        // ✅ Done TODO : Make an API Call Here !

        // Showing the Alert Message
        showAlert("Info", "Fetching Your Details", "alert-info")

        Logger(sessionStorage.getItem("token"));

        // Adding the API Call to fetch all the notes
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getuser`, {
            method: "POST", // As fetchUser is a POST method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            // No need of body as we will not pass anything in the body
        });
        // parses JSON response into native JavaScript objects and using await as the function is asynchronus function
        const userInfo = await response.json();

        // Checking
        // Logger(userInfo);
        // Logger(userInfo.user.date)

        // Sending the Formatted Date Time !
        userInfo.data.user.date = formattedDateTime(userInfo.data.user.date)
        // Logger(userInfo.data.user.date)

        setUser(userInfo.data.user)

        showAlert("Success", "User Fetched Successfully !", "alert-info")
    }

    // Function to format the Date that we got from database
    const formattedDateTime = (datetimeString) => {

        // Creating a Date Object
        const datetime = new Date(datetimeString);

        // Converting the Time into the Local Time Zone
        datetime.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })

        // Getting the hrs from the time string
        let dateHrs = datetime.getHours()

        // Getting the min from the time string
        let dateMins = datetime.getMinutes()

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Finding the am pm notation from the string
        let ampm = "";

        // Converting the 24 hours into 12 hours and finding the ampm notation
        if (dateHrs > 12) {
            ampm = "PM";
            dateHrs = dateHrs - 12;
        }
        else if (dateHrs === 12) {
            ampm = "PM";
        }
        else {
            ampm = "AM";
        }

        // Adding zero in beginning of the single digit numbers
        const addZero = (text) => {
            // Logger("text :", text);
            if (text >= 0 && text <= 9) {
                return "0" + text
            }
            return text;
        }

        // Formatting Time from hrs, min, and ampm notation
        const noteTime = addZero(dateHrs) + ":" + addZero(dateMins) + " " + ampm;

        // Formatting Date from date,month and year
        const noteDate = addZero(datetime.getDate()) + " " + addZero(months[datetime.getMonth() - 1]) + " " + datetime.getFullYear()

        // Checking
        // Logger(noteDate, noteTime, datetime.getMonth(), months[datetime.getMonth() - 1]);

        // Returning the Date and Time in a form of String
        return `${noteDate} ${noteTime}`;
    }

    // Function to move the Page to Top
    const moveToTop = () => {
        // Move the Page to the top 
        document.body.scrollIntoView({
            behavior: "smooth",
        });

    }

    const AddRecentAccessedAPI = async (description, link, timestamp) => {

        // Adding the API Call to add the notes into the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/recentaccess/add`, {
            method: "POST", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',

                // Adding the auth-token hardcore till now !
                "auth-token": sessionStorage.getItem("token"),
            },

            body: JSON.stringify({ description, link, timestamp })
        });

        // parses JSON response into native JavaScript objects and using await as the function is asynchronus function
        const addRecentAccessed = await response.json();

        // Checking
        if (!addRecentAccessed.success) {
            showAlert("Error", "Updating Recent Accessed List", "alert-danger")
        }

    }

    // Function to add the Recently Accessed
    const updateRecentlyAccessed = (description, link) => {

        // Calling the API to update the Recent Activity :
        // TODO : Add these recent Activities in the database !

        const timestamp = new Date().toLocaleString();

        // Function to Add the Recent Activity into the Database
        AddRecentAccessedAPI(description, link, timestamp)

    };

    // Function to Download the File or Material !
    const downloadFile = async (fileurl, filename, filetype) => {

        Logger("Download Process 1")
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/download`, {
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ fileurl, filename, filetype })
            });

            // Logger(filename);

            // Create a link element and initiate the download
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const a = document.createElement('a');
            // a.href = filepath;
            // a.download = filename;
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
            //window.URL.revokeObjectURL(url);

        }
        catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    return (

        // we will pass all the things in value that we have to pass
        // Passing the State and function which will update it
        // Here, {state,updateState} ===> {state:state, updateState:updateState}
        // Passing the userNotes and updateNotes in the context
        <NoteContext.Provider value={{ userNotes, alert, user, showAlert, addNote, editNote, deleteNote, fetchAllNotes, fetchUser, formattedDateTime, setuserInfo, moveToTop, updateRecentlyAccessed, downloadFile }}>
            {props.children}
        </NoteContext.Provider>
    );

}

export default NoteState;
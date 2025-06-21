import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ganpat_logo from "../Images/Ganpat_LOGO.png";
import "../CSS/Login.css"
import NoteContext from '../Context/NoteContext';

// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

function Login() {

    let navigateTo = useNavigate()

    // Using the function to get the data from the context
    const contextData = useContext(NoteContext);
    Logger("Hello Login");

    useEffect(() => {
        const role = sessionStorage.getItem("role")
        if (sessionStorage.getItem("token")) {
            navigateTo(`/dashboard/${role}`)
        }
    })

    // Calling the API to get the User Info : 
    const getInfoAPI = async (token) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getuser`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        // Variable to handle the API Response
        const userData = await response.json()

        Logger(userData)

        // Sending the response Data
        return userData
    }

    // Calling the API to login the User : 
    const loginAPI = async (useremail, userpassword, userrole) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
            method: "POST", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify({ email: useremail, password: userpassword, role: userrole })
        });

        // Variable to handle the API Response
        const loginResponse = await response.json()

        Logger(loginResponse)

        // Sending the response Data
        return loginResponse
    }

    // Function to handle when user gets logged in !
    const handleLogin = async (event) => {

        Logger("Login Submit !");

        event.preventDefault();

        let useremail = document.getElementById("useremail").value;
        Logger(useremail);
        let userpassword = document.getElementById("userpassword").value;
        Logger(userpassword);
        let userrole = document.getElementById("userrole").value;
        Logger(userrole)


        // Adding the API Call to add the notes into the Database
        const response = await loginAPI(useremail, userpassword, userrole)

        Logger(response);

        // If the user is registered and we get its auth-token,
        // Then we will save that auth-token in the sessionStorage
        if (response.success) {

            // Showing the Alert Message
            contextData.showAlert("Success", response.message, "alert-success")

            // Getting the User Info :
            const getuserResponse = await getInfoAPI(response.data.authToken)

            Logger("Hii", getuserResponse)

            // Showing the Alert Box for the Fetching the Data
            contextData.showAlert("Fetching", "Fetching the User Data", "alert-warning")

            setTimeout(() => {

                // Saving auth-token in sessionStorage
                sessionStorage.setItem("token", response.data.authToken)
                sessionStorage.setItem("role", userrole)
                sessionStorage.setItem("user", JSON.stringify(getuserResponse.data.user))

                // Showing the Alert Box for the successfull fetching the user data
                contextData.showAlert("Success", getuserResponse.message, "alert-success")

                navigateTo(`/dashboard/${userrole}`)

            }, 3000);

        }

        else {

            // Showing the Alert Message
            contextData.showAlert("Failed", response.message, "alert-danger")

            // // Setting the status message :
            // document.getElementById("status").innerText = userToken.message
            // document.getElementById("status").style.color = "red"
            // document.getElementById("status").style.fontWeight = 600;
        }

    }

    return (
        <>
            <div className='loginPage mt-5 mb-5'>

                <img src={ganpat_logo} alt="Ganpat University Logo" className='logoImg centerIt' />

                <div className="centerIt loginForm">

                    <div className="my-2" id='status'></div>

                    <form>

                        <input type="text" className="inputField form-control form-control-md" id="useremail" placeholder="Email" />
                        <input type="password" className="inputField form-control form-control-md" id="userpassword" placeholder="Password" />

                        <center>
                            <select className="form-select inputField" id='userrole' defaultValue={"student"} style={{width : "60%"}}>
                                <option value="student" defaultChecked>Student</option>
                                <option value="faculty">Faculty</option>
                                <option value="admin">Admin</option>
                            </select>
                        </center>

                        <button className='btn btn-primary centerIt loginBtn' onClick={handleLogin}>Login</button>

                        <div className="container mt-4 myLoginLink">
                            <center>
                                <Link to='mailto:sanjayasukhwani@gmail.com'>Not have an Account, Contact Admin</Link>
                            </center>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}

export default Login
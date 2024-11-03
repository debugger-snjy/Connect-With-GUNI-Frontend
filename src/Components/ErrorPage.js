import React from 'react'
import errorImg from "../Images/error.png"
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
    
    let navigateTo = useNavigate()

    // Function to move to the Login Page
    const moveToLogin = () => {
        navigateTo("/")
    }

    return (
        <div style={{ marginTop: "100px" }}>
            <div className="row">
                <img className="errorImage" src={errorImg} alt="Under Construction" />
            </div>

            <div className="row">
                <div className="col text-white">
                    <h2 align="center">Error Occured</h2>
                    <h5 align="center">Oops, the page you're looking for isn't available. Please check the URL or return to the homepage</h5>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <button className='btn btn-primary centerIt loginBtn' onClick={moveToLogin}>Home Page</button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage

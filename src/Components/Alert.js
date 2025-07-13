import React, { useContext } from 'react'
import NoteContext from '../Context/NoteContext';
// Importing the Logger Function to Log
import Logger from '../Utils/Logger';

export default function Alert() {

    // Using the function to get the data from the context
    const contextData = useContext(NoteContext);
    // Logger(contextData.alert);

    return (
        contextData.alert && (
            <div id="myAlert" className={`alert ${contextData.alert.type} alert-dismissible fade show`} role="alert">
                <strong>{contextData.alert.title}!</strong> {contextData.alert.msg}
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                        contextData.showAlert(null, null, null);
                        document.getElementById("myAlert").style.display = "none";
                    }}  // React handles dismissal
                    aria-label="Close"
                ></button>
            </div>
        )
    );
}

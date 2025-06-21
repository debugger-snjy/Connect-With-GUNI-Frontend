const Logger = (...args) => {

    if (process.env.REACT_APP_DEBUG === "true") {
        console.log(...args);
    }
    //console.log("Logger called with arguments:", args);
};

export default Logger;

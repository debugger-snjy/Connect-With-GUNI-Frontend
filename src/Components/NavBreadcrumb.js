import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

function NavBreadcrumb() {

    let location = useLocation();
    const customStyle = {
        '--bs-breadcrumb-divider': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E")`,
        "padding": "4px 20px",
        "backgroundColor": "white",
        "margin": "2px",
        "borderRadius": "20px",
    };

    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

    function isUpperCase(text) {
        return text === text.toUpperCase();
    }

    let userrole = sessionStorage.getItem("role")

    const breadcrumbItems = pathSegments.map((segment, index) => {
        let name = segment;
        let path = '/' + pathSegments.slice(0, index + 1).join('/');

        if (!isUpperCase(name)) {
            name = name[0].toUpperCase() + name.slice(1).toLowerCase()
        }
        // console.log(name)

        if (path.endsWith("dashboard")) {
            path = `${path}/${userrole}`
        }
        else if (path.endsWith(`${userrole}`)) {
            path = path.split("/")[0];
        }
        else if (path.endsWith("subject")) {
            path = path.split("/subject")[0]
        }

        if(name.toLowerCase()=="facultyinfo"){
            name = "Faculty Information"
        }

        if(name.includes("operations")){
            let first = name.split("_")[0]
            let last = name.split("_")[1]

            name = first[0].toUpperCase() + first.slice(1) + " " + last[0].toUpperCase() + last.slice(1)
        }

        if (name.toLowerCase() != `${userrole}`) {
            return (
                <li key={segment} className="breadcrumb-item">
                    <a href={path} style={{ color: "black"}}>{name}</a>
                </li>
            );
        }
    });

    return (
        <nav style={customStyle} aria-label="breadcrumb" className='menutextStyle'>
            <ol className="breadcrumb" style={{ margin: "0px", padding: "0px" }}>
                {breadcrumbItems}
            </ol>
        </nav>
    )
}

export default NavBreadcrumb

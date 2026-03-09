import React from 'react'

const ResourcesIcon = ({ color = "white" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 15h6" />
            <path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 18h6" />
            <path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 21h6" />
        </svg>
    )
}

export default ResourcesIcon;

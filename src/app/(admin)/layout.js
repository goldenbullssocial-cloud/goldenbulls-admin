import Sidebar from '@/components/sidebar'
import UserHeader from '@/components/userHeader'
import React from 'react'

export default function layout({ children }) {
    return (
        <div className='user-panel-layout'>
            <div className='sidebar-panel'>
                <Sidebar />
            </div>
            <div className='children-layout'>
                <UserHeader />
                {children}
            </div>
        </div>
    )
}

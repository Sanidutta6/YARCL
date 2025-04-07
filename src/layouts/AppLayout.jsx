import React from 'react'
import Header from '../components/Header'
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'
import SideNav from '@/components/SideNav'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router'

const AppLayout = () => {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <SideNav />
                <SidebarInset>
                    <div className="flex-1 flex flex-col h-full">
                        <Header />
                        <section className="flex-1 overflow-y-auto px-6">
                            <Outlet />
                        </section>
                        <Footer />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default AppLayout
"use client" 
 
 import { propertyOwnerLinks } from "../../(public)/components/shared/propertyOwnerSidebarLinks";
import Sidebar from "../../(public)/components/shared/Sidebar";
import Topbar from "../../(public)/components/Topbar";

 

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar variant="property-owner" />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 bg-gray-100 rounded-xl h-full">{children}</main>
      </div>
    </div>
  );
}

 "use client"
 
 import { clientLinks } from "../../(public)/components/shared/clientSidebarLinks";
import Sidebar from "../../(public)/components/shared/Sidebar";
import Topbar from "../../(public)/components/Topbar";
import useSyncSaved from "../../../hooks/useSyncSaved"
export default function DashboardLayout({ children }) {
  useSyncSaved()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar variant="client" />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 bg-gray-100 rounded-xl h-full">{children}</main>
      </div>
    </div>
  );
}

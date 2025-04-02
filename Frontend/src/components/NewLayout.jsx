import { useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
} from "lucide-react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gray-900 text-white h-screen p-4 transition-all ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-4 p-2 bg-gray-700 rounded"
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>
      <nav>
        <ul>
          <li className="py-2 px-3 flex items-center space-x-2 hover:bg-gray-700 rounded">
            <Home size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </li>
          <li className="py-2 px-3 flex items-center space-x-2 hover:bg-gray-700 rounded">
            <User size={20} />
            {!isCollapsed && <span>Profile</span>}
          </li>
          <li className="py-2 px-3 flex items-center space-x-2 hover:bg-gray-700 rounded">
            <Settings size={20} />
            {!isCollapsed && <span>Settings</span>}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function Topbar({ setShielded }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">My App</h1>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded"
        >
          <User size={20} />
          <span>John Doe</span>
          <ChevronDown size={16} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <button
              onClick={() => setShielded(true)}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
            >
              <Shield size={16} className="mr-2" /> Privacy
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-gray-200">
              <LogOut size={16} className="mr-2" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function NewLayout() {
  const [shielded, setShielded] = useState(false);

  return (
    <div className="flex h-screen relative">
      {shielded && (
        <div className="absolute inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
          <button
            onClick={() => setShielded(false)}
            className="px-4 py-2 bg-white text-black rounded"
          >
            Show
          </button>
        </div>
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar setShielded={setShielded} />
        <main className="p-4">Content goes here</main>
      </div>
    </div>
  );
}

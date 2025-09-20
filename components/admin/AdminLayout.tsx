'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/lib/redux/leadsApi';
import { logout } from '@/lib/redux/authSlice';
import Image from 'next/image';
import { ChevronDown, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<'leads' | 'settings'>('leads');
  const submenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
    }
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header and Navigation with gradient background */}
        <div className="relative flex-1">
          {/* Radial gradient background that radiates from logo */}
          <div 
            className="absolute inset-0 w-full h-[180px] bg-radial-lime"
          ></div>
          
          {/* Logo Section */}
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-center py-6">
              <Image
                src="/alma.png"
                alt="Alma Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 p-6">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setCurrentSection('leads')}
                  className={`flex items-center w-full text-left text-sm transition-colors ${
                    currentSection === 'leads' 
                      ? 'text-gray-900 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Leads
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentSection('settings')}
                  className={`flex items-center w-full text-left text-sm transition-colors ${
                    currentSection === 'settings' 
                      ? 'text-gray-900 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* User Info with Submenu */}
        <div className="p-6 border-t border-gray-200">
          <div className="relative" ref={submenuRef}>
            <button
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              className="flex items-center w-full text-left hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-gray-700 text-sm flex-1">Admin</span>
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isSubmenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {/* Submenu */}
            {isSubmenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Heading */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {currentSection === 'leads' ? 'Leads' : 'Settings'}
          </h1>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          {currentSection === 'leads' ? children : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-500 mb-2">Settings</h2>
                <p className="text-gray-400">Settings page coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

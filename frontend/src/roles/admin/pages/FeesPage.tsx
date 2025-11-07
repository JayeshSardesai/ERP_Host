import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CreditCard, FileText } from 'lucide-react';
import FeeStructureTab from './FeeStructureTab';
import FeePaymentsTab from './FeePaymentsTab';

const FeesPage: React.FC = () => {
  const location = useLocation();
  
  // Determine active tab based on URL
  const getActiveTab = () => {
    if (location.pathname.includes('/fees/structure')) return 'structure';
    if (location.pathname.includes('/fees/payments')) return 'payments';
    return 'structure'; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const tabs = [
    {
      id: 'structure',
      name: 'Fee Structure',
      icon: FileText,
      href: '/admin/fees/structure',
      description: 'Create and manage fee structures'
    },
    {
      id: 'payments',
      name: 'Fee Payments',
      icon: FileText,
      href: '/admin/fees/payments',
      description: 'Record and track fee payments'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fees Management</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.history.pushState({}, '', tab.href);
                  }}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm w-full sm:w-auto text-left ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'structure' && <FeeStructureTab />}
          {activeTab === 'payments' && <FeePaymentsTab />}
        </div>
      </div>
    </div>
  );
};

export default FeesPage;

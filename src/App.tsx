import { useState } from 'react'
import { Navigation } from './components/Navigation'
import { Dashboard } from './components/Dashboard'
import { AIChat } from './components/AIChat'
import { BookingSystem } from './components/BookingSystem'
import { MySessions } from './components/MySessions'
import { ResourceHub } from './components/ResourceHub'
import { PeerSupport } from './components/PeerSupport'
import { AdminDashboard } from './components/AdminDashboard'
import { WellnessJourney } from './components/WellnessJourney'
import { TestConnection } from './components/TestConnection'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false) // In real app, this would be determined by authentication

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />
      case 'wellness':
        return <WellnessJourney />
      case 'chat':
        return <AIChat />
      case 'booking':
        return <BookingSystem />
      case 'sessions':
        return <MySessions onPageChange={setCurrentPage} />
      case 'resources':
        return <ResourceHub />
      case 'community':
        return <PeerSupport />
      case 'admin':
        return <AdminDashboard />
      default:
        return <Dashboard onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isAdmin={isAdmin}
      />
      
      {/* Admin Toggle for Demo */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <div>
          <TestConnection />
        </div>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors w-full"
        >
          {isAdmin ? 'Switch to Student View' : 'Switch to Admin View'}
        </button>
      </div>

      <main>
        {renderCurrentPage()}
      </main>
    </div>
  )
}
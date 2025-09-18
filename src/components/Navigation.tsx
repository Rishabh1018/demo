import { Heart, MessageCircle, Calendar, BookOpen, Users, BarChart3, Menu, X, CalendarCheck } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  isAdmin?: boolean
}

export function Navigation({ currentPage, onPageChange, isAdmin = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: Heart },
    { id: 'wellness', label: 'Wellness Journey', shortLabel: 'Wellness', icon: Heart },
    { id: 'chat', label: 'Sukoon Chat', shortLabel: 'Sukoon', icon: MessageCircle },
    { id: 'booking', label: 'Book Session', shortLabel: 'Book', icon: Calendar },
    { id: 'sessions', label: 'My Sessions', shortLabel: 'Sessions', icon: CalendarCheck },
    { id: 'resources', label: 'Resources', shortLabel: 'Resources', icon: BookOpen },
    { id: 'community', label: 'Peer Support', shortLabel: 'Community', icon: Users },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', shortLabel: 'Admin', icon: BarChart3 }] : [])
  ]

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => onPageChange('dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <Heart className="h-8 w-8 text-blue-600 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nirvaan
                </span>
                <span className="text-xs text-gray-500 -mt-1">Set your mind free</span>
              </div>
            </button>
          </div>

          {/* Extra Large Desktop Navigation - Full labels (1400px+) */}
          <div className="hidden 2xl:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentPage === id ? "default" : "ghost"}
                onClick={() => onPageChange(id)}
                className="flex items-center space-x-2 px-3"
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{label}</span>
              </Button>
            ))}
          </div>

          {/* Large Desktop Navigation - Full/Short labels based on space (1200px-1399px) */}
          <div className="hidden xl:flex 2xl:hidden items-center space-x-1">
            {navItems.map(({ id, label, shortLabel, icon: Icon }) => (
              <Button
                key={id}
                variant={currentPage === id ? "default" : "ghost"}
                onClick={() => onPageChange(id)}
                className="flex items-center space-x-1 px-2"
                title={label}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm whitespace-nowrap">
                  {navItems.length <= 7 ? shortLabel : (id === 'dashboard' || id === 'chat' || id === 'booking') ? shortLabel : ''}
                </span>
              </Button>
            ))}
          </div>

          {/* Medium Desktop Navigation - Compact icons + key labels (950px-1199px) */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {navItems.slice(0, 6).map(({ id, shortLabel, icon: Icon }) => (
              <Button
                key={id}
                variant={currentPage === id ? "default" : "ghost"}
                onClick={() => onPageChange(id)}
                className="flex flex-col items-center justify-center px-1.5 py-1 h-12 min-w-[50px]"
                title={navItems.find(item => item.id === id)?.label}
              >
                <Icon className="h-3.5 w-3.5 mb-0.5" />
                <span className="text-xs leading-tight">{shortLabel.split(' ')[0]}</span>
              </Button>
            ))}
            
            {/* Overflow menu for remaining items */}
            {navItems.length > 6 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex flex-col items-center justify-center px-1.5 py-1 h-12 min-w-[50px]"
                  title="More options"
                >
                  <Menu className="h-3.5 w-3.5 mb-0.5" />
                  <span className="text-xs">More</span>
                </Button>
                
                {isMobileMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {navItems.slice(6).map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => {
                            onPageChange(id)
                            setIsMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 ${
                            currentPage === id ? 'bg-gray-100 text-primary' : 'text-gray-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tablet Navigation - Horizontal scrollable (768px-949px) */}
          <div className="hidden md:flex lg:hidden items-center">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full">
              {navItems.map(({ id, icon: Icon }) => (
                <Button
                  key={id}
                  variant={currentPage === id ? "default" : "ghost"}
                  onClick={() => onPageChange(id)}
                  className="flex items-center justify-center p-2 min-w-[40px] flex-shrink-0"
                  title={navItems.find(item => item.id === id)?.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onPageChange(id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    currentPage === id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
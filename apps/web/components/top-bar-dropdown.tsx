"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface TopBarDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export default function TopBarDropdown({ isOpen, onClose }: TopBarDropdownProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-200 ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div
        className={`
          fixed inset-0 bg-white z-50 
          md:absolute md:top-0 md:left-0 md:right-0 md:inset-auto
          transform transition-transform duration-200 ease-out
          ${isOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Mobile: Full screen, Desktop: Slide from top */}
        <div className="h-full md:h-auto">
          {/* Close button - Square border style */}
          <div className="flex justify-end p-4 md:p-6">
            <button
              onClick={onClose}
              className="w-10 h-10 border border-black flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - 2 columns on desktop, stacked on mobile */}
          <div className="px-4 pb-8 md:px-16 md:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
              {/* adiClub Section */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">FREE STANDARD SHIPPING WITH ADICLUB</h2>
                <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed">
                  Sign up for adiClub to enjoy free standard shipping and earn points on every order.
                </p>
                <button className="text-black font-bold underline hover:no-underline transition-all duration-150">
                  JOIN ADICLUB FOR FREE
                </button>
              </div>

              {/* Prime Section */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">FAST, FREE DELIVERY WITH PRIME</h2>
                <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed">
                  Get fast, free delivery on eligible items with Prime.
                </p>
                <button className="text-black font-bold underline hover:no-underline transition-all duration-150">
                  FAST, FREE PRIME DELIVERY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import Experience from './Experience'
import Interface from './Interface'
import OrderSummary from './OrderSummary'

const STORAGE_KEY = 'straw_config_data'

function App() {
  const [showSummary, setShowSummary] = useState(false)

  // Global State
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error loading saved config", e)
      }
    }
    return {
      color: '#FF0000',
      strawType: 'Flexible',
      endType: 'Standard',
      length: 300,
      diameter: '12',
      wrapperType: 'Unwrapped',
      comments: '',
      numMasterCartons: '',
      qtyPerInnerBox: '',
      innerBoxesPerCarton: ''
    }
  })

  // Persistence logic - Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  // Snapshot Ref
  const experienceRef = useRef()

  const handleSnapshot = () => {
    if (experienceRef.current) {
      experienceRef.current.takeSnapshot()
    }
  }

  // --- Order Summary Handlers ---
  const handleReviewOrder = () => {
    setShowSummary(true)
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
  }

  const handleConfirmOrder = () => {
    // Reset to defaults
    const defaults = {
      color: '#FF0000',
      strawType: 'Flexible',
      endType: 'Standard',
      length: 300,
      diameter: '12',
      wrapperType: 'Unwrapped',
      comments: '',
      numMasterCartons: '',
      qtyPerInnerBox: '',
      innerBoxesPerCarton: ''
    }
    setConfig(defaults)
    localStorage.removeItem(STORAGE_KEY)
    setShowSummary(false)
  }

  // Calculate totalQty for the summary
  const totalQty = (config.numMasterCartons || 0) * (config.qtyPerInnerBox || 0) * (config.innerBoxesPerCarton || 0);

  return (
    <div className="w-full flex flex-col lg:flex-row bg-white overflow-hidden" style={{ height: '100dvh' }}>

      {/* Left: 3D Experience Area */}
      {/* Mobile: Top 45% of screen. Desktop: Full height, flexible width */}
      <div className="w-full lg:w-auto h-[45vh] lg:h-full lg:flex-1 relative cursor-grab active:cursor-grabbing bg-gradient-to-b from-white to-gray-200 shrink-0">

        {/* Noise Overlay for Background Texture (Concrete/Plaster Effect) */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
            filter: 'contrast(120%) brightness(105%)'
          }}
        />

        <Experience config={config} onSnapshotRef={experienceRef} />
      </div>

      {/* Right: Sidebar Interface */}
      {/* Mobile: Bottom 55% (flex-1). Desktop: Fixed 400px width on right */}
      <div className="w-full flex-1 min-h-0 lg:flex-none lg:w-[400px] lg:h-full relative z-10 bg-white border-l shadow-xl">
        <Interface
          config={config}
          setConfig={setConfig}
          onSnapshot={handleSnapshot}
          onReviewOrder={handleReviewOrder}
        />
      </div>

      {/* Order Summary Modal */}
      <OrderSummary
        isOpen={showSummary}
        onClose={handleCloseSummary}
        onConfirm={handleConfirmOrder}
        data={{ ...config, totalQty }}
      />

    </div>
  )
}

export default App

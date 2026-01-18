import React, { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGLTF } from '@react-three/drei'
import Experience from './components/Experience'
import Interface from './components/Interface'
import OrderSummary from './components/OrderSummary'
import Loader from './components/Loader'

const STORAGE_KEY = 'straw_config_data'

useGLTF.preload('/straw.glb')
useGLTF.preload('/All-Straws.glb')

function App() {
  const [showSummary, setShowSummary] = useState(false)
  const [snapshotUrl, setSnapshotUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
      strawType: 'Straight',
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const experienceRef = useRef()

  const handleSnapshot = () => {
    if (experienceRef.current) {
      experienceRef.current.takeSnapshot()
    }
  }

  const handleReviewOrder = () => {
    if (experienceRef.current?.getSnapshot) {
      setSnapshotUrl(experienceRef.current.getSnapshot())
    }
    setShowSummary(true)
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
  }

  const handleConfirmOrder = () => {
    const defaults = {
      color: '#FF0000',
      strawType: 'Straight',
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
    setSnapshotUrl(null)
  }

  const totalQty = (config.numMasterCartons || 0) * (config.qtyPerInnerBox || 0) * (config.innerBoxesPerCarton || 0);

  const handleLoaderFinished = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100]"
          >
            <Loader onFinished={handleLoaderFinished} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col lg:flex-row bg-white overflow-hidden" style={{ height: '100dvh' }}>

        <div className="w-full lg:w-auto h-[45vh] lg:h-full lg:flex-1 relative cursor-grab active:cursor-grabbing bg-gradient-to-b from-white to-gray-200 shrink-0">

          <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
              filter: 'contrast(120%) brightness(105%)'
            }}
          />

          <Experience config={config} onSnapshotRef={experienceRef} />
        </div>

        <div className="w-full flex-1 min-h-0 lg:flex-none lg:w-[400px] lg:h-full relative z-10 bg-white border-l shadow-xl">
          <Interface
            config={config}
            setConfig={setConfig}
            onSnapshot={handleSnapshot}
            onReviewOrder={handleReviewOrder}
          />
        </div>

        <OrderSummary
          isOpen={showSummary}
          onClose={handleCloseSummary}
          onConfirm={handleConfirmOrder}
          data={{ ...config, totalQty }}
          snapshot={snapshotUrl}
        />

      </div>
    </>
  )
}

export default App

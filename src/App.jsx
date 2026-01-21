import React, { useState, useRef, useEffect, useCallback, startTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGLTF } from '@react-three/drei'
import Experience from './components/Experience'
import Interface from './components/Interface'
import OrderSummary from './components/OrderSummary'
import Loader from './components/Loader'

const STORAGE_KEY = 'straw_config_data'

const DEFAULT_CONFIG = {
  color: '#FF0000',
  strawType: 'Straight',
  endType: 'Standard',
  length: 200,
  diameter: '12',
  wrapperType: 'Unwrapped',
  comments: '',
  numMasterCartons: '',
  qtyPerInnerBox: '',
  innerBoxesPerCarton: ''
}

useGLTF.preload('/straw.glb')
useGLTF.preload('/All-Straws.glb')

function App() {
  const [showSummary, setShowSummary] = useState(false)
  const [snapshotUrl, setSnapshotUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isContextLost, setIsContextLost] = useState(false)

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error loading saved config", e)
      }
    }
    return DEFAULT_CONFIG
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const experienceRef = useRef()

  const handleSnapshot = useCallback(() => {
    if (experienceRef.current) {
      // The actual snapshot logic is inside Experience but this trigger might be unused if we rely on handleReviewOrder
      experienceRef.current.takeSnapshot()
    }
  }, [])

  const handleReviewOrder = useCallback(async () => {
    if (isProcessing) return
    setIsProcessing(true)

    let url = null

    // 1. Try to capture snapshot
    if (!isContextLost && experienceRef.current?.captureSnapshot) {
      try {
        // Race condition: 500ms timeout vs snapshot
        const snapshotPromise = experienceRef.current.captureSnapshot()
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 500))

        url = await Promise.race([snapshotPromise, timeoutPromise])
        if (!url) console.warn('Snapshot timed out or failed, proceeding without it.')
      } catch (e) {
        console.warn('Snapshot error:', e)
      }
    }

    // 2. Update state safely
    startTransition(() => {
      setSnapshotUrl(url)
      setShowSummary(true)
      setIsProcessing(false)
    })
  }, [isProcessing, isContextLost])

  const handleCloseSummary = useCallback(() => {
    setShowSummary(false)
  }, [])

  const handleConfirmOrder = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    localStorage.removeItem(STORAGE_KEY)
    setShowSummary(false)
    setSnapshotUrl(null)
  }, [])

  const handleContextLost = useCallback(() => {
    setIsContextLost(true)
  }, [])

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

        <div className="w-full lg:w-auto h-[45vh] lg:h-full lg:flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden shrink-0">

          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)',
                left: '-15%',
                top: '-15%',
              }}
              animate={{
                x: ['-10%', '20%', '-5%', '15%', '-10%'],
                y: ['-20%', '10%', '25%', '-10%', '-20%'],
                scale: [1, 1.1, 0.95, 1.05, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(34,197,94,0.2) 50%, transparent 70%)',
                right: '-10%',
                bottom: '-10%',
              }}
              animate={{
                x: ['10%', '-15%', '5%', '-20%', '10%'],
                y: ['20%', '-10%', '-15%', '10%', '20%'],
                scale: [1, 0.9, 1.1, 0.95, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute w-[450px] h-[450px] rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
                left: '30%',
                top: '40%',
              }}
              animate={{
                x: ['0%', '-25%', '20%', '-10%', '0%'],
                y: ['0%', '20%', '-15%', '25%', '0%'],
                scale: [1, 1.15, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="absolute inset-0 opacity-[0.3] pointer-events-none mix-blend-overlay z-[1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              filter: 'contrast(110%) brightness(105%)'
            }}
          />

          <Experience
            config={config}
            onSnapshotRef={experienceRef}
            onContextLost={handleContextLost}
          />
        </div>

        <div className="w-full flex-1 min-h-0 lg:flex-none lg:w-[400px] lg:h-full relative z-10 bg-white shadow-xl">
          <Interface
            config={config}
            setConfig={setConfig}
            onSnapshot={handleSnapshot}
            onReviewOrder={handleReviewOrder}
            isContextLost={isContextLost}
            isProcessing={isProcessing}
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

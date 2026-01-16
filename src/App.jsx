import React, { useState, useRef, useEffect } from 'react'
import { Experience } from './Experience'
import { Interface } from './Interface'
import { OrderSummary } from './OrderSummary'

function App() {
  const canvasRef = useRef()

  const [config, setConfig] = useState(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('strawConfig')
    return saved ? JSON.parse(saved) : {
      color: '#FF0000',
      strawType: 'Flexible', 
      endType: 'Flat',       
      length: 300,           
      diameter: '12mm',      
      qtyPerBox: '',  // Empty by default
      boxesPerCarton: '', // Empty by default
      wrapped: 'Unwrapped',
      comments: ''
    }
  })

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem('strawConfig', JSON.stringify(config))
  }, [config])

  const [showSummary, setShowSummary] = useState(false)

  const resetConfig = () => {
    const defaults = {
      color: '#FF0000',
      strawType: 'Flexible', 
      endType: 'Flat',       
      length: 300,           
      diameter: '12mm',      
      qtyPerBox: '',
      boxesPerCarton: '',
      wrapped: 'Unwrapped',
      comments: ''
    }
    setConfig(defaults)
    localStorage.removeItem('strawConfig')
    setShowSummary(false)
  }

  const handleSnapshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.setAttribute('download', 'straw-design.png')
      link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click()
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white select-none relative">
      <h1 className="absolute top-8 left-8 text-3xl font-bold z-10 text-gray-900 tracking-tight">
        3D Configurator
      </h1>

      <div className="flex-1 h-full relative cursor-move">
        <Experience 
          color={config.color} 
          strawType={config.strawType} 
          canvasRef={canvasRef}
        />
      </div>

      <Interface 
        config={config} 
        setConfig={setConfig} 
        onSnapshot={handleSnapshot}
        onAddToQuote={() => setShowSummary(true)}
      />

      <OrderSummary 
        config={config}
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={resetConfig}
      />
    </div>
  )
}

export default App

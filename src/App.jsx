import React, { useState, useRef } from 'react'
import { Experience } from './Experience'
import { Interface } from './Interface'

function App() {
  const canvasRef = useRef()

  const [config, setConfig] = useState({
    color: '#FF0000',
    strawType: 'Flexible', 
    endType: 'Flat',       
    length: 300,           
    diameter: '12mm',      
    qtyPerBox: 500,
    boxesPerCarton: 20,
    wrapped: 'Unwrapped'
  })

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
    <div className="flex w-full h-screen overflow-hidden bg-white select-none">
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
      />
    </div>
  )
}

export default App

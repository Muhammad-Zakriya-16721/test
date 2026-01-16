import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Check, Shuffle } from 'lucide-react'

export const Interface = ({
  config,
  setConfig,
  onSnapshot,
  onAddToQuote
}) => {
  const { color, strawType, endType, length, diameter, wrapped } = config
  
  const totalQty = (Number(config.qtyPerBox) || 0) * (Number(config.boxesPerCarton) || 0)
  const isMoqMet = totalQty >= 100000

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
    handleChange('color', randomColor)
  }

  const handleAddToQuote = () => {
    if (!isMoqMet) return
    onAddToQuote() // Delegated to App.jsx
  }

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="w-[450px] bg-white h-full shadow-2xl absolute right-0 top-0 overflow-y-auto overflow-x-hidden z-10 font-sans text-gray-800"
    >
      <div className="p-8 space-y-8">
        {/* ... Header, Inputs, etc. REMAIN THE SAME ... */}
        {/* I need to make sure I don't delete the content I'm not seeing here. 
            The simplest way is to KEEP the content but REMOVE the AnimatePresence block at the end. */}
        
        {/* ... (Previous content implied preserved by range selection) ... */}
        {/* Retaining Header through Button */}
        <div className="flex justify-between items-start">
             <div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Configuration</span>
               <h2 className="text-3xl font-bold mt-1 text-gray-900">Custom Straw</h2>
             </div>
             <button 
               onClick={onSnapshot}
               className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
               title="Save Design"
             >
               <Camera className="w-5 h-5 text-gray-400" />
             </button>
        </div>

        {/* Color Section */}
        <section>
            <div className="flex justify-between mb-3 text-sm font-medium">
               <span className="text-gray-500">Color</span>
               <button 
                  onClick={handleRandomColor}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase"
               >
                  <Shuffle size={12} /> Random Color
               </button>
            </div>
            
            <div className="flex gap-4">
               <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-inner ring-1 ring-black/5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 group">
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-crosshair"
                  />
                  <div className="absolute inset-0 pointer-events-none group-hover:bg-white/10 transition-colors" />
               </div>
               
               <div className="flex-1 flex flex-col justify-between">
                  <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1 mb-2">
                     <span className="text-xs text-gray-400 block">HEX</span>
                     <span className="text-sm font-mono text-gray-700">{color}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                     <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-1">
                        <span>R</span> <span>{parseInt(color.slice(1,3), 16)}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-1">
                        <span>G</span> <span>{parseInt(color.slice(3,5), 16)}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>B</span> <span>{parseInt(color.slice(5,7), 16)}</span>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-8">
             <section>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span className="text-gray-500">Straw Type</span>
                  <span className="text-gray-900">{strawType}</span>
                </div>
                <div className="space-y-2">
                   <button 
                     onClick={() => handleChange('strawType', 'Straight')}
                     className={`w-full py-3 px-4 text-xs font-bold tracking-wider border rounded transition-all uppercase ${
                       strawType === 'Straight' 
                       ? 'border-gray-900 bg-gray-900 text-white' 
                       : 'border-gray-200 text-gray-500 hover:border-gray-300'
                     }`}
                   >
                     Straight
                   </button>
                   <button 
                     onClick={() => handleChange('strawType', 'Flexible')}
                     className={`w-full py-3 px-4 text-xs font-bold tracking-wider border rounded transition-all uppercase ${
                       strawType === 'Flexible' 
                       ? 'border-gray-900 bg-gray-900 text-white' 
                       : 'border-gray-200 text-gray-500 hover:border-gray-300'
                     }`}
                   >
                     Flexible
                   </button>
                </div>
             </section>

             <section>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span className="text-gray-500">End Type</span>
                  <span className="text-gray-900 truncate ml-2">{endType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   {['Flat', 'Scoop', 'Sharp'].map(type => (
                      <button
                        key={type}
                        onClick={() => handleChange('endType', type)}
                        className={`py-3 px-1 text-[10px] font-bold border rounded transition-all uppercase ${
                           endType === type
                           ? 'border-gray-900 bg-gray-900 text-white'
                           : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                   ))}
                </div>
             </section>
          </div>

          <section>
             <label className="block text-sm font-medium text-gray-500 mb-2">Individually Wrapped?</label>
             <div className="flex rounded shadow-sm">
                {['Unwrapped', 'Paper Wrapped', 'Film Wrapped'].map((w, i) => (
                   <button
                     key={w}
                     onClick={() => handleChange('wrapped', w)}
                     className={`flex-1 py-2 text-xs font-medium border-y border-r first:border-l first:rounded-l last:rounded-r border-gray-200 transition-colors ${
                        wrapped === w || (!wrapped && i === 0) 
                        ? 'bg-gray-900 text-white font-bold border-gray-900 z-10 hover:bg-gray-800' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' 
                     }`}
                   >
                      {w}
                   </button>
                ))}
             </div>
          </section>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-8 items-end">
             <section>
                <div className="flex justify-between mb-2 text-sm font-medium">
                   <span className="text-gray-900 font-bold">Length (mm)</span>
                   <span className="text-gray-500">{length}</span>
                </div>
                <input 
                   type="number"
                   value={length}
                   onChange={(e) => handleChange('length', Number(e.target.value))}
                   className="w-full p-3 border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-gray-400 hover:border-gray-300 transition-colors"
                />
             </section>

             <section>
                <div className="flex justify-between mb-2 text-sm font-medium">
                   <span className="text-gray-900 font-bold">Diameter (mm)</span>
                   <span className="text-gray-500">| {diameter}</span>
                </div>
                <div className="flex border border-gray-200 rounded divide-x divide-gray-200 overflow-hidden">
                   {['6mm', '8mm', '10mm', '12mm'].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleChange('diameter', d)}
                        className={`flex-1 py-3 text-xs font-semibold hover:bg-gray-50 ${
                          diameter === d ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-gray-600'
                        }`}
                      >
                        {d.replace('mm','')}
                      </button>
                   ))}
                </div>
             </section>
          </div>

          <section className="space-y-4">
             <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 items-end text-center">
                <div className="text-left">
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Quantity Per Inner Box</label>
                   <input 
                     type="number"
                     placeholder="0"
                     value={config.qtyPerBox}
                     onChange={(e) => handleChange('qtyPerBox', e.target.value)}
                     className="w-full p-2 border border-gray-200 rounded text-center text-gray-700 focus:outline-none focus:border-gray-900 transition-colors" 
                   />
                </div>
                <div className="pb-3 text-gray-400 font-bold">X</div>
                <div className="text-left">
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Inner Boxes Per Carton</label>
                   <input 
                     type="number"
                     placeholder="0"
                     value={config.boxesPerCarton}
                     onChange={(e) => handleChange('boxesPerCarton', e.target.value)}
                     className="w-full p-2 border border-gray-200 rounded text-center text-gray-700 focus:outline-none focus:border-gray-900 transition-colors" 
                   />
                </div>
                <div className="pb-3 text-gray-400 font-bold">=</div>
                 <div className="text-left relative">
                   <label className="block text-[10px] uppercase font-bold text-gray-900 mb-1">Total Straw Quantity</label>
                   <div className="w-full p-2 bg-gray-50 border-none rounded text-center font-bold text-gray-900">
                      {totalQty.toLocaleString()}
                   </div>
                   {!isMoqMet && (
                    <div 
                       className="absolute top-full left-0 w-[200px] mt-2 text-[10px] leading-tight text-red-500 font-bold cursor-help"
                       title="Minimum order of 100,000 straws."
                    >
                       MOQ of 100,000 Straws
                    </div>
                 )}
                </div>
             </div>
          </section>
          
          <section>
             <label className="block text-sm font-bold text-gray-900 mb-2">Additional Comments (Optional)</label>
             <textarea 
                value={config.comments || ''}
                onChange={(e) => handleChange('comments', e.target.value)}
                className="w-full h-24 p-3 border-2 border-gray-900 rounded-sm resize-none focus:outline-none focus:bg-gray-50 text-sm"
                placeholder=""
             />
          </section>

          <div className="pt-4 mt-8">
             <button
               onClick={handleAddToQuote}
               className={`w-full py-4 rounded text-sm font-bold uppercase tracking-widest transition-all ${
                  isMoqMet
                  ? 'bg-black text-white hover:bg-gray-800 shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
               }`}
             >
               Add to Quote
             </button>
          </div>
      </div>
    </motion.div>
  )
}

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, ShoppingCart, AlertCircle, ChevronDown } from 'lucide-react'

export default function Interface({ config, setConfig, onSnapshot, onReviewOrder }) {

   const {
      color, strawType, endType, length, diameter,
      numMasterCartons, qtyPerInnerBox, innerBoxesPerCarton
   } = config;

   const [isEndTypeOpen, setIsEndTypeOpen] = useState(false);

   const totalQty = useMemo(() => {
      // Handle empty strings safely
      const m = numMasterCartons || 0;
      const q = qtyPerInnerBox || 0;
      const i = innerBoxesPerCarton || 0;
      return m * q * i;
   }, [numMasterCartons, qtyPerInnerBox, innerBoxesPerCarton]);

   const MOQLimit = 100000;
   const isbelowMOQ = totalQty < MOQLimit;
   const isInvalidLength = length < 50 || length > 999;

   const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

   const handleAddToQuote = () => {
      if (isbelowMOQ || isInvalidLength) return;
      // Instead of alerting, trigger the review modal in App.jsx
      if (onReviewOrder) onReviewOrder();
   };

   const updateConfig = (key, value) => {
      setConfig(prev => ({ ...prev, [key]: value }));
   };

   return (
      <motion.div
         initial={{ x: '100%' }}
         animate={{ x: 0 }}
         transition={{ type: 'spring', damping: 20 }}
         className="h-full w-full bg-white shadow-2xl overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col"
      >
         <div className="p-6 flex-1 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configure Straw</h2>
                  <p className="text-sm text-gray-500">Customize your bulk order</p>
               </div>
               <button
                  onClick={onSnapshot}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                  title="Take Snapshot"
                  aria-label="Take Snapshot"
               >
                  <Camera size={20} />
               </button>
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Straw Color</span>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-wider">{color}</span>
               </div>

               <div className="flex flex-wrap gap-2 items-center">
                  {[
                     { name: 'Red', hex: '#FF0000' },
                     { name: 'Blue', hex: '#0000FF' },
                     { name: 'Green', hex: '#008000' },
                     { name: 'Yellow', hex: '#FFFF00' },
                     { name: 'Black', hex: '#000000' },
                     { name: 'White', hex: '#FFFFFF' },
                  ].map((preset) => (
                     <button
                        key={preset.hex}
                        onClick={() => updateConfig('color', preset.hex)}
                        className={`h-8 w-8 rounded-full border-2 transition-all transform hover:scale-110 ${color.toUpperCase() === preset.hex.toUpperCase()
                           ? 'border-black scale-110 shadow-md ring-2 ring-offset-2 ring-gray-200'
                           : 'border-transparent shadow-sm'
                           }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                        aria-label={`Select ${preset.name}`}
                     />
                  ))}

                  <div className="relative group">
                     <label
                        htmlFor="straw-color-picker"
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-black hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
                        title="Custom Color"
                     >
                        <span className="text-lg font-bold">+</span>
                        <input
                           id="straw-color-picker"
                           name="straw-color-picker"
                           type="color"
                           value={color}
                           onChange={(e) => updateConfig('color', e.target.value)}
                           className="absolute opacity-0 pointer-events-none"
                        />
                     </label>
                  </div>
               </div>
            </div>

            {/* Straw Type */}
            <div className="space-y-3">
               <span className="text-sm font-semibold text-gray-700 block">Straw Type</span>
               <div className="grid grid-cols-2 gap-2" role="group" aria-label="Straw Type Selection">
                  {['Straight', 'Flexible', 'Extra Flexible'].map((type) => {
                     const isDisabled = endType === 'Scoop (Spoon)' && type !== 'Straight';
                     return (
                        <button
                           key={type}
                           disabled={isDisabled}
                           onClick={() => updateConfig('strawType', type)}
                           className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${strawType === type
                              ? 'bg-black text-white shadow-lg'
                              : isDisabled
                                 ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              } ${type === 'Extra Flexible' ? 'col-span-2' : ''}`}
                        >
                           {type.toUpperCase()}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* End Type */}
            <div className="space-y-3">
               <span className="text-sm font-semibold text-gray-700 uppercase tracking-tight block">End Type</span>
               <div className="relative">
                  <div
                     id="end-type"
                     role="button"
                     aria-haspopup="listbox"
                     aria-expanded={isEndTypeOpen}
                     onClick={() => setIsEndTypeOpen(!isEndTypeOpen)}
                     className="w-full flex items-center justify-between bg-white p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 cursor-pointer transition-all"
                  >
                     <span>{endType}</span>
                     <motion.div
                        animate={{ rotate: isEndTypeOpen ? 180 : 0 }}
                        className="text-gray-400"
                     >
                        <ChevronDown size={18} />
                     </motion.div>
                  </div>

                  {/* Dropdown Options List */}
                  {isEndTypeOpen && (
                     <>
                        {/* Overlay to close when clicking outside */}
                        <div
                           className="fixed inset-0 z-10"
                           onClick={() => setIsEndTypeOpen(false)}
                        />
                        <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 5 }}
                           className="absolute w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                           {['Standard', 'Scoop (Spoon)', '45 Degree Angle'].map((option) => (
                              <div
                                 key={option}
                                 onClick={() => {
                                    updateConfig('endType', option);
                                    if (option === 'Scoop (Spoon)') {
                                       updateConfig('strawType', 'Straight');
                                    }
                                    setIsEndTypeOpen(false);
                                 }}
                                 className={`p-3 text-sm cursor-pointer transition-colors ${endType === option
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                              >
                                 {option}
                              </div>
                           ))}
                        </motion.div>
                     </>
                  )}
               </div>
            </div>

            {/* Individually Wrapped? - Custom Button Group */}
            <div className="space-y-3">
               <span className="text-sm font-semibold text-gray-700 block">Individually Wrapped?</span>
               <div className="flex gap-2" role="group" aria-label="Wrapper Type Selection">
                  {['Unwrapped', 'Paper Wrapped', 'Film Wrapped'].map((wType) => (
                     <button
                        key={wType}
                        onClick={() => updateConfig('wrapperType', wType)}
                        className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold border transition-all ${config.wrapperType === wType
                           ? 'border-black bg-white text-black shadow-sm ring-1 ring-black'
                           : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                           }`}
                     >
                        {wType}
                     </button>
                  ))}
               </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
               {/* Length */}
               <div className="space-y-2">
                  <label htmlFor="straw-length" className="text-sm font-semibold text-gray-700">Length (mm)</label>
                  <input
                     id="straw-length"
                     name="straw-length"
                     type="number"
                     min="50"
                     max="999"
                     value={length}
                     onChange={(e) => {
                        const val = e.target.value;
                        updateConfig('length', val === '' ? '' : Number(val));
                     }}
                     className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${isInvalidLength ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-black/5'}`}
                  />
                  {isInvalidLength && (
                     <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
                        <AlertCircle size={10} /> 50mm - 999mm Required
                     </p>
                  )}
               </div>

               {/* Diameter */}
               <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700 block">Inner Diameter (mm)</span>
                  <div className="flex gap-1" role="group" aria-label="Diameter Selection">
                     {['3', '5.5', '8', '12'].map((d) => (
                        <button
                           key={d}
                           onClick={() => updateConfig('diameter', d)}
                           className={`flex-1 py-2 rounded border text-xs font-bold transition-colors ${diameter === d
                              ? 'border-black bg-white text-black ring-1 ring-black'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                        >
                           {d}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
               <label htmlFor="comments" className="text-sm font-bold text-gray-700">Additional Comments (Optional)</label>
               <textarea
                  id="comments"
                  name="comments"
                  value={config.comments || ''}
                  onChange={(e) => updateConfig('comments', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 text-sm focus:ring-2 focus:ring-black focus:outline-none resize-none"
                  placeholder="Enter specific requirements..."
               />
            </div>

            {/* Quantity Logic */}
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Quantity Calculation</h3>

               {/* Master Carton Inputs */}
               <div className="space-y-4">
                  <div>
                     <label htmlFor="num-master-cartons" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Quantity of Master Cartons</label>
                     <input
                        id="num-master-cartons"
                        name="num-master-cartons"
                        type="number"
                        min="1"
                        placeholder="0"
                        value={numMasterCartons}
                        onChange={(e) => {
                           const val = e.target.value;
                           updateConfig('numMasterCartons', val === '' ? '' : Number(val));
                        }}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-gray-900"
                     />
                  </div>

                  <div className="flex items-start gap-3">
                     <div className="flex-1">
                        <label htmlFor="qty-per-inner-box" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Qty / Inner Box</label>
                        <input
                           id="qty-per-inner-box"
                           name="qty-per-inner-box"
                           type="number"
                           placeholder="0"
                           value={qtyPerInnerBox}
                           onChange={(e) => {
                              const val = e.target.value;
                              updateConfig('qtyPerInnerBox', val === '' ? '' : Number(val));
                           }}
                           className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-gray-700"
                        />
                     </div>

                     {/* Centered X */}
                     <div className="flex h-[66px] items-center pt-5">
                        <span className="text-gray-400 font-bold text-lg">×</span>
                     </div>

                     <div className="flex-1">
                        <label htmlFor="inner-boxes-per-carton" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Inner Boxes / Carton</label>
                        <input
                           id="inner-boxes-per-carton"
                           name="inner-boxes-per-carton"
                           type="number"
                           placeholder="0"
                           value={innerBoxesPerCarton}
                           onChange={(e) => {
                              const val = e.target.value;
                              updateConfig('innerBoxesPerCarton', val === '' ? '' : Number(val));
                           }}
                           className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-gray-700"
                        />
                     </div>
                  </div>
               </div>

               {/* Total Result */}
               <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-baseline">
                     <span className="text-sm font-bold text-gray-700">Total Straw Quantity</span>
                     <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{formatNumber(totalQty)}</span>
                  </div>

                  {isbelowMOQ && (
                     <div className="mt-3 flex items-center justify-end gap-2 text-red-600">
                        <AlertCircle size={16} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wide">MOQ {formatNumber(MOQLimit)} Required</span>
                     </div>
                  )}
               </div>
            </div>

         </div>

         {/* Footer Actions */}
         <div className="p-6 border-t bg-gray-50">
            <button
               onClick={handleAddToQuote}
               disabled={isbelowMOQ || isInvalidLength}
               aria-label="Add to Quote"
               className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all ${isbelowMOQ || isInvalidLength
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white shadow-xl hover:bg-gray-900 hover:scale-[1.02]'
                  }`}
            >
               <ShoppingCart size={20} />
               Add to Quote
            </button>
         </div>

      </motion.div>
   )
}

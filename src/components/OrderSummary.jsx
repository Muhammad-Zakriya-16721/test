import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, FileDown, Edit3 } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function OrderSummary({ isOpen, onClose, onConfirm, data, snapshot }) {
   const [isSuccess, setIsSuccess] = useState(false);

   useEffect(() => {
      if (isOpen) setIsSuccess(false);
   }, [isOpen]);

   if (!isOpen || !data) return null;

   const {
      color, strawType, endType, length, diameter, wrapperType,
      numMasterCartons, qtyPerInnerBox, innerBoxesPerCarton, totalQty, comments
   } = data;

   const fmt = useCallback((n) => new Intl.NumberFormat('en-US').format(n), []);

   const handleConfirmAction = useCallback(() => {
      setIsSuccess(true);
      setTimeout(() => {
         onConfirm();
      }, 2000);
   }, [onConfirm]);

   const handleDownloadPDF = () => {
      const doc = new jsPDF();

      doc.setFillColor(241, 245, 249);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("ORDER CONFIGURATION", 20, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 32);

      let y = 60;
      let leftColX = 20;

      if (snapshot) {
         try {
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(20, 50, 70, 70, 3, 3, 'FD');

            const img = new Image();
            img.src = snapshot;
            const imgWidth = img.width || 1;
            const imgHeight = img.height || 1;
            const aspectRatio = imgWidth / imgHeight;

            const maxWidth = 50;
            const maxHeight = 50;
            let finalWidth, finalHeight;

            if (aspectRatio > 1) {
               finalWidth = maxWidth;
               finalHeight = maxWidth / aspectRatio;
            } else {
               finalHeight = maxHeight;
               finalWidth = maxHeight * aspectRatio;
            }

            const offsetX = 30 + (maxWidth - finalWidth) / 2;
            const offsetY = 60 + (maxHeight - finalHeight) / 2;

            doc.addImage(snapshot, 'PNG', offsetX, offsetY, finalWidth, finalHeight);

            leftColX = 100;
         } catch (e) {
            console.error(e);
         }
      }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Product Details", leftColX, 55);

      const specsYStart = 65;
      let currentY = specsYStart;
      const lineHeight = 9;

      doc.setFontSize(10);

      const drawSpecRow = (label, value) => {
         doc.setFont('helvetica', 'bold');
         doc.setTextColor(100, 116, 139);
         doc.text(label, leftColX, currentY);

         doc.setFont('helvetica', 'normal');
         doc.setTextColor(15, 23, 42);
         doc.text(String(value), leftColX + 40, currentY);

         currentY += lineHeight;
      };

      drawSpecRow("Straw Type", strawType);
      drawSpecRow("End Type", endType);
      drawSpecRow("Dimensions", `${length}mm x ${diameter}mm`);
      drawSpecRow("Color", color);
      drawSpecRow("Wrapper", wrapperType);

      if (comments) {
         currentY += 5;
         doc.setFont('helvetica', 'bold');
         doc.setTextColor(100, 116, 139);
         doc.text("Notes:", leftColX, currentY);
         currentY += 5;

         doc.setFont('helvetica', 'italic');
         doc.setTextColor(51, 65, 85);
         const splitComments = doc.splitTextToSize(comments, 90);
         doc.text(splitComments, leftColX, currentY);
         currentY += (splitComments.length * 6);
      }

      y = Math.max(140, currentY + 20);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y - 10, 170, 12, 2, 2, 'F');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("Order Volume", 25, y - 2);

      y += 10;

      const qtyCol1 = 25;
      const qtyCol2 = 80;
      const qtyCol3 = 135;

      const drawQtyBox = (x, label, value) => {
         doc.setFontSize(8);
         doc.setTextColor(100, 116, 139);
         doc.text(label.toUpperCase(), x, y + 5);

         doc.setFontSize(12);
         doc.setFont('helvetica', 'bold');
         doc.setTextColor(15, 23, 42);
         doc.text(value, x, y + 15);
      };

      drawQtyBox(qtyCol1, "Master Cartons", fmt(numMasterCartons));
      drawQtyBox(qtyCol2, "Inner Boxes / Ctn", fmt(innerBoxesPerCarton));
      drawQtyBox(qtyCol3, "Qty / Inner Box", fmt(qtyPerInnerBox));

      y += 35;

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, y - 10, 190, y - 10);

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Total Quantity", 20, y);

      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(fmt(totalQty), 190, y, { align: 'right' });

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Straws", 190, y + 6, { align: 'right' });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated by Straw Struck", 105, pageHeight - 10, { align: 'center' });

      doc.save('straw-order-config.pdf');
   };

   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-black/40 backdrop-blur-md"
               />

               <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
               >
                  <div className="bg-gray-50 border-b p-6 flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                        <p className="text-sm text-gray-500">Please verify standard configuration before exporting.</p>
                     </div>
                     <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">

                     {snapshot && (
                        <div className="w-full h-56 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-4 shadow-sm">
                           <img
                              src={snapshot}
                              alt="Straw Snapshot"
                              className="h-full w-full object-contain"
                           />
                        </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Specifications</h3>
                           <div className="space-y-3">
                              <Row label="Straw Type" value={strawType} />
                              <Row label="End Type" value={endType} />
                              <Row label="Dimensions" value={`${length}mm x ${diameter}mm`} />

                              <div className="flex justify-between items-center py-1">
                                 <span className="text-sm text-gray-600 font-medium">Color</span>
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{color}</span>
                                    <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                                 </div>
                              </div>

                              <Row label="Wrapper" value={wrapperType} highlight={wrapperType !== 'Unwrapped'} />
                           </div>

                           {comments && (
                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                                 <span className="font-bold block mb-1 text-xs uppercase opacity-70">Comments</span>
                                 "{comments}"
                              </div>
                           )}
                        </div>

                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Volume</h3>
                           <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <Row label="Master Cartons" value={fmt(numMasterCartons)} bold />
                              <Row label="Inner Boxes / Ctn" value={fmt(innerBoxesPerCarton)} />
                              <Row label="Qty / Inner Box" value={fmt(qtyPerInnerBox)} />

                              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-baseline">
                                 <span className="text-sm font-bold text-gray-600">Total Quantity</span>
                                 <span className="text-2xl font-extrabold text-gray-900">{fmt(totalQty)}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>

                  <div className={`p-4 sm:p-6 border-t bg-gray-50 flex flex-row gap-2 sm:gap-3 justify-end transition-opacity duration-300 ${isSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                     <button
                        onClick={onClose}
                        className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-white hover:border-gray-400 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base cursor-pointer"
                     >
                        <Edit3 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden sm:inline">Edit Config</span>
                        <span className="sm:hidden">Edit</span>
                     </button>

                     <button
                        onClick={handleDownloadPDF}
                        className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base cursor-pointer"
                     >
                        <FileDown size={16} className="sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Download PDF</span>
                        <span className="sm:hidden">PDF</span>
                     </button>

                     <button
                        onClick={handleConfirmAction}
                        className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base cursor-pointer"
                     >
                        <Check size={16} className="sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Confirm & Clear</span>
                        <span className="sm:hidden">Confirm</span>
                     </button>
                  </div>

                  <AnimatePresence>
                     {isSuccess && (
                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                        >
                           <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                 type: "spring",
                                 stiffness: 260,
                                 damping: 20,
                                 delay: 0.1
                              }}
                              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 mb-6"
                           >
                              <Check size={48} strokeWidth={4} />
                           </motion.div>
                           <motion.h3
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-2xl font-black text-gray-900"
                           >
                              Order Confirmed!
                           </motion.h3>
                           <motion.p
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-gray-500 mt-2"
                           >
                              Clearing configuration...
                           </motion.p>
                        </motion.div>
                     )}
                  </AnimatePresence>


               </motion.div>
            </div>
         )}
      </AnimatePresence>
   )
}

const Row = ({ label, value, bold = false, highlight = false }) => (
   <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-900'} ${highlight ? 'text-blue-600 font-bold' : ''}`}>
         {value}
      </span>
   </div>
)

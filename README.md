# B2B 3D Straw Configurator

An interactive 3D configurator for B2B straw orders, built with React, Three.js, and Tailwind CSS. This application allows users to customize straw specifications, visualize them in real-time, and generate PDF quotes.

## Features

- **Real-time 3D Visualization**: Interactive 3D model that updates instantly with configuration changes.
- **Dynamic Customization**:
  - **Sizing**: Length (50mm - 999mm) and Diameter options.
  - **Appearance**: Custom colors, wrapper types (Paper, Film, Unwrapped).
  - **Types**: Flexible vs. Straight straws.
- **Visual Effects**:
  - Procedural textures for paper and film wrappers.
  - Realistic lighting, shadows, and materials.
  - Smooth animations (Levitation, Auto-rotation).
- **Snapshot Generation**: Capture high-quality images of the configured product.
- **Order Management**:
  - MOQ validation logic.
  - Order Summary Modal.
  - PDF Quote Generation (Invoice style).
- **Persistence**: automatically saves your configuration to local storage.

## Tech Stack

- **Frontend Framework**: React 19 (Vite)
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd straw-configurator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

- `src/Experience.jsx`: Main 3D scene setup (Lights, Camera, Controls).
- `src/StrawModel.jsx`: The 3D straw model component with logic for scaling, materials, and bending.
- `src/Interface.jsx`: Control panel for user inputs and configuration.
- `src/OrderSummary.jsx`: Modal component for reviewing orders and exporting PDFs.
- `src/utils/textureUtils.js`: Procedural texture generation (Paper, Film, Concrete).

---
*Built for Advanced Configurator Portfolio.*

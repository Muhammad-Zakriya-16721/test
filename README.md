[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen)](https://test-2-alpha-three.vercel.app/)

# B2B Straw Configurator

A high-performance, interactive 3D configurator for B2B straw orders, built with **React**, **Three.js**, and **Tailwind CSS**.

## ✨ Features

- **Interactive 3D Preview**: Real-time rendering of straws with customizable parameters.
- **Custom "Pour & Sip" Loader**: Delightful SVG animation for a polished loading experience.
- **Lag-Free Performance**: Smart asset preloading ensures instant configuration switching (`useGLTF.preload`).
- **Configuration Options**:
  - **Straw Type**: Straight, Flexible, Extra Flexible.
  - **End Type**: Standard, Scoop (Spoon), 45 Degree Angle.
  - **Materials & Colors**: Preset colors or custom hex picker.
  - **Wrappers**: Unwrapped, Paper Wrapped, Film Wrapped.
  - **Dimensions**: Custom Length (50mm-999mm) and Diameter.
- **Order Management**:
  - **Real-time Quantity Calculator**: Handles Master Cartons and Inner Boxes logic.
  - **Visual Order Summary**: Review specs with a generated snapshot of your configured straw.
  - **PDF Export**: Professional-grade invoice generation with integrated product visualization.
  - **Session Persistence**: LocalStorage ensures you never lose your work on accidental reload.
- **Responsive & Polished UI**:
  - Beautiful, app-like interface with **Framer Motion** animations.
  - Fully responsive design for Desktop and Mobile.
  - Optimized interactive states (Hover, Focus, Active).

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Language**: JavaScript (ES6+)
- **Build Tool**: Vite
- **3D Engine**: @react-three/fiber, @react-three/drei, Three.js
- **Styling**: Tailwind CSS v4, clsx
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Generation**: jsPDF

## 🚀 Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Start Development Server**

    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/         # Core application components
│   ├── Experience.jsx  # 3D Scene setup
│   ├── Interface.jsx   # UI controls for configuration
│   ├── Loader.jsx      # Custom loading screen
│   ├── OrderSummary.jsx# Modal for review and export
│   └── StrawModel.jsx  # Dynamic 3D straw logic
├── utils/              # Helper functions (textures, etc.)
├── App.jsx             # Main application entry
└── main.jsx            # React root
```

---

_Generated for B2B Client Portfolio._

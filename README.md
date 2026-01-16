# 3D Straw Configurator

![Project Banner](public/straw-design.png)
> *Note: Replace the above image path with an actual screenshot of your application if available, or generate one using the snapshot feature.*

A professional, interactive 3D product configurator for B2B straw orders. Built with **React**, **Three.js (React Three Fiber)**, and **Tailwind CSS**, this application allows users to customize, visualize, and generate quotes for bulk straw orders with real-time feedback.

## ✨ Key Features

-   **Interactive 3D Visualization**: Real-time rendering of the straw model with dynamic updates for color, geometry (Straight vs. Flexible), and dimensions.
-   **Deep Customization**:
    -   **Type**: Toggle between Straight and Flexible (with realistic bend geometry).
    -   **Color**: Pick any color using a visual gradient picker or "Random Color" generator.
    -   **Ends**: Choose between Flat, Scoop, or Sharp ends.
    -   **Dimensions**: Custom length and preset diameters (6mm - 12mm).
    -   **Wrapping**: Visualize wrapping options (Unwrapped, Paper, Film).
-   **Smart Quantity Logic**:
    -   Calculates total straws based on "Qty Per Box" × "Boxes Per Carton".
    -   **MOQ Validation**: Enforces a Minimum Order Quantity (MOQ) of 100,000 units with helpful warnings.
-   **Persistence**: Automatically saves your configuration to the browser's `localStorage` so you never lose your work on refresh.
-   **Order Management**:
    -   **Order Summary**: A focused, modal-based review screen.
    -   **PDF Export**: Generate professional PDF quotes containing all specifications, timestamps, and order details.
    -   **Reset**: One-click reset to clear configuration and start fresh.
-   **Visual Polish**:
    -   Smooth animations with **Framer Motion**.
    -   Responsive, clean UI with **Tailwind CSS**.
    -   Snapshot feature to download a standard PNG image of the 3D design.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (Vite)
-   **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Muhammad-Zakriya-16721/test.git
    cd straw-configurator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```text
src/
├── App.jsx              # Main application layout, state management, and persistence logic
├── Experience.jsx       # 3D Scene setup (Lights, Camera, OrbitControls)
├── StrawModel.jsx       # The dynamic 3D Straw component
├── Interface.jsx        # Sidebar UI for configuration controls
├── OrderSummary.jsx     # Modal component for Summary and PDF generation
└── index.css            # Global styles and Tailwind imports
```

## 🎨 Usage Guide

1.  **Customize**: Use the sidebar to adjust the straw's type, color, dimensions, and other attributes.
2.  **Visualize**: Rotate and zoom the 3D model to inspect details like the flexible joint or end cut.
3.  **Snapshot**: Click the Camera icon in the top right of the sidebar to save a PNG image of your design.
4.  **Quantity**: Enter your packaging details. If the total is below 100k, an MOQ warning will appear.
5.  **Quote**: Once ready, click "Add to Quote". Review your specs in the modal.
6.  **Export**: Click "Download PDF" to save a formal record of your configuration.
7.  **Confirm**: Click "Confirm Order" to simulate submission and reset the app for a new order.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import { StrawModel } from './StrawModel'

export const Experience = ({ color, strawType, canvasRef }) => {
  return (
    <div className="w-full h-full bg-gray-100 relative">
      <Canvas
        ref={canvasRef} 
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
        shadows
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <group>
           <Center position={[-2, 0, 0]}>
              <StrawModel 
                color={color} 
                strawType={strawType} 
                scale={[25, 25, 25]} 
              />
           </Center>
        </group>

        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  )
}

import { useRef, useImperativeHandle, forwardRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, SoftShadows } from '@react-three/drei'
import { StrawModel } from './StrawModel'
import * as THREE from 'three'
import { generateConcreteTexture } from './utils/textureUtils'

const Scene = forwardRef(({ config }, ref) => {
  const { gl, scene, camera } = useThree()

  // Generate Procedural Textures once
  const concreteTexture = useMemo(() => generateConcreteTexture(), [])

  // Auto-Rotation
  const [autoRotate, setAutoRotate] = useState(false)
  const timerRef = useRef(null)
  const strawRef = useRef()
  const controlsRef = useRef()

  const stopRotation = () => {
    setAutoRotate(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const startRestartTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setAutoRotate(true)
    }, 2000) // 2s Inactivity
  }

  // Rotation Timer
  useEffect(() => {
    startRestartTimer()
    return () => stopRotation()
  }, [])

  // Levitation Animation
  useFrame((state) => {
    if (!strawRef.current) return
    const time = state.clock.getElapsedTime()
    const baseY = 0 // Relative to parent group

    if (autoRotate) {
      // Float up and down gently
      const floatOffset = Math.sin(time * 0.5) * 0.15
      // Smoothly lerp to the animated position
      strawRef.current.position.y = THREE.MathUtils.lerp(
        strawRef.current.position.y,
        baseY + floatOffset,
        0.02
      )
    } else {
      // Smoothly return to base position
      strawRef.current.position.y = THREE.MathUtils.lerp(
        strawRef.current.position.y,
        baseY,
        0.1
      )
    }
  })

  // Expose snapshot functionality to parent
  useImperativeHandle(ref, () => ({
    takeSnapshot: () => {
      if (controlsRef.current) {
        // Save current camera and straw state
        const oldPos = camera.position.clone()
        const oldRot = camera.rotation.clone()
        const oldStrawY = strawRef.current ? strawRef.current.position.y : 0

        // Reset to default "First" position
        controlsRef.current.reset()
        if (strawRef.current) strawRef.current.position.y = 0
        controlsRef.current.update()

        // Render and capture
        gl.render(scene, camera)
        const dataUrl = gl.domElement.toDataURL('image/png')

        // Restore state
        camera.position.copy(oldPos)
        camera.rotation.copy(oldRot)
        if (strawRef.current) strawRef.current.position.y = oldStrawY
        controlsRef.current.update()

        const link = document.createElement('a')
        link.setAttribute('download', 'straw-design.png')
        link.setAttribute('href', dataUrl)
        link.click()
      }
    }
  }))

  return (
    <>
      {/* Background: Transparent (Relies on App.jsx CSS Gradient) */}

      {/* Lighting: Soft Studio Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* ... */}

      <Environment preset="studio" intensity={1.0} blur={0.6} />

      <group position={[0, -1, 0]}>
        <group ref={strawRef}>
          <StrawModel
            color={config.color}
            strawType={config.strawType}
            wrapperType={config.wrapperType}
            length={config.length}
            diameter={config.diameter}
            position={[0, -1, 0]}
            scale={[30, 30, 30]}
            rotation={[0.1, Math.PI / 1.5, 0]}
          />
        </group>

        {/* Platform: Custom Beveled Satin Aluminum */}
        <mesh position={[0, -2.5, 0]} receiveShadow>
          {/* Custom Lathe Geometry for Beveled Edge */}
          <latheGeometry
            args={[
              (() => {
                const points = []
                const radius = 3      // Reduced size (was 4)
                const height = 0.5    // Thickness
                const bevel = 0.2     // Chamfer size

                // 1. Center Bottom
                points.push(new THREE.Vector2(0, 0))
                // 2. Bottom Edge
                points.push(new THREE.Vector2(radius, 0))
                // 3. Side (Start of Bevel)
                points.push(new THREE.Vector2(radius, height - bevel))
                // 4. Top Edge (End of Bevel)
                points.push(new THREE.Vector2(radius - bevel, height))
                // 5. Center Top
                points.push(new THREE.Vector2(0, height))

                return points
              })(),
              64 // Segments
            ]}
          />
          <meshPhysicalMaterial
            // Base Material
            map={concreteTexture}
            color="#eeeeee"

            // Textures
            roughnessMap={concreteTexture}
            bumpMap={concreteTexture}
            bumpScale={0.02}

            roughness={0.8}
            metalness={0.0}
            clearcoat={0.0}
            envMapIntensity={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Grounding Contact Shadow */}
        <ContactShadows
          position={[0, -2.76, 0]}
          opacity={0.75}
          scale={20}
          blur={2.0}
          far={5}
          color="#1a1a1a"
        />
      </group>

      <Environment preset="studio" intensity={1.0} blur={0.6} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={15}

        // Auto-Rotation
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        onStart={stopRotation}
        onEnd={startRestartTimer}
      />
    </>
  )
})

export default function Experience({ config, onSnapshotRef }) {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 4, 10], fov: 45 }}
      // ACESFilmicToneMapping for cinematic lighting
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true
      }}
    >
      <Scene config={config} ref={onSnapshotRef} />
    </Canvas>
  )
}
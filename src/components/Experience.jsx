import { useRef, useImperativeHandle, forwardRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, SoftShadows, useTexture } from '@react-three/drei'
import { StrawModel } from './StrawModel'
import * as THREE from 'three'
import { generateConcreteTexture } from '../utils/textureUtils'



function LogoOverlay(props) {
  const texture = useTexture('logo.png')
  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 2]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.5}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

const Scene = forwardRef(({ config }, ref) => {
  const { gl, scene, camera } = useThree()

  const concreteTexture = useMemo(() => generateConcreteTexture(), [])

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
    }, 2000)
  }

  useEffect(() => {
    startRestartTimer()
    return () => stopRotation()
  }, [])

  useFrame((state) => {
    if (!strawRef.current) return
    const time = state.clock.getElapsedTime()
    const baseY = 0

    if (autoRotate) {
      const floatOffset = Math.sin(time * 0.5) * 0.15
      strawRef.current.position.y = THREE.MathUtils.lerp(
        strawRef.current.position.y,
        baseY + floatOffset,
        0.02
      )
    } else {
      strawRef.current.position.y = THREE.MathUtils.lerp(
        strawRef.current.position.y,
        baseY,
        0.1
      )
    }
  })

  useImperativeHandle(ref, () => {
    const getSnapshot = () => {
      if (!controlsRef.current) return null

      const oldPos = camera.position.clone()
      const oldRot = camera.rotation.clone()
      const oldStrawY = strawRef.current ? strawRef.current.position.y : 0

      controlsRef.current.reset()
      if (strawRef.current) strawRef.current.position.y = 0
      controlsRef.current.update()

      gl.render(scene, camera)
      const dataUrl = gl.domElement.toDataURL('image/png')

      camera.position.copy(oldPos)
      camera.rotation.copy(oldRot)
      if (strawRef.current) strawRef.current.position.y = oldStrawY
      controlsRef.current.update()

      return dataUrl
    }

    return {
      getSnapshot,
      takeSnapshot: () => {
        const dataUrl = getSnapshot()
        if (dataUrl) {
          const link = document.createElement('a')
          link.setAttribute('download', 'straw-design.png')
          link.setAttribute('href', dataUrl)
          link.click()
        }
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      <Environment preset="studio" intensity={1.0} blur={0.6} />

      <group position={[0, -1, 0]}>
        <group ref={strawRef}>
          <StrawModel
            color={config.color}
            strawType={config.strawType}
            endType={config.endType}
            wrapperType={config.wrapperType}
            length={config.length}
            diameter={config.diameter}
            position={[0, -1, 0]}
            scale={[30, 30, 30]}
            rotation={[0.1, Math.PI / 1.5, 0]}
          />
        </group>

        <mesh position={[0, -2.5, 0]} receiveShadow>
          <latheGeometry
            args={[
              (() => {
                const points = []
                const radius = 3
                const height = 0.5
                const bevel = 0.2

                points.push(new THREE.Vector2(0, 0))
                points.push(new THREE.Vector2(radius, 0))
                points.push(new THREE.Vector2(radius, height - bevel))
                points.push(new THREE.Vector2(radius - bevel, height))
                points.push(new THREE.Vector2(0, height))

                return points
              })(),
              64
            ]}
          />
          <meshPhysicalMaterial
            map={concreteTexture}
            color="#eeeeee"

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

        <LogoOverlay position={[0, -2.5 + 0.5 + 0.001, 0]} />


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
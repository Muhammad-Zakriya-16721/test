import React, { useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function StrawModel({ color, strawType, ...props }) {
  const { nodes } = useGLTF('/straw.glb')
  const topRef = useRef()
  
  const { pivot, dimensions, cylinderGeo } = useMemo(() => {
    if (!nodes.straw_flex || !nodes.straw_top) return { pivot: new THREE.Vector3(), dimensions: null, cylinderGeo: null }

    const flexGeo = nodes.straw_flex.geometry
    if (!flexGeo.boundingBox) flexGeo.computeBoundingBox()
    
    const flexMax = flexGeo.boundingBox.max
    const flexMin = flexGeo.boundingBox.min
    const height = flexMax.y - flexMin.y
    const width = flexMax.x - flexMin.x
    const depth = flexMax.z - flexMin.z
    const radius = Math.max(width, depth) / 2
    const flexCenter = new THREE.Vector3()
    flexGeo.boundingBox.getCenter(flexCenter)
    
    const geo = new THREE.CylinderGeometry(radius, radius, height, 32, 1)
    geo.translate(flexCenter.x, flexCenter.y, flexCenter.z)


    const topGeo = nodes.straw_top.geometry
    if (!topGeo.boundingBox) topGeo.computeBoundingBox()
    const topMin = topGeo.boundingBox.min
    const topCenter = new THREE.Vector3()
    topGeo.boundingBox.getCenter(topCenter)
    
    const localPivotY = topMin.y
    const localPivot = new THREE.Vector3(topCenter.x, localPivotY, topCenter.z)
    
    const topScale = nodes.straw_top.scale || new THREE.Vector3(1,1,1)
    const topPos = nodes.straw_top.position || new THREE.Vector3(0,0,0)
    
    const pivot = localPivot.clone().multiply(topScale).add(topPos)
    
    return { pivot, dimensions: { radius, center: flexCenter }, cylinderGeo: geo }
  }, [nodes])

  const materialParams = {
    color: color,
    roughness: 0.3, 
    metalness: 0.1
  }

  const rotation = strawType === 'Flexible' ? [0, 0, -70 * (Math.PI / 180)] : [0, 0, 0]
  const groupPosition = strawType === 'Flexible' ? pivot : [0, 0, 0]

  const meshPosition = useMemo(() => {
     if (!nodes.straw_top) return [0,0,0]
     if (strawType === 'Flexible') {
        const originalPos = nodes.straw_top.position.clone()
        return originalPos.sub(pivot)
     }
     return nodes.straw_top.position
  }, [strawType, pivot, nodes])

  return (
    <group {...props} dispose={null}>
      {nodes.straw_bottom && (
        <mesh 
           geometry={nodes.straw_bottom.geometry} 
           position={nodes.straw_bottom.position} 
           rotation={nodes.straw_bottom.rotation} 
           scale={nodes.straw_bottom.scale}
        >
           <meshStandardMaterial {...materialParams} />
        </mesh>
      )}

      {nodes.straw_flex && (
         <mesh 
            geometry={strawType === 'Flexible' ? nodes.straw_flex.geometry : cylinderGeo}
            position={nodes.straw_flex.position}
            rotation={nodes.straw_flex.rotation}
            scale={nodes.straw_flex.scale}
         >
            <meshStandardMaterial {...materialParams} />
         </mesh>
      )}

      {nodes.straw_top && (
        <group 
          ref={topRef}
          position={groupPosition} 
          rotation={rotation}
        >
          <mesh 
            geometry={nodes.straw_top.geometry} 
            position={meshPosition}
            rotation={nodes.straw_top.rotation}
            scale={nodes.straw_top.scale}
          >
             <meshStandardMaterial {...materialParams} />
          </mesh>
          
          {strawType === 'Flexible' && dimensions && (
             <mesh 
                position={[0,0,0]}
                scale={nodes.straw_flex.scale}
             >
                <sphereGeometry args={[dimensions.radius * 1.1, 32, 32]} />
                <meshStandardMaterial {...materialParams} />
             </mesh>
          )}
        </group>
      )}
    </group>
  )
}

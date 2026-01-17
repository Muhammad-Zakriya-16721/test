import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/Scoop-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Shell5.geometry} material={materials['Material #25']} />
    </group>
  )
}

useGLTF.preload('/Scoop-transformed.glb')

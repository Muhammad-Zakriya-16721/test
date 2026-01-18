import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/All-Straws.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.straw_flex.geometry} material={materials.straw_material} position={[0, 0.162, 0]} />
      <mesh geometry={nodes.straw_bottom.geometry} material={materials.straw_material} position={[0, 0.162, 0]} />
      <mesh geometry={nodes.straw_top.geometry} material={materials.straw_material} position={[0, 0.162, 0]} />
      <mesh geometry={nodes.Straw_Long_Flex.geometry} material={materials['Material.006']} position={[0.012, 0.128, 0.052]} />
      <mesh geometry={nodes.straw_top_bevel.geometry} material={materials.straw_material} position={[0, 0.162, 0.026]} />
      <mesh geometry={nodes.scoop_top.geometry} material={materials['Material.005']} position={[-0.003, 0.106, -0.017]} rotation={[0, 0, -Math.PI]} scale={[-0.493, -1.044, -0.493]} />
      <mesh geometry={nodes.wrap_paper.geometry} material={materials.Material} position={[-0.005, 0.16, -0.061]} rotation={[0, -0.073, 0]} scale={[-0.003, -0.051, -0.005]} />
      <mesh geometry={nodes.wrap_film.geometry} material={materials['Material.014']} position={[-0.01, 0.16, -0.112]} rotation={[0, -0.073, 0]} scale={[-0.003, -0.051, -0.005]} />
    </group>
  )
}

useGLTF.preload('/All-Straws.glb')
import React, { useLayoutEffect, useState, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
   generatePaperTexture,
   generateFilmTexture,
} from "./utils/textureUtils";

export function StrawModel({
   color,
   strawType,
   endType,
   wrapperType,
   length,
   diameter,
   ...props
}) {
   const { nodes } = useGLTF("/straw.glb");

   const paperMap = useMemo(() => generatePaperTexture(), []);
   const filmMap = useMemo(() => generateFilmTexture(), []);

   const lengthScale = useMemo(() => {
      const clampedLength = Math.max(200, Math.min(400, length || 300));
      return 0.8 + ((clampedLength - 200) / 200) * 0.4;
   }, [length]);

   const radiusMultiplier = useMemo(() => {
      const diameterMap = {
         3: 0.5,
         5.5: 0.7,
         8: 0.85,
         12: 1.0,
      };
      return diameterMap[diameter] || 1.0;
   }, [diameter]);

   const parts = useMemo(() => {
      const findAndPrepare = (name) => {
         let node = nodes[name];
         if (!node) return null;
         const clone = node.clone();
         clone.position.set(0, 0, 0);
         clone.rotation.set(0, 0, 0);
         clone.scale.set(1, 1, 1);
         return clone;
      };
      return {
         bottom: findAndPrepare("straw_bottom"),
         flex: findAndPrepare("straw_flex"),
         top: findAndPrepare("straw_top"),
      };
   }, [nodes]);

   const [measurements, setMeasurements] = useState(null);

   useLayoutEffect(() => {
      if (parts.bottom && parts.flex && parts.top) {
         const getMeshInfo = (obj) => {
            let mesh = obj;
            if (!mesh.isMesh) {
               obj.traverse((c) => {
                  if (c.isMesh && !mesh.isMesh) mesh = c;
               });
            }
            if (mesh && mesh.geometry) {
               if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
               const box = mesh.geometry.boundingBox;
               return {
                  minY: box.min.y,
                  height: box.max.y - box.min.y,
                  width: box.max.x - box.min.x,
               };
            }
            return { minY: 0, height: 1, width: 0.1 };
         };

         const bInfo = getMeshInfo(parts.bottom);
         const fInfo = getMeshInfo(parts.flex);
         const tInfo = getMeshInfo(parts.top);

         setMeasurements({
            bottom: bInfo,
            flex: fInfo,
            top: tInfo,
            radius: bInfo.width / 2,
         });

         const mat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide,
         });
         [parts.bottom, parts.flex, parts.top].forEach((p) => {
            p.traverse((c) => {
               if (c.isMesh) {
                  c.material = mat;
                  c.castShadow = true;
                  c.receiveShadow = true;
               }
            });
         });
      }
   }, [parts, color]);

   const config = useMemo(() => {
      if (!measurements) return null;
      let rotation = 0;
      let flexScale = 1;
      let showFlex = true;
      let showCylinder = false;

      if (strawType === "Straight") {
         showFlex = false;
         showCylinder = true;
      } else if (strawType === "Flexible") {
         rotation = Math.PI / 4;
      } else if (strawType === "Extra Flexible") {
         rotation = (70 * Math.PI) / 180;
         flexScale = 2;
      }
      return { rotation, flexScale, showFlex, showCylinder };
   }, [strawType, measurements]);

   const paperMaterial = useMemo(
      () =>
         new THREE.MeshPhysicalMaterial({
            map: paperMap,
            roughness: 0.8,
            metalness: 0.0,
            side: THREE.DoubleSide,
            color: "#e8dcc0",
         }),
      [paperMap],
   );

   const filmMaterial = useMemo(
      () =>
         new THREE.MeshStandardMaterial({
            map: filmMap,
            side: THREE.DoubleSide,
            color: "#f0f0f5",
         }),
      [filmMap],
   );

   if (!measurements || !config) return null;

   const { bottom, flex, top, radius } = measurements;
   const { rotation, flexScale, showFlex, showCylinder } = config;

   const neckHideAmount = 0;

   const WrapperPart = ({
      object,
      scale = [1.1, 1.03, 1.1],
      position = [0, 0, 0],
      childScale = [1, 1, 1],
   }) => {
      const isVisible =
         wrapperType === "Paper Wrapped" || wrapperType === "Film Wrapped";
      if (!isVisible) return null;

      const material =
         wrapperType === "Paper Wrapped" ? paperMaterial : filmMaterial;

      const wrappedObj = useMemo(() => {
         const clone = object.clone();
         clone.traverse((c) => {
            if (c.isMesh) {
               c.material = material;
               c.castShadow = true;
               c.receiveShadow = true;
            }
         });
         return clone;
      }, [object, material]);

      return (
         <group position={position} scale={scale}>
            <primitive object={wrappedObj} scale={childScale} />
         </group>
      );
   };

   if (endType === 'Scoop (Spoon)') {
      return (
         <group {...props} dispose={null}>
            <group
               rotation={[Math.PI, 0, 0]}
               scale={[radiusMultiplier, lengthScale, radiusMultiplier]}
               position={[0, 0, 0]}
            >
               <ScoopFullModel
                  color={color}
                  wrapperType={wrapperType}
                  paperMaterial={paperMaterial}
                  filmMaterial={filmMaterial}
               />
            </group>
         </group>
      )
   }

   return (
      <group {...props} dispose={null}>
         <group
            position={[0, 0, 0]}
            scale={[radiusMultiplier, lengthScale, radiusMultiplier]}
         >
            <group position={[0, -bottom.minY, 0]}>
               <primitive object={parts.bottom} />
               <WrapperPart object={parts.bottom} />
            </group>
         </group>

         <group
            position={[0, bottom.height * lengthScale, 0]}
            rotation={[rotation, 0, 0]}
         >
            {!showCylinder && endType !== 'Scoop (Spoon)' && (
               <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[radius * 0.96 * radiusMultiplier, 32, 32]} />
                  <meshStandardMaterial
                     color={color}
                     roughness={0.4}
                     metalness={0.1}
                  />
               </mesh>
            )}

            {showCylinder && endType !== 'Scoop (Spoon)' && (
               <mesh position={[0, flex.height / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry
                     args={[
                        radius * 0.98 * radiusMultiplier,
                        radius * 0.98 * radiusMultiplier,
                        flex.height,
                        32,
                     ]}
                  />
                  <meshStandardMaterial
                     color={color}
                     roughness={0.4}
                     metalness={0.1}
                  />
               </mesh>
            )}

            {showFlex && (
               <group
                  scale={[radiusMultiplier, flexScale, radiusMultiplier]}
                  position={[0, -flex.minY - neckHideAmount, 0]}
               >
                  <primitive object={parts.flex} />
                  <WrapperPart object={parts.flex} />
               </group>
            )}

            <group
               position={[0, flex.height * flexScale - neckHideAmount - 0.01, 0]}
            >
               <group
                  position={[0, -top.minY, 0]}
                  scale={[radiusMultiplier, 1, radiusMultiplier]}
               >
                  <primitive object={parts.top} />
                  <WrapperPart object={parts.top} />
               </group>
            </group>
         </group>
      </group>
   );
}

function ScoopFullModel({ color, wrapperType, paperMaterial, filmMaterial }) {
   const { nodes } = useGLTF('/Scoop-transformed.glb')
   const geometry = nodes.Shell5.geometry

   const Wrapper = useMemo(() => {
      if (wrapperType !== 'Paper Wrapped' && wrapperType !== 'Film Wrapped') return null
      const mat = wrapperType === 'Paper Wrapped' ? paperMaterial : filmMaterial
      // Wrapper needs to be slightly larger
      return (
         <mesh geometry={geometry} scale={[1.05, 1.05, 1.05]}>
            <primitive object={mat} attach="material" />
         </mesh>
      )
   }, [wrapperType, paperMaterial, filmMaterial, geometry])

   return (
      <group dispose={null}>
         <mesh
            geometry={geometry}
            castShadow
            receiveShadow
            scale={[0.027, 0.021, 0.027]}
            rotation={[0, 0, 0]}
            position={[0, -0.21, 0]}
         >
            <meshStandardMaterial
               color={color}
               roughness={0.2}
               metalness={0.1}
               side={THREE.DoubleSide}
            />
         </mesh>

         {Wrapper && (
            <group
               scale={[0.027, 0.021, 0.027]}
               rotation={[0, 0, 0]}
               position={[0, -0.21, 0]}
            >
               {Wrapper}
            </group>
         )}
      </group>
   )
}

useGLTF.preload('/straw.glb')
useGLTF.preload('/Scoop-transformed.glb')

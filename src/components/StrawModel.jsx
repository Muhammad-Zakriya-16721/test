import React, { useLayoutEffect, useState, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { generatePaperTexture } from "../utils/textureUtils";

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
   const { nodes: allStrawNodes, materials: allStrawMaterials } = useGLTF("/All-Straws.glb");

   const lengthScale = useMemo(() => {
      const clampedLength = Math.max(200, Math.min(400, length || 300));
      return 0.8 + ((clampedLength - 200) / 200) * 0.4;
   }, [length]);

   const paperMap = useMemo(() => generatePaperTexture(), []);

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
      let useExtraFlexModel = false;
      let use45DegreeTop = false;

      if (endType === '45 Degree Angle') {
         showFlex = false;
         showCylinder = true;
         use45DegreeTop = true;
      } else if (strawType === "Straight") {
         showFlex = false;
         showCylinder = true;
      } else if (strawType === "Flexible") {
         rotation = Math.PI / 4;
      } else if (strawType === "Extra Flexible") {
         rotation = (70 * Math.PI) / 180;
         showFlex = false;
         useExtraFlexModel = true;
      }
      return { rotation, flexScale, showFlex, showCylinder, useExtraFlexModel, use45DegreeTop };
   }, [strawType, endType, measurements]);

   if (!measurements || !config) return null;

   const { bottom, flex, top, radius } = measurements;
   const { rotation, flexScale, showFlex, showCylinder, useExtraFlexModel, use45DegreeTop } = config;

   const neckHideAmount = 0;

   if (wrapperType === 'Paper Wrapped') {
      return (
         <group {...props} dispose={null}>
            <group
               scale={[radiusMultiplier * 0.008, lengthScale * 0.052, radiusMultiplier * 0.008]}
               position={[0, 0.05, 0]}
            >
               <mesh
                  geometry={allStrawNodes.wrap_paper.geometry}
                  castShadow
                  receiveShadow
               >
                  <meshPhysicalMaterial
                     map={paperMap}
                     bumpMap={paperMap}
                     bumpScale={0.002}
                     color="#d8cbb0"
                     roughness={0.85}
                     metalness={0.0}
                     clearcoat={0.05}
                     clearcoatRoughness={0.8}
                     side={THREE.DoubleSide}
                     flatShading={false}
                  />
               </mesh>
            </group>
         </group>
      );
   }

   if (wrapperType === 'Film Wrapped') {
      return (
         <group {...props} dispose={null}>
            <group
               scale={[radiusMultiplier * 0.008, lengthScale * 0.052, radiusMultiplier * 0.008]}
               position={[0, 0.05, 0]}
            >
               <mesh
                  geometry={allStrawNodes.wrap_film.geometry}
                  material={allStrawMaterials['Material.014']}
                  castShadow
                  receiveShadow
               />
            </group>

            {endType !== 'Scoop (Spoon)' && (
               <group
                  position={[0, 0, 0]}
                  scale={[radiusMultiplier, lengthScale, radiusMultiplier]}
               >
                  <group position={[0, -bottom.minY, 0]}>
                     <primitive object={parts.bottom} />
                  </group>
               </group>
            )}

            <group
               position={[0, bottom.height * lengthScale, 0]}
            >
               {strawType === 'Straight' && endType !== 'Scoop (Spoon)' && endType !== '45 Degree Angle' && (
                  <>
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

                     <group position={[0, flex.height - 0.01, 0]}>
                        <group
                           position={[0, -top.minY, 0]}
                           scale={[radiusMultiplier, 1, radiusMultiplier]}
                        >
                           <primitive object={parts.top} />
                        </group>
                     </group>
                  </>
               )}

               {endType === '45 Degree Angle' && (
                  <group position={[0, -0.01, 0]}>
                     <mesh
                        geometry={allStrawNodes.straw_top_bevel.geometry}
                        scale={[radiusMultiplier, 1, radiusMultiplier]}
                        castShadow
                        receiveShadow
                     >
                        <meshStandardMaterial
                           color={color}
                           roughness={0.4}
                           metalness={0.1}
                           side={THREE.DoubleSide}
                        />
                     </mesh>
                  </group>
               )}

               {strawType === 'Flexible' && endType !== 'Scoop (Spoon)' && (
                  <>
                     <group
                        scale={[radiusMultiplier, 1, radiusMultiplier]}
                        position={[0, -flex.minY, 0]}
                     >
                        <mesh
                           geometry={allStrawNodes.straw_flex.geometry}
                           castShadow
                           receiveShadow
                        >
                           <meshStandardMaterial
                              color={color}
                              roughness={0.4}
                              metalness={0.1}
                              side={THREE.DoubleSide}
                           />
                        </mesh>
                     </group>

                     <group position={[0, flex.height - 0.01, 0]}>
                        <group
                           position={[0, -top.minY, 0]}
                           scale={[radiusMultiplier, 1, radiusMultiplier]}
                        >
                           <primitive object={parts.top} />
                        </group>
                     </group>
                  </>
               )}

               {strawType === 'Extra Flexible' && endType !== 'Scoop (Spoon)' && (
                  <group
                     scale={[radiusMultiplier, 1, radiusMultiplier]}
                     position={[0, -flex.minY, 0]}
                  >
                     <mesh
                        geometry={allStrawNodes.Straw_Long_Flex.geometry}
                        position={[0, -0.050, 0]}
                        scale={[1.2, 1.1, 1.2]}
                        castShadow
                        receiveShadow
                     >
                        <meshStandardMaterial
                           color={color}
                           roughness={0.4}
                           metalness={0.1}
                           side={THREE.DoubleSide}
                        />
                     </mesh>
                  </group>
               )}

               {endType === 'Scoop (Spoon)' && (
                  <group
                     rotation={[Math.PI, 0, 0]}
                     scale={[radiusMultiplier, lengthScale, radiusMultiplier]}
                     position={[0, -bottom.height * lengthScale, 0]}
                  >
                     <ScoopFullModel color={color} />
                  </group>
               )}
            </group>
         </group>
      );
   }

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

            {showCylinder && endType !== 'Scoop (Spoon)' && !use45DegreeTop && (
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
               </group>
            )}

            {useExtraFlexModel && (
               <group
                  scale={[radiusMultiplier, 1, radiusMultiplier]}
                  position={[0, -flex.minY - neckHideAmount, 0]}
               >
                  <mesh
                     geometry={allStrawNodes.Straw_Long_Flex.geometry}
                     position={[0, -0.050, 0]}
                     scale={[1.2, 1.2, 1.2]}
                     castShadow
                     receiveShadow
                  >
                     <meshStandardMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0.1}
                        side={THREE.DoubleSide}
                     />
                  </mesh>
               </group>
            )}

            {!useExtraFlexModel && !use45DegreeTop && (
               <group
                  position={[0, flex.height * flexScale - neckHideAmount - 0.01, 0]}
               >
                  <group
                     position={[0, -top.minY, 0]}
                     scale={[radiusMultiplier, 1, radiusMultiplier]}
                  >
                     <primitive object={parts.top} />
                  </group>
               </group>
            )}

            {use45DegreeTop && (
               <group
                  position={[0, -0.01, 0]}
               >
                  <mesh
                     geometry={allStrawNodes.straw_top_bevel.geometry}
                     scale={[radiusMultiplier, 1, radiusMultiplier]}
                     castShadow
                     receiveShadow
                  >
                     <meshStandardMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0.1}
                        side={THREE.DoubleSide}
                     />
                  </mesh>
               </group>
            )}
         </group>
      </group>
   );
}

function ScoopFullModel({ color }) {
   const { nodes } = useGLTF('/Scoop-transformed.glb')
   const geometry = nodes.Shell5.geometry

   return (
      <group dispose={null}>
         <mesh
            geometry={geometry}
            castShadow
            receiveShadow
            scale={[0.027, 0.021, 0.027]}
            rotation={[0, -3, 0]}
            position={[0, -0.21, 0]}
         >
            <meshStandardMaterial
               color={color}
               roughness={0.2}
               metalness={0.1}
               side={THREE.DoubleSide}
            />
         </mesh>
      </group>
   )
}

useGLTF.preload('/straw.glb')
useGLTF.preload('/Scoop-transformed.glb')
useGLTF.preload('/All-Straws.glb')

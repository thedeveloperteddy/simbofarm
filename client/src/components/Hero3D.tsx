import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, PresentationControls, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function CrackingEgg({ position, delay = 0 }: { position: [number, number, number], delay?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const yolkRef = useRef<THREE.Mesh>(null!);
  const shellTopRef = useRef<THREE.Mesh>(null!);
  const shellBottomRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() - delay;
    if (groupRef.current && t > 0) {
      // Egg cracking animation
      if (t < 2) {
        // Shake before cracking
        groupRef.current.rotation.z = Math.sin(t * 25) * 0.15;
        groupRef.current.rotation.x = Math.sin(t * 20) * 0.1;
        groupRef.current.position.y = position[1] + Math.sin(t * 18) * 0.08;
      } else if (t < 4) {
        // Crack and split
        const crackProgress = (t - 2) / 2;
        const crackIntensity = Math.sin(crackProgress * Math.PI) * 0.8;

        if (shellTopRef.current) {
          shellTopRef.current.rotation.z = crackIntensity;
          shellTopRef.current.position.y = 0.2 + crackProgress * 0.3;
          shellTopRef.current.position.x = crackProgress * 0.2;
        }

        if (shellBottomRef.current) {
          shellBottomRef.current.rotation.z = -crackIntensity * 0.5;
          shellBottomRef.current.position.y = -0.2 - crackProgress * 0.2;
        }

        groupRef.current.position.y = position[1] - crackProgress * 0.4;
      }
    }

    if (yolkRef.current && t > 3) {
      // Yolk spilling animation
      const spillProgress = Math.min((t - 3) / 4, 1);
      const spillScale = 1 + spillProgress * 2;
      yolkRef.current.scale.setScalar(spillScale);
      yolkRef.current.position.y = -0.5 - spillProgress * 1.5;
      yolkRef.current.position.x = Math.sin(t * 3) * spillProgress * 0.4;
      yolkRef.current.position.z = Math.cos(t * 2.5) * spillProgress * 0.3;

      // Add some rotation to the yolk as it spills
      yolkRef.current.rotation.x = spillProgress * Math.PI * 0.5;
      yolkRef.current.rotation.z = t * 2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[2.5, 2.5, 2.5]}>
      {/* Egg shell top half - more detailed */}
      <mesh ref={shellTopRef} position={[0, 0.15, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FAF9F6"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Egg shell bottom half - more detailed */}
      <mesh ref={shellBottomRef} position={[0, -0.15, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FAF9F6"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Crack lines on shell */}
      <mesh position={[0, 0, 1]}>
        <torusGeometry args={[0.95, 0.02, 8, 16, Math.PI / 3]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>

      {/* Yolk - more advanced with multiple layers */}
      <mesh ref={yolkRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <MeshWobbleMaterial
          color="#FFD700"
          speed={4}
          factor={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Egg white strands */}
      <mesh position={[0.1, -0.1, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

function FryingPan({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} scale={[2, 2, 2]}>
        {/* Pan base */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[1.5, 1.2, 0.3, 32]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Pan rim */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.4, 0.1, 8, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Pan handle */}
        <mesh position={[2.2, 0.1, 0]}>
          <boxGeometry args={[1.5, 0.2, 0.4]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Handle grip */}
        <mesh position={[2.8, 0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SpillingYolk({ position, delay = 0 }: { position: [number, number, number], delay?: number }) {
  const yolkRef = useRef<THREE.Mesh>(null!);
  const whiteRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() - delay;
    if (yolkRef.current && t > 0) {
      const spillProgress = Math.min(t / 3, 1);
      const spreadFactor = 1 + spillProgress * 3;

      yolkRef.current.scale.setScalar(0.8 + spillProgress * 2);
      yolkRef.current.position.y = position[1] - spillProgress * 2.5;
      yolkRef.current.position.x = position[0] + Math.sin(t * 2) * spillProgress * 0.6;
      yolkRef.current.position.z = position[2] + Math.cos(t * 1.8) * spillProgress * 0.4;

      // Add realistic yolk movement
      yolkRef.current.rotation.x = spillProgress * Math.PI * 0.3;
      yolkRef.current.rotation.z = t * 3;
      yolkRef.current.rotation.y = Math.sin(t * 4) * 0.2;
    }

    if (whiteRef.current && t > 0.5) {
      const whiteProgress = Math.min((t - 0.5) / 2.5, 1);
      whiteRef.current.scale.setScalar(0.3 + whiteProgress * 1.5);
      whiteRef.current.position.y = position[1] - whiteProgress * 2.8;
      whiteRef.current.position.x = position[0] + Math.sin(t * 2.5) * whiteProgress * 0.8;
      whiteRef.current.position.z = position[2] + Math.cos(t * 2.2) * whiteProgress * 0.6;
    }
  });

  return (
    <group>
      {/* Main yolk */}
      <mesh ref={yolkRef} position={position}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <MeshWobbleMaterial
          color="#FFA500"
          speed={5}
          factor={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Egg white spreading */}
      <mesh ref={whiteRef} position={position}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Small yolk droplets */}
      <mesh position={[position[0] + 0.3, position[1] - 0.5, position[2]]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <MeshWobbleMaterial
          color="#FFD700"
          speed={3}
          factor={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[position[0] - 0.2, position[1] - 0.8, position[2] + 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <MeshWobbleMaterial
          color="#FFD700"
          speed={4}
          factor={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={40} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 8, 5]} intensity={2.5} color="#FFF8DC" />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#FFA500" />
      <pointLight position={[-5, 3, -5]} intensity={1} color="#FFD700" />

      <PresentationControls
        global
        rotation={[0, 0.02, 0]}
        polar={[-Math.PI / 16, Math.PI / 16]}
        azimuth={[-Math.PI / 16, Math.PI / 16]}
        enabled={false}
      >
        <group position={[0, 0, 0]}>
          {/* Frying Pan */}
          <FryingPan position={[0, -3, 0]} />

          {/* Cracking Eggs - positioned for full screen view */}
          <CrackingEgg position={[-6, 3, 3]} delay={0} />
          <CrackingEgg position={[6, 3.5, -3]} delay={1.5} />
          <CrackingEgg position={[0, 2, 4]} delay={3} />

          {/* Spilling Yolks - positioned to fall into pan */}
          <SpillingYolk position={[-6, 2, 3]} delay={3} />
          <SpillingYolk position={[6, 2.5, -3]} delay={4.5} />
          <SpillingYolk position={[0, 1, 4]} delay={6} />
        </group>
      </PresentationControls>

      <Sparkles count={60} scale={20} size={3} speed={0.5} color="#FFD700" />
      <Sparkles count={40} scale={15} size={1.5} speed={0.7} color="#FFA500" />
      <Sparkles count={25} scale={10} size={1} speed={1} color="#FFFFFF" />
    </>
  );
}

export function Hero3D() {
  return (
    <div className="w-screen h-screen absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0); // Transparent background
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
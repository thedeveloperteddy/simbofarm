import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Environment,
    ContactShadows,
    BakeShadows,
} from '@react-three/drei';
import { Bloom, EffectComposer, DepthOfField, Noise, Vignette, ToneMapping, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- SHADERS & MATERIALS ---

const eggShellMaterial = new THREE.MeshPhysicalMaterial({
    color: "#faf7f0",
    roughness: 0.35,
    metalness: 0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.15,
    reflectivity: 0.4,
    side: THREE.DoubleSide,
});

const yolkMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffcf14",
    emissive: "#ffb700",
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.1,
    transmission: 0.05,
});

const liquidWhiteMaterial = new THREE.MeshPhysicalMaterial({
    color: "#f2f2f2",
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.65,
    transmission: 0.9,
    ior: 1.33,
    thickness: 0.3,
    sheen: 0.6,
    sheenRoughness: 0.25,
});

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// --- COMPONENTS ---

function FracturedShell({ progress }: { progress: number }) {
    const group = useRef<THREE.Group>(null!);
    const count = 24;

    const pieces = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const isTop = i < count / 2;
            const dir = new THREE.Vector3(Math.cos(angle), isTop ? 0.8 : -0.8, Math.sin(angle)).normalize();
            const size = 0.15 + Math.random() * 0.1;
            return {
                id: i,
                dir,
                rot: new THREE.Vector3((Math.random() - 0.5) * Math.PI, (Math.random() - 0.5) * Math.PI, (Math.random() - 0.5) * Math.PI),
                size,
                isTop
            };
        });
    }, []);

    const tempVec = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        if (!group.current) return;

        const crackProgress = clamp01((progress - 0.13) / 0.24);
        const fadeProgress = clamp01((progress - 0.55) / 0.25);
        const fallBias = Math.pow(crackProgress, 1.4);

        group.current.children.forEach((child, i) => {
            const piece = pieces[i];
            const drift = tempVec.copy(piece.dir).multiplyScalar(fallBias * 8 + 0.5);
            const gravity = -Math.pow(fallBias, 1.5) * 3.5;

            child.position.set(drift.x, drift.y + gravity + (piece.isTop ? 0.8 : -0.6), drift.z);
            child.rotation.set(
                piece.rot.x * fallBias * 2.2,
                piece.rot.y * fallBias * 2.2,
                piece.rot.z * fallBias * 2.2
            );

            const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
            if (mat) {
                mat.transparent = true;
                mat.opacity = 1 - fadeProgress;
                mat.clearcoat = 0.15 + (1 - crackProgress) * 0.25;
            }
        });
    });

    return (
        <group ref={group}>
            {pieces.map((p) => (
                <mesh key={p.id} castShadow>
                    <boxGeometry args={[p.size, p.size * 0.6, p.size * 0.3]} />
                    <primitive object={eggShellMaterial.clone()} attach="material" />
                </mesh>
            ))}
        </group>
    );
}

function EggContents({ progress }: { progress: number }) {
    const yolk = useRef<THREE.Mesh>(null!);
    const white = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const openP = clamp01((progress - 0.25) / 0.15); // 25% -> 40%
        const dropP = clamp01((progress - 0.33) / 0.25); // 33% -> 58%
        const cookP = clamp01((progress - 0.55) / 0.35); // 55% -> 90%

        const targetY = -9.8;
        const currentY = THREE.MathUtils.lerp(0, targetY, dropP);
        const wobble = Math.sin(state.clock.getElapsedTime() * 2.2) * (0.1 + (1 - dropP) * 0.35);

        if (yolk.current) {
            yolk.current.position.set(wobble, currentY, 0);
            const scale = THREE.MathUtils.clamp(1 + openP * 0.2 - cookP * 0.55, 0.65, 1.25);
            yolk.current.scale.setScalar(scale);
            (yolk.current.material as THREE.MeshPhysicalMaterial).clearcoat = 0.2 + cookP * 0.1;
        }

        if (white.current) {
            white.current.position.set(wobble * 0.3, currentY - 0.12, 0);
            const spread = THREE.MathUtils.lerp(1, 3.8, dropP);
            const cookSpread = THREE.MathUtils.lerp(1, 1.8, cookP);
            white.current.scale.set(spread * cookSpread, 1, spread * cookSpread);

            const mat = white.current.material as THREE.MeshPhysicalMaterial;
            mat.opacity = THREE.MathUtils.lerp(0.35, 0.85, cookP);
            mat.thickness = THREE.MathUtils.lerp(0.3, 0.05, cookP);
            mat.clearcoat = 0.2;
            mat.sheen = 0.5;
        }
    });

    return (
        <group>
            <mesh ref={yolk} castShadow>
                <sphereGeometry args={[0.5, 64, 64]} />
                <primitive object={yolkMaterial} attach="material" />
            </mesh>
            <mesh ref={white} castShadow>
                <sphereGeometry args={[0.8, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <primitive object={liquidWhiteMaterial} attach="material" />
            </mesh>
        </group>
    );
}

function Garnish({ progress }: { progress: number }) {
    const group = useRef<THREE.Group>(null!);
    const particles = useMemo(
        () =>
            Array.from({ length: 12 }, () => ({
                offset: new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4),
                color: Math.random() > 0.5 ? "#4ade80" : "#f59e0b", // green or orange herbs
                size: 0.05 + Math.random() * 0.1,
            })),
        []
    );

    useFrame(() => {
        const p = clamp01((progress - 0.9) / 0.1);
        if (!group.current) return;

        group.current.children.forEach((child, idx) => {
            const data = particles[idx];
            child.position.set(data.offset.x, -10.3 + p * 0.5, data.offset.z);
            child.scale.setScalar(data.size * p);

            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            mat.opacity = p * 0.8;
        });
    });

    return (
        <group ref={group}>
            {particles.map((p, idx) => (
                <mesh key={idx}>
                    <sphereGeometry args={[0.1, 6, 6]} />
                    <meshStandardMaterial
                        color={p.color}
                        transparent
                        opacity={0}
                        roughness={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

function Steam({ progress }: { progress: number }) {
    const group = useRef<THREE.Group>(null!);
    const count = 30;

    const particles = useMemo(
        () =>
            Array.from({ length: count }, () => ({
                offset: new THREE.Vector3(
                    (Math.random() - 0.5) * 3,
                    0,
                    (Math.random() - 0.5) * 3
                ),
                speed: 0.5 + Math.random() * 1.5,
                drift: (Math.random() - 0.5) * 0.4,
                phase: Math.random() * Math.PI * 2,
                size: 0.08 + Math.random() * 0.12,
            })),
        []
    );

    useFrame((state) => {
        const p = clamp01((progress - 0.55) / 0.35);
        if (!group.current) return;

        const time = state.clock.getElapsedTime();

        group.current.children.forEach((child, idx) => {
            const data = particles[idx];
            const rise = ((time * data.speed + data.phase) % 4) / 4; // 0..1 looping
            const x = data.offset.x + Math.sin(time * 0.5 + data.phase) * data.drift;
            const z = data.offset.z + Math.cos(time * 0.5 + data.phase) * data.drift;
            const y = -10.0 + rise * 5;

            child.position.set(x, y, z);
            const scale = data.size * p * (1 - rise * 0.6);
            child.scale.setScalar(Math.max(scale, 0));

            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            mat.opacity = p * (1 - rise) * 0.35;
        });
    });

    return (
        <group ref={group}>
            {particles.map((_, idx) => (
                <mesh key={idx}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent
                        opacity={0}
                        depthWrite={false}
                        roughness={1}
                    />
                </mesh>
            ))}
        </group>
    );
}

function PanAndPlate({ progress }: { progress: number }) {
    const pan = useRef<THREE.Group>(null!);
    const plate = useRef<THREE.Group>(null!);

    useFrame(() => {
        const enterP = clamp01((progress - 0.45) / 0.2);
        const exitP = clamp01((progress - 0.78) / 0.18);

        if (pan.current) {
            pan.current.position.x = THREE.MathUtils.lerp(20, -3, enterP) - exitP * 18;
            pan.current.position.y = THREE.MathUtils.lerp(-5.8, -10.5, enterP);
            pan.current.rotation.y = THREE.MathUtils.lerp(0.2, -0.45, enterP);
        }

        const plateP = clamp01((progress - 0.82) / 0.18);
        if (plate.current) {
            plate.current.position.x = THREE.MathUtils.lerp(20, 0, plateP);
            plate.current.position.y = -10.5;
            plate.current.rotation.y = THREE.MathUtils.lerp(0, 1.2, plateP);
        }
    });

    return (
        <>
            <group ref={pan} position={[20, -10.5, 0]}>
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[6, 5.5, 0.8, 64]} />
                    <meshStandardMaterial color="#111" metalness={0.92} roughness={0.08} />
                </mesh>
                <mesh position={[9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.4, 0.4, 8, 32]} />
                    <meshStandardMaterial color="#121212" roughness={0.75} metalness={0.55} />
                </mesh>
            </group>

            <group ref={plate} position={[20, -10.5, 0]}>
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[7, 6.5, 0.4, 64]} />
                    <meshStandardMaterial color="#f4f4f4" roughness={0.05} metalness={0.1} />
                </mesh>
            </group>
        </>
    );
}

function Scene() {
    const [scroll, setScroll] = useState(0);

    const camPos = useMemo(() => new THREE.Vector3(), []);
    const camTarget = useMemo(() => new THREE.Vector3(), []);

    useEffect(() => {
        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => setScroll(self.progress),
        });

        return () => trigger.kill();
    }, []);

    useFrame((state) => {
        const t = scroll;

        // Smooth cinematic path across key milestones
        const startPos = new THREE.Vector3(0, 4.5, 10);
        const midPos = new THREE.Vector3(3.5, 3.2, 8);
        const panPos = new THREE.Vector3(6, 3.2, 5);
        const finalPos = new THREE.Vector3(2.1, 2.2, 4.4);

        const startTarget = new THREE.Vector3(0, 0, 0);
        const panTarget = new THREE.Vector3(0, -9.5, 0);
        const finalTarget = new THREE.Vector3(0, -9.2, 0);

        if (t < 0.25) {
            camPos.lerpVectors(startPos, midPos, t / 0.25);
            camTarget.lerpVectors(startTarget, panTarget, t / 0.25);
        } else if (t < 0.6) {
            camPos.lerpVectors(midPos, panPos, (t - 0.25) / 0.35);
            camTarget.lerpVectors(panTarget, finalTarget, (t - 0.25) / 0.35);
        } else {
            camPos.lerpVectors(panPos, finalPos, (t - 0.6) / 0.4);
            camTarget.lerpVectors(finalTarget, finalTarget, 1);
        }

        // Add a gentle floating/breathing motion
        const clock = state.clock.getElapsedTime();
        const nudge = Math.sin(clock * 0.6) * 0.12;
        camPos.y += nudge;

        state.camera.position.lerp(camPos, 0.08);
        state.camera.lookAt(camTarget);

        // Subtle FOV shift for more cinematic feel
        const cam = state.camera as THREE.PerspectiveCamera;
        const targetFov = THREE.MathUtils.lerp(40, 34, t);
        cam.fov = targetFov;
        cam.updateProjectionMatrix();
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={40} />
            <Environment preset="studio" />
            <ambientLight intensity={0.4} />
            <spotLight position={[20, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, 0, 5]} intensity={0.5} color="#ffa500" />

            <group position={[0, 0, 0]}>
                <FracturedShell progress={scroll} />
                <EggContents progress={scroll} />
            </group>

            <PanAndPlate progress={scroll} />
            <Steam progress={scroll} />
            <Garnish progress={scroll} />

            <ContactShadows
                position={[0, -10.8, 0]}
                opacity={0.4}
                scale={30}
                blur={2}
                far={15}
            />

            <EffectComposer multisampling={4}>
                <Bloom
                    intensity={0.5}
                    luminanceThreshold={0.85}
                    luminanceSmoothing={0.08}
                />
                <DepthOfField
                    focusDistance={0.02}
                    focalLength={0.02}
                    bokehScale={1.6}
                    height={480}
                />
                <ChromaticAberration
                    offset={[0.0025, 0.0025]}
                    blendFunction={1}
                />
                <Noise opacity={0.04} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
                <ToneMapping adaptive={true} />
            </EffectComposer>
        </>
    );
}

export function CinematicEggExperience() {
    return (
        <div className="w-full h-full fixed top-0 left-0 pointer-events-none z-0">
            <Canvas shadows dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <Scene />
                    <BakeShadows />
                </Suspense>
            </Canvas>
        </div>
    );
}

import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

interface CarSceneProps {
  phase: "intro" | "opening" | "zoomed";
  onDoorOpenComplete: () => void;
  loginSuccess?: boolean;
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#88aaff"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function NeonUnderglow() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);
  const light4 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1.current)
      light1.current.intensity = 1.5 + Math.sin(t * 2.1) * 0.8;
    if (light2.current)
      light2.current.intensity = 1.2 + Math.sin(t * 1.7 + 1) * 0.6;
    if (light3.current)
      light3.current.intensity = 1.0 + Math.sin(t * 2.5 + 2) * 0.5;
    if (light4.current)
      light4.current.intensity = 0.8 + Math.sin(t * 1.9 + 3) * 0.4;
  });

  return (
    <>
      <pointLight
        ref={light1}
        position={[-1, -0.5, 0]}
        color="#4488ff"
        distance={6}
      />
      <pointLight
        ref={light2}
        position={[1, -0.5, 0]}
        color="#aa44ff"
        distance={6}
      />
      <pointLight
        ref={light3}
        position={[0, -0.5, 1.5]}
        color="#ff2244"
        distance={5}
      />
      <pointLight
        ref={light4}
        position={[0, -0.5, -1.5]}
        color="#4488ff"
        distance={5}
      />
    </>
  );
}

function GroundGlow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
      <planeGeometry args={[6, 2.5]} />
      <meshBasicMaterial
        color="#2244aa"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

interface CarProps {
  phase: "intro" | "opening" | "zoomed";
  onDoorOpenComplete: () => void;
  loginSuccess?: boolean;
}

function Car({ phase, onDoorOpenComplete, loginSuccess }: CarProps) {
  const doorRef = useRef<THREE.Mesh>(null);
  const doorOpened = useRef(false);
  const headlightL = useRef<THREE.Mesh>(null);
  const headlightR = useRef<THREE.Mesh>(null);
  const taillightL = useRef<THREE.Mesh>(null);
  const taillightR = useRef<THREE.Mesh>(null);

  // Pivot group for door (front edge at x=0 local, door extends in +x)
  const doorPivotRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Headlight flash on login success
    if (loginSuccess) {
      const flash = Math.sin(t * 20) > 0 ? 1 : 0;
      if (headlightL.current) {
        (
          headlightL.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = 0.5 + flash * 3;
      }
      if (headlightR.current) {
        (
          headlightR.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = 0.5 + flash * 3;
      }
      if (taillightL.current) {
        (
          taillightL.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = 0.5 + flash * 3;
      }
      if (taillightR.current) {
        (
          taillightR.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = 0.5 + flash * 3;
      }
    }

    // Door animation
    if (phase === "opening" && doorPivotRef.current && !doorOpened.current) {
      const target = -1.2;
      doorPivotRef.current.rotation.y = THREE.MathUtils.lerp(
        doorPivotRef.current.rotation.y,
        target,
        delta * 1.5,
      );
      if (doorPivotRef.current.rotation.y < -1.15) {
        doorOpened.current = true;
        onDoorOpenComplete();
      }
    }
  });

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a1a2e"),
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  const roofMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#141420"),
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#112244"),
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.4,
    transmission: 0.5,
  });

  const rubberMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111111"),
    metalness: 0.0,
    roughness: 0.9,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#aaaacc"),
    metalness: 0.95,
    roughness: 0.1,
  });

  const doorMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a1a2e"),
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Car body */}
      <mesh material={bodyMat} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.5, 1.5]} />
      </mesh>

      {/* Front lower fascia */}
      <mesh material={bodyMat} position={[1.6, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.38, 1.3]} />
      </mesh>

      {/* Rear lower fascia */}
      <mesh material={bodyMat} position={[-1.6, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.38, 1.3]} />
      </mesh>

      {/* Hood - slightly angled */}
      <mesh
        material={
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#222236"),
            metalness: 0.85,
            roughness: 0.22,
            clearcoat: 0.9,
          })
        }
        position={[1.0, 0.28, 0]}
        rotation={[0, 0, -0.08]}
      >
        <boxGeometry args={[1.4, 0.12, 1.35]} />
      </mesh>

      {/* Roof/cabin */}
      <mesh material={roofMat} position={[-0.1, 0.62, 0]}>
        <boxGeometry args={[1.8, 0.45, 1.2]} />
      </mesh>

      {/* Spoiler */}
      <mesh material={bodyMat} position={[-1.55, 0.55, 0]}>
        <boxGeometry args={[0.18, 0.12, 1.4]} />
      </mesh>
      {/* Spoiler supports */}
      <mesh material={bodyMat} position={[-1.55, 0.32, 0.55]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
      </mesh>
      <mesh material={bodyMat} position={[-1.55, 0.32, -0.55]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
      </mesh>

      {/* Front windshield */}
      <mesh
        material={glassMat}
        position={[0.75, 0.62, 0]}
        rotation={[0, 0, 0.5]}
      >
        <boxGeometry args={[0.55, 0.6, 1.15]} />
      </mesh>

      {/* Rear windshield */}
      <mesh
        material={glassMat}
        position={[-0.92, 0.62, 0]}
        rotation={[0, 0, -0.4]}
      >
        <boxGeometry args={[0.45, 0.55, 1.15]} />
      </mesh>

      {/* Side windows left */}
      <mesh material={glassMat} position={[-0.1, 0.7, 0.61]}>
        <boxGeometry args={[1.5, 0.38, 0.04]} />
      </mesh>

      {/* RIGHT DOOR - animated (pivot at front-right edge) */}
      <group ref={doorPivotRef} position={[0.4, 0, 0.76]}>
        <mesh ref={doorRef} material={doorMat} position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.8, 0.44, 0.06]} />
        </mesh>
        {/* Door window */}
        <mesh material={glassMat} position={[-0.4, 0.32, 0]}>
          <boxGeometry args={[0.7, 0.3, 0.04]} />
        </mesh>
        {/* Door handle */}
        <mesh material={rimMat} position={[-0.25, 0.05, 0.04]}>
          <boxGeometry args={[0.18, 0.04, 0.04]} />
        </mesh>
      </group>

      {/* Left door (static) */}
      <mesh material={doorMat} position={[0, 0, -0.76]}>
        <boxGeometry args={[0.8, 0.44, 0.06]} />
      </mesh>
      <mesh material={glassMat} position={[0, 0.32, -0.76]}>
        <boxGeometry args={[0.7, 0.3, 0.04]} />
      </mesh>

      {/* Wheels FL */}
      <group position={[1.1, -0.28, 0.82]}>
        <mesh material={rubberMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 20]} />
        </mesh>
        <mesh
          material={rimMat}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          <cylinderGeometry args={[0.22, 0.22, 0.27, 12]} />
        </mesh>
      </group>

      {/* Wheels FR */}
      <group position={[1.1, -0.28, -0.82]}>
        <mesh material={rubberMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 20]} />
        </mesh>
        <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.27, 12]} />
        </mesh>
      </group>

      {/* Wheels RL */}
      <group position={[-1.1, -0.28, 0.82]}>
        <mesh material={rubberMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 20]} />
        </mesh>
        <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.27, 12]} />
        </mesh>
      </group>

      {/* Wheels RR */}
      <group position={[-1.1, -0.28, -0.82]}>
        <mesh material={rubberMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 20]} />
        </mesh>
        <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.27, 12]} />
        </mesh>
      </group>

      {/* Headlights */}
      <mesh
        ref={headlightL}
        material={
          new THREE.MeshStandardMaterial({
            color: "#ffffff",
            emissive: new THREE.Color("#aaccff"),
            emissiveIntensity: 0.8,
          })
        }
        position={[1.72, 0.1, 0.5]}
      >
        <sphereGeometry args={[0.1, 10, 10]} />
      </mesh>
      <mesh
        ref={headlightR}
        material={
          new THREE.MeshStandardMaterial({
            color: "#ffffff",
            emissive: new THREE.Color("#aaccff"),
            emissiveIntensity: 0.8,
          })
        }
        position={[1.72, 0.1, -0.5]}
      >
        <sphereGeometry args={[0.1, 10, 10]} />
      </mesh>

      {/* Taillights */}
      <mesh
        ref={taillightL}
        material={
          new THREE.MeshStandardMaterial({
            color: "#ff2244",
            emissive: new THREE.Color("#ff2244"),
            emissiveIntensity: 1.2,
          })
        }
        position={[-1.73, 0.1, 0.5]}
      >
        <sphereGeometry args={[0.09, 10, 10]} />
      </mesh>
      <mesh
        ref={taillightR}
        material={
          new THREE.MeshStandardMaterial({
            color: "#ff2244",
            emissive: new THREE.Color("#ff2244"),
            emissiveIntensity: 1.2,
          })
        }
        position={[-1.73, 0.1, -0.5]}
      >
        <sphereGeometry args={[0.09, 10, 10]} />
      </mesh>

      <NeonUnderglow />
      <GroundGlow />
    </group>
  );
}

function SceneController({
  phase,
  onDoorOpenComplete,
  loginSuccess,
}: CarSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Rotate car slowly in intro
    if (phase === "intro" && groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }

    // Camera zoom for zoomed phase
    if (phase === "zoomed") {
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        1.5,
        delta * 1.2,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        0.8,
        delta * 1.2,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        2.5,
        delta * 1.2,
      );
    } else if (phase === "intro") {
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        4,
        delta * 0.5,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        1.5,
        delta * 0.5,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        5,
        delta * 0.5,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Car
        phase={phase}
        onDoorOpenComplete={onDoorOpenComplete}
        loginSuccess={loginSuccess}
      />
    </group>
  );
}

function SceneContent({
  phase,
  onDoorOpenComplete,
  loginSuccess,
}: CarSceneProps) {
  return (
    <>
      <fog attach="fog" args={["#030510", 8, 35]} />
      <ambientLight intensity={0.15} />
      <spotLight
        position={[3, 6, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={2}
        color="#8899ff"
        castShadow
      />
      <pointLight position={[0, 5, 0]} color="#334466" intensity={0.5} />
      <ParticleField />
      <SceneController
        phase={phase}
        onDoorOpenComplete={onDoorOpenComplete}
        loginSuccess={loginSuccess}
      />
    </>
  );
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function CarScene({
  phase,
  onDoorOpenComplete,
  loginSuccess,
}: CarSceneProps) {
  const fallback = (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #0a0a2e 0%, #030510 70%)",
      }}
    />
  );

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <Canvas
        camera={{ position: [4, 1.5, 5], fov: 45 }}
        style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneContent
            phase={phase}
            onDoorOpenComplete={onDoorOpenComplete}
            loginSuccess={loginSuccess}
          />
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  );
}

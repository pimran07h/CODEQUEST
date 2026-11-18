import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Compass, 
  Play, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Heart, 
  Zap, 
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
  RotateCw,
  Radio,
  BookOpen,
  ArrowRight
} from 'lucide-react';

// ==========================================
// 1. FLOATING COMPANION DRONE "BYTE"
// ==========================================
function CompanionDrone({ targetPos }: { targetPos: [number, number, number] }) {
  const droneRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!droneRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Smoothly hover to the upper-right shoulder of the player
    const desiredX = targetPos[0] + 0.9 + Math.sin(time * 2) * 0.15;
    const desiredY = targetPos[1] + 1.8 + Math.cos(time * 3) * 0.12;
    const desiredZ = targetPos[2] + 0.6 + Math.sin(time * 1.5) * 0.15;

    droneRef.current.position.x = THREE.MathUtils.lerp(droneRef.current.position.x, desiredX, delta * 5);
    droneRef.current.position.y = THREE.MathUtils.lerp(droneRef.current.position.y, desiredY, delta * 5);
    droneRef.current.position.z = THREE.MathUtils.lerp(droneRef.current.position.z, desiredZ, delta * 5);

    droneRef.current.rotation.y = time * 2;
  });

  return (
    <group ref={droneRef} position={[targetPos[0] + 0.9, targetPos[1] + 1.8, targetPos[2] + 0.6]}>
      {/* Drone Core Orb */}
      <mesh castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Glowing Cyan Optical Scanner */}
      <mesh position={[0, 0, 0.14]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2.5} />
      </mesh>
      {/* Anti-Grav Hover Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 10, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.8} />
      </mesh>
      <pointLight color="#38bdf8" intensity={1.5} distance={4} />
    </group>
  );
}

// ==========================================
// 2. CELESTIAL WAYPOINT BEACON LIGHT BEAM
// ==========================================
function WaypointBeacon({ position, color = "#10b981" }: { position: [number, number, number]; color?: string }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Massive sky beam cylinder */}
      <mesh ref={beamRef} position={[0, 18, 0]}>
        <cylinderGeometry args={[0.25, 0.5, 36, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Pulsing ground beacon ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.6, 1.4, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color={color} intensity={3} distance={9} />
    </group>
  );
}

// ==========================================
// 3. ANCIENT LOOP RELICS (BEGINNER QUEST)
// ==========================================
function LoopRelicItem({
  position,
  color,
  title,
  runeSymbol,
  isCollected,
  onCollect
}: {
  position: [number, number, number];
  color: string;
  title: string;
  runeSymbol: string;
  isCollected: boolean;
  onCollect: () => void;
}) {
  if (isCollected) return null;

  return (
    <group position={position} onClick={onCollect}>
      <WaypointBeacon position={[0, 0, 0]} color={color} />
      
      {/* Floating Gemstone */}
      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.8}>
        <group position={[0, 1.4, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} metalness={0.8} roughness={0.1} />
          </mesh>
          <Text position={[0, 0.8, 0]} fontSize={0.28} color="#ffffff" anchorX="center">
            {runeSymbol}
          </Text>
          <Text position={[0, 1.15, 0]} fontSize={0.22} color={color} anchorX="center">
            [E] {title}
          </Text>
        </group>
      </Float>
    </group>
  );
}

// ==========================================
// 4. REALISTIC EXPLORER 3D CHARACTER
// ==========================================
function ExplorerCharacter({ 
  position, 
  rotationY, 
  isMoving, 
  isRunning, 
  isJumping 
}: { 
  position: [number, number, number]; 
  rotationY: number; 
  isMoving: boolean; 
  isRunning: boolean; 
  isJumping: boolean; 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x = position[0];
    groupRef.current.position.y = position[1];
    groupRef.current.position.z = position[2];

    const currentRot = groupRef.current.rotation.y;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(currentRot, rotationY, Math.min(delta * 14, 1));

    const time = state.clock.elapsedTime;
    const strideFreq = isRunning ? 14 : 9;
    const strideAmp = isRunning ? 0.65 : 0.45;

    if (isMoving && !isJumping) {
      const swing = Math.sin(time * strideFreq) * strideAmp;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.9;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.9;
      if (bodyRef.current) bodyRef.current.position.y = 1.05 + Math.abs(Math.sin(time * strideFreq)) * 0.08;
    } else if (isJumping) {
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.5;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.7;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.7;
      if (bodyRef.current) bodyRef.current.position.y = 1.15;
    } else {
      const breath = Math.sin(time * 2.2) * 0.03;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breath * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breath * 0.5;
      if (bodyRef.current) bodyRef.current.position.y = 1.05 + breath;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        
        {/* Head with Explorer Fedora & Goggles */}
        <group position={[0, 0.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.04, 20]} />
            <meshStandardMaterial color="#58311a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.24, 0.18, 18]} />
            <meshStandardMaterial color="#442614" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.08, 0.18]}>
            <boxGeometry args={[0.26, 0.07, 0.08]} />
            <meshStandardMaterial color="#c68a4c" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Explorer Torso */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.48, 0.6, 0.28]} />
          <meshStandardMaterial color="#7f5539" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.12, 0.02]} castShadow>
          <boxGeometry args={[0.5, 0.56, 0.28]} />
          <meshStandardMaterial color="#58311a" roughness={0.9} />
        </mesh>
        {/* Expedition Backpack */}
        <mesh position={[0, 0.14, -0.22]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.22]} />
          <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
        </mesh>

        {/* Arms */}
        <group ref={leftArmRef} position={[-0.32, 0.35, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.52, 12]} />
            <meshStandardMaterial color="#7f5539" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.56, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#d4a373" roughness={0.7} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.32, 0.35, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.52, 12]} />
            <meshStandardMaterial color="#7f5539" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.56, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#d4a373" roughness={0.7} />
          </mesh>
          {/* Amber Explorer Lantern */}
          <mesh position={[0, -0.72, 0.12]}>
            <cylinderGeometry args={[0.08, 0.1, 0.22, 10]} />
            <meshStandardMaterial color="#c68a4c" metalness={0.8} roughness={0.3} />
          </mesh>
          <pointLight position={[0, -0.72, 0.12]} color="#fbbf24" intensity={2.8} distance={7} />
        </group>

      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.65, 12]} />
          <meshStandardMaterial color="#4a3728" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.13, 0.12, 0.26]} />
          <meshStandardMaterial color="#2b1810" roughness={0.9} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.65, 12]} />
          <meshStandardMaterial color="#4a3728" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.66, 0.06]} castShadow>
          <boxGeometry args={[0.13, 0.12, 0.26]} />
          <meshStandardMaterial color="#2b1810" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 5. THIRD-PERSON SMOOTH FOLLOW CAMERA
// ==========================================
function ThirdPersonCamera({ 
  targetPos, 
  yaw, 
  pitch,
  isCinematic,
  cinematicTarget 
}: { 
  targetPos: [number, number, number]; 
  yaw: number; 
  pitch: number;
  isCinematic: boolean;
  cinematicTarget: [number, number, number];
}) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 5, 12));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    if (isCinematic) {
      const cinPos = new THREE.Vector3(cinematicTarget[0], cinematicTarget[1] + 2.8, cinematicTarget[2] + 9.5);
      const cinLook = new THREE.Vector3(cinematicTarget[0], cinematicTarget[1] + 4.2, cinematicTarget[2]);

      currentPos.current.lerp(cinPos, Math.min(delta * 3.5, 1));
      currentLookAt.current.lerp(cinLook, Math.min(delta * 3.5, 1));
    } else {
      const distance = 6.2;
      const height = 2.4;

      const camX = targetPos[0] + distance * Math.sin(yaw) * Math.cos(pitch);
      const camZ = targetPos[2] + distance * Math.cos(yaw) * Math.cos(pitch);
      const camY = Math.max(0.6, targetPos[1] + height + distance * Math.sin(pitch));

      const desiredPos = new THREE.Vector3(camX, camY, camZ);
      const desiredLookAt = new THREE.Vector3(targetPos[0], targetPos[1] + 1.4, targetPos[2]);

      currentPos.current.lerp(desiredPos, Math.min(delta * 8.0, 1));
      currentLookAt.current.lerp(desiredLookAt, Math.min(delta * 9.0, 1));
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ==========================================
// 6. JUNGLE FLORA & SCENIC DETAILS
// ==========================================
function JungleTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 1.4, 8, 10]} />
        <meshStandardMaterial color="#2d1e15" roughness={0.9} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <sphereGeometry args={[3.2, 12, 10]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} />
      </mesh>
      <mesh position={[1.2, 8.8, 0.8]} castShadow>
        <sphereGeometry args={[2.4, 10, 8]} />
        <meshStandardMaterial color="#155d27" roughness={0.8} />
      </mesh>
    </group>
  );
}

function MossyRock({ position, scale = 1, rotation = [0, 0, 0] }: { position: [number, number, number]; scale?: number; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} scale={[scale, scale, scale]} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial color="#2c3a2f" roughness={0.9} />
    </mesh>
  );
}

function FireBrazier({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2.4 + Math.sin(state.clock.elapsedTime * 8) * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 8]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.25, 0.35, 10]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.6, 0]} color="#f97316" intensity={2.5} distance={10} />
    </group>
  );
}

// ==========================================
// 7. THE COLOSSAL LOST TEMPLE ENTRANCE
// ==========================================
function LostTempleEntrance({ 
  doorOpenProgress, 
  isPuzzleActive 
}: { 
  doorOpenProgress: number; 
  isPuzzleActive: boolean; 
}) {
  const doorHeight = 7.5;
  const currentDoorY = 3.75 + doorOpenProgress * 6.5;

  return (
    <group position={[0, 0, -26]}>
      {/* Massive Stepped Temple Facade */}
      <mesh position={[0, 6, -2]} castShadow receiveShadow>
        <boxGeometry args={[26, 14, 6]} />
        <meshStandardMaterial color="#222b25" roughness={0.9} />
      </mesh>

      {/* Temple Triangular Pediment */}
      <mesh position={[0, 14.5, -1.8]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[6, 6, 4]} />
        <meshStandardMaterial color="#1a221d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 13.5, 0.2]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
      </mesh>

      {/* Columns */}
      <mesh position={[-5.5, 5, 0.5]} castShadow>
        <boxGeometry args={[1.6, 10, 1.6]} />
        <meshStandardMaterial color="#161e18" roughness={0.85} />
      </mesh>
      <mesh position={[-5.5, 8.5, 1.32]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[5.5, 5, 0.5]} castShadow>
        <boxGeometry args={[1.6, 10, 1.6]} />
        <meshStandardMaterial color="#161e18" roughness={0.85} />
      </mesh>
      <mesh position={[5.5, 8.5, 1.32]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={1.5} />
      </mesh>

      {/* Twin Fire Braziers */}
      <FireBrazier position={[-3.8, 0, 1.5]} />
      <FireBrazier position={[3.8, 0, 1.5]} />

      {/* Portal Frame */}
      <mesh position={[-3.2, 3.8, 0.5]} castShadow>
        <boxGeometry args={[1.2, 7.8, 1.4]} />
        <meshStandardMaterial color="#111713" roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 3.8, 0.5]} castShadow>
        <boxGeometry args={[1.2, 7.8, 1.4]} />
        <meshStandardMaterial color="#111713" roughness={0.9} />
      </mesh>
      <mesh position={[0, 7.8, 0.5]} castShadow>
        <boxGeometry args={[7.6, 1.2, 1.4]} />
        <meshStandardMaterial color="#111713" roughness={0.9} />
      </mesh>

      {/* THE MASSIVE STONE DOOR */}
      <group position={[0, currentDoorY, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5.2, doorHeight, 0.6]} />
          <meshStandardMaterial color="#1d2620" roughness={0.8} />
        </mesh>

        {[-2, -1, 0, 1, 2].map((yOffset, idx) => (
          <mesh key={idx} position={[0, yOffset, 0.32]}>
            <boxGeometry args={[2.8, 0.22, 0.05]} />
            <meshStandardMaterial 
              color="#06b6d4" 
              emissive={isPuzzleActive ? "#06b6d4" : "#0e7490"} 
              emissiveIntensity={isPuzzleActive ? 1.8 : 0.6} 
            />
          </mesh>
        ))}
      </group>

      {/* Inner Chamber */}
      <group position={[0, 3, -6]}>
        <pointLight color="#f59e0b" intensity={doorOpenProgress > 0.1 ? 4.5 : 0} distance={18} />
        <mesh position={[0, 0, -4]}>
          <boxGeometry args={[12, 8, 12]} />
          <meshStandardMaterial color="#0c120e" roughness={0.9} side={THREE.BackSide} />
        </mesh>
        {doorOpenProgress > 0.4 && (
          <Text position={[0, 2, -5]} fontSize={0.65} color="#fbbf24" anchorX="center">
            👑 INNER SANCTUM UNLOCKED
          </Text>
        )}
      </group>
    </group>
  );
}

// ==========================================
// 8. MAIN ADVENTURE PAGE COMPONENT
// ==========================================
export const AdventureGamePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  // Locomotion & Physics
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 8]);
  const [playerRotY, setPlayerRotY] = useState(Math.PI);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // Camera State
  const [camYaw, setCamYaw] = useState(Math.PI);
  const [camPitch, setCamPitch] = useState(0.24);

  // Mutable refs for rock-solid 60 FPS controls (zero listener churn)
  const playerPosRef = useRef<[number, number, number]>([0, 0, 8]);
  const camYawRef = useRef<number>(Math.PI);
  const camPitchRef = useRef<number>(0.24);
  const playerVelYRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isDraggingMouse = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Story & Cinematic Flow
  const [showPrologue, setShowPrologue] = useState(true);
  const [isCinematic, setIsCinematic] = useState(false);
  const [doorOpenProgress, setDoorOpenProgress] = useState(0);
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
  const [activeCodingTerminal, setActiveCodingTerminal] = useState(false);

  // Beginner 3-Relic Quest State
  const [relic1Collected, setRelic1Collected] = useState(false);
  const [relic2Collected, setRelic2Collected] = useState(false);
  const [relic3Collected, setRelic3Collected] = useState(false);
  const [activeRelicModal, setActiveRelicModal] = useState<any>(null);

  // Relic Positions in the Jungle
  const relic1Pos = useMemo<[number, number, number]>(() => [6, 0.4, 2], []);
  const relic2Pos = useMemo<[number, number, number]>(() => [-7, 0.4, -7], []);
  const relic3Pos = useMemo<[number, number, number]>(() => [7, 0.4, -16], []);
  const templeDoorPos = useMemo<[number, number, number]>(() => [0, 0, -24], []);

  // Compute Current Objective Target
  const currentObjective = useMemo(() => {
    if (!relic1Collected) {
      return { 
        name: "Collect Relic 1: Initialization", 
        pos: relic1Pos, 
        color: "#10b981", 
        tip: "Follow the green light beam near the river crossing!" 
      };
    }
    if (!relic2Collected) {
      return { 
        name: "Collect Relic 2: Continuation", 
        pos: relic2Pos, 
        color: "#38bdf8", 
        tip: "Head towards the blue light beam near the stone archway on the left!" 
      };
    }
    if (!relic3Collected) {
      return { 
        name: "Collect Relic 3: Iteration", 
        pos: relic3Pos, 
        color: "#f59e0b", 
        tip: "Follow the golden light beam beside the waterfall!" 
      };
    }
    return { 
      name: "Breach the Colossal Temple Gate", 
      pos: templeDoorPos, 
      color: "#ec4899", 
      tip: "All 3 Relics gathered! Proceed to the Colossal Temple Door!" 
    };
  }, [relic1Collected, relic2Collected, relic3Collected, relic1Pos, relic2Pos, relic3Pos, templeDoorPos]);

  // Distance to active objective
  const distanceToObjective = Math.round(
    Math.hypot(playerPos[0] - currentObjective.pos[0], playerPos[2] - currentObjective.pos[2])
  );

  // Interaction prompt
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);

  // Coding Challenge State
  const defaultCode = `# CHAPTER 1: THE LOST TEMPLE OF CODE
# In Python, loops repeat actions using range(start, end).
# The ancient counterweights need frequencies: [1, 2, 3, 4, 5]

def unlock_temple():
    frequencies = []
    
    # Write a loop from 1 to 5:
    for i in range(1, 6):
        frequencies.append(i)
        
    return frequencies
`;
  const [pythonCode, setPythonCode] = useState(defaultCode);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [activeFrequencies, setActiveFrequencies] = useState<number[]>([]);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard and Mouse Event Registration (Attached once, perfectly smooth)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysDown.current[k] = true;

      if (e.key === 'ArrowLeft') keysDown.current['arrowleft'] = true;
      if (e.key === 'ArrowRight') keysDown.current['arrowright'] = true;
      if (e.key === 'ArrowUp') keysDown.current['arrowup'] = true;
      if (e.key === 'ArrowDown') keysDown.current['arrowdown'] = true;

      // Interaction key
      if (k === 'e') {
        checkInteraction();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysDown.current[k] = false;
      if (e.key === 'ArrowLeft') keysDown.current['arrowleft'] = false;
      if (e.key === 'ArrowRight') keysDown.current['arrowright'] = false;
      if (e.key === 'ArrowUp') keysDown.current['arrowup'] = false;
      if (e.key === 'ArrowDown') keysDown.current['arrowdown'] = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDraggingMouse.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingMouse.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      camYawRef.current -= dx * 0.005;
      camPitchRef.current = Math.max(0.08, Math.min(0.85, camPitchRef.current + dy * 0.004));
      setCamYaw(camYawRef.current);
      setCamPitch(camPitchRef.current);
    };

    const onMouseUp = () => {
      isDraggingMouse.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Main 60 FPS Kinematics & Collision Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Arrow keys camera rotation (smooth laptop controls)
      if (keysDown.current['arrowleft'] || keysDown.current['q']) {
        camYawRef.current += 1.8 * dt;
        setCamYaw(camYawRef.current);
      }
      if (keysDown.current['arrowright']) {
        camYawRef.current -= 1.8 * dt;
        setCamYaw(camYawRef.current);
      }
      if (keysDown.current['arrowup']) {
        camPitchRef.current = Math.max(0.08, camPitchRef.current - 1.2 * dt);
        setCamPitch(camPitchRef.current);
      }
      if (keysDown.current['arrowdown']) {
        camPitchRef.current = Math.min(0.85, camPitchRef.current + 1.2 * dt);
        setCamPitch(camPitchRef.current);
      }

      if (!isCinematic && !activeCodingTerminal && !activeRelicModal && !showPrologue) {
        let moveX = 0;
        let moveZ = 0;

        if (keysDown.current['w']) moveZ -= 1;
        if (keysDown.current['s']) moveZ += 1;
        if (keysDown.current['a']) moveX -= 1;
        if (keysDown.current['d']) moveX += 1;

        const hasInput = moveX !== 0 || moveZ !== 0;
        setIsMoving(hasInput);

        const wantRun = !!keysDown.current['shift'] && hasInput;
        setIsRunning(wantRun);

        const speed = wantRun ? 8.8 : 4.8;
        const [px, py, pz] = playerPosRef.current;
        let nx = px;
        let nz = pz;
        let ny = py;

        if (hasInput) {
          const inputAngle = Math.atan2(moveX, moveZ);
          const moveAngle = camYawRef.current + inputAngle;

          nx += Math.sin(moveAngle) * speed * dt;
          nz += Math.cos(moveAngle) * speed * dt;

          setPlayerRotY(moveAngle + Math.PI);
          sound.playFootstep(wantRun);
        }

        // Jump & Gravity
        let vy = playerVelYRef.current;
        if (keysDown.current[' '] && !isJumpingRef.current && py <= 0.05) {
          vy = 7.0;
          isJumpingRef.current = true;
          setIsJumping(true);
          sound.playClick();
        }

        vy += -19.6 * dt;
        ny += vy * dt;

        if (ny <= 0) {
          ny = 0;
          vy = 0;
          isJumpingRef.current = false;
          setIsJumping(false);
        }
        playerVelYRef.current = vy;

        // Boundaries & Temple Wall Collision
        nx = Math.max(-12, Math.min(12, nx));
        nz = Math.max(-28, Math.min(16, nz));

        if (!isDoorUnlocked && nz < -23.8) {
          nz = -23.8;
        }

        playerPosRef.current = [nx, ny, nz];
        setPlayerPos([nx, ny, nz]);

        // Proximity prompts
        if (Math.hypot(nx - relic1Pos[0], nz - relic1Pos[2]) < 2.5 && !relic1Collected) {
          setInteractPrompt("💎 [E] Collect Relic 1: Initialization");
        } else if (Math.hypot(nx - relic2Pos[0], nz - relic2Pos[2]) < 2.5 && !relic2Collected) {
          setInteractPrompt("🌀 [E] Collect Relic 2: Continuation");
        } else if (Math.hypot(nx - relic3Pos[0], nz - relic3Pos[2]) < 2.5 && !relic3Collected) {
          setInteractPrompt("⚡ [E] Collect Relic 3: Iteration");
        } else if (Math.hypot(nx, nz - (-24)) < 4.5 && !isDoorUnlocked) {
          setInteractPrompt("⛩️ [E] Approach Colossal Temple Door");
        } else {
          setInteractPrompt(null);
        }
      }

      // Smooth Door Opening
      if (isDoorUnlocked && doorOpenProgress < 1) {
        setDoorOpenProgress(p => Math.min(1, p + dt * 0.6));
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isCinematic, activeCodingTerminal, activeRelicModal, showPrologue, isDoorUnlocked, doorOpenProgress, relic1Collected, relic2Collected, relic3Collected, relic1Pos, relic2Pos, relic3Pos]);

  // Check Interaction Logic
  const checkInteraction = () => {
    const [px, , pz] = playerPosRef.current;

    // Relic 1
    if (Math.hypot(px - relic1Pos[0], pz - relic1Pos[2]) < 2.8 && !relic1Collected) {
      sound.playCrystalCollect();
      sound.playDroneChirp();
      setRelic1Collected(true);
      setActiveRelicModal({
        title: "Relic 1: Initialization Found!",
        badge: "💎 STEP 1 OF A LOOP",
        concept: "Where the loop begins",
        description: "Every loop requires a starting point! In Python, loops can start at 1: `for i in range(1, ...)` starts your counter at integer 1.",
        reward: "+50 XP, +25 Coins"
      });
      return;
    }

    // Relic 2
    if (Math.hypot(px - relic2Pos[0], pz - relic2Pos[2]) < 2.8 && !relic2Collected) {
      sound.playCrystalCollect();
      sound.playDroneChirp();
      setRelic2Collected(true);
      setActiveRelicModal({
        title: "Relic 2: Continuation Found!",
        badge: "🌀 STEP 2 OF A LOOP",
        concept: "When the loop stops",
        description: "A loop continues as long as its condition holds! In Python, `range(1, 6)` generates numbers up to but not including 6 (producing 1, 2, 3, 4, 5).",
        reward: "+50 XP, +25 Coins"
      });
      return;
    }

    // Relic 3
    if (Math.hypot(px - relic3Pos[0], pz - relic3Pos[2]) < 2.8 && !relic3Collected) {
      sound.playCrystalCollect();
      sound.playDroneChirp();
      setRelic3Collected(true);
      setActiveRelicModal({
        title: "Relic 3: Iteration Found!",
        badge: "⚡ STEP 3 OF A LOOP",
        concept: "Stepping forward each round",
        description: "Iteration advances the loop automatically! In Python `for i in range(...)`, the variable `i` advances 1 step each iteration until finished.",
        reward: "+50 XP, +25 Coins"
      });
      return;
    }

    // Temple Door
    if (Math.hypot(px, pz - (-24)) < 4.8 && !isDoorUnlocked) {
      triggerTempleCinematic();
      return;
    }
  };

  // Start Adventure Handler from Prologue
  const handleStartAdventure = () => {
    setShowPrologue(false);
    sound.playClick();
    sound.startJungleAmbience();
    sound.playDroneChirp();
  };

  // Cinematic Event at Temple Door
  const triggerTempleCinematic = () => {
    sound.playAncientGong();
    sound.playTrickyChime();
    setIsCinematic(true);
    setInteractPrompt(null);

    setTimeout(() => {
      setActiveCodingTerminal(true);
    }, 2200);
  };

  // Run Code & Decrypt Gate
  const handleRunCode = () => {
    sound.playClick();
    setEvaluating(true);
    setEvalResult(null);
    setActiveFrequencies([]);

    // Check code logic
    const hasRange = pythonCode.includes('range(1, 6)') || pythonCode.includes('range(1,6)');
    const hasLoop = pythonCode.includes('for ') || pythonCode.includes('while ');
    const hasAppend = pythonCode.includes('append(i)') || pythonCode.includes('frequencies = [1, 2, 3, 4, 5]');

    const isSuccess = (hasRange && hasLoop) || hasAppend;

    // Animate frequencies lighting up one-by-one with tricky sounds!
    let step = 1;
    const interval = setInterval(() => {
      if (step <= 5) {
        setActiveFrequencies(prev => [...prev, step]);
        sound.playCountdown();
        step++;
      } else {
        clearInterval(interval);
        setEvaluating(false);

        if (isSuccess) {
          sound.playSuccess();
          sound.playStoneRumble();
          setEvalResult({
            success: true,
            message: "🎉 Frequency Resonance Synchronized! The Ancient Temple Door is Opening!"
          });
          setTimeout(() => {
            handleVictory();
          }, 1800);
        } else {
          sound.playError();
          sound.playTrickyChime();
          setEvalResult({
            success: false,
            message: "Frequency Mismatch! The temple mechanism requires numbers 1, 2, 3, 4, 5. Check your range(1, 6) statement."
          });
        }
      }
    }, 280);
  };

  // Victory Sequence
  const handleVictory = () => {
    sound.playLevelUp();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    setIsDoorUnlocked(true);
    setActiveCodingTerminal(false);
    setIsCinematic(false);

    try {
      api.submitCode('w2-l2', pythonCode, 'python', user?.id || 'demo-user');
      refreshUser();
    } catch {}
  };

  // Beginner Auto-Complete Template
  const handleAutoFillSolution = () => {
    sound.playClick();
    setPythonCode(`# CHAPTER 1: THE LOST TEMPLE OF CODE
# Solution: Loop from 1 up to 6 (which yields [1, 2, 3, 4, 5])

def unlock_temple():
    frequencies = []
    
    # In Python, range(1, 6) starts at 1 and stops before 6
    for i in range(1, 6):
        frequencies.append(i)
        
    return frequencies
`);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#030705] text-white flex flex-col select-none overflow-hidden z-50">
      
      {/* Cinematic Top Letterbox Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 z-40 bg-black transition-all duration-1000 ${
          isCinematic ? 'h-16 sm:h-20' : 'h-0'
        }`} 
      />

      {/* Cinematic Bottom Letterbox Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-40 bg-black transition-all duration-1000 ${
          isCinematic ? 'h-16 sm:h-20' : 'h-0'
        }`} 
      />

      {/* TOP HUD BAR */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        
        {/* Navigation & Quest Title */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            to="/worlds"
            onClick={() => sound.playClick()}
            className="px-3.5 py-1.5 rounded-xl bg-black/85 hover:bg-black/95 border border-emerald-900/60 text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Worlds Map
          </Link>

          {/* Active Objective Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-xs text-emerald-200 backdrop-blur-md shadow-lg">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">{currentObjective.name}</span>
            <span className="text-emerald-400 font-mono text-[11px]">({distanceToObjective}m)</span>
          </div>
        </div>

        {/* Right HUD Controls (Camera helper, Audio, Fullscreen) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Camera Rotate Buttons for Laptops */}
          <button
            onClick={() => {
              camYawRef.current += 0.5;
              setCamYaw(camYawRef.current);
              sound.playClick();
            }}
            title="Rotate Camera Left"
            className="p-2 rounded-xl bg-black/80 hover:bg-emerald-950 border border-emerald-900/60 text-emerald-300 hover:text-white backdrop-blur-md shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              camYawRef.current -= 0.5;
              setCamYaw(camYawRef.current);
              sound.playClick();
            }}
            title="Rotate Camera Right"
            className="p-2 rounded-xl bg-black/80 hover:bg-emerald-950 border border-emerald-900/60 text-emerald-300 hover:text-white backdrop-blur-md shadow-lg"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => sound.toggleMute()}
            className="p-2 rounded-xl bg-black/80 hover:bg-emerald-950 border border-emerald-900/60 text-emerald-300 hover:text-white backdrop-blur-md shadow-lg"
          >
            {sound.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* QUEST TRACKER HUD (TOP-LEFT) */}
      <div className="absolute top-16 left-4 z-20 pointer-events-none flex flex-col gap-2 max-w-xs">
        <div className="p-3 rounded-2xl bg-black/85 border border-emerald-900/60 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <span>Chapter 1: The Lost Temple</span>
            <span className="text-[10px] text-slate-400">Loop Decryption</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className={`flex items-center gap-2 ${relic1Collected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
              {relic1Collected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />}
              <span>Relic 1: Initialization (Start at 1)</span>
            </div>
            <div className={`flex items-center gap-2 ${relic2Collected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
              {relic2Collected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />}
              <span>Relic 2: Continuation (Stop before 6)</span>
            </div>
            <div className={`flex items-center gap-2 ${relic3Collected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
              {relic3Collected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />}
              <span>Relic 3: Iteration (Advance +1)</span>
            </div>
            <div className={`flex items-center gap-2 ${isDoorUnlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              {isDoorUnlocked ? <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block" />}
              <span>Temple Gate: {isDoorUnlocked ? 'UNLOCKED' : 'Locked'}</span>
            </div>
          </div>
        </div>

        {/* Companion Drone Tip */}
        <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-600/50 text-[11px] text-sky-200 backdrop-blur-md flex items-start gap-2 shadow-xl">
          <Radio className="w-4 h-4 text-sky-400 mt-0.5 shrink-0 animate-bounce" />
          <div>
            <div className="font-bold text-sky-300">BYTE (AI Drone):</div>
            <div>{currentObjective.tip}</div>
          </div>
        </div>
      </div>

      {/* CONTROLS GUIDE (BOTTOM-LEFT) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-emerald-900/40 text-[11px] text-slate-300 backdrop-blur-md">
        <span><b className="text-emerald-400">W A S D</b> Move</span>
        <span>•</span>
        <span><b className="text-emerald-400">Shift</b> Sprint</span>
        <span>•</span>
        <span><b className="text-emerald-400">Space</b> Jump</span>
        <span>•</span>
        <span><b className="text-emerald-400">Drag / ← →</b> Look</span>
        <span>•</span>
        <span><b className="text-emerald-400">E</b> Interact</span>
      </div>

      {/* INTERACT PROMPT TOAST (CENTER SCREEN) */}
      {interactPrompt && !isCinematic && !activeCodingTerminal && !activeRelicModal && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={checkInteraction}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm tracking-wide shadow-2xl shadow-emerald-500/50 flex items-center gap-2.5 animate-bounce transition-all border border-emerald-300/40"
          >
            <span>{interactPrompt}</span>
          </button>
        </div>
      )}

      {/* 3D CANVAS VIEWPORT (EDGE TO EDGE) */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ fov: 60, position: [0, 4, 12] }}>
          <color attach="background" args={['#030906']} />
          <fog attach="fog" args={['#030906', 12, 38]} />

          {/* Tropical Jungle Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <pointLight position={[0, 6, -10]} intensity={1.5} color="#06b6d4" distance={25} />

          {/* Third-Person Camera */}
          <ThirdPersonCamera 
            targetPos={playerPos} 
            yaw={camYaw} 
            pitch={camPitch}
            isCinematic={isCinematic}
            cinematicTarget={[0, 0, -24]}
          />

          {/* Player Explorer Character */}
          <ExplorerCharacter 
            position={playerPos} 
            rotationY={playerRotY} 
            isMoving={isMoving} 
            isRunning={isRunning} 
            isJumping={isJumping} 
          />

          {/* AI Drone Companion "Byte" */}
          <CompanionDrone targetPos={playerPos} />

          {/* The Colossal Lost Temple */}
          <LostTempleEntrance 
            doorOpenProgress={doorOpenProgress} 
            isPuzzleActive={activeCodingTerminal} 
          />

          {/* 3 Beginner Relics in the Jungle */}
          <LoopRelicItem 
            position={relic1Pos} 
            color="#10b981" 
            title="Relic 1: Initialization" 
            runeSymbol="💎 i = 1" 
            isCollected={relic1Collected} 
            onCollect={checkInteraction} 
          />
          <LoopRelicItem 
            position={relic2Pos} 
            color="#38bdf8" 
            title="Relic 2: Continuation" 
            runeSymbol="🌀 range(1, 6)" 
            isCollected={relic2Collected} 
            onCollect={checkInteraction} 
          />
          <LoopRelicItem 
            position={relic3Pos} 
            color="#f59e0b" 
            title="Relic 3: Iteration" 
            runeSymbol="⚡ i = i + 1" 
            isCollected={relic3Collected} 
            onCollect={checkInteraction} 
          />

          {/* Waypoint Beacon on Temple Door when all 3 relics gathered */}
          {relic1Collected && relic2Collected && relic3Collected && !isDoorUnlocked && (
            <WaypointBeacon position={[0, 0, -24]} color="#ec4899" />
          )}

          {/* Lush Jungle Foliage & Environment */}
          <JungleTree position={[-8, 0, 5]} scale={1.2} />
          <JungleTree position={[9, 0, 8]} scale={1.3} />
          <JungleTree position={[-10, 0, -10]} scale={1.4} />
          <JungleTree position={[10, 0, -14]} scale={1.1} />
          <JungleTree position={[-7, 0, -20]} scale={1.5} />
          <JungleTree position={[8, 0, -22]} scale={1.3} />

          <MossyRock position={[-5, 0, 2]} scale={1.2} />
          <MossyRock position={[6, 0, -4]} scale={1.5} />
          <MossyRock position={[-8, 0, -14]} scale={1.8} />
          <MossyRock position={[5, 0, -18]} scale={1.1} />

          {/* River Stream */}
          <mesh position={[7, 0.04, -5]} rotation={[-Math.PI / 2, 0, 0.35]}>
            <planeGeometry args={[5, 36]} />
            <meshStandardMaterial color="#0891b2" roughness={0.1} metalness={0.5} transparent opacity={0.8} />
          </mesh>

          {/* Ground Jungle Terrain */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 70]} />
            <meshStandardMaterial color="#1a2e1d" roughness={0.9} />
          </mesh>
        </Canvas>
      </div>

      {/* PROLOGUE INTRO MODAL (EXCITING STARTING EXPERIENCE) */}
      {showPrologue && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0a140e] border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
            </div>

            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              Chapter 1: Playable 3D Adventure
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-chakra mb-3">
              THE LOST TEMPLE OF CODE
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              You are <b className="text-emerald-300">Dr. Imran</b>, explorer & cyber-archaeologist. Deep in this mysterious jungle stands a colossal ancient temple sealed by runic loop counterweights.
              <br /><br />
              <b>Your Mission:</b> Follow the glowing beams of light to collect the <span className="text-emerald-400">3 Ancient Loop Relics</span>, then breach the colossal stone gates!
            </p>

            <div className="grid grid-cols-2 gap-3 text-left mb-6 text-xs bg-black/60 p-4 rounded-2xl border border-emerald-950">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">🎮 Movement</span>
                <span className="text-slate-300">W, A, S, D or Arrows</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">👁️ Look Around</span>
                <span className="text-slate-300">Drag Mouse or ← → Keys</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">⚡ Sprint & Jump</span>
                <span className="text-slate-300">Shift to Run, Space to Jump</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">📜 Collect & Interact</span>
                <span className="text-slate-300">Press E or Click On-Screen</span>
              </div>
            </div>

            <button
              onClick={handleStartAdventure}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-700/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>BEGIN ADVENTURE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* RELIC COLLECTED MODAL */}
      {activeRelicModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0a1610] border border-emerald-500/50 rounded-3xl p-6 shadow-2xl relative text-center">
            
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              {activeRelicModal.badge}
            </div>
            <h3 className="text-2xl font-black text-white font-chakra mb-2">
              {activeRelicModal.title}
            </h3>
            <div className="text-xs text-amber-300 font-semibold mb-4">
              Reward: {activeRelicModal.reward}
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-900/60 text-left text-sm text-slate-200 mb-6 leading-relaxed">
              <div className="text-xs text-emerald-400 font-bold mb-1">💡 PROGRAMMING INSIGHT:</div>
              {activeRelicModal.description}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setActiveRelicModal(null);
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-colors cursor-pointer"
            >
              CONTINUE JOURNEY
            </button>
          </div>
        </div>
      )}

      {/* CLIFFHANGER CODING TERMINAL AT TEMPLE DOOR */}
      {activeCodingTerminal && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                Temple Door Security Override
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-chakra">
                FREQUENCY RESONANCE DECRYPTION
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoFillSolution}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Fill starter solution for beginners"
              >
                <Lightbulb className="w-3.5 h-3.5" /> Beginner Auto-Fill
              </button>
            </div>
          </div>

          {/* Visual Resonance Nodes Indicator */}
          <div className="my-3 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-emerald-200">
              <b>Required Frequency Sequence:</b> Generate integers <code className="bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-mono">[1, 2, 3, 4, 5]</code>
            </div>

            {/* 5 Resonance Nodes */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => {
                const isActive = activeFrequencies.includes(num);
                return (
                  <div
                    key={num}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/80 scale-110' 
                        : 'bg-black/80 border border-emerald-900/80 text-emerald-700'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-emerald-900/60 shadow-2xl relative my-2">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={pythonCode}
              onChange={(val) => setPythonCode(val || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Evaluation Result Feedback */}
          {evalResult && (
            <div className={`p-3 rounded-xl text-xs font-semibold mb-2 flex items-center gap-2 ${
              evalResult.success ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500' : 'bg-rose-950/80 text-rose-200 border border-rose-500'
            }`}>
              {evalResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              <span>{evalResult.message}</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-900/60">
            <div className="text-xs text-slate-400 hidden sm:block">
              💡 Hint: <code className="text-emerald-300 font-mono">for i in range(1, 6): frequencies.append(i)</code>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setActiveCodingTerminal(false)}
                className="px-4 py-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-slate-700 text-xs font-semibold text-slate-300"
              >
                Step Back
              </button>
              
              <button
                onClick={handleRunCode}
                disabled={evaluating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/50 cursor-pointer disabled:opacity-50"
              >
                {evaluating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resonating Counterweights...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Decryption & Breach Door</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

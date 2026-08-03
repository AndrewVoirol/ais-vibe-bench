import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { LLMModel } from '../types';
import { PROVIDER_COLORS } from '../constants';

// --- Shaders ---

const CoreVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Displacement based on noise
    float noise = snoise(position * 2.0 + uTime * 0.5);
    vec3 newPos = position + normal * noise * 0.2;
    
    vPosition = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const CoreFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Basic fresnel
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
    
    // Pulse color
    vec3 colorA = vec3(0.0, 0.1, 0.2); // Dark Slate
    vec3 colorB = vec3(0.2, 0.8, 0.6); // Emerald
    
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    vec3 finalColor = mix(colorA, colorB, fresnel + pulse * 0.2);
    
    // Add glowing core center
    float centerGlow = 1.0 / length(vPosition) * 0.2;
    
    gl_FragColor = vec4(finalColor + centerGlow, 0.9);
  }
`;

// --- Components ---

const SingularityCore = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame(({ clock }) => {
    // Safety check to ensure uniforms exist before setting value
    if (material.current && material.current.uniforms && material.current.uniforms.uTime) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={CoreVertexShader}
        fragmentShader={CoreFragmentShader}
        transparent
        side={THREE.DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface ModelSystemProps {
  model: LLMModel;
  position: [number, number, number];
  color: string;
  index: number;
  total: number;
}

const ModelSystem: React.FC<ModelSystemProps> = ({ model, position, color, index, total }) => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (group.current) {
      // Orbit logic
      const t = clock.getElapsedTime() * 0.2;
      const angle = (index / total) * Math.PI * 2 + t;
      const radius = 6;
      group.current.position.x = Math.cos(angle) * radius;
      group.current.position.z = Math.sin(angle) * radius;
      
      // Look at center
      group.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={group} position={position}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <group 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
            {/* Planet */}
            <mesh>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={hovered ? 3 : 1}
                roughness={0.4}
                metalness={0.8}
              />
            </mesh>

            {/* Context Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.65, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <ringGeometry args={[0.7, 0.72, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* Label */}
            <Html position={[0, -1, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
               <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="whitespace-nowrap font-display text-sm font-bold tracking-widest text-white shadow-black drop-shadow-md">
                    {model.name}
                  </div>
                  {hovered && (
                      <div className="glass-panel mt-2 flex flex-col gap-1 rounded border border-slate-700 p-2 text-[10px] text-slate-300 backdrop-blur-md">
                          <div className="flex justify-between gap-4"><span>VIBE</span> <span style={{color}}> {model.vibeScore}</span></div>
                          <div className="flex justify-between gap-4"><span>ELO</span> <span className="text-white">{model.elo}</span></div>
                          <div className="flex justify-between gap-4"><span>BASED</span> <span className="text-white">{model.attributes.basedness}</span></div>
                      </div>
                  )}
               </div>
            </Html>
        </group>
      </Float>
    </group>
  );
};

const ConnectionLines = ({ count = 20 }: { count?: number }) => {
    const lines = useMemo(() => {
        return new Array(count).fill(0).map(() => {
            const start = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
            const end = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
            return { start, end };
        });
    }, [count]);

    return (
        <group>
            {lines.map((line, i) => (
                <Line 
                    key={i} 
                    points={[line.start, line.end]} 
                    color="#1e293b" 
                    transparent 
                    opacity={0.1} 
                    lineWidth={1} 
                />
            ))}
        </group>
    )
}

const Particles = () => {
  const count = 1000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(s * 0.5 + 0.5); // Pulse size
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.4} />
    </instancedMesh>
  );
};

export const Hero3D: React.FC<{ models: LLMModel[] }> = ({ models }) => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#020617]">
      <Canvas camera={{ position: [0, 5, 12], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 10, 30]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#34d399" />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#0ea5e9" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <group>
            {/* The Vibe Core */}
            <SingularityCore />

            {/* Orbiting Models */}
            {models.map((model, i) => (
               <ModelSystem 
                  key={model.id} 
                  model={model} 
                  index={i} 
                  total={models.length}
                  position={[0, 0, 0]} // Controlled by component
                  color={PROVIDER_COLORS[model.provider]}
               />
            ))}
            
            {/* Background Chaos */}
            <Particles />
            <ConnectionLines />
        </group>

        <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
    </div>
  );
};

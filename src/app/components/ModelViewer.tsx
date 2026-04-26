import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/Hitem3d.glb');
  return <primitive object={scene} position={[0, -1, 0]} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-64 sm:h-80 md:h-[400px] relative bg-black flex items-center justify-center overflow-hidden border-t border-white/5">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} className="absolute inset-0 z-10">
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          {/* Allow user interaction but prevent zooming to keep it small / contained */}
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/Hitem3d.glb');

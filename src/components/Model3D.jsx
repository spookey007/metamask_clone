import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './Model3D.css';

function Model() {
  const modelRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Setup GLTFLoader with DRACOLoader
  const gltf = useLoader(GLTFLoader, '/anims/instance-transformed.glb', (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/libs/draco/'); // Make sure this path is correct
    loader.setDRACOLoader(dracoLoader);
  });

  // Mouse move tracking
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate model with mouse movement
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouseRef.current.x * 1 - modelRef.current.rotation.y) * 0.3;
      modelRef.current.rotation.x += (mouseRef.current.y * 1 - modelRef.current.rotation.x) * 0.3;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={6}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

const Model3D = () => {
  return (
    <div className="model-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        className="model-canvas"
      >
        <ambientLight intensity={0.8} />
        <spotLight
          position={[15, 15, 15]}
          angle={0.2}
          penumbra={1}
          intensity={1.2}
        />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3D;

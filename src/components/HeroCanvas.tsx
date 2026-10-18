'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SphereData {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  speed: number;
  offset: number;
  rotationSpeed: THREE.Vector3;
  parallaxFactor: number;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting for hyper-glossy reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    // Red accent rim light to create luxury reflections
    const redRimLight = new THREE.PointLight(0xe5262d, 5, 20);
    redRimLight.position.set(-6, -2, 4);
    scene.add(redRimLight);

    const fillLight = new THREE.DirectionalLight(0xf6f3f0, 1.8);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const topSoftLight = new THREE.PointLight(0xffffff, 3, 15);
    topSoftLight.position.set(0, 5, 5);
    scene.add(topSoftLight);

    // 3. Glossy Materials (Red, Obsidian Black, Pure White/Pearl)
    const redGlossMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e5262d'),
      emissive: new THREE.Color('#3a0507'),
      roughness: 0.12,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });

    const blackGlossMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0d0d0d'),
      roughness: 0.08,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
    });

    const whiteGlossMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#fbf9f7'),
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.85,
    });

    const chromeGlossMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e0e0e0'),
      roughness: 0.04,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    // 4. Create Spheres with different sizes, colors and depths
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const smallSphereGeo = new THREE.SphereGeometry(0.5, 48, 48);

    const sphereConfigs = [
      // Central prominent Red signature sphere
      {
        material: redGlossMaterial,
        scale: 1.75,
        pos: new THREE.Vector3(2.5, 0.4, 0.5),
        speed: 1.1,
        parallax: 0.85,
      },
      // Sleek Obsidian Black primary sphere
      {
        material: blackGlossMaterial,
        scale: 2.1,
        pos: new THREE.Vector3(-2.8, -0.6, -1.2),
        speed: 0.8,
        parallax: 0.55,
      },
      // Pearlescent White floating sphere
      {
        material: whiteGlossMaterial,
        scale: 1.35,
        pos: new THREE.Vector3(1.0, -1.8, 1.2),
        speed: 1.3,
        parallax: 1.1,
      },
      // Chrome accent sphere
      {
        material: chromeGlossMaterial,
        scale: 0.9,
        pos: new THREE.Vector3(-1.2, 2.0, -0.5),
        speed: 0.9,
        parallax: 0.7,
      },
      // Small floating Red orb
      {
        material: redGlossMaterial,
        scale: 0.55,
        pos: new THREE.Vector3(-3.4, 1.5, 1.0),
        speed: 1.5,
        parallax: 1.3,
      },
      // Floating Obsidian satellite orb
      {
        material: blackGlossMaterial,
        scale: 0.65,
        pos: new THREE.Vector3(3.6, -1.5, -0.8),
        speed: 1.2,
        parallax: 0.9,
      },
      // Floating White micro orb
      {
        material: whiteGlossMaterial,
        scale: 0.45,
        pos: new THREE.Vector3(0.1, 2.3, 0.8),
        speed: 1.6,
        parallax: 1.2,
      },
    ];

    const spheres: SphereData[] = sphereConfigs.map((cfg, i) => {
      const geo = cfg.scale < 0.7 ? smallSphereGeo : sphereGeometry;
      const mesh = new THREE.Mesh(geo, cfg.material);
      mesh.scale.setScalar(cfg.scale);
      mesh.position.copy(cfg.pos);
      scene.add(mesh);

      return {
        mesh,
        basePos: cfg.pos.clone(),
        speed: cfg.speed,
        offset: i * 1.35,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.008,
          0
        ),
        parallaxFactor: cfg.parallax,
      };
    });

    // 5. Mouse Interaction Tracking with Smooth Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    // Touch support for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = x;
        mouse.targetY = y;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Update spheres
      spheres.forEach((s) => {
        // Floating sinusoidal levitation
        const floatY = Math.sin(elapsedTime * s.speed + s.offset) * 0.35;
        const floatX = Math.cos(elapsedTime * (s.speed * 0.7) + s.offset) * 0.2;

        // Mouse reactive displacement with depth parallax
        const mouseDisplaceX = mouse.x * 1.4 * s.parallaxFactor;
        const mouseDisplaceY = mouse.y * 1.4 * s.parallaxFactor;

        s.mesh.position.x = s.basePos.x + floatX + mouseDisplaceX;
        s.mesh.position.y = s.basePos.y + floatY + mouseDisplaceY;

        // Subtle rotation for light glints
        s.mesh.rotation.x += s.rotationSpeed.x;
        s.mesh.rotation.y += s.rotationSpeed.y;
      });

      // Subtle camera tilt
      camera.position.x = mouse.x * 0.4;
      camera.position.y = mouse.y * 0.4;
      camera.lookAt(0, 0, 0);

      // Move red rim light slightly with mouse for dynamic edge glow
      redRimLight.position.x = -6 + mouse.x * 3;
      redRimLight.position.y = -2 + mouse.y * 2;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      smallSphereGeo.dispose();
      redGlossMaterial.dispose();
      blackGlossMaterial.dispose();
      whiteGlossMaterial.dispose();
      chromeGlossMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

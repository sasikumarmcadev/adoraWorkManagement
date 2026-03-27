import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export function DottedSurface({ className, ...props }) {
  const { theme } = useTheme();

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 100;
    const AMOUNTX = 350;
    const AMOUNTY = 120;

    // Scene setup
    const scene = new THREE.Scene();
    const isDark = theme === 'dark';
    const fogColor = isDark ? 0x000000 : 0xffffff;
    scene.fog = new THREE.Fog(fogColor, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    containerRef.current.appendChild(renderer.domElement);

    const positions = [];
    const colors = [];
    const ixiyArray = [];

    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);
        ixiyArray.push(ix, iy);
        
        if (isDark) {
          colors.push(0.31, 0.31, 0.31); 
        } else {
          colors.push(0, 0, 0); 
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('ixiy', new THREE.Float32BufferAttribute(ixiyArray, 2));

    const uniforms = { uTime: { value: 0 } };

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = 'uniform float uTime;\nattribute vec2 ixiy;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        vec3 transformed = vec3(position);
        transformed.y = sin((ixiy.x + uTime) * 0.3) * 50.0 + sin((ixiy.y + uTime) * 0.5) * 50.0;
        `
      );
    };

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    const animate = () => {
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value = count;
      renderer.render(scene, camera);
      count += 0.08;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      animationId,
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.renderer.dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      {...props}
    />
  );
}

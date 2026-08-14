"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DTooth() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // stylized "tooth" — smooth blob built from a scaled icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.6, 6);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const scale = 1 + Math.max(0, -y) * 0.35; // wider top, tapered bottom like a tooth
      positions.setX(i, positions.getX(i) * (y > 0.3 ? 1.1 : 1));
      positions.setZ(i, positions.getZ(i) * (y > 0.3 ? 1.1 : 1));
      positions.setY(i, y * 1.3);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F7F3EC"),
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transmission: 0.15,
      thickness: 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const rim = new THREE.DirectionalLight("#2D9C8F", 2);
    rim.position.set(-3, 2, 4);
    scene.add(rim);

    const fill = new THREE.DirectionalLight("#FF7A59", 1.2);
    fill.position.set(3, -2, 2);
    scene.add(fill);

    const ambient = new THREE.AmbientLight("#ffffff", 0.6);
    scene.add(ambient);

    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.6;
      targetY = y * 0.6;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      mesh.rotation.y += 0.004;
      mesh.rotation.x += (targetY - mesh.rotation.x) * 0.05;
      mesh.rotation.z += (targetX - mesh.rotation.z) * 0.05;
      mesh.position.y = Math.sin(t * 0.8) * 0.15;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[380px] md:h-[420px]" />;
}
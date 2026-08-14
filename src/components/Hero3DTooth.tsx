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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ---- Tooth group: crown + two roots, matching the original silhouette ----
    const toothGroup = new THREE.Group();

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FBFAF7"),
      roughness: 0.15,
      metalness: 0.0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.25,
      thickness: 1.2,
      iridescence: 0.6,
      iridescenceIOR: 1.3,
      sheen: 1,
      sheenColor: new THREE.Color("#2D9C8F"),
    });

    // crown (wide top, two-lobed like a molar)
    const crownGeo = new THREE.SphereGeometry(1.5, 48, 48);
    crownGeo.scale(1.15, 0.85, 1);
    const crown = new THREE.Mesh(crownGeo, pearlMaterial);
    crown.position.y = 1.1;
    toothGroup.add(crown);

    // two roots tapering down
    const rootGeo = new THREE.ConeGeometry(0.42, 2.2, 24);
    const rootL = new THREE.Mesh(rootGeo, pearlMaterial);
    rootL.position.set(-0.55, -1.1, 0);
    rootL.rotation.z = 0.12;
    toothGroup.add(rootL);

    const rootR = new THREE.Mesh(rootGeo, pearlMaterial);
    rootR.position.set(0.55, -1.1, 0);
    rootR.rotation.z = -0.12;
    toothGroup.add(rootR);

    toothGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(toothGroup);

    // ---- lighting ----
    const rim = new THREE.DirectionalLight("#2D9C8F", 2.2);
    rim.position.set(-3, 2, 4);
    scene.add(rim);

    const fill = new THREE.DirectionalLight("#FF7A59", 1.4);
    fill.position.set(3, -1, 3);
    scene.add(fill);

    const ambient = new THREE.AmbientLight("#ffffff", 0.7);
    scene.add(ambient);

    const topLight = new THREE.PointLight("#ffffff", 1.2, 10);
    topLight.position.set(0, 3, 3);
    scene.add(topLight);

    // ---- orbiting sparkles ----
    const sparkleCount = 60;
    const sparkleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.3 + Math.random() * 1.2;
      const y = (Math.random() - 0.5) * 3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const sparkleMaterial = new THREE.PointsMaterial({
      color: "#2D9C8F",
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMaterial);
    scene.add(sparkles);

    const sparkleMaterial2 = new THREE.PointsMaterial({
      color: "#FF7A59",
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const sparkles2 = new THREE.Points(sparkleGeo.clone(), sparkleMaterial2);
    sparkles2.rotation.y = Math.PI / 2;
    scene.add(sparkles2);

    // ---- interaction ----
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.5;
      targetY = y * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      toothGroup.rotation.y += 0.006;
      toothGroup.rotation.x += (targetY - toothGroup.rotation.x) * 0.05;
      toothGroup.rotation.z += (targetX - toothGroup.rotation.z) * 0.05;
      toothGroup.position.y = Math.sin(t * 0.8) * 0.15;

      sparkles.rotation.y += 0.0025;
      sparkles2.rotation.y -= 0.002;
      sparkleMaterial.opacity = 0.5 + Math.sin(t * 2) * 0.3;
      sparkleMaterial2.opacity = 0.5 + Math.cos(t * 2) * 0.3;

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
      crownGeo.dispose();
      rootGeo.dispose();
      pearlMaterial.dispose();
      sparkleGeo.dispose();
      sparkleMaterial.dispose();
      sparkleMaterial2.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[420px] md:h-[480px]" />;
}
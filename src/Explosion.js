import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Explosion = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; // ← ここでローカル変数にコピー

    const scene = new THREE.Scene();

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // レンダラー
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // 粒子群を作成
    const particles = [];
    const particleCount = 200;
    const gravity = new THREE.Vector3(0, -0.03, 0); // 少し強めの重力

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.12, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`hsl(${30 + Math.random() * 30}, 100%, 50%)`),
        transparent: true,
        opacity: 1.0,
      });

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(0, 0, 0);

      // ランダムな球面方向に速度を与える
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 4 + Math.random() * 6;

      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).multiplyScalar(speed);

      particle.userData.velocity = velocity;
      particle.userData.aliveTime = 0; // 生存時間カウント

      scene.add(particle);
      particles.push(particle);
    }

    // 爆発のフラッシュ光
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffcc,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });
    const flash = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), flashMaterial);
    scene.add(flash);

    // アニメーション開始時刻
    let startTime = null;
    const maxDuration = 3500; // 3.5秒でフェードアウト終了

    // アニメーション関数
    let frameId;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      particles.forEach((p) => {
        // 重力加算
        p.userData.velocity.add(gravity);

        // 位置更新
        p.position.add(p.userData.velocity);

        // 生存時間アップデート
        p.userData.aliveTime += 16;

        // 徐々に透明にし縮小
        p.material.opacity = THREE.MathUtils.clamp(1 - p.userData.aliveTime / maxDuration, 0, 1);
        const scaleVal = THREE.MathUtils.lerp(1, 0, p.userData.aliveTime / maxDuration);
        p.scale.setScalar(scaleVal);
      });

      // フラッシュも徐々に大きく、透明に
      flash.scale.multiplyScalar(1.1);
      flash.material.opacity = THREE.MathUtils.clamp(1 - elapsed / maxDuration, 0, 1);

      renderer.render(scene, camera);
      if (elapsed < maxDuration) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Explosion;
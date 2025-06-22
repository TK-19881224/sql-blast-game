import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ExplosionThree = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // シーンセットアップ
    const scene = new THREE.Scene();

    // カメラセットアップ
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // レンダラーセットアップ
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // 🧨 爆弾本体（黒い球体）
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 1,
    });
    const bomb = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(bomb);

    // 🧵 導火線（シリンダー）
    const fuseGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const fuseMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // オレンジ
    const fuse = new THREE.Mesh(fuseGeometry, fuseMaterial);
    fuse.position.y = 0.6; // 球の上に乗せる
    bomb.add(fuse); // 球体に付ける

    // 🔥 火花（オプション: 点滅）
    const sparkGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
    spark.position.y = 0.2;
    fuse.add(spark);

    // リサイズ対応
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let reqId;

    // アニメーション関数
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // スケールアップ
      bomb.scale.x += 0.01;
      bomb.scale.y += 0.01;
      bomb.scale.z += 0.01;

      // フェードアウト
      if (bomb.material.opacity > 0) {
        bomb.material.opacity -= 0.01;
        if (bomb.material.opacity < 0) bomb.material.opacity = 0;
      }

      // 点滅（火花用）
      spark.visible = Math.random() > 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // クリーンアップ
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default ExplosionThree;
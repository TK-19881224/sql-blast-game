import * as THREE from 'three';

const scene = new THREE.Scene();

// カメラ設定
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 球体の作成
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーション
function animate() {
  requestAnimationFrame(animate);

  // スケールアップ
  sphere.scale.x += 0.01;
  sphere.scale.y += 0.01;
  sphere.scale.z += 0.01;

  // フェードアウト
  if (sphere.material.opacity > 0) {
    sphere.material.opacity -= 0.01;
    if (sphere.material.opacity < 0) sphere.material.opacity = 0;
  }

  renderer.render(scene, camera);
}
animate();
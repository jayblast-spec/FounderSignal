import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("signal3d");

if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.65, 7.4);

  const root = new THREE.Group();
  scene.add(root);

  const teal = new THREE.Color("#00f5a0");
  const blue = new THREE.Color("#7aa7ff");
  const gold = new THREE.Color("#ffb800");
  const ink = new THREE.Color("#00f5a0");

  scene.add(new THREE.AmbientLight("#8affcb", 0.55));
  const key = new THREE.DirectionalLight("#cdffde", 2.4);
  key.position.set(3, 5, 5);
  scene.add(key);

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: "#17231f",
    roughness: 0.22,
    metalness: 0.72,
    emissive: "#00f5a0",
    emissiveIntensity: 0.16,
  });
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: "#00f5a0",
    wireframe: true,
    transparent: true,
    opacity: 0.34,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 2), ringMaterial);
  root.add(core);

  const haloA = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.012, 12, 160), wireMaterial);
  haloA.rotation.x = Math.PI / 2.45;
  root.add(haloA);

  const haloB = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.01, 12, 180), wireMaterial.clone());
  haloB.material.color = blue;
  haloB.rotation.y = Math.PI / 2.1;
  root.add(haloB);

  const haloC = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.008, 12, 220), wireMaterial.clone());
  haloC.material.color = gold;
  haloC.rotation.x = Math.PI / 2;
  haloC.rotation.z = 0.4;
  root.add(haloC);

  const nodeGeometry = new THREE.SphereGeometry(0.065, 24, 24);
  const nodes = [];
  const nodeData = [
    { color: teal, radius: 1.65, speed: 0.62, y: 0.15, phase: 0 },
    { color: blue, radius: 2.35, speed: -0.44, y: -0.22, phase: 1.7 },
    { color: gold, radius: 3.05, speed: 0.28, y: 0.34, phase: 2.8 },
    { color: teal, radius: 2.75, speed: -0.34, y: -0.5, phase: 4.2 },
  ];
  for (const data of nodeData) {
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.55,
      roughness: 0.28,
      metalness: 0.25,
    });
    const node = new THREE.Mesh(nodeGeometry, material);
    node.userData = data;
    root.add(node);
    nodes.push(node);
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#00f5a0",
    transparent: true,
    opacity: 0.36,
  });
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(nodes.length * 2 * 3);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  root.add(lines);

  const particleCount = 420;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.8 + Math.random() * 3.4;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 3.8;
    particlePositions[i * 3] = Math.cos(a) * r;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = Math.sin(a) * r;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: "#00f5a0",
      size: 0.018,
      transparent: true,
      opacity: 0.52,
    }),
  );
  scene.add(particles);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8, 28, 18),
    new THREE.MeshBasicMaterial({
      color: ink,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    }),
  );
  plane.rotation.x = -Math.PI / 2.25;
  plane.position.y = -2.05;
  plane.position.z = -0.8;
  scene.add(plane);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    resize();

    root.rotation.y = t * 0.13;
    root.rotation.x = Math.sin(t * 0.28) * 0.08;
    core.rotation.x = t * 0.25;
    core.rotation.y = t * 0.38;
    haloA.rotation.z = t * 0.24;
    haloB.rotation.x = t * 0.18;
    haloC.rotation.y = t * -0.12;
    particles.rotation.y = t * 0.025;
    plane.position.x = Math.sin(t * 0.35) * 0.18;

    nodes.forEach((node, index) => {
      const data = node.userData;
      const angle = t * data.speed + data.phase;
      node.position.set(
        Math.cos(angle) * data.radius,
        data.y + Math.sin(angle * 1.8) * 0.16,
        Math.sin(angle) * data.radius * 0.55,
      );
      const positions = lineGeometry.attributes.position.array;
      positions[index * 6] = 0;
      positions[index * 6 + 1] = 0;
      positions[index * 6 + 2] = 0;
      positions[index * 6 + 3] = node.position.x;
      positions[index * 6 + 4] = node.position.y;
      positions[index * 6 + 5] = node.position.z;
    });
    lineGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

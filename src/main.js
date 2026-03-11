import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const app = document.getElementById("app");
const captionEl = document.getElementById("caption");
const teachingEl = document.getElementById("teachingText");
const devcheckEl = document.getElementById("devcheck");
const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");
const volumeInput = document.getElementById("volume");
const freqInput = document.getElementById("freq");
const freqText = document.getElementById("freqText");
const volText = document.getElementById("volText");

const checks = [];
function addCheck(label, pass, detail = "") {
  checks.push({ label, pass, detail });
  devcheckEl.innerHTML = `
    <strong>运行检查</strong><br />
    ${checks.map((item) => `${item.pass ? '<span class="ok">✓</span>' : '<span class="warn">⚠</span>'} ${item.label}${item.detail ? `：${item.detail}` : ""}`).join("<br />")}
  `;
}

addCheck("Three.js 已加载", !!THREE.REVISION, `r${THREE.REVISION || "unknown"}`);
addCheck("OrbitControls 已加载", typeof OrbitControls === "function");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1115);
scene.fog = new THREE.Fog(0x0f1115, 10, 24);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.6, 2.7, 7.6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
app.appendChild(renderer.domElement);
addCheck("Renderer 已创建", !!renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 14;
addCheck("交互控制器已创建", true);

const hemi = new THREE.HemisphereLight(0xa8c7ff, 0x1b1d22, 1.2);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.6);
dir.position.set(4, 8, 5);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
dir.shadow.camera.left = -10;
dir.shadow.camera.right = 10;
dir.shadow.camera.top = 10;
dir.shadow.camera.bottom = -10;
scene.add(dir);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: 0x151922, roughness: 0.95, metalness: 0.02 }),
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(30, 30, 0x263141, 0x1b2230);
grid.position.y = 0.001;
scene.add(grid);

const speakerGroup = new THREE.Group();
scene.add(speakerGroup);
speakerGroup.position.set(-3.0, 0.9, 0);
// 让喇叭正面朝向 +X，正对右侧的一排小球。
speakerGroup.rotation.y = Math.PI / 2;

const speakerBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.8, 1.0),
  new THREE.MeshStandardMaterial({ color: 0x20252f, roughness: 0.65, metalness: 0.2 }),
);
speakerBody.castShadow = true;
speakerBody.receiveShadow = true;
speakerGroup.add(speakerBody);

// 喇叭口（锥形）+ 鼓膜（振动面），让声源结构更符合教学示意。
const hornBaseZ = 0.51;
const horn = new THREE.Mesh(
  new THREE.CylinderGeometry(0.33, 0.46, 0.2, 48, 1, false),
  new THREE.MeshStandardMaterial({ color: 0x2a3446, roughness: 0.42, metalness: 0.3 }),
);
horn.rotation.x = Math.PI / 2;
horn.position.set(0, 0, hornBaseZ);
horn.castShadow = true;
speakerGroup.add(horn);

const hornLip = new THREE.Mesh(
  new THREE.TorusGeometry(0.47, 0.04, 18, 80),
  new THREE.MeshStandardMaterial({ color: 0x8fa6c5, roughness: 0.28, metalness: 0.6 }),
);
hornLip.position.set(0, 0, hornBaseZ + 0.08);
hornLip.castShadow = true;
speakerGroup.add(hornLip);

const diaphragmBaseZ = hornBaseZ + 0.07;
const diaphragm = new THREE.Mesh(
  new THREE.CircleGeometry(0.27, 48),
  new THREE.MeshStandardMaterial({ color: 0x667892, roughness: 0.22, metalness: 0.2 }),
);
diaphragm.position.set(0, 0, diaphragmBaseZ);
diaphragm.castShadow = true;
speakerGroup.add(diaphragm);

const wooferRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.29, 0.026, 16, 70),
  new THREE.MeshStandardMaterial({ color: 0xa7bbd4, roughness: 0.32, metalness: 0.46 }),
);
wooferRing.position.set(0, 0, diaphragmBaseZ + 0.01);
speakerGroup.add(wooferRing);

const experimentGroup = new THREE.Group();
scene.add(experimentGroup);

const standMaterial = new THREE.MeshStandardMaterial({ color: 0x7f8b99, roughness: 0.35, metalness: 0.75 });
const topY = 2.25;
const standLeftX = -1.35;
const standRightX = 1.4;

const leftPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 20), standMaterial);
leftPole.position.set(standLeftX, 1.1, 0);
leftPole.castShadow = true;
experimentGroup.add(leftPole);

const rightPole = leftPole.clone();
rightPole.position.x = standRightX;
experimentGroup.add(rightPole);

const topBar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.025, 0.025, standRightX - standLeftX, 20),
  standMaterial,
);
topBar.rotation.z = Math.PI / 2;
topBar.position.set((standLeftX + standRightX) / 2, topY, 0);
topBar.castShadow = true;
experimentGroup.add(topBar);

const baseBarL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.45), standMaterial);
baseBarL.position.set(standLeftX, 0.025, 0);
experimentGroup.add(baseBarL);
const baseBarR = baseBarL.clone();
baseBarR.position.x = standRightX;
experimentGroup.add(baseBarR);

const ballXs = [-1.0, -0.6, -0.2, 0.2, 0.6, 1.0];
const ballDistanceMin = ballXs[0] - speakerGroup.position.x;
const ballDistanceMax = ballXs[ballXs.length - 1] - speakerGroup.position.x;
const ballDistanceRange = Math.max(0.0001, ballDistanceMax - ballDistanceMin);
const balls = [];
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xf1a13a, roughness: 0.55, metalness: 0.05 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xc9d3df, transparent: true, opacity: 0.9 });

function makeStringGeometry(endPoint) {
  return new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), endPoint.clone()]);
}

ballXs.forEach((x) => {
  const group = new THREE.Group();
  group.position.set(x, topY, 0);
  experimentGroup.add(group);

  const ballRest = new THREE.Vector3(0, -1.05, 0);
  const line = new THREE.Line(makeStringGeometry(ballRest), lineMaterial);
  group.add(line);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 32), ballMaterial);
  ball.position.copy(ballRest);
  ball.castShadow = true;
  ball.receiveShadow = true;
  group.add(ball);

  const distance = x - speakerGroup.position.x;
  const normalizedDistance = (distance - ballDistanceMin) / ballDistanceRange;

  balls.push({
    group,
    line,
    ball,
    rest: ballRest,
    distance,
    normalizedDistance,
    delay: distance * 0.4,
  });
});
addCheck("6 个小球已创建", balls.length === 6, `当前数量 ${balls.length}`);

const waveGroup = new THREE.Group();
scene.add(waveGroup);
const waves = [];
const waveCurvePoints = [];
const waveHeight = 1.45;
for (let i = 0; i <= 48; i++) {
  const y = -waveHeight / 2 + (i / 48) * waveHeight;
  const z = Math.sin((i / 48) * Math.PI) * 0.10;
  waveCurvePoints.push(new THREE.Vector3(0, y, z));
}
const waveCurve = new THREE.CatmullRomCurve3(waveCurvePoints);
const waveTubeGeometry = new THREE.TubeGeometry(waveCurve, 48, 0.012, 8, false);

for (let i = 0; i < 8; i++) {
  const wave = new THREE.Mesh(
    waveTubeGeometry,
    new THREE.MeshBasicMaterial({ color: 0x7ec2ff, transparent: true, opacity: 0 }),
  );
  wave.visible = false;
  waveGroup.add(wave);
  waves.push({ mesh: wave, progress: 0, active: false, x: -2.3 });
}
addCheck("波前对象已创建", waves.length === 8, `当前数量 ${waves.length}`);

function spawnWave() {
  const available = waves.find((w) => !w.active);
  if (!available) return;
  available.active = true;
  available.progress = 0;
  available.x = -2.35;
  available.mesh.visible = true;
  available.mesh.position.set(available.x, 1.12, 0);
  available.mesh.scale.set(1, 1, 1);
  available.mesh.material.opacity = 0.85;
}

const cols = 22;
const rows = 10;
const particleCount = cols * rows;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particleMeta = [];

let idx = 0;
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = -2.2 + col * 0.19;
    const y = 0.52 + row * 0.18;
    const z = row % 2 === 0 ? -0.02 : 0.02;
    particlePositions[idx * 3] = x;
    particlePositions[idx * 3 + 1] = y;
    particlePositions[idx * 3 + 2] = z;
    particleColors[idx * 3] = 0.74;
    particleColors[idx * 3 + 1] = 0.88;
    particleColors[idx * 3 + 2] = 1.0;
    particleMeta.push({ baseX: x, baseY: y, baseZ: z, col, row });
    idx++;
  }
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  }),
);
particles.visible = true;
scene.add(particles);
addCheck("微观粒子已创建", particleMeta.length === particleCount, `当前数量 ${particleMeta.length}`);

const densityBars = [];
const densityBarGeometry = new THREE.PlaneGeometry(0.16, 1.85);
for (let i = 0; i < 10; i++) {
  const bar = new THREE.Mesh(
    densityBarGeometry,
    new THREE.MeshBasicMaterial({ color: 0x6db8ff, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  bar.position.set(-2.0 + i * 0.38, 1.33, -0.18);
  scene.add(bar);
  densityBars.push(bar);
}
addCheck("疏密区辅助层已创建", densityBars.length === 10, `当前数量 ${densityBars.length}`);

const state = {
  playing: false,
  volume: 0.7,
  freqIndex: 1,
  timelineTime: 0,
  lastSpawn: 0,
  totalDuration: 60,
  clock: new THREE.Clock(),
};

const freqMap = [2.2, 4.3, 7.2];
const freqLabelMap = ["低", "中", "高"];

const captionTimeline = [
  { start: 0, end: 8, text: "声音是如何传播的？" },
  { start: 8, end: 20, text: "声源振动产生声音" },
  { start: 20, end: 35, text: "振动通过空气逐层传播" },
  { start: 35, end: 50, text: "声音可以传递能量" },
  { start: 50, end: 61, text: "空气分子振动形成声波" },
];
addCheck("字幕时间轴已配置", captionTimeline.length === 5, `当前段数 ${captionTimeline.length}`);

const teachingTimeline = [
  {
    start: 0,
    end: 8,
    text: "同学们先看声源与受体的空间位置：左侧音箱是声源，右侧小球列是受体系统，今天我们重点观察“振动如何在介质中逐层传递”。",
  },
  {
    start: 8,
    end: 20,
    text: "请盯住喇叭鼓膜，鼓膜做周期性前后振动；这不是空气整体前进，而是驱动相邻空气层发生受迫振动。",
  },
  {
    start: 20,
    end: 35,
    text: "现在看到的竖向波前与粒子疏密变化，分别对应宏观波前推进和微观压缩/稀疏区交替，这正是纵波传播特征。",
  },
  {
    start: 35,
    end: 50,
    text: "请比较六个小球：靠近声源的振幅更大、响应更早，远处振幅衰减更明显，说明波在传播中能量逐步分散。",
  },
  {
    start: 50,
    end: 61,
    text: "结论要记牢：声波传播的是振动状态与能量，不是空气分子的整体迁移；分子主要在平衡位置附近往复振动。",
  },
];

function setCaption(t) {
  const active = captionTimeline.find((item) => t >= item.start && t < item.end) || captionTimeline[0];
  captionEl.textContent = active.text;
}

function setTeachingText(t) {
  const active = teachingTimeline.find((item) => t >= item.start && t < item.end) || teachingTimeline[0];
  teachingEl.textContent = active.text;
}

function updateUI() {
  freqText.textContent = `频率：${freqLabelMap[state.freqIndex]}`;
  volText.textContent = `音量：${state.volume.toFixed(2)}`;
}

function resetStringsAndBalls() {
  balls.forEach(({ group, ball, line, rest }) => {
    group.rotation.z = 0;
    ball.position.copy(rest);
    line.geometry.dispose();
    line.geometry = makeStringGeometry(rest);
  });
}

function resetScene() {
  state.timelineTime = 0;
  state.lastSpawn = 0;
  state.playing = false;
  playBtn.textContent = "播放";
  setCaption(0);
  setTeachingText(0);
  diaphragm.position.z = diaphragmBaseZ;
  diaphragm.scale.set(1, 1, 1);
  resetStringsAndBalls();
  waves.forEach((w) => {
    w.active = false;
    w.progress = 0;
    w.mesh.visible = false;
    w.mesh.material.opacity = 0;
  });
  particles.visible = true;
  particles.material.opacity = 0.85;
  densityBars.forEach((bar) => {
    bar.visible = true;
  });
  updateUI();
}

playBtn.addEventListener("click", () => {
  state.playing = !state.playing;
  playBtn.textContent = state.playing ? "暂停" : "播放";
});

resetBtn.addEventListener("click", resetScene);

volumeInput.addEventListener("input", (e) => {
  state.volume = Number(e.target.value);
  updateUI();
});

freqInput.addEventListener("input", (e) => {
  state.freqIndex = Number(e.target.value);
  updateUI();
});

updateUI();

function updateWaves(dt) {
  const freq = freqMap[state.freqIndex];
  const canEmit = state.playing;
  const spawnGap = Math.max(0.18, 0.48 - state.volume * 0.18 - freq * 0.015);

  if (canEmit && state.timelineTime - state.lastSpawn > spawnGap) {
    spawnWave();
    state.lastSpawn = state.timelineTime;
  }

  waves.forEach((w) => {
    if (!w.active) return;
    w.progress += dt * (1.2 + state.volume * 0.7 + freq * 0.03);
    w.x = -2.35 + w.progress * 4.55;
    w.mesh.position.x = w.x;
    w.mesh.position.y = 1.12;

    const stretchZ = 1 + Math.sin(w.progress * 6.0) * 0.12;
    w.mesh.scale.set(1, 1, stretchZ);
    w.mesh.material.opacity = Math.max(0, 0.88 - w.progress * 0.52);

    if (w.progress > 1.55) {
      w.active = false;
      w.mesh.visible = false;
      w.mesh.material.opacity = 0;
    }
  });
}

function updateParticles(t) {
  const positions = particleGeometry.attributes.position.array;
  const colors = particleGeometry.attributes.color.array;
  const amplitude = 0.016 + state.volume * 0.032;
  const omega = freqMap[state.freqIndex] * 1.15;
  const waveNumber = 5.6;

  for (let i = 0; i < particleMeta.length; i++) {
    const meta = particleMeta[i];
    const phase = omega * t - (meta.baseX + 2.25) * waveNumber;
    const dx = Math.sin(phase) * amplitude;
    const density = (Math.cos(phase) + 1) * 0.5;

    positions[i * 3] = meta.baseX + dx;
    positions[i * 3 + 1] = meta.baseY;
    positions[i * 3 + 2] = meta.baseZ;

    colors[i * 3] = 0.55 + density * 0.25;
    colors[i * 3 + 1] = 0.75 + density * 0.18;
    colors[i * 3 + 2] = 0.95 + density * 0.03;
  }

  particleGeometry.attributes.position.needsUpdate = true;
  particleGeometry.attributes.color.needsUpdate = true;
  particles.material.opacity = 0.85;
  particles.visible = true;

  densityBars.forEach((bar, index) => {
    const baseX = -2.0 + index * 0.38;
    const phase = omega * t - (baseX + 2.1) * waveNumber;
    const compression = (Math.cos(phase) + 1) * 0.5;
    bar.visible = true;
    bar.position.x = baseX + Math.sin(phase) * amplitude * 0.7;
    bar.scale.x = 0.65 + compression * 0.65;
    bar.material.opacity = 0.06 + compression * 0.14;
  });
}

function updateExperiment(t) {
  const omega = freqMap[state.freqIndex];
  const amp = 0.02 + state.volume * 0.085;
  const activeExperiment = state.playing;

  if (activeExperiment) {
    const vibration = Math.sin(t * omega) * amp;
    const pulse = 1 + Math.sin(t * omega * 1.9) * (0.02 + state.volume * 0.03);
    diaphragm.position.z = diaphragmBaseZ + vibration;
    diaphragm.scale.set(pulse, pulse, 1);
  } else {
    diaphragm.position.z = diaphragmBaseZ;
    diaphragm.scale.set(1, 1, 1);
  }

  balls.forEach(({ group, ball, line, rest, delay, normalizedDistance }) => {
    const started = activeExperiment && t > delay;
    const localT = started ? t - delay : 0;
    const envelope = started ? Math.min(1, localT * 2.3) : 0;
    // 近强远弱：使用指数衰减，确保视觉差异明显。
    const distanceAttenuation = Math.pow(0.22, normalizedDistance * 1.05);
    const strength = envelope * state.volume * distanceAttenuation;

    const swing = Math.sin(localT * omega * 0.95) * strength * 0.9;
    const zOffset = Math.sin(localT * omega * 1.25) * strength * 0.18;
    const yLift = Math.max(0, Math.sin(localT * omega * 0.58)) * strength * 0.12;

    group.rotation.z = swing;
    ball.position.set(0, rest.y + yLift, zOffset);

    line.geometry.dispose();
    line.geometry = makeStringGeometry(ball.position);
  });

  speakerGroup.visible = true;
  experimentGroup.visible = true;
  waveGroup.visible = true;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = state.clock.getDelta();

  if (state.playing) {
    state.timelineTime += dt;
    if (state.timelineTime > state.totalDuration) state.timelineTime = state.totalDuration;
  }

  const t = state.timelineTime;

  setCaption(t);
  setTeachingText(t);
  updateExperiment(t);
  updateWaves(dt);
  updateParticles(t);

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

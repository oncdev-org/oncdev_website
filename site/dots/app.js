/**
 * Standalone Poisson Disk Sampling (Bridson's Algorithm)
 * Generates an even, blue-noise distribution of points in 2D.
 */
class PoissonDiskSampling {
  constructor(options, rng = Math.random) {
    this.width = options.shape[0];
    this.height = options.shape[1];
    this.minDistance = options.minDistance;
    this.maxTries = options.tries || 30;
    this.rng = rng;
  }

  fill() {
    const r = this.minDistance;
    const cellSize = r / Math.sqrt(2);
    const gridWidth = Math.ceil(this.width / cellSize);
    const gridHeight = Math.ceil(this.height / cellSize);
    const grid = new Array(gridWidth * gridHeight).fill(-1);

    const points = [];
    const active = [];

    const addPoint = (p) => {
      points.push(p);
      const idx = points.length - 1;
      const gx = Math.floor(p[0] / cellSize);
      const gy = Math.floor(p[1] / cellSize);
      grid[gx + gy * gridWidth] = idx;
      active.push(idx);
    };

    // Spawn first point randomly
    addPoint([this.rng() * this.width, this.rng() * this.height]);

    while (active.length > 0) {
      const randIdx = Math.floor(this.rng() * active.length);
      const pointIdx = active[randIdx];
      const p = points[pointIdx];
      let found = false;

      for (let i = 0; i < this.maxTries; i++) {
        const theta = this.rng() * Math.PI * 2;
        const dist = r + this.rng() * r; // Random distance between r and 2r
        const newX = p[0] + Math.cos(theta) * dist;
        const newY = p[1] + Math.sin(theta) * dist;

        if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
          const gx = Math.floor(newX / cellSize);
          const gy = Math.floor(newY / cellSize);

          let ok = true;
          // Check neighboring grid cells
          for (let x = Math.max(0, gx - 2); x <= Math.min(gridWidth - 1, gx + 2); x++) {
            for (let y = Math.max(0, gy - 2); y <= Math.min(gridHeight - 1, gy + 2); y++) {
              const neighborIdx = grid[x + y * gridWidth];
              if (neighborIdx !== -1) {
                const np = points[neighborIdx];
                const d = Math.hypot(newX - np[0], newY - np[1]);
                if (d < r) {
                  ok = false;
                  break;
                }
              }
            }
            if (!ok) break;
          }

          if (ok) {
            addPoint([newX, newY]);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        active.splice(randIdx, 1);
      }
    }

    return points;
  }
}

/**
 * 1D Value Noise Generator
 * Used for smooth, organic floating animations (autopilot mode).
 */
class ValueNoise1D {
  constructor() {
    this.MAX_VERTICES = 256;
    this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
    this.amplitude = 1;
    this.scale = 1;
    this.r = [];
    for (let e = 0; e < this.MAX_VERTICES; ++e) {
      this.r.push(Math.random());
    }
  }

  getVal(e) {
    const t = e * this.scale;
    const i = Math.floor(t);
    const r = t - i;
    const o = r * r * (3 - 2 * r);
    const s = i % this.MAX_VERTICES_MASK;
    const a = (s + 1) % this.MAX_VERTICES_MASK;
    const l = this.lerp(this.r[s], this.r[a], o);
    return l * this.amplitude;
  }

  lerp(e, t, i) {
    return e * (1 - i) + t * i;
  }
}

// Simplex Noise shader chunk (2D, 3D, 4D Simplex noise by Ian McEwan / Ashima Arts)
const SIMPLEX_NOISE_GLSL = `
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}

  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  vec4 grad4(float j, vec4 ip){
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
  }

  float snoise(vec4 v){
    const vec2  C = vec2( 0.138196601125010504,
                          0.309016994374947451);
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    vec4 i0;

    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;

    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;

    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

    i = mod(i, 289.0);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
              i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
  }
`;

/**
 * GPGPU Particles Simulation Manager
 */
class ParticlesSimulation {
  constructor(scene) {
    this.scene = scene;
    this.renderer = scene.renderer;
    this.camera = scene.camera;
    this.lastTime = 0;
    this.everRendered = false;
    this.ringPos = new THREE.Vector2(0, 0);
    this.cursorPos = new THREE.Vector2(0, 0);
    this.colorScheme = scene.theme === "dark" ? 0 : 1;
    this.particleScale = (this.renderer.domElement.width / this.scene.pixelRatio / 2000) * this.scene.particlesScale;
    
    this.size = 256;
    this.length = this.size * this.size;
    
    this.createPoints();
    this.init();
  }

  createPoints() {
    // Utility interpolation function
    const lerp = (n, e, t, i, r) => (n - e) * (r - i) / (t - e) + i;
    
    // Set up spacing/distance options based on density
    const minDistance = lerp(this.scene.density, 0, 300, 10, 2);
    const maxDistance = lerp(this.scene.density, 0, 300, 11, 3);
    
    // Generate blue-noise points distribution using Bridson's Poisson Disk Sampling
    const rawPoints = new PoissonDiskSampling({
      shape: [500, 500],
      minDistance: minDistance,
      tries: 20
    }).fill();

    this.pointsData = [];
    for (let i = 0; i < rawPoints.length; i++) {
      // Center points around (0,0) instead of [0, 500]
      this.pointsData.push(rawPoints[i][0] - 250, rawPoints[i][1] - 250);
    }
    
    this.count = this.pointsData.length / 2;
    document.getElementById('particles-count-val').innerText = this.count.toLocaleString();
  }

  createDataTexturePosition() {
    const data = new Float32Array(this.length * 4);
    for (let i = 0; i < this.count; i++) {
      const idx = i * 4;
      // Normalize to [-1, 1] range inside GPGPU simulation space
      data[idx + 0] = this.pointsData[i * 2 + 0] * (1 / 250);
      data[idx + 1] = this.pointsData[i * 2 + 1] * (1 / 250);
      data[idx + 2] = 0; // scale
      data[idx + 3] = 0; // velocity
    }
    const texture = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    return texture;
  }

  createRenderTarget() {
    return new THREE.WebGLRenderTarget(this.size, this.size, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false
    });
  }

  init() {
    this.posTex = this.createDataTexturePosition();
    this.rt1 = this.createRenderTarget();
    this.rt2 = this.createRenderTarget();

    // Clear render targets
    this.renderer.setRenderTarget(this.rt1);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(this.rt2);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(null);

    this.noise = new ValueNoise1D();
    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // GPGPU Simulation Shader
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uPosRefs: { value: this.posTex },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRingRadius: { value: 0.2 },
        uDeltaTime: { value: 0 },
        uRingWidth: { value: 0.05 },
        uRingWidth2: { value: 0.015 },
        uRingDisplacement: { value: this.scene.ringDisplacement },
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uPosition;
        uniform sampler2D uPosRefs;
        uniform vec2 uRingPos;
        uniform float uTime;
        uniform float uDeltaTime;
        uniform float uRingRadius;
        uniform float uRingWidth;
        uniform float uRingWidth2;
        uniform float uRingDisplacement;

        ${SIMPLEX_NOISE_GLSL}

        void main() {
          vec2 simTexCoords = vUv;
          vec4 pFrame = texture2D(uPosition, simTexCoords);

          float scale = pFrame.z;
          float velocity = pFrame.w;
          vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

          float time = uTime * 0.5;
          vec2 curentPos = refPos;

          vec2 pos = pFrame.xy;
          pos *= 0.8;

          float dist = distance(curentPos.xy, uRingPos);
          float noise0 = snoise(vec3(curentPos.xy * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
          float dist1 = distance(curentPos.xy + (noise0 * 0.005), uRingPos);

          float t = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
          float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
          float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

          t = pow(t, 2.0);
          t2 = pow(t2, 3.0);

          t += t2 * 3.0;
          t += t3 * 0.4;
          t += snoise(vec3(curentPos.xy * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

          float nS = snoise(vec3(curentPos.xy * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
          t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

          // Mid scale noise
          float noise1 = snoise(vec3(curentPos.xy * 4.0 + vec2(88.494, 32.4397), time * 0.35));
          float noise2 = snoise(vec3(curentPos.xy * 4.0 + vec2(50.904, 120.947), time * 0.35));

          // Close scale noise
          float noise3 = snoise(vec3(curentPos.xy * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
          float noise4 = snoise(vec3(curentPos.xy * 20.0 + vec2(50.904, 120.947), time * 0.5));

          vec2 disp = vec2(noise1, noise2) * 0.03;
          disp += vec2(noise3, noise4) * 0.005;

          // Sin wave
          disp.x += sin((refPos.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
          disp.y += cos((refPos.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

          pos -= (uRingPos - (curentPos + disp)) * pow(t2, 0.75) * uRingDisplacement;

          // Add scale
          float scaleDiff = t - scale;
          scaleDiff *= 0.2;
          scale += scaleDiff;

          // Final position
          vec2 finalPos = curentPos + disp + (pos * 0.25);

          velocity *= 0.5;
          velocity += scale * 0.25;

          gl_FragColor = vec4(finalPos, scale, velocity);
        }
      `
    });

    const simMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.simScene.add(simMesh);

    // Particle rendering geometry
    const geometry = new THREE.BufferGeometry();
    const uvs = new Float32Array(this.count * 2);
    const positions = new Float32Array(this.count * 3);
    const seeds = new Float32Array(this.count * 4);

    for (let s = 0; s < this.count; s++) {
      const xIndex = s % this.size;
      const yIndex = Math.floor(s / this.size);
      // Sample center of pixel for maximum coordinate lookup accuracy
      uvs[s * 2] = (xIndex + 0.5) / this.size;
      uvs[s * 2 + 1] = (yIndex + 0.5) / this.size;
    }

    for (let s = 0; s < this.count; s++) {
      seeds[s * 4 + 0] = Math.random();
      seeds[s * 4 + 1] = Math.random();
      seeds[s * 4 + 2] = Math.random();
      seeds[s * 4 + 3] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("seeds", new THREE.BufferAttribute(seeds, 4));

    // Particle Shader Material
    this.renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(this.scene.colorControls.color1) },
        uColor2: { value: new THREE.Color(this.scene.colorControls.color2) },
        uColor3: { value: new THREE.Color(this.scene.colorControls.color3) },
        uAlpha: { value: 1.0 },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRez: { value: new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height) },
        uParticleScale: { value: this.particleScale },
        uPixelRatio: { value: this.scene.pixelRatio },
        uColorScheme: { value: this.colorScheme }
      },
      vertexShader: `
        precision highp float;
        attribute vec4 seeds;
        uniform sampler2D uPosition;
        uniform float uTime;
        uniform float uParticleScale;
        uniform float uPixelRatio;
        uniform int uColorScheme;

        varying vec4 vSeeds;
        varying float vVelocity;
        varying vec2 vLocalPos;
        varying vec2 vScreenPos;
        varying float vScale;

        void main() {
          vec4 pos = texture2D(uPosition, uv);
          vSeeds = seeds;
          vVelocity = pos.w;
          vScale = pos.z;
          vLocalPos = pos.xy;
          
          vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.0), 1.0);
          gl_Position = projectionMatrix * viewSpace;
          vScreenPos = gl_Position.xy;

          // Adjust size based on scale, pixelRatio, and user settings
          gl_PointSize = ((vScale * 7.0) * (uPixelRatio * 0.5) * uParticleScale);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec4 vSeeds;
        varying vec2 vScreenPos;
        varying vec2 vLocalPos;
        varying float vScale;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec2 uRingPos;
        uniform vec2 uRez;
        uniform float uAlpha;
        uniform float uTime;
        uniform int uColorScheme;

        ${SIMPLEX_NOISE_GLSL}

        #define PI 3.1415926535897932384626433832795

        float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
          r.xy = (p.x > 0.0) ? r.xy : r.zw;
          r.x  = (p.y > 0.0) ? r.x  : r.y;
          vec2 q = abs(p) - b + r.x;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
        }

        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, s, -s, c);
          return m * v;
        }

        void main() {
          float uBorderSize = 0.2;
          float ratio = uRez.x / uRez.y;

          // Compute local noise fields for angle and color
          float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
          float noiseColor = snoise(vec3(vLocalPos * 2.0 + vec2(74.664, 91.556), uTime * 0.5));
          noiseColor = (noiseColor + 1.0) * 0.5;

          // Rotate local UV based on angle relative to cursor ring + noise
          float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

          vec2 uv = gl_PointCoord.xy;
          uv -= vec2(0.5);
          uv.y *= -1.0;
          uv = rotate(uv, -angle + (noiseAngle * 0.5));

          // Interpolate color using 3-stop noise gradient
          float h = 0.8;
          float progress = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
          vec3 col = mix(mix(uColor1, uColor2, progress / h), mix(uColor2, uColor3, (progress - h) / (1.0 - h)), step(h, progress));
          vec3 color = col;

          // Calculate rounded box signed distance field
          float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(0.25));
          rounded = smoothstep(0.1, 0.0, rounded);

          float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);
          if (a < 0.01) {
            discard;
          }

          color = clamp(color, 0.0, 1.0);
          
          // In Light Theme (uColorScheme == 1), darken particles based on velocity/scale to create depth
          color = mix(color, color * clamp(vVelocity, 0.0, 1.0), float(uColorScheme));

          gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    this.mesh = new THREE.Points(geometry, this.renderMaterial);
    this.mesh.position.set(0, 0, 0);
    this.mesh.scale.set(5, 5, 5); // Scale mesh to span [-5, 5]
    this.scene.scene.add(this.mesh);
  }

  resize() {
    this.renderMaterial.uniforms.uRez.value.set(this.renderer.domElement.width, this.renderer.domElement.height);
    this.renderMaterial.uniforms.uPixelRatio.value = this.scene.pixelRatio;
    this.renderMaterial.needsUpdate = true;
  }

  update() {
    const elapsed = this.scene.clock.getElapsedTime();
    const dt = elapsed - this.lastTime;
    this.lastTime = elapsed;

    // Bob cursor using 1D value noise
    const noiseX = (this.noise.getVal(this.scene.time * 0.66 + 94.234) - 0.5) * 2;
    const noiseY = (this.noise.getVal(this.scene.time * 0.75 + 21.028) - 0.5) * 2;

    const delayFactor = this.scene.cursorDelay !== undefined ? this.scene.cursorDelay : 50;
    const tVal = delayFactor / 100;
    const easing = 0.2 * Math.pow(0.01, tVal);

    const offsetX = this.scene.autopilot ? (this.scene.orbOffsetX !== undefined ? this.scene.orbOffsetX : 0) : 0;
    const offsetY = this.scene.autopilot ? (this.scene.orbOffsetY !== undefined ? this.scene.orbOffsetY : 0) : 0;

    if (this.scene.isIntersecting && !this.scene.autopilot) {
      // Map screen plane intersection coordinate down to normalized simulation coords [-1, 1]
      this.cursorPos.set(
        this.scene.intersectionPoint.x * 0.175 + noiseX * 0.1 + offsetX,
        this.scene.intersectionPoint.y * 0.175 + noiseY * 0.1 + offsetY
      );
      this.ringPos.x += (this.cursorPos.x - this.ringPos.x) * easing;
      this.ringPos.y += (this.cursorPos.y - this.ringPos.y) * easing;
    } else {
      // Autopilot floating cursor around the offset center
      this.cursorPos.set(noiseX * 0.2 + offsetX, noiseY * 0.1 + offsetY);
      this.ringPos.x += (this.cursorPos.x - this.ringPos.x) * (easing * 0.5);
      this.ringPos.y += (this.cursorPos.y - this.ringPos.y) * (easing * 0.5);
    }

    // Dynamic scale metrics
    this.particleScale = (this.renderer.domElement.width / this.scene.pixelRatio / 2000) * this.scene.particlesScale;

    // GPGPU Step: Render simulation target
    this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex;
    this.simMaterial.uniforms.uTime.value = elapsed;
    this.simMaterial.uniforms.uDeltaTime.value = dt;
    this.simMaterial.uniforms.uRingRadius.value = this.scene.ringRadius + Math.sin(this.scene.time * 1.0) * 0.03 + Math.cos(this.scene.time * 3.0) * 0.02;
    this.simMaterial.uniforms.uRingPos.value = this.ringPos;
    this.simMaterial.uniforms.uRingWidth.value = this.scene.ringWidth;
    this.simMaterial.uniforms.uRingWidth2.value = this.scene.ringWidth2;
    this.simMaterial.uniforms.uRingDisplacement.value = this.scene.enableOrb ? this.scene.ringDisplacement : 0.0;

    this.renderer.setRenderTarget(this.rt2);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    // Apply simulation result texture to renderer Point material
    this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex;
    this.renderMaterial.uniforms.uTime.value = elapsed;
    this.renderMaterial.uniforms.uRingPos.value = this.ringPos;
    this.renderMaterial.uniforms.uParticleScale.value = this.particleScale;
  }

  postRender() {
    // Swap buffer references
    const temp = this.rt1;
    this.rt1 = this.rt2;
    this.rt2 = temp;
    this.everRendered = true;
  }

  kill() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.rt1.dispose();
    this.rt2.dispose();
    this.posTex.dispose();
    this.simMaterial.dispose();
    this.renderMaterial.dispose();
  }
}

/**
 * Main WebGL Application Scene Wrapper
 */
class DotsBackground {
  constructor(options) {
    this.options = options;
    this.container = options.container;
    this.theme = options.theme || "dark";
    this.autopilot = options.autopilot !== undefined ? options.autopilot : true;
    this.cursorDelay = options.cursorDelay !== undefined ? options.cursorDelay : 50;
    this.enableOrb = options.enableOrb !== undefined ? options.enableOrb : true;
    this.orbOffsetX = options.orbOffsetX !== undefined ? options.orbOffsetX : 0;
    this.orbOffsetY = options.orbOffsetY !== undefined ? options.orbOffsetY : 0;
    
    this.pixelRatio = window.devicePixelRatio || 1;
    this.particlesScale = options.particlesScale || 0.75;
    this.density = options.density || 200;
    
    this.scene = new THREE.Scene();
    
    // Create canvas
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: false,
      precision: "highp"
    });
    
    const gl = this.renderer.getContext();
    gl.getExtension("EXT_color_buffer_float");
    
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    
    this.clock = new THREE.Clock();
    this.time = 0;
    this.lastTime = 0;
    this.dt = 0;
    this.skipFrame = false;
    this.isPaused = false;
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.intersectionPoint = new THREE.Vector3(0, 0, 0);
    this.isIntersecting = false;
    this.mouseIsOver = false;
    
    // Interactive Raycast Plane
    this.raycastPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 12.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false, side: THREE.DoubleSide })
    );
    this.scene.add(this.raycastPlane);
    
    this.initCamera();
    this.initColors();
    
    // Animation constants matching the site config
    this.ringWidth = options.ringWidth || 0.107;
    this.ringWidth2 = options.ringWidth2 || 0.05;
    this.ringDisplacement = options.ringDisplacement || 0.15;
    this.ringRadius = options.ringRadius || 0.11;
    
    this.initParticles();
    this.initEvents();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(40, this.canvas.width / this.canvas.height, 0.1, 1000);
    this.camera.position.z = 3.1;
  }

  initColors() {
    // Setup color palettes for themes
    if (this.theme === "dark") {
      this.colorControls = {
        color1: this.options.color1 || "#7189ff",
        color2: this.options.color2 || "#3074f9",
        color3: this.options.color3 || "#000000"
      };
      this.renderer.setClearColor(0x121317, 1);
      this.scene.background = new THREE.Color(0x121317);
    } else {
      this.colorControls = {
        color1: this.options.color1 || "#2c64ed",
        color2: this.options.color2 || "#f84242",
        color3: this.options.color3 || "#ffcf03"
      };
      this.renderer.setClearColor(0xf8f9fc, 1);
      this.scene.background = new THREE.Color(0xf8f9fc);
    }
  }

  initParticles() {
    this.particles = new ParticlesSimulation(this);
  }

  initEvents() {
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize);

    const onPointerMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (x !== undefined && y !== undefined) {
        this.mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
        this.mouseIsOver = true;
      }
    };

    const onPointerLeave = () => {
      this.mouse.set(-999, -999);
      this.mouseIsOver = false;
      this.isIntersecting = false;
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    
    this.canvas.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("touchend", onPointerLeave);
  }

  onWindowResize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();
    if (this.particles) {
      this.particles.resize();
    }
  }

  setTheme(theme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.initColors();
    
    // Update shader configurations
    if (this.particles) {
      this.particles.colorScheme = theme === "dark" ? 0 : 1;
      this.particles.renderMaterial.uniforms.uColorScheme.value = this.particles.colorScheme;
      this.particles.renderMaterial.uniforms.uColor1.value.set(this.colorControls.color1);
      this.particles.renderMaterial.uniforms.uColor2.value.set(this.colorControls.color2);
      this.particles.renderMaterial.uniforms.uColor3.value.set(this.colorControls.color3);
      this.particles.renderMaterial.needsUpdate = true;
    }
  }

  updateColors(c1, c2, c3) {
    this.colorControls.color1 = c1;
    this.colorControls.color2 = c2;
    this.colorControls.color3 = c3;
    if (this.particles) {
      this.particles.renderMaterial.uniforms.uColor1.value.set(c1);
      this.particles.renderMaterial.uniforms.uColor2.value.set(c2);
      this.particles.renderMaterial.uniforms.uColor3.value.set(c3);
      this.particles.renderMaterial.needsUpdate = true;
    }
  }

  recreateParticles() {
    if (this.particles) {
      this.scene.remove(this.particles.mesh);
      this.particles.kill();
    }
    this.initParticles();
  }

  preRender() {
    this.dt = this.clock.getElapsedTime() - this.lastTime;
    this.lastTime = this.clock.getElapsedTime();
    this.time += this.dt;

    if (this.particles) {
      this.particles.update();
    }

    this.skipFrame = !this.skipFrame;
    if (this.skipFrame) return;

    // Check intersection with Raycast Plane
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.raycastPlane);
    if (intersects.length > 0 && this.mouseIsOver) {
      this.intersectionPoint.copy(intersects[0].point);
      this.isIntersecting = true;
    } else {
      this.isIntersecting = false;
    }
  }

  render() {
    if (this.isPaused) return;
    this.preRender();
    this.renderer.setRenderTarget(null);
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (this.particles) {
      this.particles.postRender();
    }
  }

  kill() {
    this.isPaused = true;
    window.removeEventListener("resize", this.onWindowResize);
    if (this.raycastPlane) {
      this.scene.remove(this.raycastPlane);
      this.raycastPlane.geometry.dispose();
      this.raycastPlane.material.dispose();
    }
    if (this.particles) {
      this.scene.remove(this.particles.mesh);
      this.particles.kill();
    }
    this.renderer.dispose();
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // If we are running in Wallpaper Engine, hide the control UI card by default
  const isWallpaperEngine = typeof window.wallpaperRegisterAudioListener !== 'undefined' || 
                            typeof window.wallpaperPropertyListener !== 'undefined';
  if (isWallpaperEngine) {
    const brandingHeader = document.querySelector('.branding-header');
    const controlPanelWrapper = document.querySelector('.control-panel-wrapper');
    if (brandingHeader) brandingHeader.style.display = 'none';
    if (controlPanelWrapper) controlPanelWrapper.style.display = 'none';
  }

  const container = document.getElementById('particles-container');
  
  // Set default settings
  const config = {
    container: container,
    theme: 'dark',
    autopilot: true,
    density: 200,
    particlesScale: 0.75,
    ringDisplacement: 0.15,
    ringRadius: 0.11,
    ringWidth: 0.107,
    ringWidth2: 0.05,
    cursorDelay: 50
  };

  // Create Background instance
  const dotsApp = new DotsBackground(config);
  window.dotsApp = dotsApp;

  // Animation Loop
  function tick() {
    dotsApp.render();
    requestAnimationFrame(tick);
  }
  tick();

  // DOM Elements Setup
  const themeDarkBtn = document.getElementById('theme-btn-dark');
  const themeLightBtn = document.getElementById('theme-btn-light');
  
  const densitySlider = document.getElementById('density-slider');
  const scaleSlider = document.getElementById('scale-slider');
  const displacementSlider = document.getElementById('displacement-slider');
  const radiusSlider = document.getElementById('radius-slider');
  const delaySlider = document.getElementById('delay-slider');
  const autopilotToggle = document.getElementById('autopilot-toggle');
  
  const color1Picker = document.getElementById('color1-picker');
  const color2Picker = document.getElementById('color2-picker');
  const color3Picker = document.getElementById('color3-picker');
  const resetColorsBtn = document.getElementById('reset-colors-btn');

  // Theme Selectors
  function applyTheme(theme) {
    if (theme === 'dark') {
      themeDarkBtn.classList.add('active');
      themeLightBtn.classList.remove('active');
      document.body.className = 'theme-dark';
      
      // Update color pickers to dark defaults
      color1Picker.value = '#7189ff';
      color2Picker.value = '#3074f9';
      color3Picker.value = '#000000';
    } else {
      themeLightBtn.classList.add('active');
      themeDarkBtn.classList.remove('active');
      document.body.className = 'theme-light';
      
      // Update color pickers to light defaults
      color1Picker.value = '#2c64ed';
      color2Picker.value = '#f84242';
      color3Picker.value = '#ffcf03';
    }
    
    dotsApp.setTheme(theme);
    dotsApp.updateColors(color1Picker.value, color2Picker.value, color3Picker.value);
  }
  window.applyThemeGlobal = applyTheme;

  themeDarkBtn.addEventListener('click', () => applyTheme('dark'));
  themeLightBtn.addEventListener('click', () => applyTheme('light'));

  // Sliders Change Events
  densitySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('density-val').innerText = val;
    dotsApp.density = val;
    dotsApp.recreateParticles();
  });

  scaleSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('scale-val').innerText = val.toFixed(2);
    dotsApp.particlesScale = val;
    if (dotsApp.particles) {
      dotsApp.particles.particleScale = (dotsApp.renderer.domElement.width / dotsApp.pixelRatio / 2000) * val;
    }
  });

  displacementSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('displacement-val').innerText = val.toFixed(2);
    dotsApp.ringDisplacement = val;
  });

  radiusSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('radius-val').innerText = val;
    dotsApp.ringRadius = val;
  });

  delaySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('delay-val').innerText = val;
    dotsApp.cursorDelay = val;
  });

  autopilotToggle.addEventListener('change', (e) => {
    dotsApp.autopilot = e.target.checked;
  });

  // Color Pickers Change Events
  const updateAppColors = () => {
    dotsApp.updateColors(color1Picker.value, color2Picker.value, color3Picker.value);
  };
  
  color1Picker.addEventListener('input', updateAppColors);
  color2Picker.addEventListener('input', updateAppColors);
  color3Picker.addEventListener('input', updateAppColors);

  resetColorsBtn.addEventListener('click', () => {
    applyTheme(dotsApp.theme);
  });

  // UI Toggling Setup for manual close / reopen of controls card
  const brandingHeader = document.querySelector('.branding-header');
  const controlPanelWrapper = document.querySelector('.control-panel-wrapper');
  const showControlsBtn = document.getElementById('show-controls-btn');
  const closeCardBtn = document.getElementById('close-card-btn');

  function toggleUI(show) {
    if (show) {
      if (brandingHeader) brandingHeader.style.display = '';
      if (controlPanelWrapper) controlPanelWrapper.style.display = '';
      if (showControlsBtn) showControlsBtn.style.display = 'none';
    } else {
      if (brandingHeader) brandingHeader.style.display = 'none';
      if (controlPanelWrapper) controlPanelWrapper.style.display = 'none';
      
      const isWallpaperEngine = typeof window.wallpaperRegisterAudioListener !== 'undefined' || 
                                typeof window.wallpaperPropertyListener !== 'undefined';
      if (showControlsBtn) {
        showControlsBtn.style.display = isWallpaperEngine ? 'none' : 'flex';
      }
    }
  }
  window.toggleUIGlobal = toggleUI;

  if (closeCardBtn) {
    closeCardBtn.addEventListener('click', () => toggleUI(false));
  }
  if (showControlsBtn) {
    showControlsBtn.addEventListener('click', () => toggleUI(true));
  }
  
  // Set default initial theme setup
  applyTheme('dark');

  // If there are properties cached from Wallpaper Engine during startup, apply them now!
  if (wePropertiesCache) {
    applyWeProperties(wePropertiesCache);
    wePropertiesCache = null;
  }
});

// ==========================================
// Wallpaper Engine Global API Implementation
// ==========================================

let wePropertiesCache = null;
window.dotsApp = null;

function applyWeProperties(properties) {
  const dotsApp = window.dotsApp;
  if (!dotsApp) return;

  if (properties.showUI !== undefined) {
    const show = properties.showUI.value;
    if (window.toggleUIGlobal) {
      window.toggleUIGlobal(show);
    } else {
      const branding = document.querySelector('.branding-header');
      const card = document.querySelector('.control-card');
      if (branding) branding.style.display = show ? '' : 'none';
      if (card) card.style.display = show ? '' : 'none';
    }
  }
  
  if (properties.enableOrb !== undefined) {
    dotsApp.enableOrb = properties.enableOrb.value;
  }
  
  if (properties.orbOffsetX !== undefined) {
    dotsApp.orbOffsetX = properties.orbOffsetX.value;
  }
  
  if (properties.orbOffsetY !== undefined) {
    dotsApp.orbOffsetY = properties.orbOffsetY.value;
  }
  
  if (properties.theme !== undefined) {
    if (window.applyThemeGlobal) {
      window.applyThemeGlobal(properties.theme.value);
    }
  }
  
  if (properties.density !== undefined) {
    const val = properties.density.value;
    const slider = document.getElementById('density-slider');
    if (slider) slider.value = val;
    const valDisplay = document.getElementById('density-val');
    if (valDisplay) valDisplay.innerText = val;
    dotsApp.density = val;
    dotsApp.recreateParticles();
  }
  
  if (properties.particlesScale !== undefined) {
    const val = properties.particlesScale.value;
    const slider = document.getElementById('scale-slider');
    if (slider) slider.value = val;
    const valDisplay = document.getElementById('scale-val');
    if (valDisplay) valDisplay.innerText = val.toFixed(2);
    dotsApp.particlesScale = val;
    if (dotsApp.particles) {
      dotsApp.particles.particleScale = (dotsApp.renderer.domElement.width / dotsApp.pixelRatio / 2000) * val;
    }
  }
  
  if (properties.ringDisplacement !== undefined) {
    const val = properties.ringDisplacement.value;
    const slider = document.getElementById('displacement-slider');
    if (slider) slider.value = val;
    const valDisplay = document.getElementById('displacement-val');
    if (valDisplay) valDisplay.innerText = val.toFixed(2);
    dotsApp.ringDisplacement = val;
  }
  
  if (properties.ringRadius !== undefined) {
    const val = properties.ringRadius.value;
    const slider = document.getElementById('radius-slider');
    if (slider) slider.value = val;
    const valDisplay = document.getElementById('radius-val');
    if (valDisplay) valDisplay.innerText = val;
    dotsApp.ringRadius = val;
  }
  
  if (properties.cursorDelay !== undefined) {
    const val = properties.cursorDelay.value;
    const slider = document.getElementById('delay-slider');
    if (slider) slider.value = val;
    const valDisplay = document.getElementById('delay-val');
    if (valDisplay) valDisplay.innerText = val;
    dotsApp.cursorDelay = val;
  }
  
  if (properties.autopilot !== undefined) {
    const val = properties.autopilot.value;
    const toggle = document.getElementById('autopilot-toggle');
    if (toggle) toggle.checked = val;
    dotsApp.autopilot = val;
  }
  
  let colorsUpdated = false;
  const c1 = document.getElementById('color1-picker');
  const c2 = document.getElementById('color2-picker');
  const c3 = document.getElementById('color3-picker');
  
  if (properties.color1 !== undefined && c1) {
    c1.value = weColorToHex(properties.color1.value);
    colorsUpdated = true;
  }
  if (properties.color2 !== undefined && c2) {
    c2.value = weColorToHex(properties.color2.value);
    colorsUpdated = true;
  }
  if (properties.color3 !== undefined && c3) {
    c3.value = weColorToHex(properties.color3.value);
    colorsUpdated = true;
  }
  
  if (colorsUpdated && c1 && c2 && c3) {
    dotsApp.updateColors(c1.value, c2.value, c3.value);
  }
}

function weColorToHex(weColor) {
  if (typeof weColor === 'string') {
    const parts = weColor.split(' ');
    if (parts.length === 3) {
      const r = Math.round(parseFloat(parts[0]) * 255);
      const g = Math.round(parseFloat(parts[1]) * 255);
      const b = Math.round(parseFloat(parts[2]) * 255);
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  } else if (Array.isArray(weColor)) {
    const r = Math.round(weColor[0] * 255);
    const g = Math.round(weColor[1] * 255);
    const b = Math.round(weColor[2] * 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  return '#ffffff';
}

window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (!window.dotsApp) {
      wePropertiesCache = Object.assign(wePropertiesCache || {}, properties);
      return;
    }
    applyWeProperties(properties);
  }
};


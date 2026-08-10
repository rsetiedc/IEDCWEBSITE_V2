import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import './Particles.css';

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const int = parseInt(hex.slice(0, 6), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uTanFov;
  uniform float uAspect;
  uniform float uNear;
  uniform float uFar;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    // Continuous per-particle drift (independent of the cursor): each particle
    // orbits its base position on smooth sine paths so the field always flows.
    // Amplitudes are tiny so nothing ever moves at a noticeable pace — just a
    // slow, subtle background hum.
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.02, 0.12, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.02, 0.12, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.02, 0.12, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    // Toroidal wrap: particles can never leave the visible field, so the number
    // of particles on screen is always constant and none ever disappear. This
    // only changes *where* a particle is rendered — never whether it renders.
    //
    // 1) Wrap depth along the view axis so nothing is clipped by the near or
    //    far planes (e.g. a particle pushed behind the camera re-enters at the
    //    far side as a small distant dot).
    float depth = -mvPos.z;
    float wrappedDepth = mod(depth - uNear, uFar - uNear) + uNear;
    mvPos.z = -wrappedDepth;

    // 2) Pac-Man style wrap across the visible frustum at that depth, so a
    //    particle exiting one edge of the screen re-enters from the opposite
    //    edge with the same apparent size.
    float halfW = wrappedDepth * uTanFov * uAspect;
    float halfH = wrappedDepth * uTanFov;
    mvPos.x = mod(mvPos.x + halfW, 2.0 * halfW) - halfW;
    mvPos.y = mod(mvPos.y + halfH, 2.0 * halfH) - halfH;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
      // Safety cap: with uNear = 2.0 the natural max size stays well under
      // this, but it guards against any extreme near-field flash.
      gl_PointSize = min(gl_PointSize, 80.0);
    }

    // Larger dots are slightly transparent: the bigger the sprite, the more it
    // fades, so big particles sit softly in the background while small ones
    // stay crisp and opaque.
    vAlpha = clamp(1.0 - (gl_PointSize - 12.0) * 0.015, 0.35, 1.0);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      // Transparent (large) dots fade smoothly to zero right at the discard
      // edge (no hard ring); fully opaque small dots keep their crisp edge.
      float soft = smoothstep(0.5, 0.4, d);
      float alpha = mix(vAlpha * soft, vAlpha, step(0.999, vAlpha));
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), alpha);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className = ''
}) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    let width = 0;
    let height = 0;
    // Declared here (before the first resize()) so the resize handler can
    // refresh the wrap aspect ratio once the program exists. Resizing only
    // updates the canvas/projection — particles are never recreated or reset.
    let program;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      if (program) {
        program.uniforms.uAspect.value = gl.canvas.width / gl.canvas.height;
      }
    };
    window.addEventListener('resize', resize, false);
    resize();

    // Normalized pointer position (for hover motion).
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 - 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Pointer left the page → drop the hover offset back to center. The drift
    // animation keeps running regardless; this only returns the cloud's anchor.
    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };
    window.addEventListener('mouseleave', handleMouseLeave);

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        // Wrap parameters: keep every particle inside the view frustum. uNear is
        // deliberately raised well above the camera near plane: particles that
        // drift extremely close to the camera are what read as large, fast dots.
        uTanFov: { value: Math.tan((camera.fov * Math.PI) / 360) },
        uAspect: { value: gl.canvas.width / gl.canvas.height },
        uNear: { value: 2.0 },
        uFar: { value: 98 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      const time = elapsed * 0.001;
      program.uniforms.uTime.value = time;

      // Ease the cloud anchor toward its target so mouse-driven motion stays
      // slow and smooth (mouse only influences movement — never visibility).
      const targetX = moveParticlesOnHover ? -mouseRef.current.x * particleHoverFactor : 0;
      const targetY = moveParticlesOnHover ? -mouseRef.current.y * particleHoverFactor : 0;
      particles.position.x += (targetX - particles.position.x) * 0.02;
      particles.position.y += (targetY - particles.position.y) * 0.02;

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
}
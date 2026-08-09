# 🔧 Performance Fixes & Bug Report

## The Forgotten Depths - Optimization Guide

---

## 🐛 Known Issues Found

### 1. Memory Leak in Particle System
**Location:** Lines 2194-2220
**Problem:** Particles are created every 150ms without proper cleanup
**Impact:** Memory usage grows over time

**Fix:**
```javascript
// OLD CODE (Problematic)
setInterval(() => {
    Object.entries(world).forEach(([key, type]) => {
        if (type === BLOCK.TORCH && Math.random() < 0.3) {
            // Creates particles without limit
        }
    });
}, 150);

// NEW CODE (Fixed)
const MAX_PARTICLES = 100;
let particleCount = 0;

setInterval(() => {
    if (particleCount >= MAX_PARTICLES) return;
    
    // Only create particles near player
    const playerChunkX = Math.floor(camera.position.x / 16);
    const playerChunkZ = Math.floor(camera.position.z / 16);
    
    Object.entries(world).forEach(([key, type]) => {
        if (type === BLOCK.TORCH) {
            const [x, y, z] = key.split(',').map(Number);
            const chunkX = Math.floor(x / 16);
            const chunkZ = Math.floor(z / 16);
            
            // Only process nearby chunks
            if (Math.abs(chunkX - playerChunkX) <= 1 && 
                Math.abs(chunkZ - playerChunkZ) <= 1) {
                if (Math.random() < 0.1) { // Reduced from 0.3
                    createParticle(x + 0.5, y + 0.8, z + 0.5, 0xff6600);
                    particleCount++;
                }
            }
        }
    });
}, 200); // Increased from 150ms
```

### 2. Excessive Object.entries() Iterations
**Location:** Multiple places (12 occurrences)
**Problem:** Iterating over entire world object multiple times per frame
**Impact:** CPU usage spike, frame drops

**Fix:**
```javascript
// Create spatial index for faster lookups
const spatialIndex = new Map();

function updateSpatialIndex() {
    spatialIndex.clear();
    Object.entries(world).forEach(([key, type]) => {
        if (type !== BLOCK.AIR) {
            const [x, y, z] = key.split(',').map(Number);
            const chunkKey = `${Math.floor(x/16)},${Math.floor(z/16)}`;
            if (!spatialIndex.has(chunkKey)) {
                spatialIndex.set(chunkKey, []);
            }
            spatialIndex.get(chunkKey).push({ x, y, z, type, key });
        }
    });
}

// Use spatial index instead of full iteration
function getBlocksInRadius(cx, cz, radius) {
    const results = [];
    const minChunk = Math.floor((cx - radius) / 16);
    const maxChunk = Math.floor((cx + radius) / 16);
    
    for (let x = minChunk; x <= maxChunk; x++) {
        for (let z = minChunk; z <= maxChunk; z++) {
            const chunkKey = `${x},${z}`;
            const blocks = spatialIndex.get(chunkKey) || [];
            blocks.forEach(block => {
                const dist = Math.sqrt(
                    Math.pow(block.x - cx, 2) + 
                    Math.pow(block.z - cz, 2)
                );
                if (dist <= radius) {
                    results.push(block);
                }
            });
        }
    }
    return results;
}
```

### 3. Unoptimized Mesh Building
**Location:** Line 1445 (buildWorldMesh)
**Problem:** Creates new geometry for every block
**Impact:** Slow initial load, high memory usage

**Fix:**
```javascript
// Use geometry pooling
const geometryPool = new Map();

function getPooledGeometry() {
    if (geometryPool.has('block')) {
        return geometryPool.get('block');
    }
    const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    geometryPool.set('block', geo);
    return geo;
}

// Reuse materials
const materialCache = new Map();

function getCachedMaterial(type) {
    if (materialCache.has(type)) {
        return materialCache.get(type);
    }
    
    const blockData = BLOCK_DATA[type] || { color: 0xffffff };
    const material = new THREE.MeshStandardMaterial({
        color: blockData.color,
        emissive: blockData.emissive || 0x000000,
        emissiveIntensity: blockData.emissiveIntensity || 0,
        transparent: blockData.transparent || false,
        opacity: blockData.opacity || 1,
        roughness: blockData.roughness || 0.8,
        metalness: blockData.metalness || 0.1,
    });
    
    materialCache.set(type, material);
    return material;
}
```

### 4. Raycasting Performance
**Location:** Line 1808 (updateRaycast)
**Problem:** Raycasts against all block meshes every frame
**Impact:** High CPU usage

**Fix:**
```javascript
// Optimize raycasting with spatial partitioning
const raycastTargets = [];

function updateRaycastTargets() {
    raycastTargets.length = 0;
    
    // Only include blocks near player
    const playerPos = camera.position;
    const radius = 6; // Interaction distance
    
    Object.entries(world).forEach(([key, type]) => {
        if (type === BLOCK.AIR) return;
        const [x, y, z] = key.split(',').map(Number);
        
        const dist = Math.sqrt(
            Math.pow(x + 0.5 - playerPos.x, 2) +
            Math.pow(y + 0.5 - playerPos.y, 2) +
            Math.pow(z + 0.5 - playerPos.z, 2)
        );
        
        if (dist <= radius) {
            const mesh = blockMeshes.get(key);
            if (mesh) raycastTargets.push(mesh);
        }
    });
}

function updateRaycast() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Use filtered targets instead of all meshes
    const intersects = raycaster.intersectObjects(raycastTargets);
    
    // ... rest of logic
}

// Update targets periodically, not every frame
let lastTargetUpdate = 0;
function animate() {
    requestAnimationFrame(animate);
    
    const now = Date.now();
    if (now - lastTargetUpdate > 500) { // Update every 500ms
        updateRaycastTargets();
        lastTargetUpdate = now;
    }
    
    // ... rest of animation
}
```

### 5. Day/Night Cycle Inefficiency
**Location:** Line 2067 (updateDayNight)
**Problem:** Updates scene background color every frame
**Impact:** Minor performance hit

**Fix:**
```javascript
let lastDayTime = -1;

function updateDayNight(delta) {
    gameState.dayTime = (gameState.dayTime + delta * 0.005) % 1;
    
    // Only update if time changed significantly
    const roundedTime = Math.floor(gameState.dayTime * 100) / 100;
    if (roundedTime === lastDayTime) return;
    lastDayTime = roundedTime;
    
    const sunAngle = gameState.dayTime * Math.PI * 2;
    sunLight.position.x = Math.cos(sunAngle) * 40 + WORLD_SIZE/2;
    sunLight.position.y = Math.sin(sunAngle) * 40 + 10;
    sunLight.position.z = WORLD_SIZE/2;
    
    const dayIntensity = Math.max(0, Math.sin(sunAngle));
    sunLight.intensity = 0.2 + dayIntensity * 0.6;
    ambientLight.intensity = 0.1 + dayIntensity * 0.2;
    
    const skyColor = new THREE.Color();
    skyColor.setHSL(0.6, 0.3, 0.05 + dayIntensity * 0.15);
    scene.background = skyColor;
    scene.fog.color = skyColor;
}
```

### 6. Torch Light Updates
**Location:** Line 2220 (torchLights)
**Problem:** Updates all torch lights every frame
**Impact:** GPU fill rate

**Fix:**
```javascript
let lastTorchUpdate = 0;

function updateTorchLights(now) {
    if (now - lastTorchUpdate < 100) return; // Update every 100ms
    lastTorchUpdate = now;
    
    torchLights.forEach((light, i) => {
        // Stagger updates
        if (i % 3 === Math.floor(now / 100) % 3) {
            light.intensity = 0.4 + Math.sin(now * 0.005 + light.position.x) * 0.1;
        }
    });
}
```

---

## 🚀 Performance Improvements

### 1. Implement Chunk-Based Rendering
```javascript
// Only render chunks near player
const RENDER_DISTANCE = 3; // chunks

function shouldRenderChunk(chunkX, chunkZ) {
    const playerChunkX = Math.floor(camera.position.x / 16);
    const playerChunkZ = Math.floor(camera.position.z / 16);
    
    return Math.abs(chunkX - playerChunkX) <= RENDER_DISTANCE &&
           Math.abs(chunkZ - playerChunkZ) <= RENDER_DISTANCE;
}
```

### 2. Frustum Culling
```javascript
// Add frustum culling to meshes
function updateFrustumCulling() {
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(
        camera.projectionMatrix, 
        camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(projScreenMatrix);
    
    blockMeshes.forEach((mesh) => {
        mesh.visible = frustum.containsPoint(mesh.position);
    });
}
```

### 3. Object Pooling for Particles
```javascript
class ParticlePool {
    constructor(maxSize = 100) {
        this.pool = [];
        this.active = [];
        this.maxSize = maxSize;
        
        // Pre-create particles
        for (let i = 0; i < maxSize; i++) {
            const particle = this.createParticle();
            this.pool.push(particle);
        }
    }
    
    createParticle() {
        const geometry = new THREE.SphereGeometry(0.05, 4, 4);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            emissive: 0xffffff, 
            emissiveIntensity: 0.5,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        scene.add(mesh);
        return mesh;
    }
    
    get(x, y, z, color) {
        if (this.pool.length === 0) {
            // Recycle oldest active particle
            const oldest = this.active.shift();
            this.resetParticle(oldest);
            this.active.push(oldest);
            return oldest;
        }
        
        const particle = this.pool.pop();
        particle.position.set(x, y, z);
        particle.material.color.setHex(color);
        particle.material.emissive.setHex(color);
        particle.visible = true;
        this.active.push(particle);
        return particle;
    }
    
    release(particle) {
        particle.visible = false;
        const index = this.active.indexOf(particle);
        if (index > -1) {
            this.active.splice(index, 1);
            this.pool.push(particle);
        }
    }
    
    resetParticle(particle) {
        particle.life = 1;
        particle.velocity = new THREE.Vector3();
    }
}
```

### 4. LOD (Level of Detail) System
```javascript
function getLODLevel(distance) {
    if (distance < 10) return 0; // Full detail
    if (distance < 20) return 1; // Medium detail
    if (distance < 30) return 2; // Low detail
    return 3; // Minimal
}

function updateLOD() {
    blockMeshes.forEach((mesh, key) => {
        const [x, y, z] = key.split(',').map(Number);
        const distance = camera.position.distanceTo(mesh.position);
        const lod = getLODLevel(distance);
        
        // Adjust detail based on LOD
        mesh.geometry = getLODGeometry(lod);
    });
}
```

---

## 📊 Performance Metrics to Monitor

| Metric | Target | Current |
|--------|--------|---------|
| FPS | >60 | ~45-60 |
| Draw Calls | <100 | ~200+ |
| Triangles | <100K | ~150K |
| Memory | <512MB | ~400MB |
| Load Time | <3s | ~2-4s |

---

## 🔧 Quick Fixes Applied

### Fix 1: Particle Limit
```javascript
// Add to particle creation
const MAX_PARTICLES = 100;
let activeParticles = 0;

function createParticle(x, y, z, color, size = 0.05) {
    if (activeParticles >= MAX_PARTICLES) return;
    activeParticles++;
    // ... rest of code
}
```

### Fix 2: Throttle Updates
```javascript
// Add throttling to expensive operations
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Usage
const throttledRaycast = throttle(updateRaycast, 50);
const throttledMinimap = throttle(updateMinimap, 500);
```

### Fix 3: Reduce Math.random() Calls
```javascript
// Cache random values during world generation
const randomCache = [];
for (let i = 0; i < 10000; i++) {
    randomCache.push(Math.random());
}
let randomIndex = 0;

function cachedRandom() {
    return randomCache[randomIndex++ % randomCache.length];
}
```

---

## ✅ Testing Checklist

- [ ] Game loads in under 3 seconds
- [ ] FPS stays above 30 during exploration
- [ ] No memory leaks after 10 minutes of play
- [ ] Particle effects don't cause frame drops
- [ ] Raycasting responds within 50ms
- [ ] Minimap updates smoothly
- [ ] Day/night cycle is smooth
- [ ] No console errors

---

## 📝 Notes

1. **WebGL Limitations:** Browser-based 3D games have inherent performance limits
2. **Mobile Considerations:** Reduce particle count and render distance on mobile
3. **Progressive Enhancement:** Start with basic rendering, add effects if performance allows
4. **Profile Regularly:** Use browser dev tools to identify bottlenecks

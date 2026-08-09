# 🎮 THE FORGOTTEN DEPTHS
## Game Design Document (GDD)
### Versión 1.0

---

# 📋 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Visión del Juego](#2-visión-del-juego)
3. [Mecánicas Principales](#3-mecánicas-principales)
4. [Diseño del Mundo](#4-diseño-del-mundo)
5. [Sistema de Puzzles](#5-sistema-de-puzzles)
6. [Modo Cooperativo](#6-modo-cooperativo)
7. [Progresión y Recompensas](#7-progresión-y-recompensas)
8. [Diseño de Arte y Audio](#8-diseño-de-arte-y-audio)
9. [Interfaz de Usuario (UI/UX)](#9-interfaz-de-usuario)
10. [Narrativa y Lore](#10-narrativa-y-lore)
11. [Especificaciones Técnicas](#11-especificaciones-técnicas)
12. [Métricas y Analytics](#12-métricas-y-analytics)
13. [Cronograma de Desarrollo](#13-cronograma-de-desarrollo)
14. [Apéndices](#14-apéndices)

---

# 1. RESUMEN EJECUTIVO

## 1.1 Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Título** | The Forgotten Depths |
| **Género** | Puzzle / Adventure / Cooperative |
| **Plataforma** | Web Browser (PC, Mobile) |
| **Jugadores** | 1-4 (Cooperativo Asimétrico) |
| **Motor** | Three.js + Colyseus |
| **Estado** | Prototipo |

## 1.2 Elevator Pitch

> *"The Forgotten Depths es un juego cooperativo asimétrico donde 4 jugadores con roles únicos deben comunicarse para resolver puzzles ambientales en un mundo voxel procedural. Cada jugador ve información diferente: el mapa, los códigos, los peligros, o el mundo físico. Solo juntos pueden descubrir los secretos del abismo."*

## 1.3 Objetivos del Juego

1. **Explorar** un mundo procedural generado con 4 biomas únicos
2. **Resolver** puzzles ambientales que requieren cooperación
3. **Descubrir** secretos ocultos tras paredes y en cuevas
4. **Comunicarse** efectivamente entre roles para progresar
5. **Completar** la historia descifrando el código ancestral

---

# 2. VISIÓN DEL JUEGO

## 2.1 Concepto Central

**The Forgotten Depths** es un juego que combina:
- **Exploración voxel** estilo Minecraft
- **Puzzles ambientales** que forman parte del mundo
- **Cooperación asimétrica** donde cada jugador aporta algo único
- **Descubrimiento de secretos** que recompensa la curiosidad

## 2.2 Pilares de Diseño

```
┌─────────────────────────────────────────────────────────────────┐
│                    PILARES DE DISEÑO                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 🧩 PUZZLES INTEGRADOS                                       │
│     Los puzzles no son pantallas aisladas, sino partes          │
│     del mundo que el jugador puede manipular directamente.      │
│                                                                 │
│  2. 🤝 COOPERACIÓN NECESARIA                                    │
│     Ningún jugador puede resolver todo solo. La información     │
│     está distribuida entre los roles, forzando comunicación.    │
│                                                                 │
│  3. 🔍 DESCUBRIMIENTO CONSTANTE                                │
│     El mundo está lleno de secretos, tesoros y lore que         │
│     recompensa la exploración y la curiosidad.                  │
│                                                                 │
│  4. 🌍 MUNDO VIVO Y REACTIVO                                    │
│     El mundo tiene ciclo día/noche, criaturas, y eventos        │
│     dinámicos que cambian la experiencia de juego.              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.3 Audiencia Objetivo

| Segmento | Descripción | Edad |
|----------|-------------|------|
| **Primario** | Amigos que buscan juegos cooperativos | 16-35 |
| **Secundario** | Fans de puzzles y mystery games | 18-40 |
| **Terciario** | Streamers buscando contenido interactivo | 18-30 |

## 2.4 Referencias e Inspiración

| Juego | Elemento Inspirador |
|-------|---------------------|
| **Keep Talking and Nobody Explodes** | Comunicación asimétrica |
| **Minecraft** | Mundo voxel y exploración |
| **Portal 2** | Puzzles de física ambientales |
| **The Witness** | Puzzles integrados en el entorno |
| **Sea of Thieves** | Co-op con roles especializados |
| **Spelunky** | Exploración procedural y secretos |

---

# 3. MECÁNICAS PRINCIPALES

## 3.1 Movimiento y Exploración

### Controles (Explorador)

| Acción | Tecla | Descripción |
|--------|-------|-------------|
| Moverse | W/A/S/D | Movimiento direccional |
| Saltar | Espacio | Salto vertical |
| Correr | Shift | Movimiento rápido |
| Interactuar | E / Click | Usar objetos |
| Herramienta 1-4 | 1/2/3/4 | Seleccionar herramienta |
| Linterna | F | Encender/apagar linterna |
| Diario | J | Abrir diario |
| Chat | T | Abrir chat |

### Física del Jugador

```javascript
const PLAYER_PHYSICS = {
    height: 1.6,           // Altura del jugador
    radius: 0.3,           // Radio de colisión
    speed: 8,              // Velocidad base (unidades/segundo)
    sprintSpeed: 14,       // Velocidad al correr
    jumpForce: 8,          // Fuerza de salto
    gravity: -20,          // Gravedad
    maxFallSpeed: -30,     // Velocidad máxima de caída
};
```

### Colisiones

El sistema de colisiones usa **AABB** (Axis-Aligned Bounding Box) contra bloques del mundo:

```
1. Mover en eje X → Verificar colisión → Revertir si colisiona
2. Mover en eje Y → Verificar colisión → Revertir si colisiona
3. Mover en eje Z → Verificar colisión → Revertir si colisiona
```

## 3.2 Sistema de Bloques

### Tipos de Bloques

| ID | Bloque | Color | Propiedades |
|----|--------|-------|-------------|
| 0 | Aire | - | Transparente, sin colisión |
| 1 | Grass | #4caf50 | Superficie, rompible |
| 2 | Dirt | #8d6e63 | Subterráneo, rompible |
| 3 | Stone | #757575 | Rocoso, requiere pico |
| 4 | Wood | #6d4c41 | Árboles, rompible |
| 5 | Leaves | #2e7d32 | Copa de árboles |
| 6-9 | Crystals | Varios | Puzzles de colores |
| 10 | Mirror | #cfd8dc | Puzzles de luz |
| 11 | Light Source | #ffab00 | Emite luz |
| 12 | Receiver | #9e9e9e | Recibe luz (target) |
| 16 | Secret Wall | #546e7a | Rompible con martillo |
| 21 | Water | #1565c0 | Líquido, atraviesa |
| 22 | Lava | #ff5722 | Daño al tocar |
| 28 | Chest | #8d6e63 | Contiene tesoros |
| 29 | Key Item | #ffd700 | Llave coleccionable |
| 30 | Journal Page | #fff8e1 | Página del diario |

### Interacción con Bloques

```javascript
// Acciones disponibles por bloque
const BLOCK_INTERACTIONS = {
    [BLOCK.SECRET_WALL]: {
        requiredTool: 'hammer',
        onBreak: 'revealSecretRoom',
        particle: 'stone_debris',
    },
    [BLOCK.CHEST]: {
        requiredTool: 'hand',
        onInteract: 'openChest',
        lootTable: ['diamond', 'gold', 'key'],
    },
    [BLOCK.MIRROR]: {
        requiredTool: 'hand',
        onInteract: 'rotateMirror',
        rotationStep: 45, // grados
    },
    [BLOCK.CRYSTAL_RED]: {
        requiredTool: 'hand',
        onInteract: 'activateCrystal',
        puzzleType: 'color_sequence',
    },
};
```

## 3.3 Sistema de Herramientas

### Herramientas Disponibles

| Herramienta | Icono | Uso Principal | Desbloqueo |
|-------------|-------|---------------|------------|
| **Mano** | ✋ | Interacción básica | Inicio |
| **Martillo** | 🔨 | Romper paredes débiles | Puzzle 1 |
| **Pico** | ⛏️ | Extraer minerales | Puzzle 2 |
| **Llave** | 🗝️ | Abrir candados | Puzzle 3 |
| **Linterna** | 🔦 | Iluminar oscuridad | Puzzle 4 |

### Desbloqueo Progresivo

```
Puzzle 1 (Espejos) → Martillo
Puzzle 2 (Colores) → Pico
Puzzle 3 (Peso) → Llave
Puzzle 4 (Código) → Linterna
```

## 3.4 Sistema de Items

### Categorías de Items

```typescript
enum ItemCategory {
    TOOL = 'tool',           // Herramientas
    KEY = 'key',             // Llaves especiales
    COLLECTIBLE = 'collectible', // Coleccionables
    QUEST = 'quest',         // Items de misión
    CONSUMABLE = 'consumable', // Consumibles
}

// Ejemplos
const ITEMS = {
    // Herramientas
    hammer: { category: 'tool', icon: '🔨', stackable: false },
    pickaxe: { category: 'tool', icon: '⛏️', stackable: false },
    
    // Llaves
    golden_key: { category: 'key', icon: '🗝️', unlocks: 'golden_door' },
    crystal_key: { category: 'key', icon: '🔑', unlocks: 'crystal_chest' },
    
    // Coleccionables
    diamond: { category: 'collectible', icon: '💎', value: 100 },
    gold: { category: 'collectible', icon: '🥇', value: 50 },
    
    // Misión
    journal_page: { category: 'quest', icon: '📖', lore: true },
    ancient_rune: { category: 'quest', icon: '🔮', puzzle_hint: true },
};
```

---

# 4. DISEÑO DEL MUNDO

## 4.1 Generación Procedural

### Sistema de Seed

Cada mundo se genera a partir de una **seed** (cadena de texto) que determina:
- Forma del terreno
- Ubicación de biomas
- Posición de puzzles y secretos
- Contenido de cofres

```javascript
// Ejemplo de generación
const seed = "aventura123";
const noise = new SimplexNoise(hashString(seed));

// Altura del terreno
function getTerrainHeight(x, z) {
    const base = noise.fbm2D(x * 0.05, z * 0.05, 4) * 8;
    const detail = noise.fbm2D(x * 0.1, z * 0.1, 3) * 3;
    return Math.floor(12 + base + detail);
}
```

### Parámetros del Mundo

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **World Size** | 48x48 | Tamaño del mapa en bloques |
| **World Height** | 32 | Altura máxima |
| **Render Distance** | 20 | Chunks visibles |
| **Chunk Size** | 16x16x16 | Tamaño de cada chunk |

## 4.2 Biomas

### 🌲 Bosque Petrificado

```
┌─────────────────────────────────────────┐
│         BOSQUE PETRIFICADO              │
├─────────────────────────────────────────┤
│ Superficie: Grass                       │
│ Subterráneo: Dirt → Stone              │
│ Árboles: 8% de spawn                   │
│ Flores: 2% de spawn                    │
│ Cuevas: 30% de probabilidad            │
│ Secretos: 2% de probabilidad           │
│                                         │
│ Características:                       │
│ - Árboles de piedra y madera           │
│ - Terreno ondulado                     │
│ - Vegetación petrificada               │
│ - Cuevas poco profundas                │
└─────────────────────────────────────────┘
```

### 💎 Cavernas de Cristal

```
┌─────────────────────────────────────────┐
│         CAVERNAS DE CRISTAL             │
├─────────────────────────────────────────┤
│ Superficie: Stone                       │
│ Subterráneo: Stone (sin variación)     │
│ Árboles: 0%                            │
│ Cristales: 3% de spawn                 │
│ Cuevas: 60% de probabilidad            │
│ Secretos: 5% de probabilidad           │
│                                         │
│ Características:                       │
│ - Grandes cavernas abiertas            │
│ - Cristales de 4 colores               │
│ - Formaciones naturales                │
│ - Iluminación bioluminiscente          │
└─────────────────────────────────────────┘
```

### 🏛️ Templo Sumergido

```
┌─────────────────────────────────────────┐
│         TEMPLO SUMERGIDO                │
├─────────────────────────────────────────┤
│ Superficie: Sand                        │
│ Subterráneo: Dirt → Ancient Brick      │
│ Pilares: 4% de spawn                   │
│ Agua: Nivel 2                          │
│ Cuevas: 20% de probabilidad            │
│ Secretos: 8% de probabilidad           │
│                                         │
│ Características:                       │
│ - Estructuras antiguas                 │
│ - Pilares y arcos                      │
│ - Áreas inundadas                      │
│ - Runas y jeroglíficos                 │
└─────────────────────────────────────────┘
```

### 🕳️ El Abismo

```
┌─────────────────────────────────────────┐
│         EL ABISMO                       │
├─────────────────────────────────────────┤
│ Superficie: Bedrock                     │
│ Subterráneo: Cracked Stone             │
│ Lava: 2% de spawn                      │
│ Hongos: 5% de spawn                    │
│ Cuevas: 80% de probabilidad            │
│ Secretos: 10% de probabilidad          │
│                                         │
│ Características:                       │
│ - Oscuridad casi total                 │
│ - Lagos de lava                        │
│ - Hongos brillantes                    │
│ - Estructuras de obsidiana             │
│ - Enemigos más peligrosos              │
└─────────────────────────────────────────┘
```

## 4.3 Estructuras del Mundo

### Estructuras Procedurales

| Estructura | Bioma | Tamaño | Contenido |
|------------|-------|--------|-----------|
| **Sala de Puzzles** | Todos | 10x10 | Puzzle + Recompensa |
| **Cámara Secreta** | Todos | 3-6x3-6 | Tesoro + Lore |
| **Cueva Profunda** | Cavernas | Variable | Minerales + Peligros |
| **Ruinas del Templo** | Templo | 8x8 | Puzzle + Key Item |
| **Nido de Criaturas** | Abismo | 5x5 | Enemigos + Loot |

### Generación de Secretos

```javascript
function generateSecret(x, y, z, biome) {
    const roomSize = 3 + Math.floor(Math.random() * 3);
    const roomY = y - 2 - Math.floor(Math.random() * 3);
    
    // Crear habitación oculta
    createRoom(x, roomY, z, roomSize);
    
    // Pared de entrada (rompible)
    setSecretWall(x, roomY, z);
    
    // Tesoro aleatorio
    const treasure = ['chest', 'key', 'journal', 'diamond'];
    placeTreasure(x, roomY, z, treasure);
    
    // Registrar secreto
    secrets.push({ x, y: roomY, z, found: false });
}
```

---

# 5. SISTEMA DE PUZZLES

## 5.1 Filosofía de Diseño

Los puzzles deben ser:
1. **Integrados en el mundo** (no pantallas separadas)
2. **Resolubles con información distribuida** (cooperación)
3. **Visualmente intuitivos** (el jugador entiende qué hacer)
4. **Progresivamente difíciles** (aprendizaje gradual)

## 5.2 Tipos de Puzzles

### 🔥 Puzzle de Espejos y Luz

**Concepto:** Redirigir un rayo de luz hacia un receptor usando espejos.

**Mecánica:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [FUENTE] ──────rayo──────► [ESPEJO1] ──────► [RECEPTOR] │
│                               (rotable)                     │
│                                                             │
│   El jugador rota espejos para guiar el rayo               │
│   hasta el receptor. Cada rotación = 45°                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cooperación requerida:**
- **Cartógrafo:** Ve posición de fuente y receptor
- **Explorador:** Rota los espejos
- **Cifrador:** Lee notas con ángulos correctos
- **Vigía:** Detecta trampas cerca de espejos

**Dificultad progresiva:**
| Nivel | Espejos | Trampas | Complejidad |
|-------|---------|---------|-------------|
| 1 | 2 | 0 | Ángulos simples (90°) |
| 2 | 3 | 1 | Ángulos mixtos (45°, 90°) |
| 3 | 4 | 2 | Ángulos precisos (30°, 60°) |
| 4 | 5+ | 3+ | Múltiples rayos |

---

### 🎨 Puzzle de Secuencia de Colores

**Concepto:** Activar cristales en el orden correcto.

**Mecánica:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Secuencia: 🔴 → 🔵 → 🟢 → 🟡                             │
│                                                             │
│   [CRISTAL_ROJO] [CRISTAL_AZUL] [CRISTAL_VERDE] [CRISTAL_AME]│
│                                                             │
│   El jugador toca los cristales en orden.                  │
│   Error = reset completo.                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cooperación requerida:**
- **Cartógrafo:** Ve qué cristales están activados
- **Explorador:** Toca los cristales
- **Cifrador:** Descifra la secuencia de notas
- **Vigía:** Detecta criaturas que interfieren

**Dificultad progresiva:**
| Nivel | Cristales | Tiempo | Penalización |
|-------|-----------|--------|--------------|
| 1 | 4 | Sin límite | Reset |
| 2 | 5 | 60s | Reset + daño |
| 3 | 6 | 45s | Reset + spawn enemigo |
| 4 | 7+ | 30s | Reset + teletransporte |

---

### ⚖️ Puzzle de Peso y Balanza

**Concepto:** Colocar bloques en plataformas para平衡ar.

**Mecánica:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   IZQUIERDA          BALANZA           DERECHA              │
│   [Platform] ◄──────[Fulcrum]──────► [Platform]            │
│                                                             │
│   Colocar bloques del mismo peso en ambos lados.           │
│   Bloques tienen pesos diferentes (ligero/pesado).         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cooperación requerida:**
- **Cartógrafo:** Ve peso necesario en cada plataforma
- **Explorador:** Mueve bloques pesados
- **Cifrador:** Lee inscripciones con pesos
- **Vigía:** Detecta bloques trampa

**Dificultad progresiva:**
| Nivel | Plataformas | Bloques | Trampas |
|-------|-------------|---------|---------|
| 1 | 2 | 4 | 0 |
| 2 | 2 | 6 | 1 |
| 3 | 3 | 8 | 2 |
| 4 | 3+ | 10+ | 3+ |

---

### 🔑 Puzzle de Llave y Candado

**Concepto:** Encontrar llave y llevarla al candado correcto.

**Mecánica:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [LLAVE_DORADA] ──────?──────► [CANDADO_AZUL]             │
│                                                             │
│   Múltiples llaves y candados.                             │
│   Cada llave tiene un candado específico.                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cooperación requerida:**
- **Cartógrafo:** Ve ubicación de llaves y candados
- **Explorador:** Recoge llave y la lleva
- **Cifrador:** Descifra qué llave va con qué candado
- **Vigía:** Detecta guardianes

---

## 5.3 Sistema de Pistas

### Niveles de Pista

```typescript
enum HintLevel {
    NONE = 0,        // Sin pistas
    SUBTLE = 1,      // Insinuación visual
    MODERATE = 2,    // Pista textual
    EXPLICIT = 3,    // Solución casi directa
    DIRECT = 4,      // Solución completa
}
```

### Activación de Pistas

Las pistas se activan automáticamente después de cierto tiempo:

```javascript
const HINT_TIMERS = {
    puzzle_start: 0,           // Pista inmediata al empezar
    after_30_seconds: 1,       // Pista sutil después de 30s
    after_60_seconds: 2,       // Pista moderada después de 1m
    after_120_seconds: 3,      // Pista explícita después de 2m
    after_180_seconds: 4,      // Solución después de 3m
};
```

---

# 6. MODO COOPERATIVO

## 6.1 Roles Asimétricos

### 🗺️ El Cartógrafo

**Frase:** *"Yo veo el camino, tú recórrelo"*

**Habilidades:**
- ✅ Ver mapa completo del mundo
- ✅ Ver ubicación de secretos (sin contenido)
- ✅ Ver estado de puzzles
- ✅ Marcar puntos de interés
- ✅ Ver posición de todos los jugadores

**Restricciones:**
- ❌ No puede moverse
- ❌ No puede interactuar con bloques
- ❌ No puede recoger items

**UI:** Panel de mapa fullscreen con zoom y marcadores

---

### 🔍 El Explorador

**Frase:** *"Mis manos transforman el mundo"*

**Habilidades:**
- ✅ Movimiento libre (WASD + salto)
- ✅ Romper bloques con herramientas
- ✅ Recoger items y tesoros
- ✅ Activar mecanismos
- ✅ Primera persona con vista 3D

**Restricciones:**
- ❌ No ve mapa completo
- ❌ No ve secretos marcados
- ❌ No puede descifrar códigos

**UI:** Vista primera persona + minimapa + inventario

---

### 🔐 El Cifrador

**Frase:** *"Los símbolos cuentan historias que solo yo entiendo"*

**Habilidades:**
- ✅ Leer notas y documentos cifrados
- ✅ Descifrar códigos en paredes
- ✅ Interpretar runas antiguas
- ✅ Ver patrones invisibles
- ✅ Recibir pistas contextuales

**Restricciones:**
- ❌ No puede abrir cofres
- ❌ No puede romper bloques
- ❌ No puede ver mapa completo

**UI:** Panel de descifrado + visor de runas

---

### 👁️ El Vigía

**Frase:** *"Veo lo que la oscuridad esconde"*

**Habilidades:**
- ✅ Ver todas las criaturas (a través de paredes)
- ✅ Ver trampas y peligros
- ✅ Ver enemigos ocultos
- ✅ Detectar cambios en el entorno
- ✅ Visión nocturna mejorada

**Restricciones:**
- ❌ No puede moverse
- ❌ No puede interactuar
- ❌ No puede ver puzzles ni secretos

**UI:** Vista cenital térmica + lista de amenazas

---

## 6.2 Matriz de Comunicación

| Información | Cartógrafo | Explorador | Cifrador | Vigía |
|-------------|-----------|------------|----------|-------|
| Mapa completo | ✅ Ver | ❌ | ❌ | ❌ |
| Posición jugadores | ✅ Ver | ❌ | ❌ | ❌ |
| Secretos (ubicación) | ✅ Ver | ❌ | ❌ | ❌ |
| Secuencias de colores | ❌ | ❌ | ✅ Descifrar | ❌ |
| Ángulos de espejos | ❌ | ❌ | ✅ Descifrar | ❌ |
| Pesos de bloques | ❌ | ❌ | ✅ Leer | ❌ |
| Ubicación llaves | ✅ Ver | ❌ | ❌ | ❌ |
| Criaturas | ❌ | ❌ | ❌ | ✅ Ver |
| Trampas | ❌ | ❌ | ❌ | ✅ Ver |

## 6.3 Flujo de Información

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE INFORMACIÓN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. Cartógrafo detecta puzzle en el mapa                      │
│            │                                                    │
│            ▼                                                    │
│   2. Cartógrafo informa: "Hay puzzle de espejos al norte"      │
│            │                                                    │
│            ▼                                                    │
│   3. Explorador se mueve hacia el puzzle                       │
│            │                                                    │
│            ▼                                                    │
│   4. Cifrador lee notas: "Los ángulos son 45° y 90°"           │
│            │                                                    │
│            ▼                                                    │
│   5. Vigía detecta: "Hay una trampa cerca del segundo espejo"  │
│            │                                                    │
│            ▼                                                    │
│   6. Explorador ejecuta: rota espejos evitando trampa          │
│            │                                                    │
│            ▼                                                    │
│   7. ¡Puzzle resuelto!                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 7. PROGRESIÓN Y RECOMPENSAS

## 7.1 Estructura de Progresión

```
INICIO
  │
  ├── Puzzle 1: Espejos (Fácil)
  │     └── Recompensa: Martillo
  │
  ├── Puzzle 2: Colores (Medio)
  │     └── Recompensa: Pico
  │
  ├── Puzzle 3: Peso (Difícil)
  │     └── Recompensa: Llave
  │
  ├── Puzzle 4: Código (Experto)
  │     └── Recompensa: Linterna
  │
  └── PUZZLE FINAL: Cámara del Abismo
        └── Recompensa: Final del juego
```

## 7.2 Sistema de Recompensas

### Recompensas por Puzzle

| Puzzle | Recompensa Inmediata | Recompensa Persistente |
|--------|---------------------|------------------------|
| Espejos | Martillo | +1 habilidad |
| Colores | Pico | +1 habilidad |
| Peso | Llave | +1 habilidad |
| Código | Linterna | +1 habilidad |

### Recompensas por Secreto

| Tipo de Secreto | Recompensa |
|-----------------|------------|
| **Cofre** | Items aleatorios (diamantes, oro, llaves) |
| **Página del Diario** | Entrada de lore + pista |
| **Cofre con Llave** | Llave especial → Área nueva |
| **Mineral Raro** | Material de crafting |

### Monedas y Economía

```typescript
const CURRENCY = {
    diamonds: { name: 'Diamantes', icon: '💎', value: 100 },
    gold: { name: 'Oro', icon: '🥇', value: 50 },
    silver: { name: 'Plata', icon: '🥈', value: 25 },
};

// Tienda (futuro)
const SHOP_ITEMS = {
    hint_token: { price: 50, effect: 'Pista gratuita' },
    extra_time: { price: 100, effect: '+30s en puzzles' },
    cosmetic_hat: { price: 200, effect: 'Sombrero cosmético' },
};
```

## 7.3 Diario del Explorador

### Entradas del Diario (50 páginas)

Cada página contiene:
1. **Título** de la entrada
2. **Texto narrativo** con lore
3. **Pista** para un puzzle
4. **Código cifrado** (opcional)

### Ejemplo de Entrada

```markdown
## Entry #27: The Crystal Song

The crystals in the eastern caves hum with an ancient melody.
Each color resonates at a different frequency:
- Red pulses slowest (4 beats)
- Blue follows (2 beats)  
- Green dances (1 beat)
- Yellow completes the phrase (3 beats)

This sequence... it must mean something. The door won't open
unless they're activated in the right order.

[CIPHER: R-B-G-Y]
```

---

# 8. DISEÑO DE ARTE Y AUDIO

## 8.1 Estilo Visual

### Referencia Estilo

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTILO VISUAL                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Referencia: Minecraft meets The Witness                    │
│                                                             │
│  • Bloques voxel con texturas pixeladas                     │
│  • Colores vibrantes pero terrosos                          │
│  • Iluminación suave con sombras                            │
│  • Partículas para efectos especiales                       │
│  • UI limpia y minimalista                                  │
│                                                             │
│  Paleta de colores:                                         │
│  🟤 Tierra: #8d6e63, #6d4c41                              │
│  🟢 Vegetación: #4caf50, #2e7d32                           │
│  🔵 Cristales: #2196f3, #00bcd4                            │
│  🔴 Cristales: #f44336, #e91e63                            │
│  🟡 Oro: #ffd54f, #ffeb3b                                 │
│  ⬜ Piedra: #757575, #9e9e9e                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Texturas de Bloques

Cada bloque tiene 3 texturas:
1. **Top** (superior)
2. **Side** (laterales)
3. **Bottom** (inferior)

Resolución recomendada: **16x16 píxeles** por textura

### Paleta de Colores por Bioma

| Bioma | Superficie | Subterráneo | Acentos |
|-------|------------|-------------|---------|
| Bosque | #4caf50 | #8d6e63 | #2e7d32 |
| Cavernas | #757575 | #616161 | #7c4dff |
| Templo | #ffe082 | #795548 | #9c27b0 |
| Abismo | #212121 | #424242 | #ff5722 |

## 8.2 Efectos Visuales

### Partículas

| Evento | Partículas | Color | Duración |
|--------|-----------|-------|----------|
| Romper bloque | 10-15 debris | Color del bloque | 0.5s |
| Activar cristal | 20-30 brillo | Color del cristal | 1s |
| Descubrir secreto | 50-100 golden | #ffd700 | 2s |
| Resolver puzzle | 100-150 rainbow | Multicolor | 3s |
| Encender antorcha | 5-10 fuego | #ff6600 | Loop |
| Hongos brillantes | 3-5 spores | #76ff03 | Loop |

### Iluminación

```javascript
const LIGHTING_CONFIG = {
    // Luces ambientales
    ambient: {
        day: { color: 0x404060, intensity: 0.3 },
        night: { color: 0x101020, intensity: 0.1 },
    },
    
    // Sol/Luna
    sun: {
        day: { color: 0xfff4e0, intensity: 0.8 },
        night: { color: 0x4444ff, intensity: 0.3 },
    },
    
    // Punto de luz del jugador
    flashlight: {
        color: 0xffffcc,
        intensity: 2,
        distance: 20,
        angle: Math.PI / 6,
    },
    
    // Antorchas
    torch: {
        color: 0xff6600,
        intensity: 0.5,
        distance: 8,
        flicker: true,
    },
};
```

## 8.3 Diseño de Audio

### Música

| Escena | Estilo | BPM | Instrumentos |
|--------|--------|-----|--------------|
| **Menú** | Ambient misterioso | 60 | Piano, pad, cuerdas |
| **Exploración** | Aventura suave | 80 | Guitarra, flauta |
| **Puzzle activo** | Concentración | 90 | Sintetizador, percusión |
| **Puzzle resuelto** | Éxito | 120 | Orquesta completa |
| **Peligro** | Tenso | 110 | Cuerdas, metales |
| **Noche** | Suspenso | 70 | Piano, pad oscuro |

### Efectos de Sonido

| Acción | Sonido | Categoría |
|--------|--------|-----------|
| Romper bloque | "crunch" | World |
| Activar cristal | "chime" | Puzzle |
| Rotar espejo | "clank" | Puzzle |
| Abrir cofre | "creak" | World |
| Recoger item | "pickup" | UI |
| Resolver puzzle | "fanfare" | Achievement |
| Criatura cerca | "growl" | Enemy |
| Paso del jugador | "footstep" | Player |

### Audio Espacial

```javascript
const SPATIAL_AUDIO = {
    // Sonidos 3D posicionales
    positionSounds: ['torch', 'crystal', 'creature'],
    
    // Sonidos globales
    globalSounds: ['puzzle_solved', 'secret_found', 'music'],
    
    // Configuración de rolloff
    rolloffFactor: 1.5,
    refDistance: 5,
    maxDistance: 50,
};
```

---

# 9. INTERFAZ DE USUARIO

## 9.1 Diseño General

### Principios UI

1. **Minimalista:** No saturar la pantalla
2. **Inmersiva:** No romper la experiencia 3D
3. **Informativa:** Mostrar lo necesario sin abrumar
4. **Accesible:** Fácil de entender para nuevos jugadores

### Paleta de UI

```css
:root {
    --ui-bg: rgba(0, 0, 0, 0.7);
    --ui-border: rgba(255, 255, 255, 0.2);
    --ui-text: #ffffff;
    --ui-accent: #4fc3f7;
    --ui-success: #4caf50;
    --ui-warning: #ffab00;
    --ui-danger: #f44336;
}
```

## 9.2 Pantallas Principales

### Pantalla de Inicio

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ⛏️ The Forgotten Depths                   │
│                     Procedural World Generator              │
│                                                             │
│                 ┌─────────────────────────┐                 │
│                 │   Enter seed (random)   │                 │
│                 └─────────────────────────┘                 │
│                                                             │
│                    [ Start Exploring ]                      │
│                                                             │
│   WASD Move  |  Mouse Look  |  E Interact  |  J Journal   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### HUD del Explorador

```
┌─────────────────────────────────────────────────────────────┐
│ 🌲 Petrified Forest                    🔵 0/12 Secrets     │
│                                                             │
│                                         ┌─────────────┐    │
│                                         │   MAPA      │    │
│                                         │   MINI      │    │
│                                         └─────────────┘    │
│                                                             │
│                    ┌─────────────────┐                      │
│                    │    + crosshair  │                      │
│                    └─────────────────┘                      │
│                                                             │
│ HP: ████████░░  │ [✋][🔨][⛏️][🗝️]  │ 💎x2 🥇x1 📖x3     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💡 "The mirror must face north" (from Cifrador)         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Panel del Cartógrafo

```
┌─────────────────────────────────────────────────────────────┐
│ 🗺️ CARTÓGRAFO MODE                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              MAPA COMPLETO DEL MUNDO                │   │
│  │                                                     │   │
│  │   🌲🌲🌲💎🌲🏛️  │  🔵 = Jugador                    │   │
│  │   🌲🔵P1🌲🔴??  │  🔴 = Secreto                    │   │
│  │   🏛️🌲🔵P2🌲   │  🟡 = Puzzle                      │   │
│  │   🌲🌲🌲🌲🌲   │  🟠 = Peligro                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [🔵 Marcar] [🔴 Peligro] [🟡 Puzzle] [🟠 Ayuda]          │
│                                                             │
│  Jugadores: P1:Explorador P2:Cifrador P3:Vigía            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 9.3 Elementos de UI

### Mini Mapa

- **Tamaño:** 150x150 píxeles
- **Posición:** Esquina superior derecha
- **Actualización:** Cada 500ms
- **Contenido:** Terreno + jugadores + marcadores

### Barra de Herramientas

- **Tamaño:** 60x60 píxeles por slot
- **Posición:** Parte inferior central
- **Slots:** 4 herramientas
- **Feedback:** Highlight al seleccionar

### Panel de Pistas

- **Posición:** Parte inferior central
- **Aparición:** Fade in/out
- **Contenido:** Icono + texto
- **Duración:** 3 segundos

### Notificaciones

- **Posición:** Centro de pantalla
- **Animación:** Scale in + fade out
- **Tipos:** Éxito (verde), Error (rojo), Info (azul)

---

# 10. NARRATIVA Y LORE

## 10.1 Historia de Fondo

### La Civilización de Blokheim

Hace mil años, una civilización avanzada construyó ciudades de cristal y piedra en las profundidades de la tierra. Sus habitantes, los **Arquitectos**, dominaban la luz, el peso y los códigos.

Pero una noche, algo terrible despertó en el Abismo. Una fuerza oscura consumió sus ciudades, dejando solo ruinas y puzzles como testigos de su grandeza.

### El Jugador

El jugador es un **Explorador Moderno** que despierta en el Bosque Petrificado sin recuerdos. Su único companions es un **Diario Antiguo** que encontró en su bolsillo.

Poco a poco, descubre que debe resolver los puzzles de los Arquitectos para:
1. Recordar quién es
2. Descubrir qué pasó con Blokheim
3. Enfrentar la amenaza del Abismo

## 10.2 Estructura Narrativa

```
ACTO 1: DESPERTAR (Puzzles 1-2)
├── El jugador despierta en el Bosque
├── Encuentra el diario y primeras pistas
├── Resuelve puzzle de espejos (aprende mecánicas)
└── Descubre entrada al Templo Sumergido

ACTO 2: DESCUBRIMIENTO (Puzzles 3-4)
├── Explora el Templo y sus runas
├── Resuelve puzzle de colores (aprende cooperation)
├── Encuentra la Llave Cristalina
└── Accede a las Cavernas de Cristal

ACTO 3: REVELACIÓN (Puzzle Final)
├── Descubre la verdad sobre Blokheim
├── Resuelve puzzle de peso (desafío final)
├── Entra al Abismo
└── Enfrenta el guardian final

EPÍLOGO: DESEO
├── El jugador elige su destino
├── 5 finales diferentes
└── Rejugabilidad con nuevos secretos
```

## 10.3 Páginas del Diario (Ejemplos)

### Entry #1: El Despertar

> *"No sé dónde estoy. El aire huele a piedra vieja y humedad. Hay árboles, pero son de piedra. Tengo este diario en el bolsillo... parece antiguo. Las primeras páginas están arrancadas. Debo encontrar una salida."*

### Entry #2: Los Puzzles

> *"He descubierto extraños mecanismos. Espejos que reflejan luz, cristales que responden al tacto, plataformas que pesan. Los Arquitectos debieron ser genios. Pero, ¿por qué dejaron estos acertijos? ¿Es una prueba? ¿Una trampa?"*

### Entry #27: La Verdad

> *"Las runas cuentan la historia completa. Los Arquitectos crearon el Abismo para contener algo. Algo que no podía ser destruido, solo encerrado. Los puzzles no son defensas... son llaves. Y nosotros las estamos abriendo."*

---

# 11. ESPECIFICACIONES TÉCNICAS

## 11.1 Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Three.js** | r128+ | Rendering 3D WebGL |
| **React** | 18+ | UI Framework |
| **Zustand** | 4+ | State Management |
| **TypeScript** | 5+ | Type Safety |
| **Vite** | 5+ | Build Tool |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 20+ | Runtime |
| **Colyseus** | 0.15+ | Multiplayer Framework |
| **TypeScript** | 5+ | Type Safety |
| **Redis** | 7+ | Session Cache |
| **PostgreSQL** | 16+ | Persistence |

### DevOps

| Tecnología | Uso |
|------------|-----|
| **Docker** | Containerization |
| **Railway/Fly.io** | Hosting |
| **GitHub Actions** | CI/CD |
| **Cloudflare R2** | Asset Storage |

## 11.2 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DEL SISTEMA                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     WebSocket      ┌──────────────────┐      │
│  │   CLIENTE    │◄─────────────────►│   SERVIDOR       │      │
│  │   (Browser)  │                    │   (Node.js)      │      │
│  │              │                    │                  │      │
│  │  • Three.js  │    State Diffs     │  • Colyseus      │      │
│  │  • React UI  │───────────────────│  • Game Rooms    │      │
│  │  • Zustand   │                    │  • World Gen     │      │
│  └──────────────┘                    │  • Puzzle Engine  │      │
│                                      └────────┬─────────┘      │
│                                               │                 │
│                              ┌────────────────┼────────────┐   │
│                              │                │            │   │
│                       ┌──────▼──────┐  ┌──────▼──────┐    │   │
│                       │   REDIS     │  │ POSTGRESQL  │    │   │
│                       │   (Cache)   │  │ (Persist)   │    │   │
│                       └─────────────┘  └─────────────┘    │   │
│                                                            │   │
└─────────────────────────────────────────────────────────────────┘
```

## 11.3 Protocolo de Red

### Mensajes Cliente → Servidor

```typescript
interface ClientMessages {
    player_move: {
        position: Vector3;
        rotation: Vector3;
        velocity: Vector3;
    };
    
    block_interact: {
        action: 'break' | 'place';
        position: Vector3;
        blockType?: number;
    };
    
    pick_up_item: {
        itemId: string;
        position: Vector3;
    };
    
    decode_cipher: {
        cipherId: string;
        solution: string;
    };
    
    mark_map: {
        position: Vector2;
        markerType: 'secret' | 'danger' | 'interest' | 'puzzle';
        note?: string;
    };
    
    chat_message: {
        message: string;
        channel: 'team' | 'global';
    };
}
```

### Mensajes Servidor → Cliente

```typescript
interface ServerMessages {
    world_state: {
        seed: string;
        chunks: ChunkData[];
        puzzles: PuzzleState[];
        secrets: SecretState[];
    };
    
    player_update: {
        id: string;
        role: Role;
        position?: Vector3;
        inventory?: Item[];
    };
    
    role_data: {
        mapData?: CartographerData;
        cipherData?: CipherData;
        vigilData?: VigilData;
    };
    
    puzzle_event: {
        type: 'started' | 'progress' | 'solved' | 'failed';
        puzzleId: string;
        data: any;
    };
    
    secret_found: {
        secretId: string;
        position: Vector3;
        foundBy: string;
        contains: Item;
    };
}
```

## 11.4 Optimizaciones

### Rendering

- **Greedy Meshing:** Combinar caras adyacentes del mismo tipo
- **Frustum Culling:** No renderizar chunks fuera de vista
- **LOD:** Nivel de detalle reducido para chunks lejanos
- **Texture Atlas:**Una sola textura para todos los bloques

### Red

- **State Sync:** Solo enviar cambios (deltas)
- **Interpolación:** Suavizar movimiento de otros jugadores
- **Predicción:** Movimiento local instantáneo
- **Compresión:** LZ4 para datos de chunks

### Memoria

- **Object Pooling:** Reutilizar geometrías y materiales
- **Lazy Loading:** Cargar chunks bajo demanda
- **Disposal:** Liberar memoria de chunks no visibles

---

# 12. MÉTRICAS Y ANALYTICS

## 12.1 Métricas Clave

### Engagement

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **Sesiones/día** | >1000 | Jugadores únicos diarios |
| **Tiempo promedio** | >15 min | Duración de sesión |
| **Tasa de retención D1** | >40% | Vuelve al día siguiente |
| **Tasa de retención D7** | >20% | Vuelve en una semana |

### Gameplay

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **Tasa de completación** | >70% | Completan al menos 1 puzzle |
| **Tiempo por puzzle** | 3-5 min | No muy fácil ni muy difícil |
| **Tasa de comunicación** | >80% | Usan chat/marcadores |
| **Tasa de cooperación** | >90% | Puzzles requieren ayuda |

### Monetización (Futuro)

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **Conversion** | >5% | Usuarios que pagan |
| **ARPU** | >$5 | Ingreso promedio por usuario |
| **LTV** | >$20 | Valor de vida del usuario |

## 12.2 Eventos de Analytics

```typescript
const ANALYTICS_EVENTS = {
    // Engagement
    'game_start': { userId, seed, timestamp },
    'game_end': { userId, duration, puzzlesSolved, secretsFound },
    
    // Gameplay
    'puzzle_started': { puzzleId, puzzleType, players },
    'puzzle_solved': { puzzleId, duration, hintsUsed },
    'puzzle_failed': { puzzleId, attempts },
    'secret_found': { secretId, position, foundBy },
    
    // Social
    'chat_sent': { userId, channel, messageLength },
    'marker_placed': { userId, markerType, position },
    
    // Technical
    'fps': { fps, timestamp },
    'load_time': { duration, assets },
    'error': { type, message, stack },
};
```

---

# 13. CRONOGRAMA DE DESARROLLO

## 13.1 Fases del Proyecto

```
FASE 1: PROTOTIPO (Semanas 1-4)
├── Semana 1: Configuración del proyecto + Voxel engine básico
├── Semana 2: Movimiento del jugador + Colisiones
├── Semana 3: Generación procedural de mundo
├── Semana 4: Puzzle de espejos funcional
└── Entregable: Prototipo jugable con 1 puzzle

FASE 2: MECÁNICAS CORE (Semanas 5-8)
├── Semana 5: Sistema de puzzles completo (4 tipos)
├── Semana 6: Sistema de roles asimétricos
├── Semana 7: Multiplayer básico (Colyseus)
├── Semana 8: UI completa por roles
└── Entregable: Juego cooperativo funcional

FASE 3: CONTENIDO (Semanas 9-12)
├── Semana 9: Generación de secretos + tesoros
├── Semana 10: Sistema de progresión + Items
├── Semana 11: Diario + Lore + Narrativa
├── Semana 12: Balance de dificultad
└── Entregable: Contenido completo

FASE 4: PULIDO (Semanas 13-16)
├── Semana 13: Arte + Audio + Partículas
├── Semana 14: Optimización + Performance
├── Semana 15: Testing + Bug fixes
├── Semana 16: Deploy + Launch
└── Entregable: Juego listo para producción
```

## 13.2 Hito Importante

| Semana | Hito | Estado |
|--------|------|--------|
| 4 | Prototipo jugable | 🟡 En progreso |
| 8 | Multiplayer funcional | ⬜ Pendiente |
| 12 | Contenido completo | ⬜ Pendiente |
| 16 | Lanzamiento | ⬜ Pendiente |

---

# 14. APÉNDICES

## 14.1 Glosario

| Término | Definición |
|---------|------------|
| **Voxel** | Volumetric pixel, unidad 3D del mundo |
| **Chunk** | Sección del mundo (16x16x16 bloques) |
| **Seed** | Cadena que genera el mundo procedural |
| **Biome** | Región con características específicas |
| **Puzzle** | Acertijo que requiere resolver |
| **Asimétrico** | Roles con información/habilidades diferentes |
| **NPC** | Non-Player Character (criatura) |
| **Lore** | Historia de fondo del juego |

## 14.2 Referencias

### Documentos Relacionados
- `COOPERATIVE_SYSTEM_DESIGN.md` - Diseño del sistema cooperativo
- `index.html` - Prototipo interactivo

### Enlaces Útiles
- Three.js Docs: https://threejs.org/docs/
- Colyseus Docs: https://docs.colyseus.io/
- Simplex Noise: https://en.wikipedia.org/wiki/Simplex_noise

## 14.3 Créditos

| Rol | Nombre |
|-----|--------|
| **Game Design** | Buffy AI |
| **Technical Design** | Buffy AI |
| **Prototyping** | Buffy AI |

---

# 📋 CAMBIO DE DOCUMENTO

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-08-09 | Versión inicial del GDD |

---

**FIN DEL DOCUMENTO**

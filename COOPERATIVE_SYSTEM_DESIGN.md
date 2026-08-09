# 🎮 The Forgotten Depths - Sistema Cooperativo Asimétrico

## Documento de Diseño Técnico

---

## 1. Visión General del Sistema

### 1.1 Concepto
El juego cooperativo asimétrico asigna a cada jugador un **rol único** con información y habilidades diferentes. Para progresar, los jugadores **deben comunicarse y cooperar**, ya que ninguno puede resolver los puzzles solo.

### 1.2 Jugadores Soportados
- **Mínimo:** 2 jugadores
- **Máximo:** 4 jugadores
- **Modo recomendado:** 3-4 jugadores

### 1.3 Principios Diseño
1. **Información Asimétrica:** Cada rol ve información diferente del mundo
2. **Dependencia Mutua:** Ningún rol puede completar puzzles sin ayuda
3. **Comunicación Efectiva:** El juego incentiva hablar y coordinar
4. **Rejugabilidad:** Roles aleatorios hacen cada partida única

---

## 2. Sistema de Roles

### 2.1 Los Cuatro Roles

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ROLES ASIMÉTRICOS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🗺️ CARTÓGRAFO          🔍 EXPLORADOR                              │
│  ┌─────────────────┐    ┌─────────────────┐                        │
│  │ Ve el mapa       │    │ Se mueve libre   │                        │
│  │ completo         │    │ por el mundo     │                        │
│  │                  │    │                  │                        │
│  │ ✅ Ver mapa      │    │ ✅ Romper bloques│                        │
│  │ ✅ Ver secretos  │    │ ✅ Recoger items │                        │
│  │ ✅ Ver puzzles   │    │ ✅ Abrir cofres  │                        │
│  │ ❌ Moverse       │    │ ❌ Ver mapa      │                        │
│  │ ❌ Interactuar   │    │ ❌ Ver secretos  │                        │
│  │ ❌ Recoger items │    │ ❌ Ver puzzles   │                        │
│  └─────────────────┘    └─────────────────┘                        │
│                                                                     │
│  🔐 CIFRADOR            👁️ VIGÍA                                   │
│  ┌─────────────────┐    ┌─────────────────┐                        │
│  │ Descifra códigos │    │ Detecta peligros│                        │
│  │ y acertijos      │    │ y secretos      │                        │
│  │                  │    │                  │                        │
│  │ ✅ Ver notas     │    │ ✅ Ver criaturas │                        │
│  │ ✅ Descifrar     │    │ ✅ Ver trampas   │                        │
│  │ ✅ Leer runas    │    │ ✅ Ver enemigos  │                        │
│  │ ❌ Abrir cofres  │    │ ❌ Moverse       │                        │
│  │ ❌ Romper bloques│    │ ❌ Interactuar   │                        │
│  │ ❌ Ver mapa      │    │ ❌ Recoger items │                        │
│  └─────────────────┘    └─────────────────┘                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Descripción Detallada de Roles

#### 🗺️ El Cartógrafo
**Frase:** *"Yo veo el camino, tú recórrelo"*

**Habilidades:**
- Ve el **mapa completo** del mundo (todos los chunks descubiertos)
- Puede ver **íconos de secretos** en el mapa (sin saber qué contienen)
- Puede ver **ubicación de puzzles** y su estado (resuelto/pendiente)
- Puede **marcar puntos** en el mapa para guiar a otros
- Ve la **posición de todos los jugadores** en tiempo real

**Restricciones:**
- **No puede moverse** (vista estática tipo "上帝视角")
- **No puede interactuar** con bloques ni objetos
- **No puede recoger** items ni tesoros

**UI Especial:**
- Panel de mapa fullscreen con zoom
- Botón de marcadores (punto de interés, peligro, secretos)
- Lista de jugadores con sus posiciones
- Indicadores de puzzles activos

---

#### 🔍 El Explorador
**Frase:** *"Mis manos transforman el mundo"*

**Habilidades:**
- **Movimiento libre** por todo el mundo (WASD + salto)
- Puede **romper bloques** con herramientas
- Puede **recoger items** (llaves, gemas, páginas del diario)
- Puede **abrir cofres** y obtener tesoros
- Puede **activar mecanismos** (palancas, presión)
- Primera persona con vista completa del entorno 3D

**Restricciones:**
- **No ve el mapa** (solo minimapa básico)
- **No ve secretos** marcados (aunque puede encontrarlos por exploración)
- **No ve puzzles** en el mapa
- **No puede descifrar** códigos ni leer runas

**UI Especial:**
- Vista primera persona con crosshair
- Barra de herramientas (mano, martillo, pico, llave)
- Inventario de items recolectados
- Indicador de salud/energía

---

#### 🔐 El Cifrador
**Frase:** *"Los símbolos cuentan historias que solo yo entiendo"*

**Habilidades:**
- Puede **leer notas** y documentos cifrados
- Puede **descifrar códigos** en paredes y objetos
- Puede **interpretar runas** en piedras antiguas
- Puede **ver patrones** invisibles para otros (secuencias de colores, símbolos)
- Recibe **pistas contextuales** que otros no ven

**Restricciones:**
- **No puede abrir cofres** (solo ver su contenido)
- **No puede romper bloques**
- **No puede ver el mapa** completo
- **No puede recoger items** (solo observar)

**UI Especial:**
- Panel de descifrado con campo de texto
- Visor de runas (overlay especial)
- Historial de códigos descifrados
- Pistas contextuales aparecen automáticamente

---

#### 👁️ El Vigía
**Frase:** *"Veo lo que la oscuridad esconde"*

**Habilidades:**
- Ve **todas las criaturas** y su posición (incluso a través de paredes)
- Ve **trampas y peligros** marcados en rojo
- Ve **enemigos ocultos** que otros no pueden ver
- Detecta **cambios en el entorno** (bloques que se mueven, puertas que se abren)
- Tiene **visión nocturna** mejorada

**Restricciones:**
- **No puede moverse** (vista estática tipo security camera)
- **No puede interactuar** con nada
- **No puede recoger items**
- **No puede ver puzzles** ni secretos

**UI Especial:**
- Vista cenital con visión de calor (enemigos en rojo, trampas en amarillo)
- Lista de amenazas activas
- Temporizador de spawn de criaturas
- Alertas de peligro cercano

---

## 3. Sistema de Permisos

### 3.1 Matriz de Permisos

| Acción | Cartógrafo | Explorador | Cifrador | Vigía |
|--------|-----------|------------|----------|-------|
| **Movimiento** | ❌ | ✅ | ❌ | ❌ |
| **Ver mapa completo** | ✅ | ❌ | ❌ | ❌ |
| **Ver minimapa** | ✅ | ✅ | ✅ | ✅ |
| **Romper bloques** | ❌ | ✅ | ❌ | ❌ |
| **Recoger items** | ❌ | ✅ | ❌ | ❌ |
| **Abrir cofres** | ❌ | ✅ | ❌ | ❌ |
| **Activar mecanismos** | ❌ | ✅ | ❌ | ❌ |
| **Leer notas/códigos** | ❌ | ❌ | ✅ | ❌ |
| **Descifrar runas** | ❌ | ❌ | ✅ | ❌ |
| **Ver secretos marcados** | ✅ | ❌ | ❌ | ❌ |
| **Ver criaturas/enemigos** | ❌ | ❌ | ❌ | ✅ |
| **Ver trampas** | ❌ | ❌ | ❌ | ✅ |
| **Marcar puntos en mapa** | ✅ | ❌ | ❌ | ❌ |
| **Chat de voz/texto** | ✅ | ✅ | ✅ | ✅ |

### 3.2 Validación de Permisos (Servidor)

```typescript
// server/permissions.ts
enum Role {
    CARTOGRAPHER = 'cartographer',
    EXPLORER = 'explorer',
    CIPHER = 'cipher',
    VIGIL = 'vigil'
}

const PERMISSIONS: Record<Role, string[]> = {
    [Role.CARTOGRAPHER]: [
        'view_full_map',
        'view_secrets_on_map',
        'view_puzzle_status',
        'mark_map_points',
        'view_all_players'
    ],
    [Role.EXPLORER]: [
        'move',
        'break_blocks',
        'place_blocks',
        'pick_up_items',
        'open_chests',
        'activate_mechanisms',
        'use_tools'
    ],
    [Role.CIPHER]: [
        'read_notes',
        'decode_ciphers',
        'read_runes',
        'see_hidden_patterns',
        'view_contextual_hints'
    ],
    [Role.VIGIL]: [
        'see_creatures',
        'see_traps',
        'see_hidden_enemies',
        'night_vision',
        'detect_environment_changes'
    ]
}

function hasPermission(role: Role, action: string): boolean {
    return PERMISSIONS[role]?.includes(action) ?? false;
}

function validateAction(playerId: string, action: string, gameState: GameState): boolean {
    const player = gameState.players.get(playerId);
    if (!player) return false;
    
    // Special case: Explorer can interact with puzzles if Cifrador provides solution
    if (action === 'solve_puzzle') {
        return player.role === Role.EXPLORER && 
               gameState.hasReceivedSolution(playerId);
    }
    
    return hasPermission(player.role, action);
}
```

---

## 4. Sistema de Sincronización

### 4.1 Arquitectura de Red

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MULTIPLAYER ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     WebSocket      ┌──────────────────┐          │
│  │   CLIENTE    │◄─────────────────►│   SERVIDOR       │          │
│  │   (Browser)  │                    │   (Node.js)      │          │
│  └──────┬───────┘                    └────────┬─────────┘          │
│         │                                     │                     │
│         │         ┌─────────────┐            │                     │
│         │         │    REDIS    │◄───────────┤                     │
│         │         │   (Cache)   │            │                     │
│         │         └─────────────┘            │                     │
│         │                                     │                     │
│  ┌──────▼───────┐                    ┌────────▼─────────┐          │
│  │  Room State  │                    │   PostgreSQL     │          │
│  │  (in-memory) │                    │   (Persistence)  │          │
│  └──────────────┘                    └──────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Protocolo de Mensajes

#### Mensajes Cliente → Servidor

```typescript
// Tipos de mensajes del cliente
interface ClientMessages {
    // Movimiento (solo Explorer)
    player_move: {
        position: { x: number, y: number, z: number };
        rotation: { x: number, y: number, z: number };
        velocity: { x: number, y: number, z: number };
    };
    
    // Interacción con bloques (solo Explorer)
    block_interact: {
        action: 'break' | 'place';
        position: { x: number, y: number, z: number };
        blockType?: number;
    };
    
    // Recoger item (solo Explorer)
    pick_up_item: {
        itemId: string;
        position: { x: number, y: number, z: number };
    };
    
    // Descifrar (solo Cifrador)
    decode_cipher: {
        cipherId: string;
        solution: string;
    };
    
    // Marcar mapa (solo Cartógrafo)
    mark_map: {
        position: { x: number, z: number };
        markerType: 'secret' | 'danger' | 'interest' | 'puzzle';
        note?: string;
    };
    
    // Chat
    chat_message: {
        message: string;
        channel: 'team' | 'global';
    };
    
    // Solución de puzzle (cooperativo)
    puzzle_solution: {
        puzzleId: string;
        solution: any;
        assistedBy?: string; // Player ID who provided info
    };
}
```

#### Mensajes Servidor → Cliente

```typescript
// Tipos de mensajes del servidor
interface ServerMessages {
    // Estado del mundo
    world_state: {
        seed: string;
        chunks: ChunkData[];
        puzzles: PuzzleState[];
        secrets: SecretState[];
    };
    
    // Actualización de jugadores
    player_update: {
        id: string;
        role: Role;
        position?: { x: number, y: number, z: number };
        inventory?: Item[];
        isAlive: boolean;
    };
    
    // Datos específicos por rol
    role_data: {
        // Para Cartógrafo
        mapData?: {
            revealedChunks: ChunkCoord[];
            secretLocations: SecretLocation[];
            puzzleLocations: PuzzleLocation[];
            playerPositions: PlayerPosition[];
            markers: MapMarker[];
        };
        
        // Para Cifrador
        cipherData?: {
            availableCiphers: Cipher[];
            decodedCiphers: DecodedCipher[];
            contextualHints: Hint[];
        };
        
        // Para Vigía
        vigilData?: {
            creatures: Creature[];
            traps: Trap[];
            hiddenEnemies: HiddenEnemy[];
            alerts: Alert[];
        };
    };
    
    // Eventos de puzzle
    puzzle_event: {
        type: 'started' | 'progress' | 'solved' | 'failed';
        puzzleId: string;
        data: any;
    };
    
    // Notificación de secreto
    secret_found: {
        secretId: string;
        position: { x: number, y: number, z: number };
        foundBy: string;
        contains: Item;
    };
    
    // Chat
    chat_broadcast: {
        senderId: string;
        senderName: string;
        message: string;
        channel: 'team' | 'global';
    };
}
```

### 4.3 Sincronización de Estado

```typescript
// server/GameRoom.ts
class GameRoom {
    private state: GameState;
    private players: Map<string, PlayerConnection>;
    
    // Tick rate: 20 Hz para estado del mundo
    private worldUpdateInterval = 50; // ms
    
    // Tick rate: 30 Hz para movimiento
    private movementUpdateInterval = 33; // ms
    
    constructor(seed: string) {
        this.state = new GameState(seed);
        this.startGameLoop();
    }
    
    private startGameLoop() {
        // World state updates (slower)
        setInterval(() => this.broadcastWorldState(), this.worldUpdateInterval);
        
        // Movement updates (faster)
        setInterval(() => this.broadcastMovementState(), this.movementUpdateInterval);
    }
    
    private broadcastWorldState() {
        for (const [playerId, connection] of this.players) {
            const player = this.state.players.get(playerId);
            if (!player) continue;
            
            // Send role-specific data
            const roleData = this.getRoleSpecificData(player.role, player);
            connection.send('role_data', roleData);
        }
    }
    
    private broadcastMovementState() {
        // Only Explorer moves, so we only need to broadcast their position
        const explorer = this.state.getExplorer();
        if (!explorer) return;
        
        for (const [playerId, connection] of this.players) {
            if (playerId === explorer.id) continue; // Don't send to self
            
            connection.send('player_update', {
                id: explorer.id,
                role: explorer.role,
                position: explorer.position,
                isAlive: explorer.isAlive
            });
        }
    }
    
    private getRoleSpecificData(role: Role, player: Player): any {
        switch (role) {
            case Role.CARTOGRAPHER:
                return {
                    mapData: {
                        revealedChunks: this.state.getRevealedChunks(),
                        secretLocations: this.state.getSecretLocations(),
                        puzzleLocations: this.state.getPuzzleLocations(),
                        playerPositions: this.state.getAllPlayerPositions(),
                        markers: this.state.getMapMarkers(player.id)
                    }
                };
                
            case Role.EXPLORER:
                return {
                    inventory: player.inventory,
                    nearbyBlocks: this.state.getNearbyBlocks(player.position, 5),
                    nearbyItems: this.state.getNearbyItems(player.position, 3)
                };
                
            case Role.CIPHER:
                return {
                    cipherData: {
                        availableCiphers: this.state.getAvailableCiphers(),
                        decodedCiphers: player.decodedCiphers,
                        contextualHints: this.state.getContextualHints(player.position)
                    }
                };
                
            case Role.VIGIL:
                return {
                    vigilData: {
                        creatures: this.state.getCreatures(),
                        traps: this.state.getTraps(),
                        hiddenEnemies: this.state.getHiddenEnemies(),
                        alerts: this.state.getNearbyAlerts(player.position)
                    }
                };
        }
    }
    
    // Handle player actions
    handlePlayerAction(playerId: string, action: string, data: any) {
        const player = this.state.players.get(playerId);
        if (!player) return;
        
        // Validate permissions
        if (!this.validateAction(player, action)) {
            this.sendError(playerId, 'Permission denied for this action');
            return;
        }
        
        // Execute action
        switch (action) {
            case 'block_interact':
                this.handleBlockInteraction(player, data);
                break;
            case 'decode_cipher':
                this.handleCipherDecode(player, data);
                break;
            case 'mark_map':
                this.handleMapMark(player, data);
                break;
            case 'puzzle_solution':
                this.handlePuzzleSolution(player, data);
                break;
        }
    }
    
    private validateAction(player: Player, action: string): boolean {
        // Check role permissions
        if (!hasPermission(player.role, action)) {
            return false;
        }
        
        // Special case: puzzle solving requires coordination
        if (action === 'solve_puzzle') {
            return this.state.canSolvePuzzle(player);
        }
        
        return true;
    }
}
```

---

## 5. Sistema de Puzzles Cooperativos

### 5.1 Puzzle: Espejos y Luz (Mirror)

**Descripción:** Redirigir un rayo de luz hacia un receptor usando espejos.

**Cooperación requerida:**
- **Cartógrafo** ve la posición del光源 y el receptor en el mapa
- **Explorador** mueve y rota los espejos
- **Cifrador** lee las notas que indican el ángulo correcto
- **Vigía** detecta trampas cerca de los espejos

**Flujo de solución:**
```
1. Cartógrafo: "El光源 está en (5,3,2), el receptor en (8,3,8)"
2. Cifrador: "Las notas dicen: ángulo 45°, luego reflejar al sur"
3. Explorador: Rota el primer espejo a 45°
4. Vigía: "Cuidado, hay una trampa cerca del segundo espejo"
5. Explorador: Rota el segundo espejo evitando la trampa
6. ¡Puzzle resuelto!
```

### 5.2 Puzzle: Secuencia de Colores

**Descripción:** Activar cristales en el orden correcto.

**Cooperación requerida:**
- **Cartógrafo** ve qué cristales están activados
- **Explorador** activa los cristales tocándolos
- **Cifrador** descifra la secuencia de las notas en la pared
- **Vigía** detecta si hay criaturas que interfieren

**Flujo de solución:**
```
1. Cifrador: "El código dice: Rojo → Azul → Verde → Amarillo"
2. Explorador: Toca el cristal rojo
3. Cartógrafo: "Confirmado, rojo activado"
4. Explorador: Toca el cristal azul
5. Vigía: "Una criatura se acerca por el pasillo norte"
6. Explorador: Toca verde y amarillo rápido antes de que llegue
7. ¡Puzzle resuelto!
```

### 5.3 Puzzle: Peso y Balanza

**Descripción:** Colocar bloques pesados en plataformas para平衡ar.

**Cooperación requerida:**
- **Cartógrafo** ve el peso necesario en cada plataforma
- **Explorador** mueve los bloques pesados
- **Cifrador** lee las inscripciones que indican el peso
- **Vigía** detecta trampas de peso (bloques que parecen pesados pero no lo son)

**Flujo de solución:**
```
1. Cartógrafo: "Plataforma izquierda necesita 2 bloques, derecha 2"
2. Cifrador: "Las runas dicen: el bloque dorado es ligero, el negro es pesado"
3. Explorador: Coloca 2 bloques negros en izquierda
4. Explorador: Coloca 2 bloques negros en derecha
5. Vigía: "El bloque rojo es una trampa, no lo toques"
6. ¡Puzzle resuelto!
```

### 5.4 Puzzle: Llave y Candado

**Descripción:** Encontrar una llave y usarla en un candado específico.

**Cooperación requerida:**
- **Cartógrafo** ve dónde está la llave y el candado
- **Explorador** recoge la llave y la lleva al candado
- **Cifrador** descifra qué candado corresponde a qué llave
- **Vigía** detecta guardianes que protegen la llave

**Flujo de solución:**
```
1. Cartógrafo: "Llave en (12,5,8), candado en (5,5,12)"
2. Cifrador: "Las runas dicen: llave dorada → candado azul"
3. Vigía: "Hay 3 guardianes alrededor de la llave"
4. Explorador: Espera a que pasen los guardianes
5. Explorador: Recoge llave dorada
6. Explorador: Lleva llave al candado azul
7. ¡Puzzle resuelto!
```

---

## 6. Sistema de Comunicación

### 6.1 Chat de Texto

```typescript
// Tipos de mensajes
interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: Role;
    message: string;
    channel: 'team' | 'global';
    timestamp: number;
    // Para mensajes de sistema
    isSystem?: boolean;
    type?: 'puzzle_hint' | 'secret_found' | 'danger_alert';
}
```

### 6.2 Marcadores Rápidos (Ping System)

El juego incluye marcadores rápidos que cualquier jugador puede usar:

| Tecla | Marcador | Icono | Descripción |
|-------|----------|-------|-------------|
| `Q` | Interés | 🔵 | "Mira esto" |
| `R` | Peligro | 🔴 | "Cuidado aquí" |
| `T` | Secret | 🟡 | "Hay algo oculto" |
| `Y` | Ayuda | 🟢 | "Necesito ayuda aquí" |

### 6.3 Comunicación por Rol

Cada rol tiene acceso a **canales especiales**:

```typescript
// Canales de comunicación
const CHANNELS = {
    // Todos pueden usar
    TEAM: 'team',           // Chat del equipo
    
    // Solo ciertos roles
    CARTOGRAPHER_NOTES: 'cartographer_notes',  // Notas del mapa
    CIPHER_DECODES: 'cipher_decodes',          // Códigos descifrados
    VIGIL_ALERTS: 'vigil_alerts',              // Alertas de peligro
    
    // Automáticos (el sistema envía)
    SYSTEM_HINTS: 'system_hints',              // Pistas del sistema
    PUZZLE_UPDATES: 'puzzle_updates',          // Actualizaciones de puzzles
};
```

---

## 7. UI/UX por Rol

### 7.1 Cartógrafo - Interfaz

```
┌─────────────────────────────────────────────────────────────────────┐
│  🗺️ CARTÓGRAFO - Panel de Mapa                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MAPA COMPLETO                             │   │
│  │  ┌─────┬─────┬─────┬─────┬─────┐                           │   │
│  │  │ 🌲  │ 🌲  │ 💎  │ 🌲  │ 🏛️  │  ← Biomas               │   │
│  │  ├─────┼─────┼─────┼─────┼─────┤                           │   │
│  │  │ 🌲  │ 🔵P1│ 🌲  │ 🔴??│ 🌲  │  ← Jugadores y Secretos │   │
│  │  ├─────┼─────┼─────┼─────┼─────┤                           │   │
│  │  │ 🏛️  │ 🌲  │ 🔵P2│ 🌲  │ 🌲  │                           │   │
│  │  └─────┴─────┴─────┴─────┴─────┘                           │   │
│  │                                                              │   │
│  │  Leyenda: 🔵=Jugador 🔴=Secreto 🟡=Puzzle 🟠=Peligro       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ Marcadores       │  │ Jugadores        │                        │
│  │ [🔵 Interés]     │  │ P1: Explorador   │                        │
│  │ [🔴 Peligro]     │  │ P2: Cifrador     │                        │
│  │ [🟡 Secreto]     │  │ P3: Vigía        │                        │
│  │ [🟠 Puzzle]      │  │                   │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Chat: "Explorador, ve al norte del bosque petrificado"      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Explorador - Interfaz

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 EXPLORADOR - Vista Primera Persona                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │                    [VISTA 3D DEL MUNDO]                     │   │
│  │                                                             │   │
│  │                         +                                   │   │
│  │                      [crosshair]                            │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────┐  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │ HP: ████ │  │ Herramientas:        │  │ Inventario:          │ │
│  │ EN: ███  │  │ [✋][🔨][⛏️][🗝️]    │  │ 💎x2  🥇x1  📖x3  │ │
│  └──────────┘  └──────────────────────┘  └──────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Minimapa:           │ Pistas del Cifrador:                  │   │
│  │ ┌─────────────┐     │ "El espejo debe estar a 45°"          │   │
│  │ │    [mini]   │     │                                       │   │
│  │ └─────────────┘     │ Marcadores del Cartógrafo:            │   │
│  │                      │ 🔵 "Ve al norte"                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3 Cifrador - Interfaz

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔐 CIFRADOR - Panel de Descifrado                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Códigos Activos                                              │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │ 🔑 Cifrado #1: "XVHBW" → ¿Qué significa?              │ │   │
│  │ │    Pista: Las runas antiguas usan desplazamiento +3     │ │   │
│  │ │    Respuesta: [_______________] [Descifrar]             │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │ 🔑 Cifrado #2: "🔴→🔵→🟢→🟡" (Secuencia de colores)   │ │   │
│  │ │    Estado: Descifrado ✓                                 │ │   │
│  │ │    Mensaje: "Activa los cristales en este orden"        │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Pistas Contextuales                                         │   │
│  │ 📍 Cerca de puzzle de espejos: "Los reflejos siguen la     │   │
│  │    ley de Snell: ángulo de incidencia = ángulo de反射"      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Chat: "Explorador, el código es: Rojo, Azul, Verde, Amarillo"│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.4 Vigía - Interfaz

```
┌─────────────────────────────────────────────────────────────────────┐
│  👁️ VIGÍA - Panel de Vigilancia                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    VISTA CENITAL                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │        [Vista térmica del mapa]                      │   │   │
│  │  │   🟢 = Seguro    🔴 = Peligro    🟡 = Trampa        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ Amenazas Activas │  │ Alertas          │                        │
│  │ 🟤 Criatura x3   │  │ ⚠️ "Criatura    │                        │
│  │ 🟤 Guardián x1   │  │    detectada en  │                        │
│  │ 🟠 Trampa x2     │  │    pasillo norte"│                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Próximo spawn: 00:32  │  Explorador: Seguro ✓              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Chat: "Explorador, hay 2 criaturas esperando en la cueva"   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Flujo de Partida Cooperativa

### 8.1 Inicio de Partida

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE PARTIDA                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. CREACIÓN DE SALA                                                │
│     ┌─────────────┐                                                 │
│     │ Host crea    │──── Seed: "aventura123"                       │
│     │ sala         │──── Max jugadores: 4                          │
│     └──────┬──────┘                                                 │
│            │                                                        │
│  2. UNIÓN DE JUGADORES                                              │
│     ┌──────▼──────┐                                                 │
│     │ Jugadores   │──── Esperando... (2/4)                        │
│     │ se unen     │                                                 │
│     └──────┬──────┘                                                 │
│            │                                                        │
│  3. ASIGNACIÓN DE ROLES (Aleatoria)                                │
│     ┌──────▼──────┐                                                 │
│     │ Sistema     │──── P1: 🗺️ Cartógrafo                         │
│     │ asigna      │──── P2: 🔍 Explorador                         │
│     │ roles       │──── P3: 🔐 Cifrador                           │
│     │             │──── P4: 👁️ Vigía                               │
│     └──────┬──────┘                                                 │
│            │                                                        │
│  4. GENERACIÓN DEL MUNDO                                            │
│     ┌──────▼──────┐                                                 │
│     │ Servidor    │──── Genera mundo con seed                      │
│     │ genera      │──── Coloca puzzles                             │
│     │ mundo       │──── Distribuye secretos                        │
│     └──────┬──────┘                                                 │
│            │                                                        │
│  5. INICIO DEL JUEGO                                                │
│     ┌──────▼──────┐                                                 │
│     │ Todos       │──── "¡Comiencen la aventura!"                  │
│     │ empiezan    │──── Cada uno ve su interfaz de rol             │
│     └─────────────┘                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Ejemplo de Partida

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EJEMPLO DE PARTIDA                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MINUTO 0: INICIO                                                  │
│  ─────────────────                                                  │
│  🗺️ Cartógrafo: "Veo 4 puzzles y 12 secretos en el mapa"          │
│  🔍 Explorador: "Estoy en el bosque petrificado, ¿hacia dónde?"   │
│  🔐 Cifrador: "Tengo 3 códigos sin descifrar"                      │
│  👁️ Vigía: "Veo 5 criaturas en las cuevas del sur"                 │
│                                                                     │
│  MINUTO 5: PRIMER PUZZLE                                            │
│  ────────────────────                                               │
│  🗺️ Cartógrafo: "Explorador, ve al puzzle de espejos en (8,5,8)"   │
│  🔍 Explorador: "Llegué, veo 3 espejos y un rayo de luz"           │
│  🔐 Cifrador: "Las notas dicen: 'El primero mira al norte'"        │
│  👁️ Vigía: "Hay una trampa cerca del segundo espejo"                │
│                                                                     │
│  MINUTO 8: RESOLVIENDO PUZZLE                                       │
│  ────────────────────────────                                       │
│  🔍 Explorador: "Roté el primer espejo al norte"                   │
│  🗺️ Cartógrafo: "¡Confirmado! El rayo ahora apunta al segundo"     │
│  🔐 Cifrador: "El segundo debe estar a 45° grados"                  │
│  🔍 Explorador: "Rotado. Pero hay una trampa aquí"                  │
│  👁️ Vigía: "Espera 10 segundos, la criatura se va"                  │
│  🔍 Explorador: "¡Esperando... ahora! Rotado el tercero"            │
│  🗺️ Cartógrafo: "¡El rayo llegó al receptor! Puzzle resuelto!"     │
│                                                                     │
│  MINUTO 12: DESCUBRIMIENTO                                          │
│  ─────────────────────────                                          │
│  🔍 Explorador: "Hay una pared rara aquí, ¿la rompo?"              │
│  🗺️ Cartógrafo: "Sí, es un secreto según el mapa"                  │
│  🔐 Cifrador: "Las runas dicen: 'Solo el martillo puede abrir'"    │
│  🔍 Explorador: "¡Rompió la pared! Encontré un cofre"              │
│  👁️ Vigía: "Cuidado, hay una criatura saliendo"                     │
│  🔍 Explorador: "¡Agarré el tesoro y corro!"                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Implementación Técnica

### 9.1 Stack Tecnológico

| Capa | Tecnología | Uso |
|------|-----------|-----|
| **Frontend** | Three.js + React | Rendering 3D + UI |
| **Estado** | Zustand | State management |
| **Red** | Colyseus | Multiplayer rooms |
| **Transport** | WebSocket | Comunicación |
| **Cache** | Redis | Estado en tiempo real |
| **DB** | PostgreSQL | Persistencia |
| **Auth** | JWT | Autenticación |

### 9.2 Estructura de Archivos

```
packages/
├── client/
│   ├── src/
│   │   ├── roles/
│   │   │   ├── CartographerUI.tsx      # Interfaz del Cartógrafo
│   │   │   ├── ExplorerUI.tsx          # Interfaz del Explorador
│   │   │   ├── CipherUI.tsx            # Interfaz del Cifrador
│   │   │   └── VigilUI.tsx             # Interfaz del Vigía
│   │   ├── components/
│   │   │   ├── CoopPanel.tsx           # Panel cooperativo
│   │   │   ├── PingSystem.tsx          # Sistema de marcadores
│   │   │   ├── ChatPanel.tsx           # Chat de texto
│   │   │   └── RoleIndicator.tsx       # Indicador de rol
│   │   └── network/
│   │       ├── GameClient.ts           # Cliente Colyseus
│   │       └── MessageHandler.ts       # Manejo de mensajes
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── rooms/
│   │   │   └── GameRoom.ts             # Sala del juego
│   │   ├── systems/
│   │   │   ├── PermissionSystem.ts     # Sistema de permisos
│   │   │   ├── PuzzleSystem.ts         # Sistema de puzzles
│   │   │   └── SyncSystem.ts           # Sincronización
│   │   └── schema/
│   │       ├── GameState.ts            # Estado del juego
│   │       └── PlayerState.ts          # Estado de jugador
│   └── package.json
│
└── shared/
    ├── src/
    │   ├── types/
    │   │   ├── Role.ts                 # Tipos de roles
    │   │   ├── Permissions.ts          # Permisos
    │   │   └── Messages.ts             # Mensajes de red
    │   └── constants/
    │       └── GameConfig.ts           # Configuración
    └── package.json
```

### 9.3 Schema de Estado (Colyseus)

```typescript
// shared/schema/GameState.ts
import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class Position extends Schema {
    @type("float32") x: number = 0;
    @type("float32") y: number = 0;
    @type("float32") z: number = 0;
}

export class PlayerState extends Schema {
    @type("string") id: string = "";
    @type("string") name: string = "";
    @type("string") role: string = "";  // 'cartographer' | 'explorer' | 'cipher' | 'vigil'
    @type(Position) position: Position = new Position();
    @type("boolean") isAlive: boolean = true;
    @type(["string"]) inventory: ArraySchema<string> = new ArraySchema<string>();
    @type(["string"]) decodedCiphers: ArraySchema<string> = new ArraySchema<string>();
}

export class PuzzleState extends Schema {
    @type("string") id: string = "";
    @type("string") type: string = "";  // 'mirror' | 'color' | 'weight' | 'key'
    @type("boolean") isSolved: boolean = false;
    @type("string") solvedBy: string = "";
    @type(Position) position: Position = new Position();
    @type("any") data: any = {};  // Puzzle-specific data
}

export class SecretState extends Schema {
    @type("string") id: string = "";
    @type(Position) position: Position = new Position();
    @type("boolean") isFound: boolean = false;
    @type("string") foundBy: string = "";
    @type("string") contains: string = "";  // Item type
}

export class CreatureState extends Schema {
    @type("string") id: string = "";
    @type("string") type: string = "";
    @type(Position) position: Position = new Position();
    @type("string") state: string = "";  // 'idle' | 'patrol' | 'chase' | 'attack'
    @type("float32") health: number = 100;
}

export class GameState extends Schema {
    @type("string") seed: string = "";
    @type("float32") dayTime: number = 0.5;
    @type("int32") totalSecrets: number = 0;
    @type("int32") foundSecrets: number = 0;
    @type({ map: PlayerState }) players: MapSchema<PlayerState> = new MapSchema<PlayerState>();
    @type([PuzzleState]) puzzles: ArraySchema<PuzzleState> = new ArraySchema<PuzzleState>();
    @type([SecretState]) secrets: ArraySchema<SecretState> = new ArraySchema<SecretState>();
    @type([CreatureState]) creatures: ArraySchema<CreatureState> = new ArraySchema<CreatureState>();
}
```

---

## 10. Métricas y Balance

### 10.1 Métricas de Juego

| Métrica | Objetivo | Importancia |
|---------|----------|-------------|
| **Tiempo promedio de puzzle** | 3-5 minutos | ⭐⭐⭐ |
| **Tasa de comunicación** | >80% de jugadores hablan | ⭐⭐⭐ |
| **Tasa de cooperación** | >90% de puzzles requieren ayuda | ⭐⭐⭐ |
| **Tasa de finalización** | >70% completan al menos 1 puzzle | ⭐⭐ |
| **Rejugabilidad** | >50% juegan 2+ veces | ⭐⭐ |

### 10.2 Balance de Dificultad

```
Nivel 1 (Fácil):   Puzzle de colores simple (4 cristales)
Nivel 2 (Medio):   Puzzle de espejos (3 espejos)
Nivel 3 (Difícil): Puzzle de peso + trampas
Nivel 4 (Experto): Puzzle de llave + criaturas + código
```

---

## 11. Conclusiones

### 11.1 Fortalezas del Diseño
1. **Dependencia real:** Ningún jugador puede dominar solo
2. **Comunicación natural:** El juego fuerza hablar
3. **Rejugabilidad:** Roles aleatorios cambian la experiencia
4. **Profundidad estratégica:** Cada rol aporta algo único

### 11.2 Desafíos Técnicos
1. **Sincronización:** Mantener estado consistente entre clientes
2. **Latencia:** Manejar lag sin romper la experiencia
3. **Balance:** Asegurar que ningún rol sea "aburrido"
4. **Escalabilidad:** Soportar múltiples salas simultáneas

### 11.3 Próximos Pasos
1. Prototipar sistema de roles en el cliente
2. Implementar Colyseus para multiplayer
3. Testear con jugadores reales
4. Ajustar balance según feedback

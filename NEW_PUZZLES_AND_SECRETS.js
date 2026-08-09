// ============================================
// THE FORGOTTEN DEPTHS - New Puzzles & Secrets
// Additional content pack
// ============================================

// ============================================
// NEW PUZZLE TYPES
// ============================================

const NEW_PUZZLE_TYPES = {
    
    // ==========================================
    // PUZZLE: RIDDLE STONES (Piedras Adivinanzas)
    // ==========================================
    // Player must activate stones in correct order based on riddles
    riddle_stones: {
        name: 'Piedras Adivinanzas',
        description: 'Resuelve acertijos para activar piedras antiguas en el orden correcto',
        difficulty: 'medium',
        requiredRoles: ['cipher', 'explorer'],
        
        // Riddle data
        riddles: [
            {
                riddle: 'Soy el primero en llegar, pero el último en irme. ¿Quién soy?',
                answer: 'la luz del alba',
                stoneIndex: 0,
                hint: 'Comienza con el amanecer'
            },
            {
                riddle: 'Cresco cuando me alimentan, pero muero cuando beben de mí.',
                answer: 'una vela',
                stoneIndex: 1,
                hint: 'Se consume con el fuego'
            },
            {
                riddle: 'Tengo ciudades pero no casas, montañas pero no árboles.',
                answer: 'un mapa',
                stoneIndex: 2,
                hint: 'Representa el mundo'
            },
            {
                riddle: 'Cuanto más me quitas, más grande soy.',
                answer: 'un agujero',
                stoneIndex: 3,
                hint: 'Lo que falta'
            }
        ],
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Room floor and walls
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 5; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Riddle stones (activated by solving riddles)
            const stonePositions = [
                { x: x + 2, z: z + 2 },
                { x: x + 5, z: z + 2 },
                { x: x + 2, z: z + 5 },
                { x: x + 5, z: z + 5 }
            ];
            
            stonePositions.forEach((pos, i) => {
                blocks.push({ x: pos.x, y: y, z: pos.z, type: BLOCK.RUNE_STONE });
            });
            
            // Riddle tablets on walls
            blocks.push({ x: x + 1, y: y + 2, z: z + 3, type: BLOCK.RUNE_STONE });
            blocks.push({ x: x + 6, y: y + 2, z: z + 3, type: BLOCK.RUNE_STONE });
            
            // Door
            blocks.push({ x: x + 7, y: y, z: z + 4, type: BLOCK.DOOR });
            blocks.push({ x: x + 7, y: y + 1, z: z + 4, type: BLOCK.DOOR });
            
            return blocks;
        }
    },
    
    // ==========================================
    // PUZZLE: MEMORY CRYSTALS (Cristales de Memoria)
    // ==========================================
    // Simon-says style puzzle with crystal colors
    memory_crystals: {
        name: 'Cristales de Memoria',
        description: 'Repite la secuencia de colores que muestran los cristales',
        difficulty: 'hard',
        requiredRoles: ['explorer', 'vigil'],
        
        // Sequence patterns (increasing difficulty)
        sequences: [
            [1, 2],           // 2 colors
            [1, 2, 3],        // 3 colors
            [1, 3, 2, 4],     // 4 colors
            [1, 4, 2, 3, 1],  // 5 colors
        ],
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Room
            for (let dx = 0; dx < 10; dx++) {
                for (let dz = 0; dz < 10; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 9 || dz === 0 || dz === 9) {
                        for (let dy = 0; dy < 6; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Crystal pillars (4 colors in circle)
            const crystalColors = [
                BLOCK.CRYSTAL_RED,
                BLOCK.CRYSTAL_BLUE,
                BLOCK.CRYSTAL_GREEN,
                BLOCK.CRYSTAL_YELLOW
            ];
            
            const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
            const centerX = x + 5;
            const centerZ = z + 5;
            const radius = 3;
            
            angles.forEach((angle, i) => {
                const cx = Math.floor(centerX + Math.cos(angle) * radius);
                const cz = Math.floor(centerZ + Math.sin(angle) * radius);
                
                // Crystal column
                blocks.push({ x: cx, y: y, z: cz, type: crystalColors[i] });
                blocks.push({ x: cx, y: y + 1, z: cz, type: crystalColors[i] });
                blocks.push({ x: cx, y: y + 2, z: cz, type: crystalColors[i] });
            });
            
            // Central display crystal
            blocks.push({ x: centerX, y: y, z: centerZ, type: BLOCK.LIGHT_SOURCE });
            
            // Door
            blocks.push({ x: x + 9, y: y, z: z + 4, type: BLOCK.DOOR });
            blocks.push({ x: x + 9, y: y + 1, z: z + 4, type: BLOCK.DOOR });
            
            return blocks;
        }
    },
    
    // ==========================================
    // PUZZLE: PRESSURE PLATES (Placas de Presión)
    // ==========================================
    // Step on plates in correct sequence
    pressure_plates: {
        name: 'Placas de Presión',
        description: 'Activa las placas en el orden correcto pisándolas',
        difficulty: 'easy',
        requiredRoles: ['explorer', 'cartographer'],
        
        // Plate activation order (based on floor markings)
        correctOrder: [3, 1, 4, 2], // Must step on plate 3, then 1, then 4, then 2
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Room with marked floor
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 5; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Pressure plates in grid
            const platePositions = [
                { x: x + 2, z: z + 2, order: 1 },
                { x: x + 5, z: z + 2, order: 2 },
                { x: x + 2, z: z + 5, order: 3 },
                { x: x + 5, z: z + 5, order: 4 }
            ];
            
            platePositions.forEach(plate => {
                blocks.push({ x: plate.x, y: y, z: plate.z, type: BLOCK.PRESSURE_PLATE });
            });
            
            // Floor markings showing order (colored blocks on floor)
            blocks.push({ x: x + 2, y: y - 1, z: z + 2, type: BLOCK.CRYSTAL_RED }); // 1st
            blocks.push({ x: x + 2, y: y - 1, z: z + 5, type: BLOCK.CRYSTAL_BLUE }); // 2nd
            blocks.push({ x: x + 5, y: y - 1, z: z + 2, type: BLOCK.CRYSTAL_GREEN }); // 3rd
            blocks.push({ x: x + 5, y: y - 1, z: z + 5, type: BLOCK.CRYSTAL_YELLOW }); // 4th
            
            // Door
            blocks.push({ x: x + 7, y: y, z: z + 3, type: BLOCK.DOOR });
            blocks.push({ x: x + 7, y: y + 1, z: z + 3, type: BLOCK.DOOR });
            
            return blocks;
        }
    },
    
    // ==========================================
    // PUZZLE: LIGHT BEAMS (Rayos de Luz)
    // ==========================================
    // Multiple light sources that must all reach receivers
    light_beams: {
        name: 'Rayos de Luz',
        description: 'Redirige múltiples rayos de luz para iluminar todos los receptores',
        difficulty: 'hard',
        requiredRoles: ['explorer', 'cipher', 'cartographer'],
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Large room
            for (let dx = 0; dx < 12; dx++) {
                for (let dz = 0; dz < 12; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 11 || dz === 0 || dz === 11) {
                        for (let dy = 0; dy < 6; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Multiple light sources (2-3)
            blocks.push({ x: x + 2, y: y + 3, z: z + 2, type: BLOCK.LIGHT_SOURCE });
            blocks.push({ x: x + 9, y: y + 3, z: z + 2, type: BLOCK.LIGHT_SOURCE });
            
            // Receivers (must be illuminated)
            blocks.push({ x: x + 2, y: y + 3, z: z + 9, type: BLOCK.RECEIVER });
            blocks.push({ x: x + 9, y: y + 3, z: z + 9, type: BLOCK.RECEIVER });
            blocks.push({ x: x + 5, y: y + 3, z: z + 5, type: BLOCK.RECEIVER }); // Center
            
            // Mirrors (rotatable)
            blocks.push({ x: x + 4, y: y + 3, z: z + 4, type: BLOCK.MIRROR });
            blocks.push({ x: x + 7, y: y + 3, z: z + 4, type: BLOCK.MIRROR });
            blocks.push({ x: x + 5, y: y + 3, z: z + 7, type: BLOCK.MIRROR });
            
            // Obstacles (blocks that block light)
            blocks.push({ x: x + 5, y: y + 2, z: z + 4, type: BLOCK.STONE });
            blocks.push({ x: x + 5, y: y + 3, z: z + 4, type: BLOCK.STONE });
            
            // Door
            blocks.push({ x: x + 11, y: y, z: z + 5, type: BLOCK.DOOR });
            blocks.push({ x: x + 11, y: y + 1, z: z + 5, type: BLOCK.DOOR });
            
            return blocks;
        }
    },
    
    // ==========================================
    // PUZZLE: TORCH SEQUENCE (Secuencia de Antorchas)
    // ==========================================
    // Light torches in correct order based on musical notes
    torch_sequence: {
        name: 'Secuencia de Antorchas',
        description: 'Enciende las antorchas en el orden musical correcto',
        difficulty: 'medium',
        requiredRoles: ['cipher', 'explorer'],
        
        // Musical sequence (do, re, mi, fa)
        correctSequence: [0, 1, 2, 3],
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Room
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 5; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Torches in a line (unlit initially)
            const torchPositions = [
                { x: x + 2, z: z + 3 },
                { x: x + 3, z: z + 3 },
                { x: x + 4, z: z + 3 },
                { x: x + 5, z: z + 3 }
            ];
            
            torchPositions.forEach((pos, i) => {
                // Torch holder
                blocks.push({ x: pos.x, y: y, z: pos.z, type: BLOCK.PILLAR });
                // Torch (will be toggled)
                blocks.push({ x: pos.x, y: y + 1, z: pos.z, type: BLOCK.TORCH });
            });
            
            // Musical notes on wall (hints)
            blocks.push({ x: x + 1, y: y + 3, z: z + 3, type: BLOCK.RUNE_STONE }); // Do
            blocks.push({ x: x + 6, y: y + 3, z: z + 3, type: BLOCK.RUNE_STONE }); // Fa
            
            // Door
            blocks.push({ x: x + 7, y: y, z: z + 4, type: BLOCK.DOOR });
            blocks.push({ x: x + 7, y: y + 1, z: z + 4, type: BLOCK.DOOR });
            
            return blocks;
        }
    },
    
    // ==========================================
    // PUZZLE: WEIGHT CHAIN (Cadena de Pesos)
    // ==========================================
    // Balance multiple platforms simultaneously
    weight_chain: {
        name: 'Cadena de Pesos',
        description: 'Balancea múltiples plataformas conectadas entre sí',
        difficulty: 'hard',
        requiredRoles: ['explorer', 'cartographer', 'cipher'],
        
        generateRoom: function(x, y, z) {
            const blocks = [];
            
            // Large room
            for (let dx = 0; dx < 10; dx++) {
                for (let dz = 0; dz < 10; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 9 || dz === 0 || dz === 9) {
                        for (let dy = 0; dy < 6; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Multiple weight platforms
            blocks.push({ x: x + 2, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
            blocks.push({ x: x + 4, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
            blocks.push({ x: x + 6, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
            blocks.push({ x: x + 8, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
            
            // Heavy blocks of different weights
            blocks.push({ x: x + 1, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK }); // Weight 1
            blocks.push({ x: x + 3, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK }); // Weight 2
            blocks.push({ x: x + 5, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK }); // Weight 3
            blocks.push({ x: x + 7, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK }); // Weight 4
            
            // Weight indicators on floor
            blocks.push({ x: x + 1, y: y - 1, z: z + 1, type: BLOCK.CRYSTAL_RED }); // Light
            blocks.push({ x: x + 3, y: y - 1, z: z + 1, type: BLOCK.CRYSTAL_BLUE }); // Medium
            blocks.push({ x: x + 5, y: y - 1, z: z + 1, type: BLOCK.CRYSTAL_GREEN }); // Heavy
            blocks.push({ x: x + 7, y: y - 1, z: z + 1, type: BLOCK.CRYSTAL_YELLOW }); // Very Heavy
            
            // Door
            blocks.push({ x: x + 9, y: y, z: z + 4, type: BLOCK.DOOR });
            blocks.push({ x: x + 9, y: y + 1, z: z + 4, type: BLOCK.DOOR });
            
            return blocks;
        }
    }
};

// ============================================
// NEW SECRET ROOM TYPES
// ============================================

const SECRET_ROOM_TYPES = {
    
    // ==========================================
    // SECRET: TREASURE VAULT (Cámara del Tesoro)
    // ==========================================
    treasure_vault: {
        name: 'Cámara del Tesoro',
        description: 'Una habitación llena de cofres y gemas',
        difficulty: 'medium',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Vault room (larger)
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.GOLD_ORE });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 4; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.GOLD_ORE });
                        }
                    }
                }
            }
            
            // Treasure chests
            treasures.push({ x: x + 2, y: y, z: z + 2, type: BLOCK.CHEST, loot: 'diamond' });
            treasures.push({ x: x + 5, y: y, z: z + 2, type: BLOCK.CHEST, loot: 'gold' });
            treasures.push({ x: x + 2, y: y, z: z + 5, type: BLOCK.CHEST, loot: 'key' });
            treasures.push({ x: x + 5, y: y, z: z + 5, type: BLOCK.CHEST, loot: 'diamond' });
            
            // Central pedestal
            blocks.push({ x: x + 3, y: y, z: z + 3, type: BLOCK.PILLAR });
            blocks.push({ x: x + 4, y: y, z: z + 3, type: BLOCK.PILLAR });
            blocks.push({ x: x + 3, y: y + 1, z: z + 3, type: BLOCK.DIAMOND_ORE });
            blocks.push({ x: x + 4, y: y + 1, z: z + 3, type: BLOCK.DIAMOND_ORE });
            
            // Torches
            blocks.push({ x: x + 1, y: y + 2, z: z + 1, type: BLOCK.TORCH });
            blocks.push({ x: x + 6, y: y + 2, z: z + 1, type: BLOCK.TORCH });
            blocks.push({ x: x + 1, y: y + 2, z: z + 6, type: BLOCK.TORCH });
            blocks.push({ x: x + 6, y: y + 2, z: z + 6, type: BLOCK.TORCH });
            
            return { blocks, treasures };
        }
    },
    
    // ==========================================
    // SECRET: LORE CHAMBER (Cámara de Conocimiento)
    // ==========================================
    lore_chamber: {
        name: 'Cámara de Conocimiento',
        description: 'Una biblioteca antigua con páginas del diario y runas',
        difficulty: 'easy',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Library room
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.Ancient_BRICK });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 5; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Bookshelves (stone blocks)
            for (let dy = 0; dy < 3; dy++) {
                blocks.push({ x: x + 2, y: y + dy, z: z + 1, type: BLOCK.STONE });
                blocks.push({ x: x + 5, y: y + dy, z: z + 1, type: BLOCK.STONE });
                blocks.push({ x: x + 2, y: y + dy, z: z + 6, type: BLOCK.STONE });
                blocks.push({ x: x + 5, y: y + dy, z: z + 6, type: BLOCK.STONE });
            }
            
            // Journal pages on pedestals
            treasures.push({ x: x + 3, y: y + 1, z: z + 3, type: BLOCK.JOURNAL_PAGE, loot: 'journal' });
            treasures.push({ x: x + 4, y: y + 1, z: z + 3, type: BLOCK.JOURNAL_PAGE, loot: 'journal' });
            treasures.push({ x: x + 3, y: y + 1, z: z + 4, type: BLOCK.JOURNAL_PAGE, loot: 'journal' });
            treasures.push({ x: x + 4, y: y + 1, z: z + 4, type: BLOCK.JOURNAL_PAGE, loot: 'journal' });
            
            // Rune stones with hints
            blocks.push({ x: x + 1, y: y + 2, z: z + 3, type: BLOCK.RUNE_STONE });
            blocks.push({ x: x + 6, y: y + 2, z: z + 3, type: BLOCK.RUNE_STONE });
            
            // Reading light
            blocks.push({ x: x + 3, y: y + 2, z: z + 3, type: BLOCK.LIGHT_SOURCE });
            blocks.push({ x: x + 4, y: y + 2, z: z + 3, type: BLOCK.LIGHT_SOURCE });
            
            return { blocks, treasures };
        }
    },
    
    // ==========================================
    // SECRET: CRYSTAL GROTTO (Gruta de Cristales)
    // ==========================================
    crystal_grotto: {
        name: 'Gruta de Cristales',
        description: 'Una cueva natural llena de cristales brillantes',
        difficulty: 'medium',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Irregular cave shape
            for (let dx = 0; dx < 10; dx++) {
                for (let dz = 0; dz < 10; dz++) {
                    // Create organic cave shape
                    const distFromCenter = Math.sqrt(
                        Math.pow(dx - 5, 2) + Math.pow(dz - 5, 2)
                    );
                    
                    if (distFromCenter < 4.5) {
                        blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    }
                }
            }
            
            // Crystal clusters
            const crystalTypes = [
                BLOCK.CRYSTAL_RED,
                BLOCK.CRYSTAL_BLUE,
                BLOCK.CRYSTAL_GREEN,
                BLOCK.CRYSTAL_YELLOW
            ];
            
            // Scattered crystals
            for (let i = 0; i < 12; i++) {
                const cx = x + 2 + Math.floor(Math.random() * 6);
                const cz = z + 2 + Math.floor(Math.random() * 6);
                const cy = y + Math.floor(Math.random() * 3);
                const crystalType = crystalTypes[Math.floor(Math.random() * crystalTypes.length)];
                
                blocks.push({ x: cx, y: cy, z: cz, type: crystalType });
            }
            
            // Crystal cluster formations
            blocks.push({ x: x + 3, y: y, z: z + 3, type: BLOCK.CRYSTAL_CLUSTER });
            blocks.push({ x: x + 3, y: y + 1, z: z + 3, type: BLOCK.CRYSTAL_CLUSTER });
            blocks.push({ x: x + 6, y: y, z: z + 6, type: BLOCK.CRYSTAL_CLUSTER });
            blocks.push({ x: x + 6, y: y + 1, z: z + 6, type: BLOCK.CRYSTAL_CLUSTER });
            
            // Glowing mushrooms
            blocks.push({ x: x + 2, y: y, z: z + 7, type: BLOCK.GLOWING_MUSHROOM });
            blocks.push({ x: x + 7, y: y, z: z + 2, type: BLOCK.GLOWING_MUSHROOM });
            
            // Hidden treasure
            treasures.push({ x: x + 5, y: y, z: z + 5, type: BLOCK.CHEST, loot: 'crystal_key' });
            
            // Stalactites
            blocks.push({ x: x + 3, y: y + 4, z: z + 3, type: BLOCK.STALACTITE });
            blocks.push({ x: x + 6, y: y + 4, z: z + 6, type: BLOCK.STALACTITE });
            
            return { blocks, treasures };
        }
    },
    
    // ==========================================
    // SECRET: GUARDIAN'S LAIR (Guarida del Guardián)
    // ==========================================
    guardian_lair: {
        name: 'Guarida del Guardián',
        description: 'La guarida de una criatura poderosa con un tesoro protegido',
        difficulty: 'hard',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Dark stone room
            for (let dx = 0; dx < 8; dx++) {
                for (let dz = 0; dz < 8; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.CRACKED_STONE });
                    if (dx === 0 || dx === 7 || dz === 0 || dz === 7) {
                        for (let dy = 0; dy < 5; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.CRACKED_STONE });
                        }
                    }
                }
            }
            
            // Bones and remains (white blocks)
            blocks.push({ x: x + 2, y: y, z: z + 2, type: BLOCK.STONE });
            blocks.push({ x: x + 5, y: y, z: z + 5, type: BLOCK.STONE });
            blocks.push({ x: x + 2, y: y, z: z + 5, type: BLOCK.STONE });
            blocks.push({ x: x + 5, y: y, z: z + 2, type: BLOCK.STONE });
            
            // Guardian spawn point (marked)
            blocks.push({ x: x + 4, y: y, z: z + 4, type: BLOCK.HEAVY_BLOCK });
            
            // Lava pools (danger)
            blocks.push({ x: x + 1, y: y - 1, z: z + 1, type: BLOCK.LAVA });
            blocks.push({ x: x + 6, y: y - 1, z: z + 6, type: BLOCK.LAVA });
            
            // Protected treasure
            treasures.push({ x: x + 4, y: y + 1, z: z + 4, type: BLOCK.CHEST, loot: 'legendary' });
            
            // Torches (minimal light)
            blocks.push({ x: x + 1, y: y + 2, z: z + 4, type: BLOCK.TORCH });
            blocks.push({ x: x + 6, y: y + 2, z: z + 4, type: BLOCK.TORCH });
            
            return { blocks, treasures, hasGuardian: true };
        }
    },
    
    // ==========================================
    // SECRET: PUZZLE ROOM (Cámara de Puzzle)
    // ==========================================
    puzzle_room: {
        name: 'Cámara de Puzzle',
        description: 'Una habitación con un puzzle especial que recompensa con un tesoro único',
        difficulty: 'variable',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Clean room
            for (let dx = 0; dx < 6; dx++) {
                for (let dz = 0; dz < 6; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 5 || dz === 0 || dz === 5) {
                        for (let dy = 0; dy < 4; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.Ancient_BRICK });
                        }
                    }
                }
            }
            
            // Random puzzle element
            const puzzleType = Math.floor(Math.random() * 3);
            
            switch (puzzleType) {
                case 0: // Simple mirror puzzle
                    blocks.push({ x: x + 2, y: y + 2, z: z + 2, type: BLOCK.LIGHT_SOURCE });
                    blocks.push({ x: x + 3, y: y + 2, z: z + 3, type: BLOCK.MIRROR });
                    blocks.push({ x: x + 4, y: y + 2, z: z + 4, type: BLOCK.RECEIVER });
                    break;
                    
                case 1: // Color sequence
                    blocks.push({ x: x + 2, y: y, z: z + 2, type: BLOCK.CRYSTAL_RED });
                    blocks.push({ x: x + 3, y: y, z: z + 2, type: BLOCK.CRYSTAL_BLUE });
                    blocks.push({ x: x + 2, y: y, z: z + 3, type: BLOCK.CRYSTAL_GREEN });
                    blocks.push({ x: x + 3, y: y, z: z + 3, type: BLOCK.CRYSTAL_YELLOW });
                    break;
                    
                case 2: // Weight puzzle
                    blocks.push({ x: x + 2, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
                    blocks.push({ x: x + 3, y: y, z: z + 3, type: BLOCK.WEIGHT_PLATFORM });
                    blocks.push({ x: x + 1, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK });
                    blocks.push({ x: x + 4, y: y, z: z + 1, type: BLOCK.HEAVY_BLOCK });
                    break;
            }
            
            // Treasure
            treasures.push({ x: x + 3, y: y, z: z + 4, type: BLOCK.CHEST, loot: 'puzzle_reward' });
            
            return { blocks, treasures };
        }
    },
    
    // ==========================================
    // SECRET: ESCAPE ROOM (Cámara de Escape)
    // ==========================================
    escape_room: {
        name: 'Cámara de Escape',
        description: 'Una trampa que debes resolver para escapar antes de que se llene de lava',
        difficulty: 'hard',
        
        generate: function(x, y, z) {
            const blocks = [];
            const treasures = [];
            
            // Trap room
            for (let dx = 0; dx < 6; dx++) {
                for (let dz = 0; dz < 6; dz++) {
                    blocks.push({ x: x + dx, y: y - 1, z: z + dz, type: BLOCK.STONE });
                    if (dx === 0 || dx === 5 || dz === 0 || dz === 5) {
                        for (let dy = 0; dy < 4; dy++) {
                            blocks.push({ x: x + dx, y: y + dy, z: z + dz, type: BLOCK.CRACKED_STONE });
                        }
                    }
                }
            }
            
            // Pressure plates that must be activated quickly
            blocks.push({ x: x + 2, y: y, z: z + 2, type: BLOCK.PRESSURE_PLATE });
            blocks.push({ x: x + 3, y: y, z: z + 2, type: BLOCK.PRESSURE_PLATE });
            blocks.push({ x: x + 2, y: y, z: z + 3, type: BLOCK.PRESSURE_PLATE });
            blocks.push({ x: x + 3, y: y, z: z + 3, type: BLOCK.PRESSURE_PLATE });
            
            // Timer indicator (colored blocks that change)
            blocks.push({ x: x + 1, y: y + 2, z: z + 1, type: BLOCK.CRYSTAL_GREEN }); // Safe
            blocks.push({ x: x + 4, y: y + 2, z: z + 4, type: BLOCK.CRYSTAL_RED }); // Danger
            
            // Escape door
            blocks.push({ x: x + 5, y: y, z: z + 2, type: BLOCK.DOOR });
            blocks.push({ x: x + 5, y: y + 1, z: z + 2, type: BLOCK.DOOR });
            
            // Treasure
            treasures.push({ x: x + 3, y: y + 1, z: z + 3, type: BLOCK.CHEST, loot: 'escape_reward' });
            
            return { blocks, treasures, isTimed: true };
        }
    }
};

// ============================================
// INTEGRATION HELPER FUNCTIONS
// ============================================

// Generate a random puzzle room
function generateRandomPuzzleRoom(x, y, z) {
    const puzzleTypes = Object.keys(NEW_PUZZLE_TYPES);
    const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
    const puzzle = NEW_PUZZLE_TYPES[randomType];
    
    return {
        type: randomType,
        name: puzzle.name,
        blocks: puzzle.generateRoom(x, y, z)
    };
}

// Generate a random secret room
function generateRandomSecretRoom(x, y, z) {
    const secretTypes = Object.keys(SECRET_ROOM_TYPES);
    const randomType = secretTypes[Math.floor(Math.random() * secretTypes.length)];
    const secret = SECRET_ROOM_TYPES[randomType];
    
    return {
        type: randomType,
        name: secret.name,
        ...secret.generate(x, y, z)
    };
}

// Place new puzzles in world
function placeNewPuzzles(world, count = 4) {
    const puzzles = [];
    
    for (let i = 0; i < count; i++) {
        const x = 5 + Math.floor(Math.random() * 38);
        const z = 5 + Math.floor(Math.random() * 38);
        const y = 5 + Math.floor(Math.random() * 5);
        
        const puzzle = generateRandomPuzzleRoom(x, y, z);
        
        // Place blocks
        puzzle.blocks.forEach(block => {
            setBlock(block.x, block.y, block.z, block.type);
        });
        
        puzzles.push({
            ...puzzle,
            position: { x, y, z },
            solved: false
        });
    }
    
    return puzzles;
}

// Place new secret rooms
function placeNewSecretRooms(world, count = 8) {
    const secrets = [];
    
    for (let i = 0; i < count; i++) {
        const x = 3 + Math.floor(Math.random() * 42);
        const z = 3 + Math.floor(Math.random() * 42);
        const y = 3 + Math.floor(Math.random() * 8);
        
        const secret = generateRandomSecretRoom(x, y, z);
        
        // Place blocks
        if (secret.blocks) {
            secret.blocks.forEach(block => {
                setBlock(block.x, block.y, block.z, block.type);
            });
        }
        
        // Place treasures
        if (secret.treasures) {
            secret.treasures.forEach(treasure => {
                setBlock(treasure.x, treasure.y, treasure.z, treasure.type);
            });
        }
        
        // Create entrance (secret wall)
        setBlock(x, y, z, BLOCK.SECRET_WALL);
        setBlock(x, y + 1, z, BLOCK.SECRET_WALL);
        
        secrets.push({
            ...secret,
            position: { x, y, z },
            found: false
        });
    }
    
    return secrets;
}

// ============================================
// EXPORT FOR USE IN MAIN GAME
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NEW_PUZZLE_TYPES,
        SECRET_ROOM_TYPES,
        generateRandomPuzzleRoom,
        generateRandomSecretRoom,
        placeNewPuzzles,
        placeNewSecretRooms
    };
}

/**
 * The Forgotten Depths - Internationalization System (i18n)
 * Supports: Spanish (default), English, Portuguese, French
 */

const I18n = {
    currentLang: 'es',
    translations: {},
    
    // Initialize the i18n system
    init() {
        // Load saved language or default to Spanish
        this.currentLang = localStorage.getItem('gameLang') || 'es';
        this.loadTranslations();
        this.updatePageLanguage();
    },
    
    // Load all translations
    loadTranslations() {
        this.translations = {
            // ========== SPANISH (DEFAULT) ==========
            es: {
                // Title & Menu
                gameTitle: 'The Forgotten Depths',
                gameSubtitle: 'Generador de Mundo Procedural',
                startButton: 'Comenzar Exploración',
                seedPlaceholder: 'Ingresa una semilla (o déjala aleatoria)',
                
                // HUD
                hudSeed: 'Semilla',
                hudSecrets: 'Secretos Encontrados',
                hudPosition: 'Posición',
                hudBiome: 'Bioma',
                hudTools: 'Herramientas',
                hudJournal: 'Diario',
                hudPuzzles: 'Acertijos',
                
                // Minimap
                minimapLabel: 'Mapa',
                
                // Puzzle Progress
                puzzleMirror: 'Espejo',
                puzzleColor: 'Color',
                puzzleWeight: 'Peso',
                puzzleKeys: 'Llaves',
                
                // Biomes
                biomePetrifiedForest: 'Bosque Petrificado',
                biomeCrystalCaves: 'Cavernas de Cristal',
                biomeSunkenTemple: 'Templo Sumergido',
                biomeAbyss: 'El Abismo',
                
                // Tools
                toolHammer: 'Martillo de Piedra',
                toolLinterna: 'Linterna de Cristal',
                toolCompass: 'Brújula Anómala',
                toolKey: 'Llave Elemental',
                
                // Notifications
                notifSecretFound: '¡Secreto Encontrado!',
                notifPuzzleSolved: '¡Acertijo Resuelto!',
                notifItemCollected: '¡Objeto Recogido!',
                notifBiomeEntered: '¡Nuevo Bioma!',
                notifToolUnlocked: '¡Herramienta Desbloqueada!',
                
                // Journal
                journalTitle: 'Crónicas de Blokheim',
                journalEntry1Title: 'Entrada #1: El Despertar',
                journalEntry1Content: 'Me encontré en un mundo de piedra y misterio. El aire está cargado de poder ancestral...',
                journalEntry2Title: 'Entrada #2: Los Acertijos',
                journalEntry2Content: 'Mecanismos extraños guardan los caminos. Espejos, cristales, pesos... cada uno requiere comprensión.',
                journalEntry3Title: 'Entrada #3: Los Secretos',
                journalEntry3Content: 'Paredes ocultas encierran tesoros y conocimiento. Un ojo agudo y la herramienta correcta son esenciales.',
                
                // Hints
                hintMirror: 'La luz revela lo que la oscuridad oculta. Los espejos recuerdan su propósito.',
                hintColor: 'Cuatro colores, cuatro elementos, cuatro verdades. La secuencia es sabiduría ancestral.',
                hintWeight: 'El peso balancea la verdad. Demasiado o muy poco, y el camino permanece sellado.',
                hintAbyss: 'El Abismo susurra secretos a quienes escuchan. Pero cuidado con las sombras...',
                hintCrystal: 'Las cuevas de cristal cantan con melodías olvidadas. Cada color holds un tono diferente.',
                hintTemple: 'El templo se hunde más con cada siglo que pasa. ¿Qué yace debajo?',
                hintMushroom: 'Los hongos brillan en la oscuridad más profunda. Guían al explorador digno.',
                hintRunes: 'Runas grabadas en piedra cuentan historias de quienes vinieron antes.',
                hintForest: 'El bosque alguna vez estuvo vivo con color. Solo la piedra recuerda.',
                
                // Instructions
                instructionsMove: 'Mover: W/A/S/D',
                instructionsLook: 'Mirar: Ratón',
                instructionsJump: 'Saltar: Espacio',
                instructionsInteract: 'Interactuar: E / Click',
                instructionsLinterna: 'Linterna: F',
                instructionsJournal: 'Diario: J',
                instructionsTools: 'Herramientas: 1-4',
                
                // Language
                languageLabel: 'Idioma',
                langSpanish: 'Español',
                langEnglish: 'English',
                langPortuguese: 'Português',
                langFrench: 'Français',
                
                // Actions
                actionResume: 'Continuar',
                actionRestart: 'Reiniciar',
                actionSettings: 'Configuración',
                actionExit: 'Salir'
            },
            
            // ========== ENGLISH ==========
            en: {
                // Title & Menu
                gameTitle: 'The Forgotten Depths',
                gameSubtitle: 'Procedural World Generator',
                startButton: 'Start Exploring',
                seedPlaceholder: 'Enter seed (or leave random)',
                
                // HUD
                hudSeed: 'Seed',
                hudSecrets: 'Secrets Found',
                hudPosition: 'Position',
                hudBiome: 'Biome',
                hudTools: 'Tools',
                hudJournal: 'Journal',
                hudPuzzles: 'Puzzles',
                
                // Minimap
                minimapLabel: 'Map',
                
                // Puzzle Progress
                puzzleMirror: 'Mirror',
                puzzleColor: 'Color',
                puzzleWeight: 'Weight',
                puzzleKeys: 'Keys',
                
                // Biomes
                biomePetrifiedForest: 'Petrified Forest',
                biomeCrystalCaves: 'Crystal Caves',
                biomeSunkenTemple: 'Sunken Temple',
                biomeAbyss: 'The Abyss',
                
                // Tools
                toolHammer: 'Stone Hammer',
                toolLinterna: 'Crystal Lantern',
                toolCompass: 'Anomalous Compass',
                toolKey: 'Elemental Key',
                
                // Notifications
                notifSecretFound: 'Secret Found!',
                notifPuzzleSolved: 'Puzzle Solved!',
                notifItemCollected: 'Item Collected!',
                notifBiomeEntered: 'New Biome!',
                notifToolUnlocked: 'Tool Unlocked!',
                
                // Journal
                journalTitle: 'Chronicles of Blokheim',
                journalEntry1Title: 'Entry #1: The Awakening',
                journalEntry1Content: 'I found myself in a world of stone and mystery. The air is thick with ancient power...',
                journalEntry2Title: 'Entry #2: The Puzzles',
                journalEntry2Content: 'Strange mechanisms guard the paths ahead. Mirrors, crystals, weights... each requires understanding.',
                journalEntry3Title: 'Entry #3: The Secrets',
                journalEntry3Content: 'Hidden walls conceal treasures and knowledge. A keen eye and the right tool are essential.',
                
                // Hints
                hintMirror: 'Light reveals what darkness hides. The mirrors remember their purpose.',
                hintColor: 'Four colors, four elements, four truths. The sequence is ancient wisdom.',
                hintWeight: 'Weight balances truth. Too much or too little, and the path remains sealed.',
                hintAbyss: 'The Abyss whispers secrets to those who listen. But beware the shadows...',
                hintCrystal: 'Crystal caves sing with forgotten melodies. Each color holds a different note.',
                hintTemple: 'The temple sinks deeper with each passing century. What lies beneath?',
                hintMushroom: 'Mushrooms glow in the deepest darkness. They guide the worthy explorer.',
                hintRunes: 'Runes etched in stone tell stories of those who came before us.',
                hintForest: 'The forest was once alive with color. Now only stone remembers.',
                
                // Instructions
                instructionsMove: 'Move: W/A/S/D',
                instructionsLook: 'Look: Mouse',
                instructionsJump: 'Jump: Space',
                instructionsInteract: 'Interact: E / Click',
                instructionsLinterna: 'Lantern: F',
                instructionsJournal: 'Journal: J',
                instructionsTools: 'Tools: 1-4',
                
                // Language
                languageLabel: 'Language',
                langSpanish: 'Español',
                langEnglish: 'English',
                langPortuguese: 'Português',
                langFrench: 'Français',
                
                // Actions
                actionResume: 'Resume',
                actionRestart: 'Restart',
                actionSettings: 'Settings',
                actionExit: 'Exit'
            },
            
            // ========== PORTUGUESE ==========
            pt: {
                // Title & Menu
                gameTitle: 'The Forgotten Depths',
                gameSubtitle: 'Gerador de Mundo Procedural',
                startButton: 'Começar Exploração',
                seedPlaceholder: 'Insira uma semente (ou deixe aleatória)',
                
                // HUD
                hudSeed: 'Semente',
                hudSecrets: 'Segredos Encontrados',
                hudPosition: 'Posição',
                hudBiome: 'Bioma',
                hudTools: 'Ferramentas',
                hudJournal: 'Diário',
                hudPuzzles: 'Enigmas',
                
                // Minimap
                minimapLabel: 'Mapa',
                
                // Puzzle Progress
                puzzleMirror: 'Espelho',
                puzzleColor: 'Cor',
                puzzleWeight: 'Peso',
                puzzleKeys: 'Chaves',
                
                // Biomes
                biomePetrifiedForest: 'Floresta Petrificada',
                biomeCrystalCaves: 'Cavernas de Cristal',
                biomeSunkenTemple: 'Templo Submerso',
                biomeAbyss: 'O Abismo',
                
                // Tools
                toolHammer: 'Martelo de Pedra',
                toolLinterna: 'Lanterna de Cristal',
                toolCompass: 'Bússola Anômala',
                toolKey: 'Chave Elemental',
                
                // Notifications
                notifSecretFound: 'Segredo Encontrado!',
                notifPuzzleSolved: 'Enigma Resolvido!',
                notifItemCollected: 'Item Coletado!',
                notifBiomeEntered: 'Novo Bioma!',
                notifToolUnlocked: 'Ferramenta Desbloqueada!',
                
                // Journal
                journalTitle: 'Crônicas de Blokheim',
                journalEntry1Title: 'Entrada #1: O Despertar',
                journalEntry1Content: 'Encontrei-me em um mundo de pedra e mistério. O ar está carregado de poder ancestral...',
                journalEntry2Title: 'Entrada #2: Os Enigmas',
                journalEntry2Content: 'Mecanismos estranhos guardam os caminhos. Espelhos, cristais, pesos... cada um requer compreensão.',
                journalEntry3Title: 'Entrada #3: Os Segredos',
                journalEntry3Content: 'Paredes ocultas guardam tesouros e conhecimento. Um olhar agudo e a ferramenta certa são essenciais.',
                
                // Hints
                hintMirror: 'A luz revela o que a escuridão esconde. Os espelhos lembram seu propósito.',
                hintColor: 'Quatro cores, quatro elementos, quatro verdades. A sequência é sabedoria ancestral.',
                hintWeight: 'O peso equilibra a verdade. Demais ou de menos, e o caminho permanece selado.',
                hintAbyss: 'O Abismo sussurra segredos para quem ouve. Mas cuidado com as sombras...',
                hintCrystal: 'Cavernas de cristal cantam com melodias esquecidas. Cada cor contém uma nota diferente.',
                hintTemple: 'O templo afunda mais a cada século que passa. O que jaz abaixo?',
                hintMushroom: 'Cogumelos brilham na escuridão mais profunda. Eles guiam o explorador digno.',
                hintRunes: 'Runas gravadas em pedra contam histórias daqueles que vieram antes.',
                hintForest: 'A floresta já esteve viva com cor. Agora só a pedra lembra.',
                
                // Instructions
                instructionsMove: 'Mover: W/A/S/D',
                instructionsLook: 'Olhar: Mouse',
                instructionsJump: 'Pular: Espaço',
                instructionsInteract: 'Interagir: E / Click',
                instructionsLinterna: 'Lanterna: F',
                instructionsJournal: 'Diário: J',
                instructionsTools: 'Ferramentas: 1-4',
                
                // Language
                languageLabel: 'Idioma',
                langSpanish: 'Español',
                langEnglish: 'English',
                langPortuguese: 'Português',
                langFrench: 'Français',
                
                // Actions
                actionResume: 'Continuar',
                actionRestart: 'Reiniciar',
                actionSettings: 'Configurações',
                actionExit: 'Sair'
            },
            
            // ========== FRENCH ==========
            fr: {
                // Title & Menu
                gameTitle: 'The Forgotten Depths',
                gameSubtitle: 'Générateur de Monde Procédural',
                startButton: 'Commencer l\'Exploration',
                seedPlaceholder: 'Entrez une graine (ou laissez aléatoire)',
                
                // HUD
                hudSeed: 'Graine',
                hudSecrets: 'Secrets Trouvés',
                hudPosition: 'Position',
                hudBiome: 'Biome',
                hudTools: 'Outils',
                hudJournal: 'Journal',
                hudPuzzles: 'Énigmes',
                
                // Minimap
                minimapLabel: 'Carte',
                
                // Puzzle Progress
                puzzleMirror: 'Miroir',
                puzzleColor: 'Couleur',
                puzzleWeight: 'Poids',
                puzzleKeys: 'Clés',
                
                // Biomes
                biomePetrifiedForest: 'Forêt Pétrifiée',
                biomeCrystalCaves: 'Grottes de Cristal',
                biomeSunkenTemple: 'Temple Englouti',
                biomeAbyss: 'L\'Abîme',
                
                // Tools
                toolHammer: 'Marteau de Pierre',
                toolLinterna: 'Lanterne de Cristal',
                toolCompass: 'Boussole Anomale',
                toolKey: 'Clé Élémentaire',
                
                // Notifications
                notifSecretFound: 'Secret Trouvé!',
                notifPuzzleSolved: 'Énigme Résolue!',
                notifItemCollected: 'Objet Collecté!',
                notifBiomeEntered: 'Nouveau Biome!',
                notifToolUnlocked: 'Outil Débloqué!',
                
                // Journal
                journalTitle: 'Chroniques de Blokheim',
                journalEntry1Title: 'Entrée #1: L\'Éveil',
                journalEntry1Content: 'Je me suis retrouvé dans un monde de pierre et de mystère. L\'air est chargé de pouvoir ancien...',
                journalEntry2Title: 'Entrée #2: Les Énigmes',
                journalEntry2Content: 'Des mécanismes étranges gardent les chemins. Miroirs, cristaux, poids... chacun demande compréhension.',
                journalEntry3Title: 'Entrée #3: Les Secrets',
                journalEntry3Content: 'Des murs cachés dissimulent trésors et connaissances. Un œil avisé et le bon outil sont essentiels.',
                
                // Hints
                hintMirror: 'La lumière révèle ce que l\'obscurité cache. Les miroirs se souviennent de leur but.',
                hintColor: 'Quatre couleurs, quatre éléments, quatre vérités. La séquence est sagesse ancienne.',
                hintWeight: 'Le poids équilibre la vérité. Trop ou trop peu, et le chemin reste scellé.',
                hintAbyss: 'L\'Abîme murmure des secrets à ceux qui écoutent. Mais méfiez-vous des ombres...',
                hintCrystal: 'Les grottes de cristal chantent des mélodies oubliées. Chaque couleur porte une note différente.',
                hintTemple: 'Le temple s\'enfonce un peu plus avec chaque siècle qui passe. Que se cache-t-il en dessous?',
                hintMushroom: 'Les champignons brillent dans l\'obscurité la plus profonde. Ils guident l\'explorateur digne.',
                hintRunes: 'Des runes gravées dans la pierre racontent l\'histoire de ceux qui nous ont précédés.',
                hintForest: 'La forêt était autrefois vivante de couleurs. Maintenant, seule la pierre se souvient.',
                
                // Instructions
                instructionsMove: 'Bouger: Z/Q/S/D',
                instructionsLook: 'Regarder: Souris',
                instructionsJump: 'Sauter: Espace',
                instructionsInteract: 'Interagir: E / Clic',
                instructionsLinterna: 'Lanterne: F',
                instructionsJournal: 'Journal: J',
                instructionsTools: 'Outils: 1-4',
                
                // Language
                languageLabel: 'Langue',
                langSpanish: 'Español',
                langEnglish: 'English',
                langPortuguese: 'Português',
                langFrench: 'Français',
                
                // Actions
                actionResume: 'Continuer',
                actionRestart: 'Recommencer',
                actionSettings: 'Paramètres',
                actionExit: 'Quitter'
            }
        };
    },
    
    // Get translation by key
    t(key) {
        return this.translations[this.currentLang]?.[key] || 
               this.translations['es']?.[key] || 
               key;
    },
    
    // Change language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('gameLang', lang);
            this.updatePageLanguage();
            this.updateDynamicElements();
            
            // Track language change
            if (typeof trackGameEvent === 'function') {
                trackGameEvent('language_change', { language: lang });
            }
        }
    },
    
    // Update all elements with data-i18n attribute
    updatePageLanguage() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        
        // Update page title
        document.title = `${this.t('gameTitle')} - ${this.t('gameSubtitle')}`;
    },
    
    // Update dynamic content
    updateDynamicElements() {
        // Update HUD elements
        const biomeName = document.getElementById('biome-name');
        if (biomeName) {
            const currentBiome = biomeName.getAttribute('data-biome');
            if (currentBiome) {
                biomeName.textContent = this.t(`biome${currentBiome}`);
            }
        }
        
        // Update puzzle labels
        document.querySelectorAll('.progress-label').forEach(label => {
            const puzzleType = label.getAttribute('data-puzzle');
            if (puzzleType) {
                const icon = label.querySelector('.puzzle-icon')?.textContent || '';
                label.innerHTML = `<span class="puzzle-icon">${icon}</span> ${this.t(`puzzle${puzzleType}`)}`;
            }
        });
    },
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    },
    
    // Get all available languages
    getAvailableLanguages() {
        return [
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'pt', name: 'Português', flag: '🇧🇷' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' }
        ];
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// Export for use in other scripts
window.I18n = I18n;

// ============================================
// THE FORGOTTEN DEPTHS - Analytics System
// Track player behavior and game statistics
// ============================================

class GameAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.events = [];
        this.metrics = {
            totalPlaytime: 0,
            puzzlesAttempted: 0,
            puzzlesSolved: 0,
            secretsFound: 0,
            blocksBroken: 0,
            blocksPlaced: 0,
            itemsCollected: 0,
            deaths: 0,
            distanceTraveled: 0,
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                visible: !document.hidden
            });
        });
        
        // Track before unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.sessionStart
            });
            this.saveMetrics();
        });
        
        // Track errors
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno
            });
        });
        
        console.log('Analytics initialized. Session:', this.sessionId);
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // ============================================
    // EVENT TRACKING
    // ============================================
    
    trackEvent(eventName, eventData = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            session_id: this.sessionId,
            ...eventData
        };
        
        this.events.push(event);
        
        // Send to analytics endpoint (if configured)
        this.sendEvent(event);
        
        // Console log in development
        if (window.location.hostname === 'localhost') {
            console.log('📊 Analytics:', eventName, eventData);
        }
    }
    
    sendEvent(event) {
        // Option 1: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event.event, event);
        }
        
        // Option 2: Send to custom endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(event)
        // }).catch(() => {}); // Silent fail
        
        // Option 3: Store in localStorage for later
        this.storeEventLocally(event);
    }
    
    storeEventLocally(event) {
        try {
            const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            stored.push(event);
            
            // Keep only last 1000 events
            if (stored.length > 1000) {
                stored.splice(0, stored.length - 1000);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(stored));
        } catch (e) {
            // Storage full or unavailable
        }
    }
    
    // ============================================
    // GAME-SPECIFIC EVENTS
    // ============================================
    
    // Session events
    trackSessionStart(seed) {
        this.trackEvent('session_start', {
            seed: seed,
            platform: navigator.platform,
            screen_size: `${window.innerWidth}x${window.innerHeight}`,
            device_pixel_ratio: window.devicePixelRatio,
            webgl_support: !!document.createElement('canvas').getContext('webgl')
        });
    }
    
    trackSessionEnd() {
        this.trackEvent('session_end', {
            duration: Date.now() - this.sessionStart,
            ...this.metrics
        });
    }
    
    // Movement events
    trackPlayerMove(x, y, z) {
        this.metrics.distanceTraveled += 0.1; // Approximate
        
        // Only track significant movements
        if (Math.floor(this.metrics.distanceTraveled) % 10 === 0) {
            this.trackEvent('player_milestone', {
                distance: Math.floor(this.metrics.distanceTraveled)
            });
        }
    }
    
    // Puzzle events
    trackPuzzleStart(puzzleType, puzzleId) {
        this.metrics.puzzlesAttempted++;
        this.trackEvent('puzzle_start', {
            puzzle_type: puzzleType,
            puzzle_id: puzzleId,
            attempt_number: this.metrics.puzzlesAttempted
        });
    }
    
    trackPuzzleSolved(puzzleType, puzzleId, duration) {
        this.metrics.puzzlesSolved++;
        this.trackEvent('puzzle_solved', {
            puzzle_type: puzzleType,
            puzzle_id: puzzleId,
            duration_ms: duration,
            success_rate: this.metrics.puzzlesSolved / this.metrics.puzzlesAttempted
        });
    }
    
    trackPuzzleFailed(puzzleType, puzzleId, reason) {
        this.trackEvent('puzzle_failed', {
            puzzle_type: puzzleType,
            puzzle_id: puzzleId,
            reason: reason
        });
    }
    
    // Secret events
    trackSecretFound(secretId, secretType, location) {
        this.metrics.secretsFound++;
        this.trackEvent('secret_found', {
            secret_id: secretId,
            secret_type: secretType,
            location: location,
            total_secrets: this.metrics.secretsFound
        });
    }
    
    // Block events
    trackBlockBroken(blockType, location) {
        this.metrics.blocksBroken++;
        
        // Only track every 10th block
        if (this.metrics.blocksBroken % 10 === 0) {
            this.trackEvent('blocks_milestone', {
                count: this.metrics.blocksBroken
            });
        }
    }
    
    trackBlockPlaced(blockType, location) {
        this.metrics.blocksPlaced++;
    }
    
    // Item events
    trackItemCollected(itemType, itemId) {
        this.metrics.itemsCollected++;
        this.trackEvent('item_collected', {
            item_type: itemType,
            item_id: itemId,
            total_items: this.metrics.itemsCollected
        });
    }
    
    // Death events
    trackPlayerDeath(cause, location) {
        this.metrics.deaths++;
        this.trackEvent('player_death', {
            cause: cause,
            location: location,
            total_deaths: this.metrics.deaths
        });
    }
    
    // Biome events
    trackBiomeChange(biomeName) {
        this.trackEvent('biome_entered', {
            biome: biomeName
        });
    }
    
    // Tool events
    trackToolUsed(toolName) {
        this.trackEvent('tool_used', {
            tool: toolName
        });
    }
    
    // Journal events
    trackJournalPageFound(pageNumber) {
        this.trackEvent('journal_page_found', {
            page_number: pageNumber
        });
    }
    
    // Achievement events
    trackAchievementUnlocked(achievementId, achievementName) {
        this.trackEvent('achievement_unlocked', {
            achievement_id: achievementId,
            achievement_name: achievementName
        });
    }
    
    // UI events
    trackUIInteraction(element, action) {
        this.trackEvent('ui_interaction', {
            element: element,
            action: action
        });
    }
    
    // Performance events
    trackPerformance(fps, loadTime) {
        this.trackEvent('performance', {
            fps: fps,
            load_time_ms: loadTime,
            memory_used: performance.memory ? performance.memory.usedJSHeapSize : null
        });
    }
    
    // ============================================
    // METRICS & REPORTING
    // ============================================
    
    getMetrics() {
        return {
            ...this.metrics,
            session_duration: Date.now() - this.sessionStart,
            success_rate: this.metrics.puzzlesAttempted > 0 
                ? this.metrics.puzzlesSolved / this.metrics.puzzlesAttempted 
                : 0,
            exploration_score: this.calculateExplorationScore(),
            completion_rate: this.calculateCompletionRate()
        };
    }
    
    calculateExplorationScore() {
        let score = 0;
        score += this.metrics.secretsFound * 100;
        score += this.metrics.itemsCollected * 10;
        score += this.metrics.blocksBroken * 1;
        score += this.metrics.distanceTraveled * 0.1;
        return Math.floor(score);
    }
    
    calculateCompletionRate() {
        const maxSecrets = 12;
        const maxPuzzles = 4;
        const maxJournal = 50;
        
        const secretProgress = Math.min(this.metrics.secretsFound / maxSecrets, 1);
        const puzzleProgress = Math.min(this.metrics.puzzlesSolved / maxPuzzles, 1);
        
        return Math.floor((secretProgress * 0.4 + puzzleProgress * 0.6) * 100);
    }
    
    saveMetrics() {
        try {
            const metrics = this.getMetrics();
            localStorage.setItem('game_metrics', JSON.stringify(metrics));
        } catch (e) {
            // Storage unavailable
        }
    }
    
    loadMetrics() {
        try {
            return JSON.parse(localStorage.getItem('game_metrics') || '{}');
        } catch (e) {
            return {};
        }
    }
    
    // ============================================
    // GOOGLE ANALYTICS INTEGRATION
    // ============================================
    
    static initGoogleAnalytics(measurementId) {
        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', measurementId, {
            page_title: 'The Forgotten Depths',
            custom_map: {
                dimension1: 'session_id',
                dimension2: 'world_seed',
                dimension3: 'player_role'
            }
        });
        
        console.log('Google Analytics initialized:', measurementId);
    }
    
    // ============================================
    // ANALYTICS DASHBOARD DATA
    // ============================================
    
    static getDashboardData() {
        const metrics = JSON.parse(localStorage.getItem('game_metrics') || '{}');
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        
        // Calculate statistics
        const stats = {
            totalSessions: events.filter(e => e.event === 'session_start').length,
            totalPlaytime: events
                .filter(e => e.event === 'session_end')
                .reduce((sum, e) => sum + (e.duration || 0), 0),
            puzzlesSolved: metrics.puzzlesSolved || 0,
            secretsFound: metrics.secretsFound || 0,
            explorationScore: metrics.exploration_score || 0,
            
            // Daily activity (last 7 days)
            dailyActivity: this.calculateDailyActivity(events),
            
            // Puzzle success rates
            puzzleStats: this.calculatePuzzleStats(events),
            
            // Most visited biomes
            biomeStats: this.calculateBiomeStats(events),
            
            // Achievement progress
            achievements: this.calculateAchievements(events)
        };
        
        return stats;
    }
    
    static calculateDailyActivity(events) {
        const activity = {};
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now - i * dayMs);
            const key = date.toISOString().split('T')[0];
            activity[key] = events.filter(e => {
                const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
                return eventDate === key;
            }).length;
        }
        
        return activity;
    }
    
    static calculatePuzzleStats(events) {
        const puzzleEvents = events.filter(e => 
            e.event === 'puzzle_solved' || e.event === 'puzzle_failed'
        );
        
        const stats = {
            mirror: { solved: 0, failed: 0 },
            color: { solved: 0, failed: 0 },
            weight: { solved: 0, failed: 0 },
            key: { solved: 0, failed: 0 }
        };
        
        puzzleEvents.forEach(e => {
            const type = e.puzzle_type;
            if (stats[type]) {
                if (e.event === 'puzzle_solved') stats[type].solved++;
                else stats[type].failed++;
            }
        });
        
        return stats;
    }
    
    static calculateBiomeStats(events) {
        const biomeEvents = events.filter(e => e.event === 'biome_entered');
        const stats = {};
        
        biomeEvents.forEach(e => {
            const biome = e.biome;
            stats[biome] = (stats[biome] || 0) + 1;
        });
        
        return stats;
    }
    
    static calculateAchievements(events) {
        return events
            .filter(e => e.event === 'achievement_unlocked')
            .map(e => ({
                id: e.achievement_id,
                name: e.achievement_name,
                timestamp: e.timestamp
            }));
    }
}

// ============================================
// GOOGLE ANALYTICS SETUP
// ============================================

// Replace with your Google Analytics Measurement ID
// Get it from: https://analytics.google.com/
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your ID

// Initialize Google Analytics (if ID is provided)
if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    GameAnalytics.initGoogleAnalytics(GA_MEASUREMENT_ID);
}

// Create global analytics instance
const analytics = new GameAnalytics();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = analytics;
}

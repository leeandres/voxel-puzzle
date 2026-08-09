// ============================================
// THE FORGOTTEN DEPTHS - Audio System
// Procedural audio using Web Audio API
// ============================================

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.ambientGain = null;
        
        this.isPlaying = false;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.ambientVolume = 0.2;
        
        // Music nodes
        this.musicNodes = [];
        this.ambientNodes = [];
        
        // Initialize on user interaction
        this.initialized = false;
    }
    
    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.initialized) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = this.ambientVolume;
            this.ambientGain.connect(this.masterGain);
            
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (e) {
            console.error('Audio initialization failed:', e);
        }
    }
    
    // Resume audio context (needed for Chrome)
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    
    // ============================================
    // BACKGROUND MUSIC
    // ============================================
    
    // Ambient pad music (procedural)
    startMusic() {
        if (!this.initialized || this.isPlaying) return;
        this.isPlaying = true;
        
        // Create ambient pad
        this.createAmbientPad();
        
        // Create melody arpeggios
        this.createMelodyArpeggio();
    }
    
    createAmbientPad() {
        // Deep ambient drone
        const frequencies = [55, 82.5, 110, 165]; // A1, E2, A2, E3
        
        frequencies.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Slow LFO for movement
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.1 + i * 0.05;
            lfoGain.gain.value = 2;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 1;
            
            gain.gain.value = 0.08;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);
            
            osc.start();
            
            this.musicNodes.push({ osc, gain, lfo, filter });
        });
    }
    
    createMelodyArpeggio() {
        // Pentatonic scale notes
        const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25]; // A3, C4, D4, E4, G4, A4, C5
        
        const playNote = () => {
            if (!this.isPlaying) return;
            
            const freq = notes[Math.floor(Math.random() * notes.length)];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            
            gain.gain.value = 0;
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 2.5);
            
            // Play next note
            setTimeout(playNote, 800 + Math.random() * 1500);
        };
        
        setTimeout(playNote, 2000);
    }
    
    stopMusic() {
        this.isPlaying = false;
        this.musicNodes.forEach(node => {
            try {
                node.osc.stop();
                if (node.lfo) node.lfo.stop();
            } catch (e) {}
        });
        this.musicNodes = [];
    }
    
    // ============================================
    // SOUND EFFECTS
    // ============================================
    
    // Block break sound
    playBlockBreak(blockType = 'stone') {
        if (!this.initialized) return;
        
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / buffer.length, 3);
        }
        
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = blockType === 'stone' ? 800 : 1200;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.3;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        noise.start();
    }
    
    // Block place sound
    playBlockPlace() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 150;
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    
    // Mirror rotate sound
    playMirrorRotate() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 400;
        osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
    
    // Crystal activate sound
    playCrystalActivate(color = 'red') {
        if (!this.initialized) return;
        
        const frequencies = {
            red: 523.25,    // C5
            blue: 587.33,   // D5
            green: 659.25,  // E5
            yellow: 783.99  // G5
        };
        
        const freq = frequencies[color] || 523.25;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
        
        // Add harmonics
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2;
        gain2.gain.value = 0.1;
        gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(this.sfxGain);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.3);
    }
    
    // Puzzle solved fanfare
    playPuzzleSolved() {
        if (!this.initialized) return;
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.value = freq;
                
                gain.gain.value = 0.15;
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
                
                osc.connect(gain);
                gain.connect(this.sfxGain);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.4);
            }, i * 150);
        });
    }
    
    // Secret found sound
    playSecretFound() {
        if (!this.initialized) return;
        
        // Magical shimmer sound
        const notes = [880, 1108.73, 1318.51, 1760]; // A5, C#6, E6, A6
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.value = 0.1;
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
                
                osc.connect(gain);
                gain.connect(this.sfxGain);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.6);
            }, i * 100);
        });
    }
    
    // Chest open sound
    playChestOpen() {
        if (!this.initialized) return;
        
        // Creaking sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 100;
        osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.2);
        
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
    
    // Item pickup sound
    playItemPickup() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 600;
        osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.1);
        
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    
    // Footstep sound
    playFootstep() {
        if (!this.initialized) return;
        
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / buffer.length, 5);
        }
        
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500 + Math.random() * 300;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.08;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        noise.start();
    }
    
    // Jump sound
    playJump() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 200;
        osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.1);
        
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    
    // UI click sound
    playUIClick() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
    
    // Notification sound
    playNotification() {
        if (!this.initialized) return;
        
        const notes = [880, 1108.73]; // A5, C#6
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.value = 0.1;
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
                
                osc.connect(gain);
                gain.connect(this.sfxGain);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.2);
            }, i * 100);
        });
    }
    
    // Danger/warning sound
    playDanger() {
        if (!this.initialized) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 150;
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
        
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }
    
    // ============================================
    // AMBIENT SOUNDS
    // ============================================
    
    startAmbient(biome = 'forest') {
        if (!this.initialized) return;
        
        this.stopAmbient();
        
        switch (biome) {
            case 'forest':
                this.startForestAmbient();
                break;
            case 'caves':
                this.startCaveAmbient();
                break;
            case 'temple':
                this.startTempleAmbient();
                break;
            case 'abyss':
                this.startAbyssAmbient();
                break;
        }
    }
    
    startForestAmbient() {
        // Wind through trees
        const wind = this.ctx.createOscillator();
        const windGain = this.ctx.createGain();
        const windFilter = this.ctx.createBiquadFilter();
        
        wind.type = 'sawtooth';
        wind.frequency.value = 100;
        
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 200;
        
        // LFO for wind variation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain);
        lfoGain.connect(windFilter.frequency);
        lfo.start();
        
        windGain.gain.value = 0.03;
        
        wind.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.ambientGain);
        
        wind.start();
        
        this.ambientNodes.push({ wind, windGain, lfo });
    }
    
    startCaveAmbient() {
        // Deep rumble
        const rumble = this.ctx.createOscillator();
        const rumbleGain = this.ctx.createGain();
        
        rumble.type = 'sine';
        rumble.frequency.value = 40;
        
        rumbleGain.gain.value = 0.05;
        
        rumble.connect(rumbleGain);
        rumbleGain.connect(this.ambientGain);
        
        rumble.start();
        
        // Water drips
        const playDrip = () => {
            if (!this.initialized) return;
            
            const drip = this.ctx.createOscillator();
            const dripGain = this.ctx.createGain();
            
            drip.type = 'sine';
            drip.frequency.value = 2000 + Math.random() * 1000;
            
            dripGain.gain.value = 0.05;
            dripGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
            
            drip.connect(dripGain);
            dripGain.connect(this.ambientGain);
            
            drip.start();
            drip.stop(this.ctx.currentTime + 0.1);
            
            setTimeout(playDrip, 2000 + Math.random() * 5000);
        };
        
        setTimeout(playDrip, 1000);
        
        this.ambientNodes.push({ rumble, rumbleGain });
    }
    
    startTempleAmbient() {
        // Ethereal drone
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        
        drone.type = 'sine';
        drone.frequency.value = 110;
        
        droneGain.gain.value = 0.04;
        
        // Slow modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(drone.frequency);
        lfo.start();
        
        drone.connect(droneGain);
        droneGain.connect(this.ambientGain);
        
        drone.start();
        
        this.ambientNodes.push({ drone, droneGain, lfo });
    }
    
    startAbyssAmbient() {
        // Ominous low drone
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        
        drone.type = 'sawtooth';
        drone.frequency.value = 30;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;
        
        droneGain.gain.value = 0.04;
        
        // Slow pulsing
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain);
        lfoGain.connect(droneGain.gain);
        lfo.start();
        
        drone.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(this.ambientGain);
        
        drone.start();
        
        this.ambientNodes.push({ drone, droneGain, lfo });
    }
    
    stopAmbient() {
        this.ambientNodes.forEach(node => {
            try {
                if (node.wind) node.wind.stop();
                if (node.rumble) node.rumble.stop();
                if (node.drone) node.drone.stop();
                if (node.lfo) node.lfo.stop();
            } catch (e) {}
        });
        this.ambientNodes = [];
    }
    
    // ============================================
    // VOLUME CONTROLS
    // ============================================
    
    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.musicGain) {
            this.musicGain.gain.value = volume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = volume;
        if (this.sfxGain) {
            this.sfxGain.gain.value = volume;
        }
    }
    
    setAmbientVolume(volume) {
        this.ambientVolume = volume;
        if (this.ambientGain) {
            this.ambientGain.gain.value = volume;
        }
    }
    
    // Toggle mute
    toggleMute() {
        if (this.masterGain) {
            if (this.masterGain.gain.value > 0) {
                this.masterGain.gain.value = 0;
                return true; // muted
            } else {
                this.masterGain.gain.value = 1;
                return false; // unmuted
            }
        }
        return false;
    }
    
    // Cleanup
    destroy() {
        this.stopMusic();
        this.stopAmbient();
        if (this.ctx) {
            this.ctx.close();
        }
    }
}

// Create global audio instance
const audioSystem = new AudioSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = audioSystem;
}

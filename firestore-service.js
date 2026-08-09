import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    increment,
    serverTimestamp,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase-config';

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

// Create or update user profile
export async function createOrUpdateUser(user) {
    const userRef = doc(db, COLLECTIONS.USERS, user.uid);
    
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
        // New user - add creation date
        userData.createdAt = serverTimestamp();
        userData.settings = {
            language: 'es',
            volume: 0.8,
            showTutorials: true,
            notifications: true
        };
    }
    
    await setDoc(userRef, userData, { merge: true });
    return userData;
}

// Get user profile
export async function getUserProfile(uid) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
}

// Update user settings
export async function updateUserSettings(uid, settings) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
        settings: settings,
        updatedAt: serverTimestamp()
    });
}

// ============================================
// GAME PROGRESS FUNCTIONS
// ============================================

// Get or create game progress for a seed
export async function getGameProgress(uid, seed) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
        return { id: progressDoc.id, ...progressDoc.data() };
    }
    
    // Create new progress
    const newProgress = {
        seed: seed,
        currentRoom: 'forest',
        puzzlesSolved: [],
        secretsFound: [],
        totalSecrets: 0,
        itemsCollected: [],
        journalPages: [],
        totalPlaytime: 0,
        lastPlayed: serverTimestamp(),
        createdAt: serverTimestamp()
    };
    
    await setDoc(progressRef, newProgress);
    return newProgress;
}

// Update game progress
export async function updateGameProgress(uid, seed, updates) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    
    await updateDoc(progressRef, {
        ...updates,
        lastPlayed: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

// Save puzzle solved
export async function savePuzzleSolved(uid, seed, puzzleId) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
        const currentSolved = progressDoc.data().puzzlesSolved || [];
        if (!currentSolved.includes(puzzleId)) {
            await updateDoc(progressRef, {
                puzzlesSolved: [...currentSolved, puzzleId],
                lastPlayed: serverTimestamp()
            });
        }
    }
}

// Save secret found
export async function saveSecretFound(uid, seed, secretId) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
        const currentFound = progressDoc.data().secretsFound || [];
        if (!currentFound.includes(secretId)) {
            const newFound = [...currentFound, secretId];
            await updateDoc(progressRef, {
                secretsFound: newFound,
                totalSecrets: newFound.length,
                lastPlayed: serverTimestamp()
            });
        }
    }
}

// Save item collected
export async function saveItemCollected(uid, seed, itemId) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
        const currentItems = progressDoc.data().itemsCollected || [];
        if (!currentItems.includes(itemId)) {
            await updateDoc(progressRef, {
                itemsCollected: [...currentItems, itemId],
                lastPlayed: serverTimestamp()
            });
        }
    }
}

// Save journal page
export async function saveJournalPage(uid, seed, pageNumber) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
        const currentPages = progressDoc.data().journalPages || [];
        if (!currentPages.includes(pageNumber)) {
            await updateDoc(progressRef, {
                journalPages: [...currentPages, pageNumber],
                lastPlayed: serverTimestamp()
            });
        }
    }
}

// Update playtime
export async function updatePlaytime(uid, seed, seconds) {
    const progressRef = doc(db, COLLECTIONS.USERS, uid, 'gameProgress', seed);
    
    await updateDoc(progressRef, {
        totalPlaytime: increment(seconds),
        lastPlayed: serverTimestamp()
    });
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================

// Get or create statistics
export async function getStatistics(uid) {
    const statsRef = doc(db, COLLECTIONS.USERS, uid, 'statistics', 'main');
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
        return { id: statsDoc.id, ...statsDoc.data() };
    }
    
    // Create new statistics
    const newStats = {
        gamesPlayed: 0,
        gamesCompleted: 0,
        completionRate: 0,
        totalTime: 0,
        averageTime: 0,
        bestTime: Infinity,
        puzzlesByType: {
            mirror: 0,
            color: 0,
            weight: 0,
            key: 0
        },
        secretsByType: {
            forest: 0,
            caves: 0,
            temple: 0,
            abyss: 0
        },
        achievementsUnlocked: [],
        level: 1,
        experience: 0,
        createdAt: serverTimestamp()
    };
    
    await setDoc(statsRef, newStats);
    return newStats;
}

// Update statistics after game session
export async function updateStatistics(uid, sessionData) {
    const statsRef = doc(db, COLLECTIONS.USERS, uid, 'statistics', 'main');
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) return;
    
    const currentStats = statsDoc.data();
    
    const updates = {
        gamesPlayed: increment(1),
        totalTime: increment(sessionData.playtime || 0),
        lastPlayed: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    // Update completion
    if (sessionData.completed) {
        updates.gamesCompleted = increment(1);
    }
    
    // Update puzzle counts
    if (sessionData.puzzleType) {
        updates[`puzzlesByType.${sessionData.puzzleType}`] = increment(1);
    }
    
    // Update best time
    if (sessionData.playtime && sessionData.playtime < currentStats.bestTime) {
        updates.bestTime = sessionData.playtime;
    }
    
    // Calculate new completion rate
    const newGamesPlayed = currentStats.gamesPlayed + 1;
    const newGamesCompleted = currentStats.gamesCompleted + (sessionData.completed ? 1 : 0);
    updates.completionRate = newGamesCompleted / newGamesPlayed;
    updates.averageTime = (currentStats.totalTime + (sessionData.playtime || 0)) / newGamesPlayed;
    
    // Add experience
    const xpGained = calculateXP(sessionData);
    updates.experience = increment(xpGained);
    
    // Check for level up
    const newLevel = Math.floor((currentStats.experience + xpGained) / 1000) + 1;
    if (newLevel > currentStats.level) {
        updates.level = newLevel;
    }
    
    await updateDoc(statsRef, updates);
    
    // Check achievements
    await checkAchievements(uid, currentStats, sessionData);
    
    return updates;
}

// Calculate XP based on session
function calculateXP(sessionData) {
    let xp = 0;
    
    // Base XP for playing
    xp += 10;
    
    // XP for puzzles solved
    xp += (sessionData.puzzlesSolved || 0) * 50;
    
    // XP for secrets found
    xp += (sessionData.secretsFound || 0) * 25;
    
    // Bonus for completion
    if (sessionData.completed) {
        xp += 200;
    }
    
    // Time bonus (faster = more XP)
    if (sessionData.playtime && sessionData.playtime < 1800) { // Under 30 minutes
        xp += 100;
    }
    
    return xp;
}

// Check and unlock achievements
async function checkAchievements(uid, stats, sessionData) {
    const achievements = [];
    
    // First game
    if (stats.gamesPlayed === 0) {
        achievements.push('first_game');
    }
    
    // Speedrunner (complete in under 15 minutes)
    if (sessionData.completed && sessionData.playtime < 900) {
        achievements.push('speedrunner');
    }
    
    // Puzzle master (solve all puzzle types)
    const puzzleTypes = Object.keys(stats.puzzlesByType);
    const solvedTypes = puzzleTypes.filter(t => stats.puzzlesByType[t] > 0);
    if (solvedTypes.length === puzzleTypes.length) {
        achievements.push('puzzle_master');
    }
    
    // Secret hunter (find 10 secrets)
    const totalSecrets = Object.values(stats.secretsByType).reduce((a, b) => a + b, 0);
    if (totalSecrets >= 10) {
        achievements.push('secret_hunter');
    }
    
    // Level 5
    if (stats.level >= 5) {
        achievements.push('veteran');
    }
    
    // Unlock new achievements
    if (achievements.length > 0) {
        const statsRef = doc(db, COLLECTIONS.USERS, uid, 'statistics', 'main');
        const currentAchievements = stats.achievementsUnlocked || [];
        const newAchievements = achievements.filter(a => !currentAchievements.includes(a));
        
        if (newAchievements.length > 0) {
            await updateDoc(statsRef, {
                achievementsUnlocked: [...currentAchievements, ...newAchievements]
            });
        }
    }
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

// Get top players
export async function getLeaderboard(limit = 10) {
    const statsRef = collection(db, COLLECTIONS.USERS, 'leaderboards', 'allTime');
    const q = query(
        statsRef,
        orderBy('level', 'desc'),
        orderBy('experience', 'desc'),
        limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Get players by puzzle completion
export async function getPuzzleLeaderboard(puzzleType, limit = 10) {
    const statsRef = collection(db, COLLECTIONS.USERS, 'leaderboards', 'puzzles');
    const q = query(
        statsRef,
        orderBy(`puzzlesByType.${puzzleType}`, 'desc'),
        limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// ============================================
// ACHIEVEMENTS DEFINITION
// ============================================

export const ACHIEVEMENTS = {
    first_game: {
        id: 'first_game',
        name: 'Primer Paso',
        description: 'Completa tu primera partida',
        icon: '🎯',
        xp: 50
    },
    speedrunner: {
        id: 'speedrunner',
        name: 'Speedrunner',
        description: 'Completa el juego en menos de 15 minutos',
        icon: '⚡',
        xp: 200
    },
    puzzle_master: {
        id: 'puzzle_master',
        name: 'Maestro de Puzzles',
        description: 'Resuelve al menos un puzzle de cada tipo',
        icon: '🧩',
        xp: 150
    },
    secret_hunter: {
        id: 'secret_hunter',
        name: 'Cazador de Secretos',
        description: 'Encuentra 10 secretos en total',
        icon: '🔓',
        xp: 100
    },
    veteran: {
        id: 'veteran',
        name: 'Veterano',
        description: 'Alcanza el nivel 5',
        icon: '⭐',
        xp: 100
    },
    collector: {
        id: 'collector',
        name: 'Coleccionista',
        description: 'Recoge 50 items en total',
        icon: '💎',
        xp: 75
    },
    scholar: {
        id: 'scholar',
        name: 'Erudito',
        description: 'Lee 30 páginas del diario',
        icon: '📖',
        xp: 75
    },
    explorer: {
        id: 'explorer',
        name: 'Explorador',
        description: 'Visita los 4 biomas',
        icon: '🌍',
        xp: 100
    }
};

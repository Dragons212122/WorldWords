// WorldWords - Interactive JavaScript

// ============================================
// Navigation & Page Management
// ============================================

// Current state
let currentPage = 'home';
let isLoggedIn = false;
let userData = {
    name: 'Alex',
    email: 'alex@example.com',
    dailyGoal: 20,
    currentStreak: 12,
    wordsMastered: 847,
    wordsToday: 15
};

// Flashcard data
let flashcards = [
    { word: 'Ephemeral', phonetic: '/əˈfem(ə)rəl/', definition: 'Lasting for a very short time; fleeting.', category: 'Academic' },
    { word: 'Sagacious', phonetic: '/səˈɡāSHəs/', definition: 'Having or showing keen mental discernment and good judgment; wise.', category: 'Academic' },
    { word: 'Melifluous', phonetic: '/məˈliflo͞oəs/', definition: '(of a voice or words) sweet or musical; pleasant to hear.', category: 'Academic' },
    { word: 'Ubiquitous', phonetic: '/yo͞oˈbikwədəs/', definition: 'Present, appearing, or found everywhere.', category: 'Academic' },
    { word: 'Eloquent', phonetic: '/ˈeləkwənt/', definition: 'Fluent or persuasive in speaking or writing.', category: 'Academic' },
    { word: 'Pragmatic', phonetic: '/praɡˈmadik/', definition: 'Dealing with things sensibly and realistically.', category: 'Business' },
    { word: 'Catalyst', phonetic: '/ˈkadlˌist/', definition: 'A person or thing that precipitates an event or change.', category: 'Business' },
    { word: 'Synergy', phonetic: '/ˈsinərjē/', definition: 'The interaction of elements that when combined produce a total effect greater than the sum of the individual elements.', category: 'Business' },
    { word: 'Resilient', phonetic: '/rəˈzilyənt/', definition: 'Able to recover quickly from difficulties; tough.', category: 'Daily' },
    { word: 'Nostalgia', phonetic: '/nəˈstaljə/', definition: 'A sentimental longing or wistful affection for the past.', category: 'Daily' }
];

let currentCardIndex = 0;

// Quiz data
let quizQuestions = [
    {
        question: "Which word means 'to make something less severe or painful'?",
        options: ['Mitigate', 'Exacerbate', 'Amplify', 'Intensify'],
        correct: 0
    },
    {
        question: "What does 'ephemeral' mean?",
        options: ['Permanent', 'Lasting a very short time', 'Extremely large', 'Very important'],
        correct: 1
    },
    {
        question: "Which word describes someone with keen mental discernment?",
        options: ['Naive', 'Sagacious', 'Confused', 'Uncertain'],
        correct: 1
    },
    {
        question: "What does 'ubiquitous' mean?",
        options: ['Rare', 'Present everywhere', 'Hidden', 'Ancient'],
        correct: 1
    },
    {
        question: "Which word means 'fluent or persuasive in speaking or writing'?",
        options: ['Eloquent', 'Quiet', 'Shy', 'Brief'],
        correct: 0
    }
];

let currentQuizQuestion = 0;
let selectedAnswer = null;

// Word gallery data
let galleryWords = [
    { word: 'Ephemeral', phonetic: '/əˈfem(ə)rəl/', definition: 'Lasting for a very short time; fleeting.', status: 'mastered' },
    { word: 'Sagacious', phonetic: '/səˈɡāSHəs/', definition: 'Having or showing keen mental discernment and good judgment; wise.', status: 'mastered' },
    { word: 'Melifluous', phonetic: '/məˈliflo͞oəs/', definition: '(of a voice or words) sweet or musical; pleasant to hear.', status: 'learning' },
    { word: 'Ubiquitous', phonetic: '/yo͞oˈbikwədəs/', definition: 'Present, appearing, or found everywhere.', status: 'learning' },
    { word: 'Eloquent', phonetic: '/ˈeləkwənt/', definition: 'Fluent or persuasive in speaking or writing.', status: 'favorited' },
    { word: 'Pragmatic', phonetic: '/praɡˈmadik/', definition: 'Dealing with things sensibly and realistically.', status: 'learning' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Initialize gallery
    renderGallery();

    // Update UI with user data
    updateUserDisplay();
}

// Page navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// Authentication
// ============================================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login
    if (email && password) {
        isLoggedIn = true;
        userData.email = email;
        userData.name = email.split('@')[0];
        
        // Show success message
        alert('Login successful! Redirecting to dashboard...');
        
        // Navigate to dashboard
        navigateTo('dashboard');
        updateUserDisplay();
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Simulate signup
    if (name && email && password) {
        isLoggedIn = true;
        userData.name = name;
        userData.email = email;
        
        // Show success message
        alert('Account created successfully! Welcome to WorldWords!');
        
        // Navigate to dashboard
        navigateTo('dashboard');
        updateUserDisplay();
    }
}

function handleSocialLogin(provider) {
    alert(`Redirecting to ${provider} for authentication...`);
    // In a real app, this would redirect to OAuth flow
}

// ============================================
// Flashcards
// ============================================

function flipCard(card) {
    card.classList.toggle('flipped');
}

function rateCard(rating, event) {
    event.stopPropagation();
    
    const ratings = {
        hard: '😔',
        medium: '😐',
        easy: '😊'
    };
    
    console.log(`Card rated as ${rating}: ${ratings[rating]}`);
    
    // Move to next card after a short delay
    setTimeout(() => {
        nextCard();
    }, 500);
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateFlashcard();
    }
}

function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        updateFlashcard();
    } else {
        // Loop back to beginning or show completion
        currentCardIndex = 0;
        updateFlashcard();
    }
}

function updateFlashcard() {
    const card = document.querySelector('.flashcard');
    if (card) {
        // Remove flipped class to reset
        card.classList.remove('flipped');
        
        // Update content after animation
        setTimeout(() => {
            const front = card.querySelector('.flashcard-front');
            const back = card.querySelector('.flashcard-back');
            
            if (front && back && flashcards[currentCardIndex]) {
                const data = flashcards[currentCardIndex];
                front.querySelector('h2').textContent = data.word;
                front.querySelector('.phonetic').textContent = data.phonetic;
                back.querySelector('.definition').textContent = data.definition;
            }
        }, 200);
        
        // Update counter
        const counter = document.querySelector('.card-counter');
        if (counter) {
            counter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
        }
    }
}

// ============================================
// Quiz
// ============================================

function selectAnswer(option) {
    // Remove selected class from all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Get the index of selected option
    const options = Array.from(document.querySelectorAll('.quiz-option'));
    selectedAnswer = options.indexOf(option);
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === quizQuestions[currentQuizQuestion].correct;
    
    if (isCorrect) {
        alert('Correct! 🎉');
    } else {
        alert('Incorrect. The correct answer is: ' + quizQuestions[currentQuizQuestion].options[quizQuestions[currentQuizQuestion].correct]);
    }
    
    // Move to next question
    if (currentQuizQuestion < quizQuestions.length - 1) {
        currentQuizQuestion++;
        
        // Update question
        const questionEl = document.querySelector('.quiz-question');
        if (questionEl) {
            questionEl.textContent = quizQuestions[currentQuizQuestion].question;
        }
        
        // Update options
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((opt, index) => {
            opt.querySelector('.option-text').textContent = quizQuestions[currentQuizQuestion].options[index];
            opt.classList.remove('selected');
        });
        
        // Update progress
        const progressFill = document.querySelector('.quiz-container .progress-fill');
        if (progressFill) {
            const progress = ((currentQuizQuestion + 1) / quizQuestions.length) * 100;
            progressFill.style.width = progress + '%';
        }
        
        selectedAnswer = null;
    } else {
        alert('Quiz completed! Great job! 🎊');
        // Reset quiz
        currentQuizQuestion = 0;
        selectedAnswer = null;
        navigateTo('dashboard');
    }
}

// ============================================
// Gallery
// ============================================

function renderGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    galleryWords.forEach(word => {
        const wordEl = document.createElement('div');
        wordEl.className = `gallery-word ${word.status}`;
        wordEl.innerHTML = `
            <div class="gallery-word-header">
                <h3>${word.word}</h3>
                <span class="status-badge ${word.status}">${word.status}</span>
            </div>
            <p class="gallery-phonetic">${word.phonetic}</p>
            <p class="gallery-definition">${word.definition}</p>
            <div class="gallery-actions">
                <button class="icon-btn-small" onclick="toggleFavorite('${word.word}')">❤️</button>
                <button class="icon-btn-small" onclick="playAudio('${word.word}')">🔊</button>
            </div>
        `;
        galleryGrid.appendChild(wordEl);
    });
}

function toggleFavorite(word) {
    const wordObj = galleryWords.find(w => w.word === word);
    if (wordObj) {
        wordObj.status = wordObj.status === 'favorited' ? 'learning' : 'favorited';
        renderGallery();
    }
}

function playAudio(word) {
    // In a real app, this would play audio
    alert(`Playing pronunciation for: ${word}`);
}

// Filter gallery
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        // Remove active class from all filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked filter
        e.target.classList.add('active');
        
        const filter = e.target.textContent.toLowerCase();
        
        // Filter gallery words
        if (filter === 'all words') {
            renderGallery();
        } else {
            const filtered = galleryWords.filter(w => w.status === filter);
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                galleryGrid.innerHTML = '';
                filtered.forEach(word => {
                    const wordEl = document.createElement('div');
                    wordEl.className = `gallery-word ${word.status}`;
                    wordEl.innerHTML = `
                        <div class="gallery-word-header">
                            <h3>${word.word}</h3>
                            <span class="status-badge ${word.status}">${word.status}</span>
                        </div>
                        <p class="gallery-phonetic">${word.phonetic}</p>
                        <p class="gallery-definition">${word.definition}</p>
                        <div class="gallery-actions">
                            <button class="icon-btn-small" onclick="toggleFavorite('${word.word}')">❤️</button>
                            <button class="icon-btn-small" onclick="playAudio('${word.word}')">🔊</button>
                        </div>
                    `;
                    galleryGrid.appendChild(wordEl);
                });
            }
        }
    }
});

// ============================================
// User Display
// ============================================

function updateUserDisplay() {
    // Update welcome message if on dashboard
    const welcomeEl = document.querySelector('.welcome-text h1');
    if (welcomeEl && isLoggedIn) {
        welcomeEl.textContent = `Welcome back, ${userData.name}! 👋`;
    }
    
    // Update progress values
    const dailyGoalEl = document.querySelector('.progress-card:first-child .progress-value .value');
    if (dailyGoalEl) {
        dailyGoalEl.textContent = userData.wordsToday;
    }
    
    const streakEl = document.querySelector('.progress-card:nth-child(2) .progress-value .value');
    if (streakEl) {
        streakEl.textContent = userData.currentStreak;
    }
    
    const masteredEl = document.querySelector('.progress-card:nth-child(3) .progress-value .value');
    if (masteredEl) {
        masteredEl.textContent = userData.wordsMastered;
    }
}

// ============================================
// Profile Menu
// ============================================

function toggleProfileMenu() {
    // In a real app, this would show a dropdown menu
    if (isLoggedIn) {
        navigateTo('profile');
    } else {
        navigateTo('login');
    }
}

// ============================================
// Utility Functions
// ============================================

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (placeholder)
function handleSearch(query) {
    console.log('Searching for:', query);
    // In a real app, this would search the vocabulary database
}

// Export functions for global use
window.navigateTo = navigateTo;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleSocialLogin = handleSocialLogin;
window.flipCard = flipCard;
window.rateCard = rateCard;
window.prevCard = prevCard;
window.nextCard = nextCard;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.toggleFavorite = toggleFavorite;
window.playAudio = playAudio;
window.toggleProfileMenu = toggleProfileMenu;
window.scrollToSection = scrollToSection;
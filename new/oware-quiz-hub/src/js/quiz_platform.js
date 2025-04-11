/**
 * Oware Quiz Hub JavaScript
 * Handles all interactive functionality for the quiz platform
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize platform components
    initializeThemeToggle();
    initializeSidebar();
    initializeUserMenu();
    loadUserData();

    // Show the initial section based on URL hash or default to dashboard
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    showSection(initialSection);

    // Handle navigation click events
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Initialize create quiz functionality
    if (document.getElementById('generate-questions-btn')) {
        document.getElementById('generate-questions-btn').addEventListener('click', generateQuestionFields);
    }

    // Initialize code entry
    if (document.getElementById('join-quiz-btn')) {
        document.getElementById('join-quiz-btn').addEventListener('click', joinQuiz);
    }
});

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check if theme is stored in localStorage or use system preference
    const currentTheme = localStorage.getItem('theme') ||
                        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply theme
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.body.removeAttribute('data-theme');
        updateThemeIcon('light');
    }

    // Add click event listener to toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';

            if (isDarkTheme) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon('light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon('dark');
            }
        });
    }
}

/**
 * Update theme toggle icon based on current theme
 * @param {string} theme - 'light' or 'dark'
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar on content click (mobile)
    document.querySelector('.main-content')?.addEventListener('click', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
}

/**
 * Initialize user menu
 */
function initializeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userMenu && userDropdown) {
        // Show dropdown on hover
        userMenu.addEventListener('mouseenter', () => {
            userDropdown.style.opacity = '1';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.transform = 'translateY(0)';
        });

        userMenu.addEventListener('mouseleave', () => {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
            userDropdown.style.transform = 'translateY(10px)';
        });
    }
}

/**
 * Show the specified section and hide others
 * @param {string} sectionId - ID of the section to show
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';

        // Update active class in sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update URL hash
        window.location.hash = sectionId;

        // Handle section-specific initialization
        if (sectionId === 'leaderboard') {
            loadLeaderboardData();
        }
    }
}

/**
 * Load user data from localStorage and update UI
 */
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // Update user name in header
        const userNameElem = document.getElementById('user-name');
        if (userNameElem) {
            userNameElem.textContent = userData.name;
        }

        // Update avatar initials
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials) {
            avatarInitials.textContent = getInitials(userData.name);
        }

        // Update role badge
        const userRoleElem = document.getElementById('user-role');
        if (userRoleElem) {
            userRoleElem.textContent = userData.role || 'Student';
            userRoleElem.className = `role-badge ${userData.role?.toLowerCase() || 'student'}`;
        }

        // Update profile information
        updateProfileInfo(userData);

        // Update dashboard stats
        updateDashboardStats(userData);
    } else {
        // Create demo user data if not found
        createDemoUserData();
    }
}

/**
 * Update profile information with user data
 * @param {Object} userData - User data object
 */
function updateProfileInfo(userData) {
    // Profile page elements
    const profileNameElem = document.getElementById('profile-name');
    const profileEmailElem = document.getElementById('profile-email');
    const profileUsernameElem = document.getElementById('profile-username');
    const profileDeptElem = document.getElementById('profile-department');
    const profileRoleElem = document.getElementById('profile-role');
    const profileJoinDateElem = document.getElementById('profile-join-date');
    const profileAvatarInitials = document.getElementById('profile-avatar-initials');

    // Profile stats elements
    const profileQuizzesTaken = document.getElementById('profile-quizzes-taken');
    const profileAvgScore = document.getElementById('profile-avg-score');
    const profileTotalPoints = document.getElementById('profile-total-points');

    // Update profile information if elements exist
    if (profileNameElem) profileNameElem.textContent = userData.name || 'Name';
    if (profileEmailElem) profileEmailElem.textContent = userData.email || 'Email';
    if (profileUsernameElem) profileUsernameElem.textContent = userData.username || 'Username';
    if (profileDeptElem) profileDeptElem.textContent = userData.department || 'Department';
    if (profileRoleElem) profileRoleElem.textContent = userData.role || 'Student';
    if (profileJoinDateElem) profileJoinDateElem.textContent = userData.joinDate || new Date().toLocaleDateString();
    if (profileAvatarInitials) profileAvatarInitials.textContent = getInitials(userData.name);

    // Update profile stats if they exist
    if (userData.stats) {
        if (profileQuizzesTaken) profileQuizzesTaken.textContent = userData.stats.quizzesTaken || '0';
        if (profileAvgScore) profileAvgScore.textContent = userData.stats.averageScore ? `${userData.stats.averageScore}%` : '0%';
        if (profileTotalPoints) profileTotalPoints.textContent = userData.stats.totalPoints || '0';
    }

    // Initialize edit profile form
    initializeEditProfileForm();
}

/**
 * Update dashboard stats with user data
 * @param {Object} userData - User data object
 */
function updateDashboardStats(userData) {
    const quizzesTakenElem = document.getElementById('quizzes-taken');
    const avgScoreElem = document.getElementById('avg-score');
    const totalPointsElem = document.getElementById('total-points');
    const quizzesCreatedElem = document.getElementById('quizzes-created');

    if (userData.stats) {
        if (quizzesTakenElem) quizzesTakenElem.textContent = userData.stats.quizzesTaken || '0';
        if (avgScoreElem) avgScoreElem.textContent = userData.stats.averageScore ? `${userData.stats.averageScore}%` : '0%';
        if (totalPointsElem) totalPointsElem.textContent = userData.stats.totalPoints || '0';
    }

    // Get number of quizzes created (from localStorage)
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const userQuizzes = quizzes.filter(quiz => quiz.createdBy === userData.username);

    if (quizzesCreatedElem) quizzesCreatedElem.textContent = userQuizzes.length;
}

/**
 * Initialize edit profile form functionality
 */
function initializeEditProfileForm() {
    const editBtn = document.getElementById('edit-profile-btn');
    const editForm = document.getElementById('edit-profile-form');

    if (editBtn && editForm) {
        editBtn.addEventListener('click', toggleEditForm);
    }
}

/**
 * Toggle edit profile form visibility
 */
function toggleEditForm() {
    const form = document.getElementById('edit-profile-form');
    const isVisible = form.style.display === 'block';

    if (!isVisible) {
        // Load current user data into form
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
            document.getElementById('edit-name').value = userData.name || '';
            document.getElementById('edit-email').value = userData.email || '';
            document.getElementById('edit-username').value = userData.username || '';
            document.getElementById('edit-department').value = userData.department || 'Computer Science';
        }

        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

/**
 * Handle profile update
 * @param {Event} event - Form submission event
 * @returns {boolean} - Always returns false to prevent form submission
 */
function updateProfile(event) {
    event.preventDefault();

    // Get existing user data
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Update with form values
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const username = document.getElementById('edit-username').value;
    const department = document.getElementById('edit-department').value;

    // Create updated user data
    const updatedData = {
        ...userData,
        name,
        email,
        username,
        department
    };

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedData));

    // Update UI
    loadUserData();

    // Hide form
    toggleEditForm();

    // Show success message
    showNotification('Profile updated successfully!', 'success');

    return false;
}

/**
 * Create demo user data if none exists
 */
function createDemoUserData() {
    const demoUser = {
        name: 'Demo User',
        email: 'demo@owarequizhub.com',
        username: 'demouser',
        role: 'Student/Teacher',
        department: 'demo',
        joinDate: new Date().toLocaleDateString(),
        stats: {
            quizzesTaken: 0,
            averageScore: 0,
            totalPoints: 0
        }
    };

    localStorage.setItem('userData', JSON.stringify(demoUser));
    loadUserData();
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
function getInitials(name) {
    if (!name) return 'U';

    const names = name.split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate question fields based on user input
 */
function generateQuestionFields() {
    const mcQuestions = parseInt(document.getElementById('num-mc-questions').value) || 0;
    const theoryQuestions = parseInt(document.getElementById('num-theory-questions').value) || 0;

    if (mcQuestions === 0 && theoryQuestions === 0) {
        showNotification('Please enter at least one question.', 'error');
        return;
    }

    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    // Generate multiple choice questions
    for (let i = 1; i <= mcQuestions; i++) {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <h3>Multiple Choice Question ${i}</h3>
            <div class="form-group">
                <label for="mc-q${i}">Question:</label>
                <input type="text" id="mc-q${i}" name="mc-q${i}" required placeholder="Enter your question">
            </div>
            <div class="form-group">
                <label>Options:</label>
                <div class="option-group">
                    <input type="text" name="mc-q${i}-opt1" placeholder="Option A" required>
                    <input type="text" name="mc-q${i}-opt2" placeholder="Option B" required>
                    <input type="text" name="mc-q${i}-opt3" placeholder="Option C" required>
                    <input type="text" name="mc-q${i}-opt4" placeholder="Option D" required>
                </div>
            </div>
            <div class="form-group">
                <label for="mc-q${i}-correct">Correct Answer:</label>
                <select id="mc-q${i}-correct" name="mc-q${i}-correct" required>
                    <option value="" selected disabled>Select the correct option</option>
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                </select>
            </div>
        `;
        container.appendChild(questionCard);
    }

    // Generate theory questions
    for (let i = 1; i <= theoryQuestions; i++) {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <h3>Theory Question ${i}</h3>
            <div class="form-group">
                <label for="theory-q${i}">Question:</label>
                <input type="text" id="theory-q${i}" name="theory-q${i}" required placeholder="Enter your question">
            </div>
            <div class="form-group">
                <label for="theory-q${i}-ans">Model Answer (Optional):</label>
                <textarea id="theory-q${i}-ans" name="theory-q${i}-ans" rows="4" placeholder="Enter a model answer to guide grading"></textarea>
            </div>
        `;
        container.appendChild(questionCard);
    }

    // Show save button
    document.getElementById('quiz-actions').style.display = 'block';

    // Add event listener to save button
    document.getElementById('save-quiz-btn').addEventListener('click', saveQuiz);
}

/**
 * Save the created quiz
 */
function saveQuiz() {
    // Get quiz title and description
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;
    const timeLimit = document.getElementById('quiz-time').value;

    if (!title) {
        showNotification('Please enter a quiz title.', 'error');
        return;
    }

    // Generate unique code
    const code = generateQuizCode();

    // Create quiz object
    const quiz = {
        code,
        title,
        description,
        timeLimit,
        createdAt: new Date().toISOString(),
        createdBy: JSON.parse(localStorage.getItem('userData'))?.username || 'Anonymous',
        questions: {
            multipleChoice: collectMultipleChoiceQuestions(),
            theory: collectTheoryQuestions()
        }
    };

    // Save to localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    // Show success message and quiz code
    document.getElementById('quiz-code').textContent = code;
    document.getElementById('quiz-code-container').style.display = 'block';

    // Add copy button functionality
    document.getElementById('copy-code-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        });
    });

    showNotification('Quiz created successfully!', 'success');
}

/**
 * Collect multiple choice questions data
 * @returns {Array} - Array of multiple choice question objects
 */
function collectMultipleChoiceQuestions() {
    const mcQuestions = [];
    const count = parseInt(document.getElementById('num-mc-questions').value) || 0;

    for (let i = 1; i <= count; i++) {
        const question = document.getElementById(`mc-q${i}`).value;
        const options = [
            document.querySelector(`input[name="mc-q${i}-opt1"]`).value,
            document.querySelector(`input[name="mc-q${i}-opt2"]`).value,
            document.querySelector(`input[name="mc-q${i}-opt3"]`).value,
            document.querySelector(`input[name="mc-q${i}-opt4"]`).value
        ];
        const correctAnswer = document.getElementById(`mc-q${i}-correct`).value;

        mcQuestions.push({
            question,
            options,
            correctAnswer: parseInt(correctAnswer)
        });
    }

    return mcQuestions;
}

/**
 * Collect theory questions data
 * @returns {Array} - Array of theory question objects
 */
function collectTheoryQuestions() {
    const theoryQuestions = [];
    const count = parseInt(document.getElementById('num-theory-questions').value) || 0;

    for (let i = 1; i <= count; i++) {
        const question = document.getElementById(`theory-q${i}`).value;
        const modelAnswer = document.getElementById(`theory-q${i}-ans`).value;

        theoryQuestions.push({
            question,
            modelAnswer
        });
    }

    return theoryQuestions;
}

/**
 * Generate a unique quiz code
 * @returns {string} - 6-character alpha-numeric code
 */
function generateQuizCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

/**
 * Join a quiz with the entered code
 */
function joinQuiz() {
    const codeInput = document.getElementById('quiz-code-input');
    const code = codeInput.value.trim().toUpperCase();
    const codeStatus = document.getElementById('code-status');

    if (!code) {
        codeStatus.textContent = 'Please enter a code';
        codeStatus.className = 'code-status error';
        return;
    }

    if (code.length !== 6) {
        codeStatus.textContent = 'Code should be 6 characters';
        codeStatus.className = 'code-status error';
        return;
    }

    // Check if code exists in stored quizzes
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const quiz = quizzes.find(q => q.code === code);

    if (quiz) {
        codeStatus.textContent = 'Valid code! Redirecting to quiz...';
        codeStatus.className = 'code-status success';

        // Save code to recent codes
        saveRecentCode(code);

        // Redirect to quiz page (would be implemented in a real app)
        setTimeout(() => {
            window.location.href = `quizpage.html?code=${code}`;
        }, 1500);
    } else {
        // For demo purposes, accept any valid 6-char code
        codeStatus.textContent = 'Demo mode: All codes accepted';
        codeStatus.className = 'code-status success';

        // Save code to recent codes
        saveRecentCode(code);

        // Redirect to demo quiz
        setTimeout(() => {
            window.location.href = `quizpage.html?code=${code}`;
        }, 1500);
    }
}

/**
 * Save a code to recent codes list
 * @param {string} code - Quiz code
 */
function saveRecentCode(code) {
    let recentCodes = JSON.parse(localStorage.getItem('recentCodes') || '[]');

    // Add code if it doesn't already exist
    if (!recentCodes.includes(code)) {
        recentCodes.unshift(code);
    }

    // Keep only the most recent 5 codes
    recentCodes = recentCodes.slice(0, 5);

    localStorage.setItem('recentCodes', JSON.stringify(recentCodes));

    // Update recent codes list
    updateRecentCodesList();
}

/**
 * Update the recent codes list in the UI
 */
function updateRecentCodesList() {
    const recentCodesList = document.getElementById('recent-codes-list');
    if (!recentCodesList) return;

    const recentCodes = JSON.parse(localStorage.getItem('recentCodes') || '[]');

    if (recentCodes.length === 0) {
        recentCodesList.innerHTML = `
            <div class="empty-state">
                <p>No recent codes. Enter a code to join a quiz.</p>
            </div>
        `;
        return;
    }

    // Create list of recent codes
    recentCodesList.innerHTML = '';
    recentCodes.forEach(code => {
        const codeItem = document.createElement('div');
        codeItem.className = 'code-item';
        codeItem.innerHTML = `
            <span>${code}</span>
            <button class="btn-icon use-code" data-code="${code}" title="Use this code">
                <i class="fas fa-arrow-right"></i>
            </button>
        `;
        recentCodesList.appendChild(codeItem);
    });

    // Add event listeners to use code buttons
    document.querySelectorAll('.use-code').forEach(button => {
        button.addEventListener('click', () => {
            const code = button.dataset.code;
            document.getElementById('quiz-code-input').value = code;
        });
    });
}

/**
 * Load leaderboard data
 */
function loadLeaderboardData() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;

    // Get leaderboard data from localStorage
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    if (leaderboard.length === 0) {
        // Create sample data for demo
        createSampleLeaderboardData();
        return loadLeaderboardData(); // reload with sample data
    }

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    // Clear existing rows
    leaderboardBody.innerHTML = '';

    // Add leaderboard entries
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');

        // Format date
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString();

        row.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${entry.name}</td>
            <td>${entry.quizzes || 1}</td>
            <td>${entry.score}%</td>
            <td>${entry.points || entry.score * 10}</td>
        `;

        leaderboardBody.appendChild(row);
    });
}

/**
 * Create sample leaderboard data for demo purposes
 */
function createSampleLeaderboardData() {
    const sampleData = [
        { name: 'John Doe', score: 95, quizzes: 7, points: 950, date: new Date().toISOString() },
        { name: 'Jane Smith', score: 87, quizzes: 5, points: 870, date: new Date().toISOString() },
        { name: 'Alice Johnson', score: 82, quizzes: 4, points: 820, date: new Date().toISOString() },
        { name: 'Bob Williams', score: 78, quizzes: 3, points: 780, date: new Date().toISOString() },
        { name: 'Demo User', score: 75, quizzes: 3, points: 750, date: new Date().toISOString() }
    ];

    localStorage.setItem('leaderboard', JSON.stringify(sampleData));
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '6px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';

    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color)';
    } else {
        notification.style.backgroundColor = 'var(--danger-color)';
    }

    // Animation in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

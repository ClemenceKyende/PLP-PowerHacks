document.addEventListener('DOMContentLoaded', () => {
    // Existing functionality for authentication and content loading
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logoutButton');
    const courseList = document.getElementById('course-list');
    const quizList = document.getElementById('quiz-list');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = userInput.value;
            addMessage('You', message);
            userInput.value = '';
            await sendMessageToServer(message);
        });
    }

    checkAuthStatus();
});

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const courseList = document.getElementById('course-list');
    const quizList = document.getElementById('quiz-list');
    const loginPromptCourses = document.getElementById('login-prompt');
    const loginPromptQuizzes = document.getElementById('login-prompt');

    if (!token) {
        if (courseList) courseList.classList.add('hidden');
        if (quizList) quizList.classList.add('hidden');
        if (loginPromptCourses) loginPromptCourses.classList.remove('hidden');
        if (loginPromptQuizzes) loginPromptQuizzes.classList.remove('hidden');
    } else {
        if (courseList) courseList.classList.remove('hidden');
        if (quizList) quizList.classList.remove('hidden');
        if (loginPromptCourses) loginPromptCourses.classList.add('hidden');
        if (loginPromptQuizzes) loginPromptQuizzes.classList.add('hidden');
    }

    if (courseList) loadCourses();
    if (quizList) loadQuizzes();
}

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        showError('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            showError(data.error || 'Registration failed.');
        }
    } catch (error) {
        showError('An error occurred during registration.');
    }
}

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            showError(data.error || 'Login failed.');
        }
    } catch (error) {
        showError('An error occurred during login.');
    }
}

// Function to handle user logout
async function logoutUser() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        } else {
            showError('Logout failed.');
        }
    } catch (error) {
        showError('An error occurred during logout.');
    }
}

// Function to display error messages
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        const messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            messagesDiv.appendChild(errorDiv);
        } else {
            console.error(message);
        }
    }
}

// Fetch and display courses
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        const courseList = document.getElementById('course-list');

        if (courseList) {
            courseList.innerHTML = ''; // Clear existing content
            courses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.className = 'course-item';
                courseItem.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <a href="course.html?id=${course._id}" class="btn">View Details</a>
                `;
                courseList.appendChild(courseItem);
            });
        }
    } catch (error) {
        showError('An error occurred while fetching courses.');
    }
}

// Fetch and display quizzes
async function loadQuizzes() {
    try {
        const response = await fetch('/api/quizzes');
        const quizzes = await response.json();
        const quizList = document.getElementById('quiz-list');

        if (quizList) {
            quizList.innerHTML = ''; // Clear existing content
            quizzes.forEach(quiz => {
                const quizItem = document.createElement('div');
                quizItem.className = 'quiz-item';
                quizItem.innerHTML = `
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <a href="quiz.html?id=${quiz._id}" class="btn">Take Quiz</a>
                `;
                quizList.appendChild(quizItem);
            });
        }
    } catch (error) {
        showError('An error occurred while fetching quizzes.');
    }
}
// Function to add messages to the chat box
function addMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
}

// Function to handle sending a message
async function sendMessageToServer(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Failed to get a response from the bot.');
        }

        const data = await response.json();
        addMessage('Bot', data.reply);
    } catch (error) {
        showError('An error occurred while sending the message.');
    }
}
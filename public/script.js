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
        console.error(message);
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

// Function to handle sending a message
async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const messagesDiv = document.getElementById('messages');

    if (!userInput.trim()) {
        return; // Do nothing if the input is empty
    }

    // Display the user's message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = `You: ${userInput}`;
    messagesDiv.appendChild(userMessageDiv);

    // Clear the input field
    document.getElementById('userInput').value = '';

    // Send the message to the server
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();

        if (response.ok) {
            // Display the chatbot's response
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot-message';
            botMessageDiv.textContent = `Bot: ${data.reply}`;
            messagesDiv.appendChild(botMessageDiv);
        } else {
            // Handle errors
            showError('Failed to get a response from the bot.');
        }
    } catch (error) {
        showError('An error occurred while sending the message.');
    }
}

// Function to display error messages
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    document.getElementById('messages').appendChild(errorContainer);
}
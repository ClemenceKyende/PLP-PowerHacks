document.addEventListener('DOMContentLoaded', () => {
    // Existing functionality for authentication and content loading
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logoutButton');
    const courseList = document.getElementById('course-list');
    const quizList = document.getElementById('quiz-list');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('userInput');  // Updated to match ID in HTML
    const chatBox = document.getElementById('messages');  // Updated to match ID in HTML

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
            if (message.trim()) {
                addMessage('You', message);
                userInput.value = '';
                await sendMessageToServer(message);
            }
        });
    }

    // Check authentication status and load courses and quizzes
    checkAuthStatus();
});

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const courseList = document.getElementById('course-list');
    const quizList = document.getElementById('quiz-list');
    const loginPromptCourses = document.getElementById('login-prompt-courses');
    const loginPromptQuizzes = document.getElementById('login-prompt-quizzes');

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

        if (courseList) loadCourses();
        if (quizList) loadQuizzes();
    }
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

// Fetch and display specific course details
async function loadCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');

    if (!courseId) {
        showError('Course ID is missing.');
        return;
    }

    try {
        const response = await fetch(`/api/courses/${courseId}`);
        const course = await response.json();
        const courseDetails = document.getElementById('course-details');

        if (courseDetails) {
            courseDetails.innerHTML = `
                <h2>${course.title}</h2>
                <p>Description: ${course.description}</p>
                <div id="course-content">
                    ${course.lessons.map(lesson => `
                        <div class="lesson">
                            <h4>${lesson.title}</h4>
                            <p>${lesson.content}</p>
                            ${lesson.resources.map(resource => `<a href="${resource}" target="_blank">Resource</a>`).join('<br>')}
                        </div>
                    `).join('<hr>')}
                </div>
                <button onclick="startCourse()">Start Course</button>
            `;
        }
    } catch (error) {
        showError('An error occurred while fetching course details.');
    }
}

// Fetch and display specific quiz details
async function loadQuizDetails() {
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    if (!quizId) {
        showError('Quiz ID is missing.');
        return;
    }

    try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        const quiz = await response.json();
        const quizDetails = document.getElementById('quiz-details');

        if (quizDetails) {
            quizDetails.innerHTML = `
                <h2>${quiz.title}</h2>
                <p>Description: ${quiz.description}</p>
                ${quiz.questions.map(question => `
                    <div class="question">
                        <h4>${question.question}</h4>
                        <ul>
                            ${question.options.map(option => `<li>${option}</li>`).join('')}
                        </ul>
                    </div>
                `).join('<hr>')}
            `;
        }
    } catch (error) {
        showError('An error occurred while fetching quiz details.');
    }
}

// Function to add messages to the chat box
function addMessage(sender, message) {
    const chatBox = document.getElementById('messages');
    if (chatBox) {
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'message user-message' : 'message bot-message';
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    } else {
        console.error('Chat box element not found.');
    }
}

// Function to send a message
async function sendMessage() {
    const userInput = document.getElementById('userInput'); // Updated to match ID in HTML
    const message = userInput.value.trim();

    if (!message) {
        showError('Please enter a message.');
        return;
    }

    addMessage('user', message);
    userInput.value = ''; // Clear the input field

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || 'Failed to send message.');
            return;
        }

        const data = await response.json();

        if (data.reply) {
            addMessage('bot', data.reply); // Assuming the response has a `reply` field
        } else {
            showError('No reply field in the response.');
        }
    } catch (error) {
        showError('An error occurred while sending the message.');
        console.error('Error sending message:', error);
    }
}

// Function to display error messages
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        console.error('Error container not found:', message);
    }
}

// Add event listener to handle dynamic content loading
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('course-details')) {
        loadCourseDetails();
    }

    if (document.getElementById('quiz-details')) {
        loadQuizDetails();
    }
});

// Define the startCourse function
function startCourse() {
    // Example functionality: redirect to the first lesson of the course
    const courseId = getCourseIdFromURL();
    if (courseId) {
        window.location.href = `/lessons.html?courseId=${courseId}`;
    } else {
        alert('Course ID not found.');
    }
}

// Utility function to get course ID from URL parameters
function getCourseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Assumes the ID is passed in the URL as 'id'
}

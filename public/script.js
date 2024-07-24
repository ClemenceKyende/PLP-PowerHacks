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

    // Profile Page
    const profileSection = document.getElementById('profile-info');
    const loginPromptLinkProfile = document.getElementById('loginPromptLinkProfile');
    
    if (!token) {
        if (profileSection) profileSection.classList.add('hidden');
        if (loginPromptLinkProfile) loginPromptLinkProfile.classList.remove('hidden');
    } else {
        if (profileSection) profileSection.classList.remove('hidden');
        if (loginPromptLinkProfile) loginPromptLinkProfile.classList.add('hidden');
        loadProfile(); // Function to load user profile
    }

    // Courses and Quizzes Pages
    const courseList = document.getElementById('course-list');
    const quizList = document.getElementById('quiz-list');
    const loginPromptLinkCourses = document.getElementById('loginPromptLinkCourses');
    const loginPromptLinkQuizzes = document.getElementById('loginPromptLinkQuizzes');

    if (!token) {
        if (courseList) courseList.classList.add('hidden');
        if (quizList) quizList.classList.add('hidden');
        if (loginPromptLinkCourses) loginPromptLinkCourses.classList.remove('hidden');
        if (loginPromptLinkQuizzes) loginPromptLinkQuizzes.classList.remove('hidden');
    } else {
        if (courseList) courseList.classList.remove('hidden');
        if (quizList) quizList.classList.remove('hidden');
        if (loginPromptLinkCourses) loginPromptLinkCourses.classList.add('hidden');
        if (loginPromptLinkQuizzes) loginPromptLinkQuizzes.classList.add('hidden');
        
        if (courseList) loadCourses(); // Function to load courses
        if (quizList) loadQuizzes();   // Function to load quizzes
    }

    // Chat Page
    const chatBox = document.getElementById('chatbox');
    const loginPromptLinkChat = document.getElementById('loginPromptLinkChat');

    if (!token) {
        if (chatBox) chatBox.classList.add('hidden');
        if (loginPromptLinkChat) loginPromptLinkChat.classList.remove('hidden');
    } else {
        if (chatBox) chatBox.classList.remove('hidden');
        if (loginPromptLinkChat) loginPromptLinkChat.classList.add('hidden');
    }
}

// Ensure DOM is fully loaded before running checkAuthStatus
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// Show error message
function showError(message) {
    alert(message);
}

// Toggle edit profile form visibility
function toggleEditProfile() {
    const form = document.getElementById('edit-profile-form');
    if (form) {
        form.classList.toggle('hidden');
    } else {
        console.error('Edit profile form not found.');
    }
}

// Toggle change profile picture form visibility
function toggleChangePicture() {
    const form = document.getElementById('change-pic-form');
    if (form) {
        form.classList.toggle('hidden');
    } else {
        console.error('Change profile picture form not found.');
    }
}

async function loadProfile() {
    try {
        const response = await fetch('/api/users/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || 'Failed to load profile.');
            return;
        }

        const profile = await response.json();
        console.log('Profile data:', profile);

        // Check if elements are available before setting their content
        const usernameElem = document.getElementById('username');
        const emailElem = document.getElementById('email');
        const profilePicElem = document.getElementById('profilePic');
        const profileInfoSection = document.getElementById('profile-info');
        const loginPromptLink = document.getElementById('loginPromptLinkProfile');

        if (usernameElem && emailElem && profilePicElem && profileInfoSection) {
            usernameElem.textContent = profile.username || 'No username';
            emailElem.textContent = profile.email || 'No email';
            profilePicElem.src = profile.profilePic || ''; // Set to empty if no picture
            
            // Show the profile info section
            profileInfoSection.classList.remove('hidden');
            profilePicElem.classList.remove('hidden');

            // Hide the login prompt if the user is authenticated
            if (loginPromptLink) {
                loginPromptLink.classList.add('hidden');
            }
        } else {
            console.error('One or more profile elements are missing.');
            showError('Failed to load profile elements.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showError('An error occurred while fetching profile data.');
    }
}

// Call the loadProfile function on page load
document.addEventListener('DOMContentLoaded', loadProfile);


document.addEventListener('DOMContentLoaded', () => {
    const progressCircle = document.querySelector('.progress-circle');
    const progress = progressCircle.getAttribute('data-progress');
    
    // Update progress bar based on data-progress attribute
    progressCircle.style.setProperty('--progress', `${progress}%`);
});

// Update profile picture function
async function updateProfilePic() {
    const form = document.getElementById('changePicForm');
    if (!form) {
        console.error('Change profile picture form not found.');
        return;
    }
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/users/updateProfilePic', {  // Ensure this endpoint is correct
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            showError(errorData.error || 'Failed to update profile picture.');
            return;
        }

        const data = await response.json();
        console.log('Updated profile data:', data);

        // Update profile picture on the page
        document.getElementById('profilePic').src = data.profilePic || 'default-profile-pic.jpg';
    } catch (error) {
        console.error('Upload error:', error);
        showError('An error occurred while updating profile picture.');
    }
}

// Update profile function
async function updateProfile() {
    const form = document.getElementById('editProfileForm');
    if (!form) {
        console.error('Edit profile form not found.');
        return;
    }
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/users/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.get('newUsername'),
                email: formData.get('newEmail')
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            showError(errorData.error || 'Failed to update profile.');
            return;
        }

        const data = await response.json();
        console.log('Updated profile data:', data);

        // Reload profile data
        await loadProfile();
    } catch (error) {
        console.error('Update error:', error);
        showError('An error occurred while updating profile.');
    }
}

// Initialize profile page
window.onload = async function () {
    await checkAuthStatus();
    await loadProfile();
};

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

// Function to load quiz details when the page loads
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

        const quizTitle = document.getElementById('quiz-title');
        const quizDescription = document.getElementById('quiz-description');

        if (quizTitle && quizDescription) {
            quizTitle.textContent = quiz.title;
            quizDescription.textContent = quiz.description;
        } else {
            showError('Quiz title or description element not found.');
        }
    } catch (error) {
        showError('An error occurred while fetching quiz details.');
    }
}

// Function to start the quiz and display questions
async function startQuiz() {
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    if (!quizId) {
        showError('Quiz ID is missing.');
        return;
    }

    try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        const quiz = await response.json();

        const quizContainer = document.getElementById('quiz-container');
        const quizQuestions = document.getElementById('quiz-questions');

        if (quizContainer && quizQuestions) {
            quizQuestions.innerHTML = `
                ${quiz.questions.map((question, index) => `
                    <div class="question">
                        <h4>Question ${index + 1}</h4>
                        <p>${question.question}</p>
                        <input type="text" name="answer-${index}" class="quiz-answer">
                    </div>
                `).join('')}
            `;

            // Hide start button and show quiz container
            document.getElementById('quiz-details').classList.add('hidden');
            quizContainer.classList.remove('hidden');
        } else {
            showError('Quiz container or questions element not found.');
        }
    } catch (error) {
        showError('An error occurred while fetching quiz questions.');
    }
}

// Function to submit quiz answers
async function submitQuiz(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    const answers = Array.from(document.getElementsByClassName('quiz-answer')).map(input => input.value);

    try {
        const response = await fetch(`/api/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ answers })
        });

        const result = await response.json();

        if (response.ok) {
            // Create a results summary
            const resultsSummary = `
                <h2>Quiz Results</h2>
                <p>Your score: ${result.score}</p>
                <p>Total questions: ${result.totalQuestions}</p>
                <p>Correct answers: ${result.correctAnswers}</p>
                <p>Incorrect answers: ${result.incorrectAnswers}</p>
                <a href="quizzes.html" class="btn">Back to Quizzes</a>
            `;

            // Hide quiz container and show results summary
            document.getElementById('quiz-container').classList.add('hidden');
            document.getElementById('results-summary').innerHTML = resultsSummary;
            document.getElementById('results-summary').classList.remove('hidden');
        } else {
            showError(result.error || 'Failed to submit quiz.');
        }
    } catch (error) {
        showError('An error occurred during quiz submission.');
    }
}

// Load quiz details when the page loads
window.onload = loadQuizDetails;

// Call the appropriate functions based on the page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('course.html')) {
        loadCourseDetails();
    } else if (window.location.pathname.includes('quiz.html')) {
        loadQuizDetails();
    }
});

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
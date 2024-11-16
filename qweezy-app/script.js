const landingPage = document.querySelector(".landing-page");
const avatarSelectionPage = document.querySelector(".avatar-selection");
const categoryOptionsPage = document.querySelector(".category-options");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");

let currentQuestionIndex = 0;
let questions = [];
let playerName = "";
let playerAvatar = "";
let score = 0; // Variabel untuk menghitung skor

// Function to show the landing page
function showLandingPage() {
    landingPage.style.display = "";
    avatarSelectionPage.style.display = "none";
    categoryOptionsPage.style.display = "none";
    quizSection.style.display = "none";
    document.getElementById("player-name").value = "";
}

// Function to show avatar selection
function showAvatarSelection() {
    playerName = document.getElementById("player-name").value;
    if (playerName) {
        landingPage.style.display = "none";
        avatarSelectionPage.style.display = "";
    } else {
        alert("Please enter your name.");
    }
}

// Function to select an avatar
function selectAvatar(avatar) {
    playerAvatar = avatar;
    avatarSelectionPage.style.display = "none";
    categoryOptionsPage.style.display = "";
}

// Function to show the quiz
function showQuiz(category) {
    categoryOptionsPage.style.display = "none";
    quizSection.style.display = "";
    displayPlayerInfo();
    getQuestions(category);
}

// Function to display player info
function displayPlayerInfo() {
    const playerInfo = document.querySelector(".player-info");
    playerInfo.innerHTML = `
        <img src="images/${playerAvatar}" alt="Player Avatar">
        <p>${playerName}</p>
    `;
}

// Function to fetch questions
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=10&type=multiple&category=${category}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            questions = data.results;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Function to display the current question
function displayQuestion() {
    optionsContainer.style.display = '';
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.question) {
        questionElement.textContent = currentQuestion.question;
        optionsContainer.innerHTML = "";
        const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(options).forEach((option) => {
            addOption(option, option === currentQuestion.correct_answer);
        });
    } else {
        console.error("Invalid question format:", currentQuestion);
    }
}

// Function to shuffle the array (for randomizing the answer options)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to add option buttons to the options container
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionElement);
}

// Function to handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    if (isCorrect) {
        score++; // Tambah skor jika jawaban benar
        questionElement.textContent = "Correct!";
    } else {
        questionElement.textContent = "Incorrect!";
    }

    optionsContainer.style.display = 'none';
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        displayQuestion();
    } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        displayScore(); // Tampilkan skor setelah 10 pertanyaan
    }
}

// Function to display final score
function displayScore() {
    quizSection.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>${playerName}, your score is ${score} out of ${questions.length}.</p>
        <button onclick="showLandingPage()">Restart Game</button>
    `;
}
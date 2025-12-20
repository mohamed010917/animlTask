if (!localStorage.getItem("student") || localStorage.getItem("student") === 'null') {
    location.href = "index.html";
}

let QuestionNumber = document.querySelector("h2");
let QuestionText = document.querySelector("h1");
let ButtonChoice1 = document.querySelectorAll("button")[0];
let ButtonChoice2 = document.querySelectorAll("button")[1];
let ButtonChoice3 = document.querySelectorAll("button")[2];
let ButtonChoice4 = document.querySelectorAll("button")[3];
let ButtonNext = document.querySelectorAll("button")[4];
let ButtonSubmit = document.querySelectorAll("button")[5];
let ImgOfQuestion = document.querySelector("img");

let Btns = [ButtonChoice1, ButtonChoice2, ButtonChoice3, ButtonChoice4];

const UrlPage = new URLSearchParams(window.location.search);
const idExam = UrlPage.get("id");
const idStudent = UrlPage.get("studentId");
const examStudent = UrlPage.get("examStudent");
console.log(examStudent)

let currentExam;
let currentIndex = 0;
let score = 0;
let questions = [];
let answers = {};
let flag = true;

if (!idExam) {
    window.location.href = "studentProfile.html";
}

async function getExam(Id) {
    try {
        let responseExam = await fetch(`http://localhost:3000/exams/${Id}`);
        if (responseExam.ok) {
            currentExam = await responseExam.json();
            document.getElementById("timer").innerText = `${currentExam.duration}:00`;
            startTimer(currentExam.duration);
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadQuestionsOfExam() {
    try {
        const response1 = await fetch(`http://localhost:3000/questions?examId=${idExam}`);
        if (!response1.ok) throw new Error();
        questions = await response1.json();
        if (questions.length === 0) return;
        let newArrayOfQuestions = randomQuestions(questions);
        displayQuestions(newArrayOfQuestions);
    } catch (e) {
        console.log(e);
    }
}

function randomQuestions(array) {
    let newArray = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function displayQuestions(array) {
    let currentQuestion = array[currentIndex];
    QuestionText.innerText = `${currentIndex + 1}. ${currentQuestion.text}`;
    ImgOfQuestion.src = currentQuestion.imgUrl || "";

    if (currentIndex === array.length - 1) {
        ButtonNext.classList.add("hidden");
        ButtonSubmit.classList.remove("hidden");
    } else {
        ButtonNext.classList.remove("hidden");
        ButtonSubmit.classList.add("hidden");
    }

    let AnswersOfQuestion = randomAnswers(currentQuestion);

    Btns.forEach((Btn, index) => {
        Btn.disabled = false;
        Btn.style.background = "";
        Btn.innerText = AnswersOfQuestion[index].text;
        Btn.onclick = function () {
            let rightAnswer = checkAnswer(AnswersOfQuestion[index].key, currentQuestion);
            if (rightAnswer) {
                score += Number(currentQuestion.score) || 0;
                Btn.style.background = "green";
            } else {
                Btn.style.background = "red";
            }
            answers[currentQuestion.id] = AnswersOfQuestion[index].key;
            Btns.forEach(b => b.disabled = true);
            flag = false;
        }
    });
}

function checkAnswer(answer, question) {
    return answer == question.correctAnswer;
}

function randomAnswers(question) {
    let newArrangeOfAnswers = [
        { key: 'a', text: question.choices.a },
        { key: 'b', text: question.choices.b },
        { key: 'c', text: question.choices.c },
        { key: 'd', text: question.choices.d }
    ];

    for (let i = newArrangeOfAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArrangeOfAnswers[i], newArrangeOfAnswers[j]] = [newArrangeOfAnswers[j], newArrangeOfAnswers[i]];
    }
    return newArrangeOfAnswers;
}

ButtonNext.addEventListener('click', function () {
    if (flag) return;
    currentIndex++;
    if (currentIndex < questions.length) {
        flag = true;
        displayQuestions(questions);
    }
});

let timeOut;
function startTimer(minutes) {
    let seconds = minutes * 60;
    let timer = document.getElementById("timer");
    timeOut = setInterval(() => {
        timer.innerText = `${Math.floor(seconds / 60)}:${seconds % 60}`;
        if (seconds <= 0) submitExam();
        seconds--;
    }, 1000);
}

function submitExam() {
    Btns.forEach(b => b.disabled = true);
    ButtonNext.classList.add("hidden");
    ButtonSubmit.classList.remove("hidden");
    submitData();
}

ButtonSubmit.addEventListener('click', submitData);

async function submitData() {
    const now = new Date();
    try {
          await fetch(`http://localhost:3000/exam_students/${examStudent}`, {
                method: 'DELETE'
            });
        await fetch('http://localhost:3000/results', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                studentId: idStudent,
                score: score,
                examId : idExam ,
                answers: answers,
                finishedAt: now.toISOString()
            })
        });
       

        window.location.href = "studentProfile.html";
    } catch (e) {
        console.log(e);
    }
}

getExam(idExam);
loadQuestionsOfExam();

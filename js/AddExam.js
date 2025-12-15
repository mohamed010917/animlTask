
import { Exam ,Question } from "./Exam.js";
import ImgUplode from "./imgApi.js";
import { allStudents } from "./main.js";

const exam = new Exam();
exam.id = Math.floor(Math.random() * 1000000000);

async function fetchStudents() {
    let students = await allStudents();
    const studentsDiv = document.getElementById('students');
    students.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.classList.add('flex','items-center','gap-4','border','p-4','rounded-lg');
        studentDiv.innerHTML = `
            <input type="checkbox" data-id="${student.id}" data-grade="${student.grade}" />
            <img src="${student.imgurl}" alt="${student.name}" class="w-12 h-12 rounded-full object-cover" />
            <div>
                <h3 class="font-bold">${student.name}</h3>
                <p>Grade: ${student.grade}</p>
            </div>
        `;
        studentsDiv.appendChild(studentDiv);
    });
}

fetchStudents();

let currentStep = 0;
const steps = document.querySelectorAll('.step');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');
const buttonAddQuestions = document.querySelector('.button-add-questions');

if(currentStep == 0){
    backButton.classList.add('hidden');
}

if(currentStep >= steps.length - 1){
    nextButton.classList.add('hidden');
}

if(nextButton && backButton){
    nextButton.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            steps[currentStep].classList.add('hidden');
            currentStep++;
            steps[currentStep].classList.remove('hidden');
            backButton.classList.remove('hidden');
            if(currentStep >= steps.length - 1){
                nextButton.classList.add('hidden');
            }
            if(currentStep == 1){
                createExam();
                nextButton.classList.add('hidden');
                buttonAddQuestions.classList.remove('hidden');
            }
            if(currentStep != 1){
                buttonAddQuestions.classList.add('hidden');
                nextButton.classList.remove('hidden');
            }
        }
    });
    backButton.addEventListener('click', () => {
        steps[currentStep].classList.add('hidden');
        currentStep--;
        steps[currentStep].classList.remove('hidden');
        nextButton.classList.remove('hidden');
        if(currentStep != 1){
            buttonAddQuestions.classList.add('hidden');
        }
        if(currentStep == 0){
            backButton.classList.add('hidden');
        }
    });
}

const createExam = function(){
    const examTitle = document.getElementById('exam-name').value;
    const countQustion = document.getElementById('exam-question-count').value;
    const examDuration = document.getElementById('exam-duration').value;
    let errors = false;

    let nameError = document.querySelector('.nameError');
    if(!/[a-zA-Z]+/ig.test(examTitle)){
        nameError.textContent = "Exam name must contain only letters.";
        nameError.classList.remove('hidden');
        errors = true;
    }

    let duretionError = document.querySelector('.duretionError');
    if(isNaN(examDuration) || examDuration < 15 ){
        duretionError.textContent = "Exam duration must be a number and at least 15 minutes.";
        duretionError.classList.remove('hidden');
        errors = true;
    }
    let countError = document.querySelector('.countError');
    if(isNaN(countQustion) || countQustion <= 1){
        countError.textContent = "Question count must be a positive number.";
        countError.classList.remove('hidden');
        errors = true;
    }

    if(errors){
        backButton.click();
        setTimeout(() => {
            nameError.classList.add('hidden');
            duretionError.classList.add('hidden');
            countError.classList.add('hidden');
        }, 5000);
        return false;
    }

    exam.name = examTitle;
    exam.duration = Number(examDuration);
    exam.teacherId = JSON.parse( localStorage.getItem("teacher")).id;
    exam.questions = [];
    exam.data = new Date().toLocaleDateString();

    AddquestionToExam(countQustion);
}

const AddquestionToExam = function(count){
    let nextquestionButton = document.getElementById('next-question-button');
    nextquestionButton.addEventListener('click', async function(){
        const questionText = document.getElementById('question-text');
        const choiceA = document.getElementById('choice-a');
        const choiceB = document.getElementById('choice-b');
        const choiceC = document.getElementById('choice-c');
        const choiceD = document.getElementById('choice-d');
        const correctAnswer = document.getElementById('correct-answer');
        const score = document.getElementById('score');
        const img = document.getElementById('question-image');
        let imgUrl = await ImgUplode(img);

        let errors = false;
        let questionError = document.querySelector('.questionError');
        questionError.textContent = "";

        if(!/[a-zA-Z]{5,1000}/ig.test(questionText.value)){
            questionError.textContent += "Question text must be greate than 10 leters.";
            questionError.classList.remove('hidden');
            errors = true;
        }
        if(isNaN(score.value) || score.value > 20 || score.value <= 0 ){
            questionError.textContent += "Score must be a number and less than 20.";
            questionError.classList.remove('hidden');
            errors = true;
        }
        if(!/[a-zA-Z]+/.test(choiceA.value) || !/[a-zA-Z]+/.test(choiceB.value) || !/[a-zA-Z]+/.test(choiceC.value) || !/[a-zA-Z]+/.test(choiceD.value)){
            questionError.textContent += "Choies must contain only letters.";
            questionError.classList.remove('hidden');
            errors = true;
        }

        const choices = {
            a: choiceA.value,
            b: choiceB.value,
            c: choiceC.value,
            d: choiceD.value
        };

        if(!['a','b','c','d'].includes(correctAnswer.value)){
            questionError.textContent += "Correct answer must be one of the choices (a, b, c, d).";
            questionError.classList.remove('hidden');
            errors = true;
        }

        if(errors){
            setTimeout(() => {
                questionError.classList.add('hidden');
                questionError.textContent = "";
            }, 5000);
            return;
        }

        let question = new Question(questionText.value, choices, correctAnswer.value, Number(score.value));
        question.examId = exam.id;
        question.image = imgUrl || null;
        exam.questions.push(question);

        questionText.value = "";
        choiceA.value = "";
        choiceB.value = "";
        choiceC.value = "";
        choiceD.value = "";
        correctAnswer.value = "";
        score.value = "";

        if(exam.questions.length >= count - 1){
            nextquestionButton.textContent = "Finish Exam";
        }

        if(exam.questions.length >= count){
            AddStudentToExam();
            steps[currentStep].classList.add('hidden');
            currentStep++;
            steps[currentStep].classList.remove('hidden');
            nextquestionButton.classList.add('hidden');
            buttonAddQuestions.classList.add('hidden');
            backButton.classList.add('hidden');
        }
    });
}

const AddStudentToExam = async function(){
    const okButton = document.getElementById('Ok');
    okButton.classList.remove('hidden');

    let selectedStudents = [];
    const allCheckboxes = document.querySelectorAll('#students input[type="checkbox"]');
    const examForm = document.getElementById('examForm');

    examForm.onsubmit = null;
    examForm.onsubmit = async function(e){
        e.preventDefault();
        allCheckboxes.forEach(checkbox => {
            if(checkbox.checked){
                selectedStudents.push({
                    examId: exam.id,
                    studentId: checkbox.getAttribute('data-id'),
                    status: "assigned"
                });
            }
        });

        await fetch('http://localhost:3000/exams',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                id: exam.id,
                name: exam.name,
                duration: exam.duration,
                teacherId: exam.teacherId
            })
        });

        for(const q of exam.questions){
            await fetch('http://localhost:3000/questions',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    examId: exam.id,
                    text: q.text,
                    choices: q.choices,
                    correctAnswer: q.correctAnswer,
                    score: q.score,
                    image: q.image || null
                })
            });
        }

        for(const es of selectedStudents){
            await fetch('http://localhost:3000/exam_students',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    examId: es.examId,
                    studentId: es.studentId,
                    status: es.status ,
                    id: Math.floor(Math.random() * 1000000) 
                })
            });
        }

        location.href = "ExamShow.html";
    };

    const allStudentButton = document.getElementById('allStudent');
    allStudentButton.onclick = null;
    allStudentButton.addEventListener('click', function(e){
        e.preventDefault();
        allCheckboxes.forEach(checkbox => checkbox.checked = true);
    });

    const ByGradeSelect = document.getElementById('ByGrade');
    ByGradeSelect.addEventListener('change', function(){
        const grade = ByGradeSelect.value;
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.getAttribute('data-grade') == grade;
        });
    });
}
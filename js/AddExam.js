
import { Exam ,Question } from "./Exam.js";
import ImgUplode from "./imgApi.js";
import { allStudents } from "./main.js";



let currentStep = 0;
const steps = document.querySelectorAll('.step');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');
const buttonAddQuestions = document.querySelector('.button-add-questions');
const ExamNamePreviow = document.getElementById("ExamNamePreviow") ;
const CountqustionId = document.getElementById("CountqustionId") ;
const durationView = document.getElementById("durationView") ;
const ScoreView = document.getElementById("ScoreView") ;
const EasyCount = document.getElementById("EasyCount") ;
const middCount = document.getElementById("middCount") ;
const HardCount = document.getElementById("HardCount");
const questionsPreview = document.getElementById("questionsPreview") ;
const totalElement = document.getElementById("ScoreView") ;
let countq = 0 ;
let countes = 0;
let counthard = 0;
let countmidd = 0 ;


const exam = new Exam();
let total = 0 ;

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
    if(isNaN(examDuration) || examDuration < 1 ){
        duretionError.textContent = "Exam duration must be a number and at least 15 minutes.";
        duretionError.classList.remove('hidden');
        errors = true;
    }
    let countError = document.querySelector('.countError');
    if(isNaN(countQustion) || countQustion < 1 ){
        countError.textContent = "Question count must be a positive number. and greate then 15";
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

    exam.questions = [];
    exam.data = new Date().toLocaleDateString();
    ExamNamePreviow.innerText = exam.name ;
    durationView.innerText = exam.duration ;
    AddquestionToExam(countQustion);
}

const AddquestionToExam = function(count){
    let nextquestionButton = document.getElementById('next-question-button');
    nextquestionButton.onclick =  async function(){
        const questionText = document.getElementById('question-text');
        const choiceA = document.getElementById('choice-a');
        const choiceB = document.getElementById('choice-b');
        const choiceC = document.getElementById('choice-c');
        const choiceD = document.getElementById('choice-d');
        const correctAnswer = document.getElementById('correct-answer');
        const score = document.getElementById('score');
        const img = document.getElementById('question-image');
        const difficulty = document.getElementById("difficulty") ;
        const form = document.querySelector("#examForm") ;
     
     
     

        let errors = false;
        let questionError = document.querySelector('.questionError');
        questionError.textContent = "";

        
        if(!/[a-zA-Z]{5,1000}/ig.test(questionText.value)){
            questionError.textContent += "Question text must be greate than 10 leters.";
            questionError.classList.remove('hidden');
            errors = true;
        }
        if(isNaN(score.value) || score.value > 100 - total|| score.value > 10 || score.value <= 0 ){
            questionError.textContent += "Score must be a number and less than 20.";
            questionError.classList.remove('hidden');
            errors = true;
        }
        if(!/[a-zA-Z]+/.test(choiceA.value) || !/[a-zA-Z]+/.test(choiceB.value) || !/[a-zA-Z]+/.test(choiceC.value) || !/[a-zA-Z]+/.test(choiceD.value)){
            questionError.textContent += "Choies must contain only letters.";
            questionError.classList.remove('hidden');
            errors = true;
        }

        if(difficulty.value == ""){
          questionError.textContent += "please choise difficulty  ";
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
        if (!img.files || img.files.length === 0) {
            questionError.textContent = "Image file is required";
            questionError.classList.remove('hidden');
            errors = true;
            return errors;
         }
        if(errors){
            console.log("i am error") ;
            setTimeout(() => {
                questionError.classList.add('hidden');
                questionError.textContent = "";
            }, 5000);
            return;
        }
        let imgUrl = await ImgUplode(img);
        let question = new Question(questionText.value, choices, correctAnswer.value, Number(score.value) ,imgUrl.display_url,  difficulty.value , exam.id);
        exam.questions.push(question);
        total += question.score ;
        
        updateExamPreviwo(question) ;
        form.reset();

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
    };
}

const AddStudentToExam = async function(){
  
    const okButton = document.getElementById('Ok');
    okButton.classList.remove('hidden');

    let selectedStudents = [];
    const allCheckboxes = document.querySelectorAll('#students input[type="checkbox"]');
    const examForm = document.getElementById('examForm');

    examForm.onsubmit = null;
    examForm.onsubmit = async function(e){
        e.preventDefault();//
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
                id: exam.id +"",
                name: exam.name,
                duration: exam.duration,
                teacherId: exam.teacherId
            })
        });

        for(const q of exam.questions){
            await fetch('http://localhost:3000/questions',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(q)
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
                    id: Date.now().toString(36) + Math.random().toString(36).slice(2) 
            })});
        }

        location.href = `ExamShow.html?id=${exam.id}`;
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



const updateExamPreviwo = function(question){
    countq += 1 ;
    CountqustionId.innerText = countq ;
    if(question.difficulty == "easy"){
        countes += 1 ;
        EasyCount.innerText = countes ;
    }else if(question.difficulty == "medium"){
        countmidd += 1;
        middCount.innerText = countmidd ;
    }else{
        counthard += 1;
        HardCount.innerText = counthard ;
    }

    totalElement.innerText = total ;
    AddQustionToPreviwe(question) ;

} ;



const model = document.getElementById("model");
const AddQustionToPreviwe = function (question){
    console.log(question) ;
    const QuestionDiv = document.createElement("div") ;
    QuestionDiv.className = "question-item bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200";

    QuestionDiv.setAttribute("id" , question.id + "qus") ;
    QuestionDiv.innerHTML = `
      <div class="flex items-start justify-between mb-3 text-black dark:text-white">
      
            <div class="flex items-start space-x-3">
          
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                    <span class="text-indigo-600 dark:text-indigo-400 text-sm font-medium">${countq}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${question.text}</h5>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ${question.difficulty}
                        </span>
                        <span class="text-xs text-gray-600 dark:text-gray-400">${question.score}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center space-x-1">
               <button
                class="edit-btn p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                id="edit${question.id}"
                title="Edit Question"
                >
                Edit
                </button>
                <button  id="del${question.id}"  class="delete-btn p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        title="Delete Question">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    
                </button>
            </div>
        </div>
        
        <div class="question-details mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div class="space-y-4">
            ${
                question.imgUrl ? `<img src=${  question.imgUrl } alt=${question.text}>` : ""
            }
                <div>
                    <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Choices:</h6>
                    <div class="grid grid-cols-2 gap-2 text-black dark:text-white">
                        <div class="flex items-center p-2 rounded ${question.correctAnswer == 'a'? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-600'}">
                            <span class="w-6 h-6 rounded-full bg-gray-300 ${question.correctAnswer == 'a' ?'bg-green-500 '  : 'bg-gray-300'} rounded-full  dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center mr-2">A</span>
                            <span class="text-sm truncate">${question.choices.a}</span>
                        </div>
                        <div class="flex items-center p-2 rounded ${question.correctAnswer == 'b'?  'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-600'}">
                            <span class="w-6 h-6 rounded-full ${question.correctAnswer == 'b' ?'bg-green-500 '  : 'bg-gray-300'} rounded-full  dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center mr-2">B</span>
                            <span class="text-sm truncate">${question.choices.b}</span>
                          
                        </div>
                        <div class="flex items-center p-2 rounded ${question.correctAnswer == 'c'? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-600'}">
                            <span class="w-6 h-6 ${question.correctAnswer == 'c' ?'bg-green-500 '  : 'bg-gray-300'} rounded-full  dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center mr-2">C</span>
                            <span class="text-sm truncate">${question.choices.c}</span>
                        </div>
                        <div class="flex items-center p-2 rounded ${question.correctAnswer == 'd'? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-600'}">
                            <span class="w-6 h-6 ${question.correctAnswer == 'd' ?'bg-green-500 '  : 'bg-gray-300'} rounded-full  dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center mr-2">D</span>
                            <span class="text-sm truncate">${question.choices.d}</span>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    `

    questionsPreview.appendChild(QuestionDiv) ;
    const edit = document.getElementById(`edit${question.id}`) ;
    edit.onclick = function(e){
        OpenModel(question , QuestionDiv)
    }

    const dele = document.getElementById("del" + question.id) ;
    dele.onclick = function(e){
        deleteElement(question , QuestionDiv) ;
    }

}



const OpenModel = function(question , QuestionDiv){
    model.classList.remove("hidden") ;

    const modeText     = document.getElementById("modeText");
    const choiceAModel = document.getElementById("choice-aModel") ;
    const choiceBModel = document.getElementById("choice-bModel") ;
    const choiceCModel = document.getElementById("choice-cModel") ;
    const choiceDModel = document.getElementById("choice-dModel") ;
    const CorrectModel = document.getElementById("CorrectModel") ;
    const scoreModel   = document.getElementById("scoreModel");
    const deffModel    = document.getElementById("deffModel") ;
    const cancel       = document.getElementById("cancel") ;
    const save         = document.getElementById("save") ;



    modeText.value     = question.text ;
    choiceAModel.value = question.choices.a ;
    choiceBModel.value = question.choices.b ;
    choiceCModel.value = question.choices.c ;  
    choiceDModel.value = question.choices.d;
    CorrectModel.value = question.correctAnswer ;
    scoreModel.value   = question.score ;
    deffModel.value    = question.difficulty ;

    


    cancel.onclick = function(){
        model.classList.add("hidden") ;
    }

    save.onclick = function(){
        total -= question.score ;
         if(question.difficulty == "easy"){
            countes -= 1 ;
            EasyCount.innerText = countes ;
        }else if(question.difficulty == "medium"){
            countmidd -= 1;
            middCount.innerText = countmidd ;
        }else{
            counthard -= 1;
            HardCount.innerText = counthard ;
        }
        question.score = scoreModel.value ;
        question.text = modeText.value ;
        question.difficulty = deffModel.value ;
        question.correctAnswer = CorrectModel.value ;
       
        let choices ={
            "a" : choiceAModel.value ,
            "b" : choiceBModel.value ,
            "c" :choiceCModel.value ,
            "d" : choiceDModel.value 
        }

        question.choices = choices ;
        total += question.score ;
        totalElement.innerText = total ;
        let index = exam.questions.findIndex(e => e.id == question.id) ;
        exam.questions[index] = question ;
        if(question.difficulty == "easy"){
            countes += 1 ;
            EasyCount.innerText = countes ;
        }else if(question.difficulty == "medium"){
            countmidd += 1;
            middCount.innerText = countmidd ;
        }else{
            counthard += 1;
            HardCount.innerText = counthard ;
        }
         model.classList.add("hidden") ;
         QuestionDiv.remove() ;
         AddQustionToPreviwe(exam.questions[index]) ;
    }    
}






const deleteElement = function(question , QuestionDiv) {
      total -= question.score ;
      totalElement.innerText = total ;
      countq -= 1 ;
      CountqustionId.innerText = countq ;
      if(question.difficulty == "easy"){
        countes -= 1 ;
        EasyCount.innerText = countes ;
      }else if(question.difficulty == "medium"){
        countmidd -= 1;
        middCount.innerText = countmidd ;
      }else{
        counthard -= 1;
        HardCount.innerText = counthard ;
      }
      exam.questions = exam.questions.filter(e => e.id != question.id) ;
      QuestionDiv.remove() ;
}





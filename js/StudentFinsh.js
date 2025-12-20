if(localStorage.getItem("teacher") == 'null' || localStorage.getItem("teacher") === null ){
    location.href = "index.html";
}


let imgStudent = document.querySelector("#student img");
let nameStudent = document.querySelector("#student h2");
let gradeStudent = document.querySelector("#student p#grade");
let totalScore = document.querySelector("#total-score span");
let studentScore = document.querySelector("#total-score  span.score");
let examName = document.querySelector("#examName span");
let teacherName = document.querySelector("#TeacherName span");
let examDate = document.querySelector("#ExamDate span");
let QuestionDiv = document.getElementById("Question");

let student ={};
const ResultId = location.search.split("=")[1];

const fetchExamData = async (examId) => {
    const res = await fetch("http://localhost:3000/exams/" + examId);
    const examData = await res.json();
    return examData;
}

const fetchQuizData = async () => {
    const res = await fetch("http://localhost:3000/results/" + ResultId);
    const quizData = await res.json();
     let  std = await fetch("http://localhost:3000/students" );
    std = await std.json();
    student = std.find(s => s.id == quizData.studentId) ;
    return quizData;
}

const fetchQuestionsData = async (examId) => {
    const res = await fetch("http://localhost:3000/questions");
    let questionsData = await res.json();
    questionsData = questionsData.filter(question => question.examId == examId );
 
    return questionsData;
}



const displayExamResult = async () => {
    const quizData = await fetchQuizData();
    const examData = await fetchExamData(quizData.examId);
    const questionsData = await fetchQuestionsData(quizData.examId);
   
    let total = questionsData.reduce((sum, question) => sum + question.score, 0);
    
    imgStudent.src = student.imgurl;
    nameStudent.textContent = student.name;
    gradeStudent.textContent = `Grade: ${student.grade}`;
    totalScore.textContent = total;
    studentScore.textContent = quizData.score;
    examName.textContent = examData.name;
    teacherName.textContent = examData.teacher;
    examDate.textContent = new Date(quizData.finishedAt).toLocaleDateString();
    Object.entries(quizData.answers).forEach(([questionId, selectedAnswer], index) => {

        const question = questionsData.find(q => q.id == questionId);

        if (!question) return;

        const isCorrect = question.correctAnswer === selectedAnswer;

        const questionDiv = document.createElement("div");
        questionDiv.className = "bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6";

        questionDiv.innerHTML = `
            <h3 class="font-bold text-lg mb-4">
                Q${index + 1}: ${question.title}
            </h3>

            ${
                question.imageUrl
                    ? `<img src="${question.imageUrl}" 
                            alt="Question Image"
                            class="mb-4 max-h-64 object-contain rounded-lg">`
                    : ''
            }

            <ul class="space-y-3">
                ${Object.keys(question.choices).map(answer => `
                    <li class="border rounded-lg px-4 py-2
                        ${answer === question.correctAnswer ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : ''}
                        ${answer === selectedAnswer && !isCorrect ? 'border-red-500 bg-red-100 dark:bg-red-900' : ''}">
                        
                        ${answer === question.correctAnswer ? '✅ ' : ''}
                        ${answer === selectedAnswer && !isCorrect ? '❌ ' : ''}
                        
                        ${answer}
                    </li>
                `).join('')}
            </ul>
        `;

        QuestionDiv.appendChild(questionDiv);
    });

}

displayExamResult() ;
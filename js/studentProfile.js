if(localStorage.getItem("student") == 'null' || localStorage.getItem("student") === null ){
    location.href = "index.html";
}


const studentData = JSON.parse(localStorage.getItem("student"));
console.log(studentData) ;
const studentDiv = document.getElementById("Student");
studentDiv.querySelector("img").src = studentData.imgurl;   
document.querySelector("#Student h1").textContent = studentData.name;
document.querySelector("#Student  p").textContent = `Grade: ${studentData.grade}`;
document.querySelector("#Student span").textContent = `Mobile: ${studentData.mobile}`;


// Display student's quizzes
const AddTableQuizzeFinsh =async function(){
    const TableBody = document.getElementById("TableBody"); 

    let results = await fetch("http://localhost:3000/results") ;
    results = await results.json() ;
    let quizzes = results.filter(quiz => quiz.studentId == studentData.id);
    let allExam = await fetch("http://localhost:3000/exams") ;
     allExam = await allExam.json() ;
    // let myFinsh = allExam.filter(exam => quizzes.some(quiz => quiz.examId == exam.id));
    quizzes.forEach(quiz => {
        let exam = allExam.find(exam => exam.id === quiz.examId);
        quiz.title = exam ? exam.name : "Unknown Exam";
        quiz.finishedAt = new Date(quiz.finishedAt).toLocaleDateString();
        const row = document.createElement("tr");
        row.className = "border-b border-gray-200 dark:border-gray-700";
        row.innerHTML = `
            <td class="py-3 font-medium">${quiz.title}</td>
            <td class="py-3 text-green-600 font-semibold">${quiz.score}%</td>
            <td class="py-3 text-gray-500 dark:text-gray-300">${quiz.finishedAt}</td>
            <td class="py-3 text-gray-500 dark:text-gray-300"><a href="StudentShhowExam.html?id=${quiz.id}" class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">SHow</a></td>
        `;
        TableBody.appendChild(row);
    });

}
AddTableQuizzeFinsh() ;

const  NextQuizze =async function(){



    const nextExam = document.getElementById("nextExam"); 
    let Allquizzes = await fetch("http://localhost:3000/exam_students") ;
    Allquizzes = await Allquizzes.json() ;
    let quizzes = Allquizzes.filter(quiz => quiz.studentId == studentData.id);
    let allExam = await fetch("http://localhost:3000/exams") ;
     allExam = await allExam.json() ;
    let myExam = allExam.filter(exam => quizzes.some(quiz => quiz.examId == exam.id));



    myExam.forEach(quiz => {
        let examStudent = Allquizzes.find(e => e.examId == quiz.id && e.studentId == studentData.id)
        const quizDiv = document.createElement("div");
        quizDiv.className = "p-4 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center mb-4";
        quizDiv.innerHTML = `
            <span class="font-medium">${quiz.name}</span>
            <a href="exam.html?id=${quiz.id}&studentId=${studentData.id}&examStudent=${examStudent.id}"   class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start</a>
        `;
        nextExam.appendChild(quizDiv);
    });
        
}


NextQuizze() ;
 

// async function getExam(id){
//     let response = await fetch(`http://localhost:3000/exams/${id}`);
//         let exam = await response.json();

//         console.log(exam);
// }

// getExam('8f92');

// async function GetStudent(id){
//     let response = await fetch(`http://localhost:3000/students/${id}`);
//         let student = await response.json();

//         console.log(student);
// }

// GetStudent('1765821131384');

// async function GetTeacher(id){
//     let response = await fetch(`http://localhost:3000/teachers/${id}`);
//         let teacher = await response.json();

//         console.log(teacher);
// }

// GetTeacher('101');
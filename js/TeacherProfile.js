if(localStorage.getItem("teacher") == 'null' || localStorage.getItem("teacher") === null ){
    location.href = "index.html";
}


const teacherData = JSON.parse(localStorage.getItem("teacher"));
console.log(teacherData) ;
const teacherDiv = document.getElementById("teacher");
teacherDiv.querySelector("img").src = teacherData.imgurl;   
document.querySelector("#teacher h1").textContent = teacherData.name;




const  NextQuizze =async function(){
    const nextExam = document.getElementById("nextExam"); 
    let allExam = await fetch("http://localhost:3000/exams") ;
     allExam = await allExam.json() ;
    let myExam = allExam.filter(exam => exam.teacherId == teacherData.id);



    myExam.forEach(quiz => {
        const quizDiv = document.createElement("div");
        quizDiv.className = "p-4 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center mb-4";
        quizDiv.innerHTML = `
            <span class="font-medium">${quiz.name}</span>
            <a href="ExamShow.html?id=${quiz.id}"   class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Show</a>
        `;
        nextExam.appendChild(quizDiv);
    });
        
}


NextQuizze() ;
 
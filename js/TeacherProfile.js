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
            <button data-id="${quiz.id}" class="delete bg-red-500 pt-2 pb-2 pr-6 pl-6 rounded">Delete</button>
        `;
        nextExam.appendChild(quizDiv);
    });
        
    document.querySelectorAll(".delete").forEach(e =>{
        e.onclick = async (event)=>{
            let id = e.dataset.id ;
            let exam = myExam.find(e => e.id == id) ;
            let response = await fetch("http://localhost:3000/results") ;
            response = await response.json() ;
            response = response.find(e => e.examId == id) ;
            if(!response){
                let response = await fetch("http://localhost:3000/exams/" + id ,{method : "delete"}) ;
                response = await response.json() ;
                let allQuestion = await fetch("http://localhost:3000/questions" )
                allQuestion = await allQuestion.json() ;
                allQuestion.filter(e=> e.examId == id).array.forEach(async e => {
                    let response = await fetch("http://localhost:3000/questions/" + e.id ,{method : "delete"}) ;
                    response = await response.json() ;
                });
                let allstudent = await fetch("http://localhost:3000/exam_students" ) ;
                allstudent = await allstudent.json() ;
                allstudent.filter(e=> e.examId == id).array.forEach(async e => {
                    let response = await fetch("http://localhost:3000/exam_students/" + e.id ,{method : "delete"}) ;
                    response = await response.json() ;
                });
            }else{
                let deleteExam = document.querySelector("#deleteExam") ;
                deleteExam.classList.remove("hidden") ;
                setTimeout(()=> deleteExam.classList.add("hidden"), 2000)
            }
        }
    })
}


NextQuizze() ;
 
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
const AddTableQuizzeFinsh = function(){
    const TableBody = document.getElementById("TableBody"); 
    const quizzes = studentData.quizzes || [];
    quizzes.forEach(quiz => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-200 dark:border-gray-700";
        row.innerHTML = `
            <td class="py-3 font-medium">${quiz.title}</td>
            <td class="py-3 text-green-600 font-semibold">${quiz.score}%</td>
            <td class="py-3 text-gray-500 dark:text-gray-300">${quiz.date}</td>
        `;
        TableBody.appendChild(row);
    });

}
AddTableQuizzeFinsh() ;

const  NextQuizze =async function(){
    const nextExam = document.getElementById("NextExam"); 
    const quizzes = await allExams() ;
    const unfinshQuizzes = quizzes.filter(quiz => !quiz.finsh && quize);
    unfinshQuizzes.forEach(quiz => {
        const quizDiv = document.createElement("div");
        quizDiv.className = "p-4 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center mb-4";
        quizDiv.innerHTML = `
            <span class="font-medium">${quiz.title}</span>
            <a class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start</a>
        `;
        nextExam.appendChild(quizDiv);
    });
        
}


NextQuizze() ;
 
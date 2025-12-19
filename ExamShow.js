const UrlPage=new URLSearchParams(window.location.search);
const idExam=UrlPage.get('id');
let currentExam=null;
if(!idExam)
    {
        alert("There is no exam now");
        location.href="TecherProfile.html";
    }

//get the details of exam 
async function loadDetails()
{
    try
    {
    const response1=await fetch(`http://localhost:3000/exams`);
    const allExams=await response1.json();
    currentExam=allExams.find(exam=>exam.id==idExam);
    if(currentExam)
        {
            document.getElementById("TitleExam").textContent=currentExam.name;
            document.getElementById("DurationExam").textContent=`${currentExam.duration} min`;
        }
        else
            {
                console.log("exam isn't found in database");
            }
    }
    catch(error)
    {
        console.error("Error loading details:", error);
    }
}



let Questions=[];
//get the questions of exam
async function loadQuestions()
{
    try
    {
        const response2=await fetch(`http://localhost:3000/questions`);
        const allQuestions=await response2.json();
        Questions=allQuestions.filter(question=>String(question.examId) === String(idExam));

            const ParentContainer=document.getElementById("ParentContainer");
    ParentContainer.innerHTML = "";
    Questions.forEach((q,index)=>
        {
            const questionHtml=`
            <div class="flex justify-between">
                <div class="bg-gray p-4 rounded-xl">
                <h4 class="font-semibold">${index+1}.${q.text}</h4>
                <ul class="mt-2 space-y">
                <li class="${q.correctAnswer==='a'? 'text-green-600 font-bold': ''}">A) ${q.choices.a} </li>
                <li class="${q.correctAnswer==='b'? 'text-green-600 font-bold': ''}">B) ${q.choices.b} </li>
                <li class="${q.correctAnswer==='c'? 'text-green-600 font-bold': ''}">C) ${q.choices.c} </li>
                <li class="${q.correctAnswer==='d'? 'text-green-600 font-bold': ''}">D) ${q.choices.d} </li>
                </ul>
                <p class="text-sm mt-2">Score: ${q.score}</p>
                </div>
                <div class="flex gap-3">
                <button onclick="prepareEditId('${q.id}')" class="text-blue-500 hover:text-blue-700">Edit</button>
                <button onclick="deleteQuestionId('${q.id}')" class="text-red-500 hover:text-red-700">Delete</button>
            </div>
            `
            ParentContainer.innerHTML +=questionHtml;
        });
    }catch(error)
    {
        console.log("Error in loading:",error);
    }
}


async function deleteQuestionId(id)
{
    if(confirm("Are you sure to delete this question?!"))
        {
            await fetch(`http://localhost:3000/questions/${id}`,
            {method:`DELETE`});   
        }
        loadQuestions();
}


function prepareEditId(id)
{
   let q= Questions.find(Question=>id===Question.id);
   if(q)
    {
        document.getElementById("EditId").value=id;
        document.getElementById("QuestionText").value=q.text;
        document.getElementById("editA").value=q.choices.a;
        document.getElementById("editB").value=q.choices.b;
        document.getElementById("editC").value=q.choices.c;
        document.getElementById("editD").value=q.choices.d;
        document.getElementById("editCorrectAnswer").value=q.correctAnswer;
        document.getElementById("editQuestionModal").classList.remove("hidden");
    }
}


async function saveNewData()
{
const id=document.getElementById("EditId").value;// بستدعي الID بتاع السؤال نفسه
const updateData= // بعمل OBJECT جديد يوجد فيه كل البيانات الجديدة
{
    text: document.getElementById("QuestionText").value,
    choices:
    {
        a: document.getElementById("editA").value,
        b: document.getElementById("editB").value,
        c: document.getElementById("editC").value,
        d: document.getElementById("editD").value
    },
    correctAnswer: document.getElementById("editCorrectAnswer").value
}
const responseupdateData=await fetch(`http://localhost:3000/questions/${id}`,//بكلم السيرفر واعمل اتصال 
    {
        method: 'PATCH',// نوع الاتصال تعديل 
        headers: {"content-type": "application/json"},
        body:JSON.stringify(updateData)
    }
);
if(responseupdateData.ok)
    {
        alert("exam is updated");
        loadDetails();
    }
    else
        {
            alert("update failed");
        }

document.getElementById("editQuestionModal").classList.add("hidden");
loadQuestions();
}

//استدعاء القيم في الموديل الخاص بتعديل اسم ومدة الامتحان
function startEditExam()
{
    if(!currentExam)
        {
            alert("There is no exam");
            return;
        }
        document.getElementById("edit_exam_id").value=currentExam.id;
        document.getElementById("Edit_Exam_Name").value=currentExam.name;
        document.getElementById("Edit_Exam_Duration").value=currentExam.duration;
}

// رفع التعديلات الجديدة الي db.json
async function saveExamChanges()
{
const id=document.getElementById("edit_exam_id").value;
const editName=document.getElementById("Edit_Exam_Name").value;
const editDuration=document.getElementById("Edit_Exam_Duration").value;

const response=await fetch(`http://localhost:3000/exams/${currentExam.id}`,
    {
        method:'PATCH',
        headers:{"content-type": "application/json"},
        body: JSON.stringify( 
        {
            name: editName,
            duration: editDuration
        })
    });
if(response.ok)
    {
        alert("exam is updated");
        loadDetails();
    }
    else
        {
            alert("update failed");
        }
}


//students
let students=[];
async function loadStudents()
{
    let studentList=document.getElementById("studentList");
    studentList.innerHTML = "";
    try
    {
const responseloadstudent=await fetch('http://localhost:3000/exam_students');
    if(!responseloadstudent.ok)
        {
            alert("there is no data");
            return;
        }
    let dataLoadStudents= await responseloadstudent.json();
    students=dataLoadStudents.filter(s=>s.examId==currentExam.id);
    if (students.length === 0) {
            studentList.innerHTML = "<li>No students assigned to this exam.</li>";
            return;
        }
        
    students.forEach((student)=>
        {
            console.log(student.id);
            let liElement=document.createElement("li");
            liElement.classList="py-3 flex justify-between items-center border-b dark:border-gray-700";
            liElement.innerHTML+=`
            <span>${student.studentId} (${student.status})</span>
            <button onclick="removeStudent(${student.id})" class="text-red-500">Remove</button>
            `
            studentList.appendChild(liElement);
        })
    }catch(e)
    {
        console.log("Error loading students:", error);
    }
}

//add student into exam
let addIdNewStudent=document.getElementById("newIdStudentIntoExam");
async function addStudentIntoExam()
{
    let idValue=addIdNewStudent.value;
    const searchIdStudent=await fetch(`http://localhost:3000/students/${idValue}`);
    if(!searchIdStudent.ok)
        {
            alert("there is no student with this id");
            return;
        }
    const newAddStudent=
    {
    "examId": String(currentExam.id),
    "studentId": String(idValue),
    "status": "assigned",
    "id": String(Date.now())
    }
    try
    {
         const responseAddStudentIntoExam=await fetch(`http://localhost:3000/exam_students`,
        {
            method:'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(newAddStudent)
        });
        if(responseAddStudentIntoExam.ok)
            {
                alert("student added successfully");
                loadStudents();
            }
            else
                {
                    alert("student added failed");
                }
    }
    catch(error)
    {
        console.log(error);
    }
}



//remove student from exam
async function removeStudent(id)
{
    console.log(id);
    if(!confirm("Are you sure to delete this student?!"))
        {
            return;
        };
        try
        {
        const responseDelete=await fetch(`http://localhost:3000/exam_students/${id}`,
        {
            method:'DELETE',
        });
        if(responseDelete.ok)
            {
                alert("student removed successfully");
                loadStudents();
            }
            else
                {
                    console.error("Failed ID:", id);
                    alert("failed to remove student");
                }
        }catch(e)
        {
            console.error("Failed ID:", id);
            console.log("error in removing student",e);
            alert("error in removing student from the server");
        }
}


async function AddNewQuestion()
{
const IdOfExamOfNewQuestion=document.getElementById('IdExam');
IdOfExamOfNewQuestion.value=idExam;
const newTextOfQuestion=document.getElementById('questiontext').value;
const imageOfNewQuestion=document.getElementById('questionimage').src;
const newchoiceA=document.getElementById('choiceA').value;
const newchoiceB=document.getElementById('choiceB').value;
const newchoiceC=document.getElementById('choiceC').value;
const newchoiceD=document.getElementById('choiceD').value;
const scoreNewQuestion=document.getElementById('scoreNewQuestion').value;
const newCorrectAnswer=document.getElementById('correctAnswer').value;
const difficultyOfNewQuestion=document.getElementById('difficulty').value;

const dataOfNewQuestion=
{
    "examId": IdOfExamOfNewQuestion,
    "text": newTextOfQuestion,
    "choices": {
        "a": newchoiceA,
        "b": newchoiceB,
        "c": newchoiceC,
        "d": newchoiceD
},
    "correctAnswer": newCorrectAnswer,
    "score": scoreNewQuestion,
}
const responseToAddNewQuestion=await fetch('http://localhost:3000/questions',
    {

    })
}















window.deleteQuestionId=deleteQuestionId;
window.prepareEditId=prepareEditId;
window.saveExamChanges=saveExamChanges;
window.startEditExam=startEditExam;
window.removeStudent=removeStudent;
window.addStudentIntoExam=addStudentIntoExam;

async function init() {
    await loadDetails(); 
    loadQuestions();
    loadStudents();
}
init();



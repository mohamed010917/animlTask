import ImgUplode from "./imgApi.js";
import { allStudents } from "./main.js";
const Errors = document.getElementById("Errors");
const UrlPage = new URLSearchParams(window.location.search);
let FinshStudents = false ;
// DOM Elements
const editExamBtn = document.getElementById("edit_exam_id");
const addQuestionBtn = document.getElementById("addQuestion");
const addStudentBtn = document.getElementById("buttonAddStudentIntoExam");
const editExamModal = document.getElementById("editExamModal");
const CloseeditExamModal = document.getElementById("CloseeditExamModal");
const saveExamChangesBtn = document.getElementById("saveExamChanges");
const closeEditQuestionBtn = document.getElementById("closeModalEditqustion");
const addNewQuestionBtn = document.getElementById("AddNewQuestion");
const closeAddQuestionBtn = document.getElementById("ClosequstionModel");
const SaveEditQustion = document.getElementById("SaveEditQustion");
const Allstudents = document.getElementById("Allstudents");
const AllstudentsFinsh = document.getElementById("AllstudentsFinsh") ;

function showError(message) {
    Errors.textContent = message;
    Errors.classList.remove("hidden");
    setTimeout(() => {
        Errors.classList.add("hidden");
    }, 3000);
}

function showSuccess(message) {
    Errors.textContent = message;
    Errors.classList.remove("hidden");
    Errors.classList.add("bg-green-600", "text-white");
    Errors.classList.remove("bg-red-600");
    setTimeout(() => {
        Errors.classList.add("hidden");
        Errors.classList.remove("bg-green-600", "text-white");
        Errors.classList.add("bg-red-600");
    }, 3000);
}

async function AddStudents() {
    const response = await fetch('http://localhost:3000/exam_students');
    if (!response.ok) return;
    let data = await response.json();
    let results = await fetch('http://localhost:3000/results');
    if (!results.ok) return;
    results = await results.json();
    data = data.filter(s => s.examId == idExam);
    const allstud = await allStudents();
    let students = allstud.filter(student => data.find(s => s.studentId == student.id));
     students = students.filter(student => !results.find(s => s.studentId == student.id));

    students.forEach(s => {
        Allstudents.innerHTML +=
            `
                <div class="bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-700
                            rounded-xl shadow-md dark:shadow-black/40
                            transition-all duration-200 hover:shadow-lg">
                    
                    <div class="p-4 md:p-6">
                        <div class="flex flex-col sm:flex-row gap-4">

                            
                            <div class="relative self-center sm:self-start">
                                <img src="${s.imgurl}"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                                            border-2 border-blue-300 dark:border-blue-700
                                            object-cover">

                                <div class="absolute bottom-0 right-0 
                                            w-5 h-5 sm:w-6 sm:h-6 
                                            bg-blue-500 dark:bg-blue-600
                                            border-2 border-white dark:border-gray-800
                                            rounded-full flex items-center justify-center">
                                    <span class="text-xs text-white">✓</span>
                                </div>
                            </div>

                           
                            <div class="flex-1 w-full">

                                <div class="flex justify-between items-start gap-3">

                                    <div>
                                        <h3 class="text-lg sm:text-xl font-bold
                                                text-gray-800 dark:text-white">
                                             ${s.name}
                                        </h3>

                                        <div class="flex gap-2 mt-1">
                                            <span class="bg-blue-100 dark:bg-blue-900/40
                                                        text-blue-800 dark:text-blue-300
                                                        text-xs px-3 py-1 rounded-full">
                                                 ${s.grade}
                                            </span>

                                        </div>
                                    </div>

                                    <button  data-id="${s.id}"
                                        class="DelStudent text-red-500 dark:text-red-400
                                            hover:bg-red-50 dark:hover:bg-red-900/30
                                            p-2 rounded-full transition">
                                        🗑
                                    </button>
                                </div>

                                <!-- معلومات إضافية -->
                                <div class="mt-4 space-y-2 text-sm">

                                    <p class="text-gray-600 dark:text-gray-300">
                                        📞 ${s.mobile}
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
        `
    });
    let allDel = document.querySelectorAll(".DelStudent");
    allDel.forEach(e => {
        e.onclick = async () => {
            console.log(data);
            let id = data.find(s => e.dataset.id == s.studentId).id;
            const response = await fetch(`http://localhost:3000/exam_students/${id}`,
                { method: 'DELETE' });

            if (response.ok) {
                showSuccess("Student removed successfully");
                loadStudents();
            } else {
                showError("Failed to remove student");
            }
        }
    })
}


async function AddStudentsFinsh() {
    const response = await fetch('http://localhost:3000/results');
    if (!response.ok) return;
    let data = await response.json();
    console.log(data) ;
    if(data.length){
        editExamBtn.remove() ;
        addQuestionBtn.remove() ;
        FinshStudents = true ;
    }
    data = data.filter(s => s.examId == idExam);
    const allstud = await allStudents();
    let students = allstud.filter(student => data.find(s => s.studentId == student.id));
    students.forEach(s => {
        let result = data.find(e => e.studentId == s.id) ;
        AllstudentsFinsh.innerHTML +=
            `
                <div class="bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-700
                            rounded-xl shadow-md dark:shadow-black/40
                            transition-all duration-200 hover:shadow-lg">
                    
                    <div class="p-4 md:p-6">
                        <div class="flex flex-col sm:flex-row gap-4">

                            
                            <div class="relative self-center sm:self-start">
                                <img src="${s.imgurl}"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                                            border-2 border-blue-300 dark:border-blue-700
                                            object-cover">

                                <div class="absolute bottom-0 right-0 
                                            w-5 h-5 sm:w-6 sm:h-6 
                                            bg-blue-500 dark:bg-blue-600
                                            border-2 border-white dark:border-gray-800
                                            rounded-full flex items-center justify-center">
                                    <span class="text-xs text-white">✓</span>
                                </div>
                            </div>

                           
                            <div class="flex-1 w-full">

                                <div class="flex justify-between items-start gap-3">

                                    <div>
                                        <h3 class="text-lg sm:text-xl font-bold
                                                text-gray-800 dark:text-white">
                                             ${s.name}
                                        </h3>

                                        <div class="flex gap-2 mt-1">
                                            <span class="bg-blue-100 dark:bg-blue-900/40
                                                        text-blue-800 dark:text-blue-300
                                                        text-xs px-3 py-1 rounded-full">
                                                 ${s.grade}
                                            </span>

                                        </div>
                                    </div>

                                
                                </div>
                                  <a  href="showFinshExam.html?id=${result.id}"
                                        class="DelStudent text-red-500 dark:text-blue-400
                                            hover:bg-blue-500 dark:hover:bg-blue-900/30
                                            p-2 rounded-full transition">
                                        show
                                    </a>
                                <!-- معلومات إضافية -->
                                <div class="mt-4 space-y-2 text-sm">

                                    <p class="text-gray-600 dark:text-gray-300">
                                        📞 ${s.mobile}
                                    </p>
                                        <p class="text-gray-600 dark:text-gray-300">
                                        Score : ${result.score}
                                    </p>
                                        <p class="text-gray-600 dark:text-gray-300">
                                        finishedAt :  ${result.finishedAt}
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
        `
    });
    
}
AddStudentsFinsh();
AddStudents();

function openModal(id) { document.getElementById(id).classList.remove('hidden') }
function closeModal(id) { document.getElementById(id).classList.add('hidden') }

const idExam = UrlPage.get('id');
let currentExam = null;
let Questions = [];
let students = [];

if (!idExam) {
    console.log("There is no exam now");
    location.href = "TecherProfile.html";
}

async function loadDetails() {
    try {
        const response = await fetch(`http://localhost:3000/exams`);
        const allExams = await response.json();
        currentExam = allExams.find(exam => exam.id == idExam);

        if (currentExam) {
            document.getElementById("TitleExam").textContent = currentExam.name;
            document.getElementById("DurationExam").textContent = `${currentExam.duration} min`;
        } else {
            showError("Exam isn't found in database");
        }
    } catch (error) {
        showError("Error loading exam details");
    }
}

async function loadQuestions() {
    try {
        const response = await fetch(`http://localhost:3000/questions`);
        const allQuestions = await response.json();
        Questions = allQuestions.filter(q => String(q.examId) === String(idExam));

        const ParentContainer = document.getElementById("ParentContainer");
        ParentContainer.innerHTML = "";

        Questions.forEach((q, index) => {
            const questionHtml = `
                <div class="flex justify-between mb-3">
                    <div class="bg-gray p-4 rounded-xl w-full">
                        <h4 class="font-semibold">${index + 1}. ${q.text}</h4>
                        <ul class="mt-2 space-y-1">
                            <li class="${q.correctAnswer === 'a' ? 'text-green-600 font-bold' : ''}">A) ${q.choices.a}</li>
                            <li class="${q.correctAnswer === 'b' ? 'text-green-600 font-bold' : ''}">B) ${q.choices.b}</li>
                            <li class="${q.correctAnswer === 'c' ? 'text-green-600 font-bold' : ''}">C) ${q.choices.c}</li>
                            <li class="${q.correctAnswer === 'd' ? 'text-green-600 font-bold' : ''}">D) ${q.choices.d}</li>
                        </ul>
                        <p class="text-sm mt-2">Score: ${q.score}</p>
                    </div>
                    <div class="flex flex-col justify-center gap-2 ml-3">
                        ${
                            FinshStudents ? ""
                            :
                           ` <button onclick="prepareEditId('${q.id}')" class="text-blue-500 hover:text-blue-700">Edit</button>
                            <button onclick="deleteQuestionId('${q.id}')" class="text-red-500 hover:text-red-700">Delete</button>`
                        }
                    </div>
                </div>
            `;
            ParentContainer.innerHTML += questionHtml;
        });
    } catch (error) {
        showError("Error loading questions");
    }
}

async function deleteQuestionId(id) {
    await fetch(`http://localhost:3000/questions/${id}`, { method: 'DELETE' });
    showSuccess("Question deleted successfully");
    loadQuestions();
}

function prepareEditId(id) {
    const q = Questions.find(ques => ques.id === id);
    if (q) {
        document.getElementById("EditId").value = id;
        document.getElementById("EditQuestionText").value = q.text;
        document.getElementById("editA").value = q.choices.a;
        document.getElementById("editB").value = q.choices.b;
        document.getElementById("editC").value = q.choices.c;
        document.getElementById("editD").value = q.choices.d;
        document.getElementById("editCorrectAnswer").value = q.correctAnswer;
        document.getElementById("scoreُEditQuestion").value = q.score;
        openModal('editQuestionModal');
    }
}

async function saveNewData() {
    const id = document.getElementById("EditId").value;
    const q = Questions.find(ques => ques.id === id);

    if (!document.getElementById("EditQuestionText").value.trim()) {
        showError("Question text is required");
        return;
    }
    if (!document.getElementById("editA").value.trim() ||
        !document.getElementById("editB").value.trim() ||
        !document.getElementById("editC").value.trim() ||
        !document.getElementById("editD").value.trim()) {
        showError("All choices are required");
        return;
    }
    if (!document.getElementById("editCorrectAnswer").value) {
        showError("Please select correct answer");
        return;
    }
    const score = parseInt(document.getElementById("scoreُEditQuestion").value);
    if (!score || score <= 0) {
        showError("Score must be a positive number");
        return;
    }

    let img = document.querySelector("#questionimageEdit");
    img = await ImgUplode(img);
    if (img) {
        img = img.display_url;
    } else {
        img = q.imgUrl;
    }
    const updateData = {
        text: document.getElementById("EditQuestionText").value,
        choices: {
            a: document.getElementById("editA").value,
            b: document.getElementById("editB").value,
            c: document.getElementById("editC").value,
            d: document.getElementById("editD").value
        },
        correctAnswer: document.getElementById("editCorrectAnswer").value,
        score: document.getElementById("scoreُEditQuestion").value,
        difficulty: document.getElementById("difficultyEdit").value,
        imgUrl: img,
    };

    const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    });

    if (response.ok) {
        showSuccess("Question updated successfully");
        loadQuestions();
        closeModal('editQuestionModal');
    } else {
        showError("Failed to update question");
    }
}

SaveEditQustion.onclick = saveNewData

function startEditExam() {
    if (!currentExam) return;

    document.getElementById("edit_exam_id").value = currentExam.id;
    document.getElementById("Edit_Exam_Name").value = currentExam.name;
    document.getElementById("Edit_Exam_Duration").value = currentExam.duration;
}

async function saveExamChanges(event) {
    event.preventDefault();
    const editName = document.getElementById("Edit_Exam_Name").value.trim();
    const editDuration = document.getElementById("Edit_Exam_Duration").value.trim();

    if (!editName) {
        showError("Exam name is required");
        return;
    }
    if (!editDuration || isNaN(editDuration) || parseInt(editDuration) <= 0) {
        showError("Duration must be a positive number");
        return;
    }

    const response = await fetch(`http://localhost:3000/exams/${currentExam.id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, duration: editDuration })
    });

    if (response.ok) {
        showSuccess("Exam updated successfully");
        loadDetails();
        closeModal('editExamModal');
    } else {
        showError("Failed to update exam");
    }
}

async function loadStudents() {
    const studentsList = document.getElementById("studentsList");
    studentsList.innerHTML = "";

    try {
        const response = await fetch('http://localhost:3000/exam_students');
        if (!response.ok) return;
        let data = await response.json();
        data = data.filter(s => s.examId == currentExam.id);
        const allstud = await allStudents();
        let students = allstud.filter(student => !data.find(s => s.studentId == student.id));

        if (students.length === 0) {
            studentsList.innerHTML = "No students assigned to this exam.";
            return;
        }

        students.forEach(student => {
            studentsList.innerHTML += `
                <lable for="st${student.id}" class="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <img src="${student.imgurl}" alt="Student Image" class="w-10 h-10 rounded-full">
                    <span class="flex-1">${student.name}</span>
                    <input id="st${student.id}" type="checkbox" class="studentCheckbox" value="${student.id}">
                </lable>
            `
        });
    } catch (error) {
        showError("Error loading students");
    }
}







async function addStudentIntoExam(e) {
    
    const allCheckBox = document.querySelectorAll(".studentCheckbox");
    const selected = Array.from(allCheckBox).filter(cb => cb.checked);

    if (selected.length === 0) {
        showError("Please select at least one student");
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (let checkbox of selected) {
        if (checkbox.checked) {
            let id = checkbox.value;
            const response = await fetch('http://localhost:3000/exam_students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "id": Date.now().toString(36) + Math.random().toString(36).slice(2),
                        "examId": idExam,
                        "studentId": id,
                        "status": "assigned"
                    }
                )
            });
            if (response.ok) {
                successCount++;
            } else {
                errorCount++;
            }
        }
    }

    if (successCount > 0) {
        showSuccess(`Successfully added ${successCount} student(s)`);
        closeModal('addStudentModal');
        loadStudents();
        Allstudents.innerHTML = "";
        AddStudents();
    }
    if (errorCount > 0) {
        showError(`Failed to add ${errorCount} student(s)`);
    }
}



document.querySelector("#addSelectedStudentsBtn").onclick = addStudentIntoExam;

async function AddNewQuestion(e) {
    e.preventDefault();

    if (!document.getElementById('questiontext').value.trim()) {
        showError("Question text is required");
        return;
    }
    if (!document.getElementById('choiceA').value.trim() ||
        !document.getElementById('choiceB').value.trim() ||
        !document.getElementById('choiceC').value.trim() ||
        !document.getElementById('choiceD').value.trim()) {
        showError("All choices are required");
        return;
    }
    if (!document.getElementById('correctAnswer').value) {
        showError("Please select correct answer");
        return;
    }
    const score = parseInt(document.getElementById('scoreNewQuestion').value);
    if (!score || score <= 0) {
        showError("Score must be a positive number");
        return;
    }

    const newQuestion = {
        examId: String(idExam),
        text: document.getElementById('questiontext').value,
        choices: {
            a: document.getElementById('choiceA').value,
            b: document.getElementById('choiceB').value,
            c: document.getElementById('choiceC').value,
            d: document.getElementById('choiceD').value
        },
        correctAnswer: document.getElementById('correctAnswer').value,
        score: document.getElementById('scoreNewQuestion').value,
        difficulty: document.getElementById('difficulty').value
    };

    const response = await fetch('http://localhost:3000/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion)
    });

    if (response.ok) {
        showSuccess("Question added successfully");
        loadQuestions();
        closeModal('addQuestionModal');
    } else {
        showError("Failed to add question");
    }
}

window.deleteQuestionId = deleteQuestionId;
window.prepareEditId = prepareEditId;
window.saveExamChanges = saveExamChanges;
window.startEditExam = startEditExam;
window.addStudentIntoExam = addStudentIntoExam;

if (editExamBtn) editExamBtn.onclick = () => { startEditExam(); openModal('editExamModal'); };
if (addQuestionBtn) addQuestionBtn.onclick = () => openModal('addQuestionModal');
if (addStudentBtn) addStudentBtn.onclick = () => openModal('addStudentModal');
if (closeEditQuestionBtn) closeEditQuestionBtn.onclick = () => closeModal('editQuestionModal');
if (addNewQuestionBtn) addNewQuestionBtn.onclick = AddNewQuestion;
if (saveExamChangesBtn) saveExamChangesBtn.onclick = saveExamChanges;
if (CloseeditExamModal) CloseeditExamModal.onclick = () => { closeModal("editExamModal") }

[editExamModal, document.getElementById('editQuestionModal'), document.getElementById('addQuestionModal'), document.getElementById('addStudentModal')].forEach(modal => {
    if (modal) {
        modal.onclick = (e) => { if (e.target === modal) closeModal(modal.id); };
    }
});

async function init() {
    await loadDetails();
    await loadQuestions();
    await loadStudents();
}
init();
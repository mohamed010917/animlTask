const allStudents = localStorage.getItem("allStudents") ? 
JSON.parse(localStorage.getItem("allStudents")) : [];
export {allStudents};

const allTeachers= localStorage.getItem("allTeachers") ?
JSON.parse(localStorage.getItem("allTeachers")) : [];
export {allTeachers};
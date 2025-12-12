const allStudents = localStorage.getItem("allStudents") ? 
JSON.parse(localStorage.getItem("allStudents")) : [];


const allTeachers = localStorage.getItem("allTeachers") ? 
JSON.parse(localStorage.getItem("allTeachers")) : [];

export {allStudents , allTeachers};


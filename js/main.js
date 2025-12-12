const allStudents = localStorage.getItem("allStudents") ? 
JSON.parse(localStorage.getItem("allStudents")) : [];

export {allStudents};
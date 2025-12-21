class Student{
    constructor(name , password ,mobile , imgurl , grade ){
        this.name = name;
        this.password = password;
        this.mobile = mobile;
        this.imgurl = imgurl;
        this.grade = grade;
        this.id = Date.now().toString(36).slice(-4) +
                Math.random().toString(36).slice(2, 4);;
        this.exams = [];
        this.resultExams = [];
        this.role = "student";
    }
    
}


export default Student;
class Student{
    constructor(name , password ,mobile , imgurl , grade ,id){
        this.name = name;
        this.password = password;
        this.mobile = mobile;
        this.imgurl = imgurl;
        this.grade = grade;
        this.id = id;
        this.exams = [];
        this.resultExams = [];
        this.role = "student";
    }
    
}


export default Student;
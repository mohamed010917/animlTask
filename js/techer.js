class Teacher{
    constructor(name , passwerd){
        this.name = name;
        this.passwerd = passwerd;
        this.role = "teacher";
        this.id = Date.now().toString(36).slice(-4) +
        Math.random().toString(36).slice(2, 4);
    }
}

export default Teacher;
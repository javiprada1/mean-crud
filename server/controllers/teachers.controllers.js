const Teacher = require('../models/teacher');

const teacherCtrl = {};

teacherCtrl.getTeachers = async (req, res) =>{
    try{
        const teachers = await Teacher.find();
        res.json(teachers);
    }catch(err){
        res.json({status:'Teachers not found.'});
    }
    
};

teacherCtrl.createTeacher = async (req, res) =>{
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json({
        status:'Teacher save'
    });
};

teacherCtrl.getTeacher = (req, res) =>{
    Teacher.findById(req.params.id)
        .then(teacher => {
            res.json(teacher);
        })
        .catch(err =>{
            res.json({status:'Teacher not found. '+err});  
        });
}

teacherCtrl.editTeacher = async (req, res) =>{
    const { id } = req.params;
    const teacher = {
        name : req.body.name,
        surname : req.body.surname,
        area : req.body.area,
        salary : req.body.salary
    }

    await Teacher.findByIdAndUpdate(id, {$set:teacher}, {new:true});
    res.json({status:'Teacher update'});
}

teacherCtrl.deleteTeacher = async (req, res) =>{

    await Teacher.findByIdAndDelete(req.params.id);

    res.json({status:'Teacher deleted'});

}

module.exports = teacherCtrl;
const {Schema, model} = require('mongoose');



const courseSchema = new Schema({
courseName:{type: String, required: true, trim:true, maxlength:[50, 'Course name must be less than 50 characters'] },
courseCode:{type: String, required: true, trim:true, maxlength:[10, 'Course Code must be less than 10 characters'] },
courseDescription:{type: String, required: true, trim:true, maxlength:[500, 'Course description must be less than 500 characters'] },
courseType:{type: String, enum: ['Core', 'Elective', 'optional'], default: 'Core'},
courseStatus:{type: String, enum: ['Active','Inactive'], default: 'Active'},
courseTeachers:[{type: Schema.Types.ObjectId, ref: 'Teacher'}],
courseStudents:[{type: Schema.Types.ObjectId, ref: 'Student'}],
courseClass:[{type: Schema.Types.ObjectId, ref: 'Class'}],
courseSubjects:[{type: Schema.Types.ObjectId, ref: 'Subject'}],
courseMaterials:[{type: Schema.Types.ObjectId, ref: 'Materials'}],
courseAssignments:[{type: Schema.Types.ObjectId, ref: 'Assignment'}],
courseQuizzes:[{type: Schema.Types.ObjectId, ref: 'Quiz'}],
courseExams:[{type: Schema.Types.ObjectId, ref: 'Exam'}],
}, {timestamps: true});

const CourseModel = model('Course', courseSchema);
module.exports = model('Course', courseSchema);
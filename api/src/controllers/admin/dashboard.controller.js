const AdminModel = require('../../models/admin.model.js');

const ClassModel = require('../../models/class.model.js');
const CourseModel = require('../../models/course.model.js');
const StudentModel = require('../../models/student.model.js');
const TeacherModel = require('../../models/teacher.model.js');
const ComplaintModel = require('../../models/complaint.model.js');
const HomeworkModel = require('../../models/homework.model.js');
const AssignmentModel = require('../../models/assignment.model.js');
const ExamModel = require('../../models/exam.model.js');
const EventModel = require('../../models/event.model.js');
const AttendanceModel = require('../../models/attendance.model.js');

// =====================================================
// Admin Dashboard Statistics
// =====================================================

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalAdmins,
            totalClasses,
            totalCourses,
            totalStudents,
            totalTeachers,
            totalComplaints,
            totalHomework,
            totalAssignments,
            totalExams,
            totalEvents,
            totalAttendance
        ] = await Promise.all([
            AdminModel.countDocuments(),

            ClassModel.countDocuments(),

            CourseModel.countDocuments(),

            StudentModel.countDocuments(),

            TeacherModel.countDocuments(),

            ComplaintModel.countDocuments(),

            HomeworkModel.countDocuments(),

            AssignmentModel.countDocuments(),

            ExamModel.countDocuments(),

            EventModel.countDocuments(),

            AttendanceModel.countDocuments()
        ]);

        return res.status(200).json({
            success: true,

            message: 'Dashboard statistics fetched successfully',

            stats: {
                admins: totalAdmins,
                classes: totalClasses,
                courses: totalCourses,
                students: totalStudents,
                teachers: totalTeachers,
                complaints: totalComplaints,
                homework: totalHomework,
                assignments: totalAssignments,
                exams: totalExams,
                events: totalEvents,
                attendance: totalAttendance
            }
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Dashboard Overview
// =====================================================

const getDashboardOverview = async (req, res, next) => {
    try {
        const [
            totalStudents,
            totalTeachers,
            totalClasses,
            totalCourses,
            totalComplaints
        ] = await Promise.all([
            StudentModel.countDocuments(),
            TeacherModel.countDocuments(),
            ClassModel.countDocuments(),
            CourseModel.countDocuments(),
            ComplaintModel.countDocuments()
        ]);

        return res.status(200).json({
            success: true,

            data: {
                students: totalStudents,
                teachers: totalTeachers,
                classes: totalClasses,
                courses: totalCourses,
                complaints: totalComplaints
            }
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Recent Complaints
// =====================================================

const getRecentComplaints = async (req, res, next) => {
    try {
        const complaints = await ComplaintModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Upcoming Exams
// =====================================================

const getUpcomingExams = async (req, res, next) => {
    try {
        const today = new Date();

        const exams = await ExamModel
            .find({
                date: {
                    $gte: today
                }
            })
            .sort({ date: 1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            count: exams.length,
            exams
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Upcoming Events
// =====================================================

const getUpcomingEvents = async (req, res, next) => {
    try {
        const today = new Date();

        const events = await EventModel
            .find({
                date: {
                    $gte: today
                }
            })
            .sort({ date: 1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Dashboard Controller Exports
// =====================================================

module.exports = {
    getDashboardStats,
    getDashboardOverview,
    getRecentComplaints,
    getUpcomingExams,
    getUpcomingEvents
};
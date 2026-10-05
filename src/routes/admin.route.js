const { Router } = require('express');

// =====================================================
// Admin Controller
// =====================================================

const {
    loginAdmin,
    getMe,
    changePassword,
    updateMyPhoto,
} = require('../controllers/admin/admin.controller.js');

// =====================================================
// Dashboard Controller
// =====================================================

const {
    getDashboardStats,
    getDashboardOverview,
    getRecentComplaints,
    getUpcomingExams,
    getUpcomingEvents,
} = require('../controllers/admin/dashboard.controller.js');

// =====================================================
// Announcement Controller
// =====================================================

const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement,
} = require('../controllers/admin/announcement.controller.js');

// =====================================================
// Class Controller
// =====================================================

const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    activateClass,
    deactivateClass,
} = require('../controllers/admin/class.controller.js');

// =====================================================
// Complaint Controller
// =====================================================

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    assignComplaint,
} = require('../controllers/admin/complaint.controller.js');

// =====================================================
// Course Controller
// =====================================================

const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    activateCourse,
    deactivateCourse,
} = require('../controllers/admin/course.controller.js');

// =====================================================
// Student Controller
// =====================================================

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    activateStudent,
    deactivateStudent,
} = require('../controllers/admin/student.controller.js');

// =====================================================
// Guardian Controller
// =====================================================

const {
    createGuardian,
    getGuardians,
    getGuardianById,
    updateGuardian,
    deleteGuardian,
    activateGuardian,
    deactivateGuardian,
    addChild,
    removeChild,
} = require('../controllers/admin/guardiancontroller.js');

// =====================================================
// Middleware
// =====================================================

const adminProtector = require('../middleware/admin.middleware.js');
const upload = require('../middleware/multer.middleware.js');

const router = Router();

// =====================================================
// Public Routes
// =====================================================

// Admin Login
router.post('/login', loginAdmin);

// =====================================================
// Protected Routes
// All routes below require a valid admin JWT
// =====================================================

router.use(adminProtector);

// =====================================================
// Admin Profile
// =====================================================

router.get('/me', getMe);

router.patch(
    '/me/password',
    changePassword
);

router.patch(
    '/me/photo',
    upload.single('photo'),
    updateMyPhoto
);

// =====================================================
// Admin Dashboard
// =====================================================

router.get(
    '/dashboard',
    getDashboardStats
);

router.get(
    '/dashboard/overview',
    getDashboardOverview
);

router.get(
    '/dashboard/complaints',
    getRecentComplaints
);

router.get(
    '/dashboard/exams',
    getUpcomingExams
);

router.get(
    '/dashboard/events',
    getUpcomingEvents
);

// =====================================================
// Announcements
// =====================================================

// Create announcement
router.post(
    '/announcements',
    createAnnouncement
);

// Get all announcements
router.get(
    '/announcements',
    getAnnouncements
);

// Get single announcement
router.get(
    '/announcements/:id',
    getAnnouncementById
);

// Update announcement
router.patch(
    '/announcements/:id',
    updateAnnouncement
);

// Delete announcement
router.delete(
    '/announcements/:id',
    deleteAnnouncement
);

// Publish announcement
router.patch(
    '/announcements/:id/publish',
    publishAnnouncement
);

// Unpublish announcement
router.patch(
    '/announcements/:id/unpublish',
    unpublishAnnouncement
);

// =====================================================
// Classes
// =====================================================

// Create class
router.post(
    '/classes',
    createClass
);

// Get all classes
router.get(
    '/classes',
    getClasses
);

// Get single class
router.get(
    '/classes/:id',
    getClassById
);

// Update class
router.patch(
    '/classes/:id',
    updateClass
);

// Delete class
router.delete(
    '/classes/:id',
    deleteClass
);

// Activate class
router.patch(
    '/classes/:id/activate',
    activateClass
);

// Deactivate class
router.patch(
    '/classes/:id/deactivate',
    deactivateClass
);

// =====================================================
// Complaints
// =====================================================

// Create complaint
router.post(
    '/complaints',
    createComplaint
);

// Get all complaints
router.get(
    '/complaints',
    getComplaints
);

// Get complaint by ID
router.get(
    '/complaints/:id',
    getComplaintById
);

// Update complaint
router.patch(
    '/complaints/:id',
    updateComplaint
);

// Delete complaint
router.delete(
    '/complaints/:id',
    deleteComplaint
);

// Update complaint status
router.patch(
    '/complaints/:id/status',
    updateComplaintStatus
);

// Assign complaint
router.patch(
    '/complaints/:id/assign',
    assignComplaint
);

// =====================================================
// Courses
// =====================================================

// Create course
router.post(
    '/courses',
    createCourse
);

// Get all courses
router.get(
    '/courses',
    getCourses
);

// Get single course
router.get(
    '/courses/:id',
    getCourseById
);

// Update course
router.patch(
    '/courses/:id',
    updateCourse
);

// Delete course
router.delete(
    '/courses/:id',
    deleteCourse
);

// Activate course
router.patch(
    '/courses/:id/activate',
    activateCourse
);

// Deactivate course
router.patch(
    '/courses/:id/deactivate',
    deactivateCourse
);

// =====================================================
// Students
// =====================================================

// Create student
router.post(
    '/students',
    createStudent
);

// Get all students
router.get(
    '/students',
    getStudents
);

// Get student by ID
router.get(
    '/students/:id',
    getStudentById
);

// Update student
router.patch(
    '/students/:id',
    updateStudent
);

// Delete student
router.delete(
    '/students/:id',
    deleteStudent
);

// Activate student
router.patch(
    '/students/:id/activate',
    activateStudent
);

// Deactivate student
router.patch(
    '/students/:id/deactivate',
    deactivateStudent
);

// =====================================================
// Guardians
// =====================================================

// Create guardian
router.post(
    '/guardians',
    createGuardian
);

// Get all guardians
router.get(
    '/guardians',
    getGuardians
);

// Get guardian by ID
router.get(
    '/guardians/:id',
    getGuardianById
);

// Update guardian
router.patch(
    '/guardians/:id',
    updateGuardian
);

// Delete guardian
router.delete(
    '/guardians/:id',
    deleteGuardian
);

// Activate guardian
router.patch(
    '/guardians/:id/activate',
    activateGuardian
);

// Deactivate guardian
router.patch(
    '/guardians/:id/deactivate',
    deactivateGuardian
);

// Add child to guardian
router.patch(
    '/guardians/:id/children',
    addChild
);

// Remove child from guardian
router.delete(
    '/guardians/:id/children/:studentId',
    removeChild
);

// =====================================================
// Export Router
// =====================================================

module.exports = router;
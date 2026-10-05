// =====================================================
// Exam Access Utility
// =====================================================

const canAccessExam = (user, exam) => {
    if (!user || !exam || !user._id) {
        return false;
    }

    // Admin has full access
    if (user.role === 'admin') {
        return true;
    }

    // Teacher can access exams they created
    if (user.role === 'teacher') {
        return (
            exam.createdBy &&
            exam.createdBy.toString() === user._id.toString()
        );
    }

    // Student can access exams assigned to them
    if (user.role === 'student') {
        if (!exam.students || !Array.isArray(exam.students)) {
            return false;
        }

        return exam.students.some(
            studentId =>
                studentId &&
                studentId.toString() === user._id.toString()
        );
    }

    // Parent can access exams assigned to their child
    if (user.role === 'parent') {
        if (!exam.students || !Array.isArray(exam.students)) {
            return false;
        }

        if (!Array.isArray(user.children)) {
            return false;
        }

        return exam.students.some(studentId =>
            user.children.some(
                childId =>
                    childId &&
                    studentId &&
                    childId.toString() === studentId.toString()
            )
        );
    }

    // Unknown role
    return false;
};

module.exports = {
    canAccessExam,
};
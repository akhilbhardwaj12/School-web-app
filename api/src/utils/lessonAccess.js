// =====================================================
// Lesson Access Utility
// =====================================================

const canAccessLesson = (user, lesson) => {
    if (!user || !lesson || !user._id) {
        return false;
    }

    // Admin has full access
    if (user.role === 'admin') {
        return true;
    }

    // Teacher can access lessons they created
    if (user.role === 'teacher') {
        return (
            lesson.createdBy &&
            lesson.createdBy.toString() === user._id.toString()
        );
    }

    // Student can access lessons assigned to them
    if (user.role === 'student') {
        if (!lesson.students || !Array.isArray(lesson.students)) {
            return false;
        }

        return lesson.students.some(
            studentId =>
                studentId &&
                studentId.toString() === user._id.toString()
        );
    }

    // Parent can access lessons assigned to their child
    if (user.role === 'parent') {
        if (
            !Array.isArray(lesson.students) ||
            !Array.isArray(user.children)
        ) {
            return false;
        }

        return lesson.students.some(studentId =>
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
    canAccessLesson,
};
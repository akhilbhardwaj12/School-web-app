// =====================================================
// Homework Access Utility
// =====================================================

const canAccessHomework = (user, homework) => {
    if (!user || !homework || !user._id) {
        return false;
    }

    // Admin has full access
    if (user.role === 'admin') {
        return true;
    }

    // Teacher can access homework they created
    if (user.role === 'teacher') {
        return (
            homework.createdBy &&
            homework.createdBy.toString() === user._id.toString()
        );
    }

    // Student can access homework assigned to them
    if (user.role === 'student') {
        if (!homework.students || !Array.isArray(homework.students)) {
            return false;
        }

        return homework.students.some(
            studentId =>
                studentId &&
                studentId.toString() === user._id.toString()
        );
    }

    // Parent can access homework assigned to their child
    if (user.role === 'parent') {
        if (
            !Array.isArray(homework.students) ||
            !Array.isArray(user.children)
        ) {
            return false;
        }

        return homework.students.some(studentId =>
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
    canAccessHomework,
};
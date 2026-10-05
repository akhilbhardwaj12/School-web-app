// =====================================================
// Attendance Access Utility
// =====================================================

const canAccessAttendance = (user, attendance) => {
    if (!user || !attendance) {
        return false;
    }

    // Admin has full access
    if (user.role === 'admin') {
        return true;
    }

    // Teacher can access attendance
    // if they are the teacher who marked it
    if (user.role === 'teacher') {
        return (
            attendance.markedBy &&
            attendance.markedBy.toString() === user._id.toString()
        );
    }

    // Student can access only their own attendance
    if (user.role === 'student') {
        return (
            attendance.student &&
            attendance.student.toString() === user._id.toString()
        );
    }

    // Parent can access their child's attendance
    if (user.role === 'parent') {
        if (!attendance.student) {
            return false;
        }

        return user.children?.some(
            childId =>
                childId.toString() ===
                attendance.student.toString()
        );
    }

    return false;
};

module.exports = {
    canAccessAttendance
};
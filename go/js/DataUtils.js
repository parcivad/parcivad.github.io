/**
 * Finds person of type student or teacher in DataHolder
 * @param uuid      studentId or teacherId
 * @returns {*}     Return person
 */
function findPerson(uuid) {
    let student = getDH("students").find(f => f.studentId === uuid);
    return student !== undefined ? student : getDH("teachers").find(f => f.teacherId === uuid);
}
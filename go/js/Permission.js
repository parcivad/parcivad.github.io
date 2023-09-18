/**
 * Const. Enum collection of permission names to work with in api context
 * FIXME: pretty dumb solution
 * @author Timur Stegmann
 */

const Permission = {
    STUDENT_IDENTITY_OTHER: "student.identity.other",
    STUDENT_COURSE_ADD_OTHER: "student.course.add.other",
    STUDENT_COURSE_REMOVE_OTHER: "student.course.remove.other",
    STUDENT_ROLE_ADD: "student.role.add",
    STUDENT_ROLE_REMOVE: "student.role.remove",
    STUDENT_DELETE_OTHER: "student.delete.other",

    TEACHER_ADD: "teacher.add",
    TEACHER_DELETE: "teacher.delete",

    COMMENT_ADD: "comment.add",
    COMMENT_DELETE: "comment.delete",
    COMMENT_DELETE_OWN: "comment.delete.own",

    POLL_CREATE: "poll.create",
    POLL_OPTION_ADD: "poll.option.add",
    POLL_OPTION_REMOVE: "poll.option.remove",
    POLL_DELETE: "poll.delete",
    POLL_DELETE_OWN: "poll.delete.own",

    RANKING_CREATE: "ranking.create",
    RANKING_SHOW_PUBLISHER: "ranking.show.publisher",
    RANKING_SHOW_LIKES: "ranking.show.likes",
    RANKING_DELETE: "ranking.delete",
    RANKING_DELETE_OWN: "ranking.delete.own",

    QUOTATION_CREATE: "quotation.create",
    QUOTATION_SHOW_PUBLISHER: "quotation.show.publisher",
    QUOTATION_SHOW_LIKES: "quotation.show.likes",
    QUOTATION_DELETE: "quotation.delete",
    QUOTATION_DELETE_OWN: "quotation.delete.own",

    FINANCE_ACCESS: "finance.access",
    FINANCE_SET_GOAL: "finance.set.goal",
    FINANCE_CREATE_TRANSACTION: "finance.create.transaction",

    ROLE_CREATE: "role.create",
    ROLE_EDIT: "role.edit",
    ROLE_DELETE: "role.delete",

    AUDITLOG_SHOW: "auditlog.show",
    AUDITLOG_DELETE: "auditlog.delete"
}
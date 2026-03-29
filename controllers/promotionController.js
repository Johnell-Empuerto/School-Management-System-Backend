const promotionModel = require("../models/promotionModel");
const logAction = require("../utils/auditLogger");

const getPromotionStudents = async (req, res) => {
  try {
    const { school_year_id, grade, section } = req.query;

    const students = await promotionModel.getPromotionStudents(
      school_year_id,
      grade,
      section,
    );

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const runPromotion = async (req, res) => {
  try {
    const { students, next_year_id } = req.body;

    const promotionResults = [];

    for (const student of students) {
      const { enrollment_id, student_id, next_class_id, action } = student;
      const result = { student_id, action, success: false };

      // PROMOTE or RETAIN
      if (action === "promote" || action === "retain") {
        if (!next_class_id) continue;

        await promotionModel.insertEnrollment(
          student_id,
          next_class_id,
          next_year_id,
        );

        await promotionModel.completeEnrollment(enrollment_id);

        // LOG PROMOTE/RETAIN ACTION
        await logAction({
          user_id: req.session.user.id,
          action: action === "promote" ? "PROMOTE_STUDENT" : "RETAIN_STUDENT",
          table_name: "enrollments",
          record_id: enrollment_id,
          old_value: JSON.stringify({ enrollment_id, status: "enrolled" }),
          new_value: JSON.stringify({
            student_id,
            next_class_id,
            next_year_id,
            action,
          }),
        });

        result.success = true;
      }

      // TRANSFER
      if (action === "transfer") {
        await promotionModel.completeEnrollment(enrollment_id);

        await promotionModel.updateStudentStatus(student_id, "transferred");

        // LOG TRANSFER ACTION
        await logAction({
          user_id: req.session.user.id,
          action: "TRANSFER_STUDENT",
          table_name: "students",
          record_id: student_id,
          old_value: JSON.stringify({ status: "enrolled" }),
          new_value: JSON.stringify({ status: "transferred", enrollment_id }),
        });

        result.success = true;
      }

      // GRADUATE
      if (action === "graduate") {
        await promotionModel.completeEnrollment(enrollment_id);

        await promotionModel.updateStudentStatus(student_id, "graduated");

        // LOG GRADUATE ACTION
        await logAction({
          user_id: req.session.user.id,
          action: "GRADUATE_STUDENT",
          table_name: "students",
          record_id: student_id,
          old_value: JSON.stringify({ status: "enrolled" }),
          new_value: JSON.stringify({ status: "graduated", enrollment_id }),
        });

        result.success = true;
      }

      // NOT ENROLL
      if (action === "not_enroll") {
        await promotionModel.completeEnrollment(enrollment_id);

        // LOG NOT ENROLL ACTION
        await logAction({
          user_id: req.session.user.id,
          action: "NOT_ENROLL_STUDENT",
          table_name: "enrollments",
          record_id: enrollment_id,
          old_value: JSON.stringify({ enrollment_id, status: "enrolled" }),
          new_value: JSON.stringify({
            status: "completed",
            reason: "not_enroll",
          }),
        });

        result.success = true;
      }

      promotionResults.push(result);
    }

    // LOG PROMOTION BATCH ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "RUN_PROMOTION_BATCH",
      table_name: "enrollments",
      record_id: null,
      old_value: null,
      new_value: JSON.stringify({
        next_year_id,
        total_students: students.length,
        results: promotionResults,
      }),
    });

    res.json({
      message: "Promotion completed successfully",
      results: promotionResults,
    });
  } catch (error) {
    console.error(error);

    // LOG PROMOTION ERROR
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "PROMOTION_ERROR",
      table_name: "enrollments",
      record_id: null,
      old_value: null,
      new_value: JSON.stringify({
        error: error.message,
        students: req.body.students,
      }),
    });

    res.status(500).json({
      message: error.message,
    });
  }
};

const getNextClasses = async (req, res) => {
  try {
    const { school_year_id } = req.query;

    const classes = await promotionModel.getNextYearClasses(school_year_id);

    res.json(classes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPromotionStudents,
  runPromotion,
  getNextClasses,
};

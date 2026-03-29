const activityModel = require("../models/activityModel");
const logAction = require("../utils/auditLogger");

const getActivities = async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "activity_date";
    const page = parseInt(req.query.page) || 1;

    const limit = 5;
    const offset = (page - 1) * limit;

    const activities = await activityModel.getActivities(
      search,
      sort,
      limit,
      offset,
    );

    const total = await activityModel.countActivities(search);

    res.json({
      data: activities,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createActivity = async (req, res) => {
  try {
    const { title, description, activity_date, type } = req.body;

    const user_id = req.session.user.id;

    const result = await activityModel.createActivity(
      title,
      description,
      activity_date,
      type,
      user_id,
    );

    // LOG CREATE ACTIVITY
    await logAction({
      user_id: req.session.user.id,
      action: "CREATE_ACTIVITY",
      table_name: "activities",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        title,
        description,
        activity_date,
        type,
        created_by: user_id,
      }),
    });

    res.json({ message: "Posted successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, activity_date, type } = req.body;

    // Get old values before update
    const [oldActivity] = await activityModel.getActivityById(id);

    await activityModel.updateActivity(
      id,
      title,
      description,
      activity_date,
      type,
    );

    // LOG UPDATE ACTIVITY
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_ACTIVITY",
      table_name: "activities",
      record_id: id,
      old_value: JSON.stringify({
        title: oldActivity?.title,
        description: oldActivity?.description,
        activity_date: oldActivity?.activity_date,
        type: oldActivity?.type,
      }),
      new_value: JSON.stringify({
        title,
        description,
        activity_date,
        type,
      }),
    });

    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // Get activity details before deletion for logging
    const [activity] = await activityModel.getActivityById(id);

    await activityModel.deleteActivity(id);

    // LOG DELETE ACTIVITY
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_ACTIVITY",
      table_name: "activities",
      record_id: id,
      old_value: JSON.stringify({
        title: activity?.title,
        description: activity?.description,
        activity_date: activity?.activity_date,
        type: activity?.type,
        created_by: activity?.created_by,
      }),
      new_value: null,
    });

    res.json({ message: "Activity deleted" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};

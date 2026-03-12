const activityModel = require("../models/activityModel");

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

    await activityModel.createActivity(
      title,
      description,
      activity_date,
      type,
      user_id,
    );

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

    await activityModel.updateActivity(
      id,
      title,
      description,
      activity_date,
      type,
    );

    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    await activityModel.deleteActivity(id);

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

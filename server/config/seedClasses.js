import ClassModel from "../models/Class.js";

const defaultClasses = ["9", "10", "11", "12", "BCA", "BTech"];

const seedClasses = async () => {
  try {
    const count = await ClassModel.countDocuments();

    if (count === 0) {
      await ClassModel.insertMany(
        defaultClasses.map(name => ({ name }))
      );
      console.log("Default classes inserted");
    } else {
      console.log("Classes already exist");
    }

  } catch (error) {
    console.log("Class seeding error:", error.message);
  }
};

export default seedClasses;

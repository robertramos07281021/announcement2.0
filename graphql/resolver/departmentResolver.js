import CustomError from "../../middlewares/errors.js";
import safeResolver from "../../middlewares/safeResolver.js";
import Department from "../../models/department.js";

const departmentResolver = {
  Query: {
    getDepts: safeResolver(async () => {
      const findDepts = await Department.find().populate("branch")
      return findDepts 
    }),
  },

  Mutation: {
    createNewDepartment: safeResolver(async (_, { input }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      const newDept = new Department({
        name: input.name,
        branch: input.branch,
      });

      await newDept.save();

      return {
        success: true,
        message: "Successfully added new department",
      };
    }),
    updateDepartment: safeResolver(async (_, { input }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const updateDept = await Department.findByIdAndUpdate(input._id, {
        name: input.name,
        branch: input.branch,
      });
      if (!updateDept) throw new CustomError("Depapartment not found", 404);

      return {
        success: true,
        message: "Department successfully updated",
      };
    }),
    deleteDepartment: safeResolver(async (_, { _id }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const deletetDepartment = await Department.findByIdAndDelete(_id);
      if (!deletetDepartment)
        throw new CustomError("Depapartment not found", 404);

      return {
        success: true,
        message: "Department successfully deleted",
      };
    }),
  },
};

export default departmentResolver;

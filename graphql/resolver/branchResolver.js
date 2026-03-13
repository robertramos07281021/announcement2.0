import CustomError from "../../middlewares/errors.js";
import safeResolver from "../../middlewares/safeResolver.js";
import Branch from "../../models/branch.js";

const branchResolver = {
  Query: {
    getBranches: safeResolver(async () => {
      const findBranch = await Branch.find()
      return findBranch 
    }),
  },

  Mutation: {
    createNewBranch: safeResolver(async (_, { name }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      const newBranch = new Branch({
        name: name,
      });

      await newBranch.save();

      return {
        success: true,
        message: "Successfully added new branch",
      };
    }),
    updateBranch: safeResolver(async (_, { input }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const updateDept = await Branch.findByIdAndUpdate(input._id, {
        name: input.name,
      });
      if (!updateDept) throw new CustomError("Depapartment not found", 404);

      return {
        success: true,
        message: "Branch successfully updated",
      };
    }),
    deleteBranch: safeResolver(async (_, { id }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const deletetDepartment = await Branch.findByIdAndDelete(id);
      if (!deletetDepartment)
        throw new CustomError("Branch not found", 404);

      return {
        success: true,
        message: "Branch successfully deleted",
      };
    }),
  },
};

export default branchResolver;

import CustomError from "../../middlewares/errors.js";
import safeResolver from "../../middlewares/safeResolver.js";
import User from "../../models/user.js";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userResolvers = {
  Query: {
    findUsers: safeResolver(async () => {
      const users = await User.find().populate({
        path: "department",
        populate: "branch",
      });
      return users;
    }),
    findMe: safeResolver(async (_, __, { user }) => {
      return user;
    }),
  },
  Mutation: {
    createAccount: safeResolver(async (_, { input }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      const saltPassword = await bcrypt.genSalt(10);
      const password =
        input.type === "ADMIN" ? process.env.IT_PASS : "Bernales2026";

      const hashPassword = await bcrypt.hash(password, saltPassword);

      const newUser = new User({ ...input, password: hashPassword });
      await newUser.save();
      return {
        success: true,
        message: "New Account has been Created",
      };
    }),
    updateAccount: safeResolver(async (_, { input, id }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      const updateUser = await User.findByIdAndUpdate(id, {
        $set: { ...input },
      });
      if (!updateUser) new CustomError("User not found", 404);

      return {
        success: true,
        message: "Account has been Updated",
      };
    }),
    login: safeResolver(
      async (_, { username, password }, { req, pubsub, PUBSUB_EVENTS }) => {
        const findUser = await User.findOne({ username });
        if (!findUser)
          throw new CustomError("Username or Password is incorrect", 402);

        const validatePassword = await bcrypt.compare(
          password,
          findUser.password,
        );

        if (!validatePassword)
          throw new CustomError("Username or Password is incorrect", 402);

        const token = jwt.sign({ id: findUser._id }, process.env.SECRET);

        const newUserCredential = await User.findByIdAndUpdate(
          findUser._id,
          {
            token,
          },
          { returnDocument: "after" },
        ).populate({
          path: "department",
          populate: "branch",
        });

        req.session.user = newUserCredential;

        await pubsub.publish(PUBSUB_EVENTS.NEW_LOGIN, {
          newAccountCredential: {
            userId: newUserCredential._id,
            message: PUBSUB_EVENTS.NEW_LOGIN,
          },
        });

        return {
          success: true,
          message: "Successfully Login",
          user: newUserCredential,
        };
      },
    ),
    logout: safeResolver(async (_, __, { user, res }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      await User.findByIdAndUpdate(user._id, {
        $set: { token: null, onTv: false },
      });
      res.clearCookie("connect.sid");

      return {
        success: true,
        message: "Successfully logout",
      };
    }),
    deleteAccount: safeResolver(async (_, { _id }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      await User.findByIdAndDelete(_id);

      return {
        success: true,
        message: "Account successfully delete",
      };
    }),
    onTvNavigate: safeResolver(async (_, { value }, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);

      const findUser = await User.findById(user._id);

      await User.findByIdAndUpdate(user._id, {
        onTv: value,
      });

      return {
        success: true,
        message: "Successfully updated",
      };
    }),
  },
};

export default userResolvers;

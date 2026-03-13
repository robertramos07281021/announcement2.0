import mongoose from "mongoose";
import CustomError from "../../middlewares/errors.js";
import safeResolver from "../../middlewares/safeResolver.js";
import Announcement from "../../models/announcement.js";
import Department from "../../models/department.js";
import Branch from "../../models/branch.js";

import { promises as fsPromises } from "fs";

const announcementResolver = {
  Query: {
    getMonitorValues: safeResolver(async (_, __, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const sideDepartment = (
        await Department.find({
          name: { $in: ["ADMIN", "HR", "SSD", "OPERATIONS"] },
        })
      ).map((x) => x._id);

      const mainBranch = await Branch.findOne({ name: "MAIN" });

      const findAnnouncement = await Announcement.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "department",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: { path: "$department", preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            "department._id": {
              $in: [...sideDepartment, user.department].map(
                (id) => new mongoose.Types.ObjectId(id),
              ),
            },
            "department.branch": new mongoose.Types.ObjectId(mainBranch._id),
          },
        },
      ]);

      return findAnnouncement;
    }),
    findAnnouncement: safeResolver(async (_, __, { user }) => {
      if (!user) throw new CustomError("Unauthorized", 401);
      const announcement = await Announcement.findOne({
        department: user.department,
      }).populate({
        path: "department",
        populate: "branch",
      });
      return announcement;
    }),
    getAllAnnouncement: safeResolver(async () => {
      const announcement = await Announcement.find().populate({
        path: "department",
        populate: "branch",
      });

      return announcement;
    }),
  },
  Mutation: {
    createNewAnnounce: safeResolver(
      async (_, { input }, { user, pubsub, PUBSUB_EVENTS }) => {
        if (!user) throw new CustomError("Unauthorized", 401);

        let findAnnouncement = await Announcement.findOne({
          department: user.department,
        });

        if (findAnnouncement)
          throw new CustomError("Already have announcement", 402);

        if (!input.side) {
          findAnnouncement = new Announcement({
            main: {
              value: input.value,
              type: input.type,
            },
            department: user.department,
          });
          await findAnnouncement.save();
        } else {
          findAnnouncement = new Announcement({
            side: {
              value: input.value,
              type: input.type,
            },
            department: user.department,
          });
          await findAnnouncement.save();

          if (input.type === "text") {
            await pubsub.publish(PUBSUB_EVENTS.NEW_ANNOUNCEMENT, {
              newAnnouncement: {
                message: PUBSUB_EVENTS.NEW_ANNOUNCEMENT,
              },
            });
          }
        }

        return {
          success: true,
          message: "Successfully add new announcement",
          announcement: findAnnouncement?._id,
        };
      },
    ),
    updateAnnounce: safeResolver(
      async (_, { input }, { user, pubsub, PUBSUB_EVENTS }) => {
        if (!user) throw new CustomError("Unauthorized", 401);

        const announcement = await Announcement.findById(input._id);
        if (!announcement) throw new CustomError("Announcement not found", 404);

        const isSide = input.side === true;

        const current = isSide ? announcement.side : announcement.main;

        if (current?.value && ["images", "video"].includes(current.type)) {
          try {
            await fsPromises.unlink(`./uploads/${current.value}`);
          } catch (err) {
            console.warn("File deletion failed:", err.message);
          }
        }

        const updated = {
          value: input.value,
          type: input.type,
        };

        if (isSide) {
          announcement.side = updated;

          if (updated.type === "text") {
            await pubsub.publish(PUBSUB_EVENTS.NEW_ANNOUNCEMENT, {
              newAnnouncement: {
                message: PUBSUB_EVENTS.NEW_ANNOUNCEMENT,
              },
            });
          }
        } else {
          announcement.main = updated;
        }

        await announcement.save();

        return {
          success: true,
          message: "Announcement successfully updated",
          announcement: announcement._id,
        };
      },
    ),
  },
};

export default announcementResolver;

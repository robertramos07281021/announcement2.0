import "dotenv/config.js";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import connectDB from "./dbConnection/_db.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { useServer } from "graphql-ws/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import session from "express-session";
import { PUBSUB_EVENTS } from "./middlewares/pubsubEvents.js";
import pubsub from "./middlewares/pubsub.js";
import MongoStore from "connect-mongo";
import CustomError from "./middlewares/errors.js";
import path from "path";
import cron from "node-cron";
import { fileURLToPath } from "url";
import EventEmitter from "events";
import User from "./models/user.js";
import subscriptionsResolver from "./graphql/resolver/subscriptionResolver.js";
import UserTypeDefs from "./graphql/schema/userSchema.js";
import typesTypeDefs from "./graphql/schema/typesSchema.js";
import subscriptionTypeDefs from "./graphql/schema/subscriptionSchema.js";
import userResolvers from "./graphql/resolver/userResolver.js";
import bcrypt from "bcryptjs";
import Branch from "./models/branch.js";
import Department from "./models/department.js";
import branchResolver from "./graphql/resolver/branchResolver.js";
import branchTypeDefs from "./graphql/schema/branchSchema.js";
import departmentResolver from "./graphql/resolver/departmentResolver.js";
import departmentTypeDefs from "./graphql/schema/departmentSchema.js";
import announcementResolver from "./graphql/resolver/announcementResolver.js";
import announcementTypeDefs from "./graphql/schema/announcementSchema.js";
import multer from "multer";
import Announcement from "./models/announcement.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

EventEmitter.defaultMaxListeners = 5000;

const connectedUsers = new Map();

function getMillisecondsUntilEndOfDay() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() - now.getTime();
}

const app = express();
connectDB();
const allowedOrigins = [
  process.env.MY_FRONTEND,
  `http://${process.env.MY_IP}:5000`,
  `http://${process.env.MY_IP}:8000`,
  `http://localhost:5000`,
  `http://localhost:8000`,
  'https://announcement2-0.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setHours(24, 0, 0, 0);
const secondsUntilMidnight = Math.floor((tomorrow - now) / 1000);

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
  ttl: secondsUntilMidnight,
});

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
});

app.use(sessionMiddleware);

app.use((req, res, next) => {
  if (req.session && !req.session.cookie.maxAge) {
    req.session.cookie.maxAge = getMillisecondsUntilEndOfDay();
  }
  next();
});

cron.schedule(
  "0 0 * * *",
  async () => {
    try {
    } catch (error) {
      console.error("Cron job error", error);
    }
  },
  {
    timezone: "Asia/Singapore",
  },
);

const resolvers = mergeResolvers([
  subscriptionsResolver,
  userResolvers,
  branchResolver,
  departmentResolver,
  announcementResolver,
]);

const typeDefs = mergeTypeDefs([
  UserTypeDefs,
  typesTypeDefs,
  subscriptionTypeDefs,
  branchTypeDefs,
  departmentTypeDefs,
  announcementTypeDefs,
]);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname.trim() + "_" + Date.now() + "_" + file.originalname.trim(),
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload/images/:id", upload.single("images"), async (req, res) => {
  try {
    const query = req.query.side;
    const params = req.params.id;
    const fileName = req.file.filename;

    if (query === "true") {
      const res = await Announcement.findByIdAndUpdate(params, {
        $set: {
          "side.value": fileName,
        },
      });

      await pubsub.publish(PUBSUB_EVENTS.NEW_ANNOUNCEMENT, {
        newAnnouncement: {
          message: PUBSUB_EVENTS.NEW_ANNOUNCEMENT,
        },
      });
    } else {
      await Announcement.findByIdAndUpdate(params, {
        $set: {
          "main.value": fileName,
        },
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Image successfully upload" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

app.post("/upload/video/:id", upload.single("video"), async (req, res) => {
  try {
    const query = req.query.side;
    const params = req.params.id;
    const fileName = req.file.filename;

    if (query === "true") {
      await Announcement.findByIdAndUpdate(params, {
        $set: {
          "side.value": fileName,
        },
      });
      await pubsub.publish(PUBSUB_EVENTS.NEW_ANNOUNCEMENT, {
        newAnnouncement: {
          message: PUBSUB_EVENTS.NEW_ANNOUNCEMENT,
        },
      });
    } else {
      await Announcement.findByIdAndUpdate(params, {
        $set: {
          "main.value": fileName,
        },
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Video successfully upload" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

const initWebSocketServer = (httpServer, schema) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  wsServer.setMaxListeners(2000);

  useServer(
    {
      schema,
      // context for each WS connection
      context: async (ctx) => {
        const authHeader = ctx.connectionParams?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new CustomError("Missing Token", 401);
        }
        const token = authHeader.split(" ")[1];
        let user = null;

        try {
          const decoded = jwt.verify(token, process.env.SECRET);
          user = await User.findById(decoded.id);
          if (!user) throw new CustomError("User not found", 401);

          const userId = user?._id?.toString();
          const socket = ctx?.extra?.socket;

          // Add socket to connectedUsers
          if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, {
              sockets: new Set([socket]),
              cleanupTimer: null,
            });
          } else {
            const entry = connectedUsers.get(userId);
            entry?.sockets?.add(socket);
            if (entry?.cleanupTimer) {
              clearTimeout(entry.cleanupTimer);
              entry.cleanupTimer = null;
            }
          }

          ctx.extra.userId = userId;

          return { user, pubsub, PUBSUB_EVENTS };
        } catch (err) {
          throw new CustomError(err.message, 500);
        }
      },

      // disconnect logic
      onDisconnect: async (ctx) => {
        const socket = ctx.extra?.socket;
        const userId = ctx.extra?.userId;
        if (!userId || !socket) return;

        const entry = connectedUsers.get(userId);
        if (!entry) return;

        // remove this socket
        entry.sockets.delete(socket);

        // user still has active connections
        if (entry.sockets.size > 0) return;

        // start cleanup timer
        if (entry.cleanupTimer) clearTimeout(entry.cleanupTimer);

        entry.cleanupTimer = setTimeout(async () => {
          try {
            const latest = connectedUsers.get(userId);
            if (latest && latest.sockets.size > 0) return;

            // remove from map
            connectedUsers.delete(userId);

            const userAccount = await User.findById(userId);
            if (!userAccount) return;

            await User.findByIdAndUpdate(userAccount._id, {
              token: null,
              onTv: false,
            });

            // notify offline
            await pubsub.publish(PUBSUB_EVENTS.OFFLINE_USER, {
              accountOffline: {
                message: PUBSUB_EVENTS.OFFLINE_USER,
              },
            });
          } catch (err) {
            console.error("WS cleanup error:", err);
          }
        }, 120000); // 2 min delay
      },

      onError: (ctx, msg, errors) => {
        console.error("GraphQL WS error:", errors);
      },

      keepAlive: 12000,
    },
    wsServer,
  );

  return wsServer;
};

const httpServer = createServer(app);

initWebSocketServer(httpServer, schema);

httpServer.setTimeout(10 * 60 * 1000);

httpServer.on("connection", (socket) => {
  socket.setMaxListeners(1000);
  socket.on("error", (err) => {
    if (
      !["ECONNRESET", "ECONNABORTED", "ERR_HTTP_REQUEST_TIMEOUT"].includes(
        err.code,
      )
    ) {
      console.error("❌ Socket error:", err);
    }
  });
});

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    introspection: true
  });

  try {
    await server.start();
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          const sessionUser = req.session?.user;
          let user = null;
          const authHeader = req.headers?.authorization;
          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
              const decoded = jwt.verify(token, process.env.SECRET);
              user = await User.findById(decoded.id);
            } catch (err) {
              user = null;
            }
          }

          if (sessionUser) {
            user = user || (await User.findById(sessionUser._id));
          }
          return { user, res, req, pubsub, PUBSUB_EVENTS };
        },
      }),
    );
  
     // 2️⃣ Static uploads & React build
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use(express.static(path.join(__dirname, "client/dist")));
  
    // 3️⃣ SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client/dist/index.html"));
    });



    httpServer.listen(process.env.PORT, async () => {
      console.log(
        `🚀 Server running at http://localhost:${process.env.PORT}/graphql`,
      );
      console.log("📂 Serving static files from /public");

      const findBranch = await Branch.findOne({ name: "MAIN" });
      const findDepartment = await Department.findOne({ name: "ADMIN" });
      const findUser = await User.findOne({ name: "admin" });

      if (findBranch) return;

      const newBranch = new Branch({ name: "MAIN" });

      await newBranch.save();

      if (findDepartment) return;

      const newDept = new Department({ name: "ADMIN", branch: newBranch._id });

      await newDept.save();

      if (findUser) return;

      const saltPassword = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(process.env.IT_PASS, saltPassword);
      const createAdmin = new User({
        username: "admin",
        password: hashPassword,
        name: "admin",
        type: "ADMIN",
        department: newDept._id,
      });

      await createAdmin.save();
    });
  } catch (error) {
    console.error("❌ Server startup error:", error.message);
  }
};

startServer();





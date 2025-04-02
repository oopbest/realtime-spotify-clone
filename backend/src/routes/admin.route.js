import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protectRoute, requireAdmin); // slightly optimized clean code

router.post("/songs", createSong);
router.delete("/songs/:songId", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:albumId", deleteAlbum);

router.get("/check", checkAdmin);

export default router;

import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments();
    // const totalAlbums = await Album.countDocuments();

    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        User.countDocuments(),
        Album.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    // ✅ ใช้ Promise.all() เพื่อรันหลายคำสั่งพร้อมกัน
    // ✅ ใช้ countDocuments() เพื่อนับจำนวนเพลง, ผู้ใช้, อัลบั้ม
    // ✅ ใช้ MongoDB Aggregation ($unionWith, $group, $count) เพื่อนับศิลปินที่ไม่ซ้ำกัน
    // ✅ API นี้เหมาะกับ Dashboard หรือหน้า Admin ที่ต้องการแสดง สถิติรวม

    res.status(200).json({
      totalSongs,
      totalUsers,
      totalAlbums,
      totalArtists: uniqueArtists[0]?.count || 0, // นับศิลปิน (ถ้าไม่มีให้ใช้ค่า 0)
    });
  } catch (error) {
    console.log("Error in getStats", error);
    next(error);
  }
};

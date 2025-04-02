import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // -1 = Descending => newest -> oldest, 0 = Ascending => oldest -> newest
    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getAllSongs", error);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    // ใช้ aggregate() แทน find() เพื่อดึงข้อมูลแบบขั้นสูง
    // ใช้ $sample เพื่อสุ่ม 6 รายการจาก MongoDB
    // ใช้ $project เพื่อลดข้อมูลให้แสดงเฉพาะฟิลด์ที่ต้องการ

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error);
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    // fetch 4 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    // ใช้ aggregate() แทน find() เพื่อดึงข้อมูลแบบขั้นสูง
    // ใช้ $sample เพื่อสุ่ม 6 รายการจาก MongoDB
    // ใช้ $project เพื่อลดข้อมูลให้แสดงเฉพาะฟิลด์ที่ต้องการ

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error);
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    // fetch 4 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    // ใช้ aggregate() แทน find() เพื่อดึงข้อมูลแบบขั้นสูง
    // ใช้ $sample เพื่อสุ่ม 6 รายการจาก MongoDB
    // ใช้ $project เพื่อลดข้อมูลให้แสดงเฉพาะฟิลด์ที่ต้องการ

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error);
    next(error);
  }
};

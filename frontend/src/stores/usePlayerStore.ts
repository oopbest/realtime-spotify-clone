import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null; // เพลงปัจจุบัน
  isPlaying: boolean;
  queue: Song[]; // คิวเพลง
  currentIndex: number; // index ของเพลงปัจจุบัน

  initializeQueue: (songs: Song[]) => void; // เพื่อกําหนดคิวเพลงเริ่มต้น
  playAlbum: (songs: Song[], startIndex?: number) => void; // เพื่อเล่นอัลบั้ม
  setCurrentSong: (song: Song | null) => void; // เพื่อกําหนดเพลงปัจจุบัน
  togglePlay: () => void; // เพื่อสลับการเล่นเพลง
  playNext: () => void; // เพื่อเล่นเพลงถัดไป
  playPrevious: () => void; // เพื่อเล่นเพลงก่อนหน้า
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1, // เก็บตำแหน่งของเพลงที่กำลังเล่นอยู่ในคิว (-1 หมายถึงยังไม่มีเพลงเล่น)

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs, // ใช้กำหนด คิวเพลงเริ่มต้น ด้วยลิสต์ของเพลงที่ส่งเข้ามา (songs)
      currentSong: get().currentSong || songs[0], // ตั้งค่าเพลงแรกของคิวเป็น currentSong ถ้ายังไม่มีเพลงเล่น
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex, // ถ้ายังไม่มี currentIndex (-1) ให้เซ็ตเป็น 0
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return; // ถ้าไม่มีเพลง ก็ออกจากฟังก์ชัน

    const song = songs[startIndex]; // หยิบเพลงที่ต้องการเล่นเป็นเพลงแรก

    const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs, // เซ็ตคิวเพลงทั้งหมด
      currentSong: song, // ตั้งค่าเพลงปัจจุบันเป็นเพลงแรกของอัลบั้ม
      currentIndex: startIndex, // เซ็ต index ปัจจุบัน
      isPlaying: true, // เล่นเพลงทันที
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id); // ค้นหา index ของเพลงที่ส่งเข้ามา
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex, // ถ้าไม่พบเพลงในคิว ใช้ currentIndex ปัจจุบัน
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying; // ใช้ !get().isPlaying เพื่อ สลับค่าจาก true เป็น false หรือจาก false เป็น true

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({ isPlaying: willStartPlaying });
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex]; // หยิบเพลงถัดไป

      const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }

      set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true }); // ตั้งค่าเพลงปัจจุบัน, index และเล่นเพลง
    } else {
      set({ isPlaying: false }); // ถ้าไม่มีเพลงถัดไป

      const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      const previousSong = queue[previousIndex]; // หยิบเพลงก่อนหน้า

      const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${previousSong.title} by ${previousSong.artist}`,
        });
      }

      set({
        currentSong: previousSong,
        currentIndex: previousIndex,
        isPlaying: true,
      }); // ตั้งค่าเพลงปัจจุบัน, index และเล่นเพลง
    } else {
      set({ isPlaying: false }); // ถ้าไม่มีเพลงก่อนหน้า

      const socket = useChatStore.getState().socket; // เรียกใช้งาน socket จาก useChatStore
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },
}));

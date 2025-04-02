import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null); // อ้างอิง <audio> element เพื่อควบคุมการเล่นเพลง
  const prevSongRef = useRef<string | null>(null); // ใช้เก็บ _id ของเพลงก่อนหน้า (สำหรับเช็กว่าเพลงเปลี่ยนหรือไม่)

  const { currentSong, isPlaying, playNext } = usePlayerStore(); // เรียกใช้งาน store ของเพลงปัจจุบันและสถานะการเล่น

  // โค้ดนี้ใช้ useEffect เพื่อให้เพลงเล่นหรือหยุดเมื่อสถานะการเล่น (isPlaying) เปลี่ยน
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // โค้ดนี้ใช้ useEffect เพื่อให้เพลงเล่นต่อไปโดยอัตโนมัติเมื่อจบเพลงปัจจุบัน (Auto Play Next) โดยเรียกฟังก์ชัน playNext()
  useEffect(() => {
    const audio = audioRef.current; // อ้างอิง <audio> element

    const handleEnded = () => {
      playNext(); // เรียก playNext() เมื่อเพลงจบ
    };

    audio?.addEventListener("ended", handleEnded); // เมื่อ เพลงจบ (ended) → เรียก handleEnded() เพื่อเล่นเพลงถัดไป

    return () => {
      audio?.removeEventListener("ended", handleEnded); // ล้าง event listener เมื่อ component ถูก unmount
    };
  }, [playNext]);

  // โค้ดนี้ใช้ useEffect เพื่อเปลี่ยน src ของ <audio> element เมื่อเพลงปัจจุบันเปลี่ยน
  useEffect(() => {
    if (!audioRef.current || !currentSong) return; // ถ้าไม่มี <audio> element หรือไม่มีเพลงปัจจุบัน ให้ return

    const audio = audioRef.current; // อ้างอิง <audio> element

    const isSongChange = prevSongRef.current !== currentSong?.audioUrl; // ตรวจสอบว่าเพลงเปลี่ยนหรือไม่
    if (isSongChange) {
      audio.src = currentSong?.audioUrl; // เปลี่ยน src ของ <audio> element เป็น URL ของเพลงปัจจุบัน
      audio.currentTime = 0; // เริ่มเล่นเพลงจากเริ่มต้น
      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) {
        audio.play();
      }
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;

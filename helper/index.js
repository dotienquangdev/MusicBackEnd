const Singer = require("../models/singer.model");
const Song = require("../models/song.model");
const Topic = require("../models/topic.model");

module.exports = (app) => {
    app.get("/api/singer", async (req, res) => {
        try {
            const singer = await Singer.find({});
            res.json(singer);
        } catch (error) {
            console.error('Lỗi truy vấn dữ liệu:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });

    app.get("/api/song", async (req, res) => {
        try {
            const songs = await Song.find({});

            const result = songs.map(song => ({
                _id: song._id.toString(),
                title: song.title || 'Không có tên',
                avatar: song.avatar || 'https://default-avatar.jpg',
                description: song.description || 'Không có mô tả',
                singerId: song.singerId || 'Không có thông tin ca sĩ',
                topicId: song.topicId || 'Không có thông tin chủ đề',
                like: song.like || 0,
                lyrics: song.lyrics || 'Không có lời bài hát',
                audio: song.audio || 'https://default-audio.mp3',
                status: song.status,
                slug: song.slug,
                deleted: song.deleted || false,
                updatedAt: song.updatedAt || new Date(),
            }));

            res.json(result);
        } catch (error) {
            console.error('Lỗi truy vấn dữ liệu:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });


    app.get("/api/topic", async (req, res) => {
        try {
            const result = await Topic.find({});
            res.json(result);
        } catch (error) {
            console.error('Lỗi truy vấn dữ liệu:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });
};

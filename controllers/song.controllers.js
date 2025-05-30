const Song = require("../models/song.model");
const Singer = require("../models/singer.model");
const Topic = require("../models/topic.model");
const FavoriteSong = require("../models/favorite-song.model");
const createTreeHelper = require("../helper/createTree");

module.exports.getListSong = async (req, res) => {
    const song = await Song.find({
        deleted: false,
    })
    const singer = await Singer.findOne({
        // _id: song.singerId,
        deleted: false,
        // });
    }).select("fullName");
    console.log(singer);
    res.json({
        song: song,
        singer: singer
    })
}

//[GET] /songs/detail/:slugSong
module.exports.getDetailSong = async (req, res) => {
    const slugSong = req.params.slugSong;

    const song = await Song.findOne({
        slug: slugSong,
        status: "active",
        deleted: false,
    });

    const singer = await Singer.findOne({
        _id: song.singerId,
        deleted: false,
    }).select("fullName");

    const topic = await Topic.findOne({
        _id: song.topicId,
        deleted: false,
    }).select("title");

    const favoriteSong = await FavoriteSong.findOne({
        songId: song.id,
    });

    song["isFavoriteSong"] = favoriteSong ? true : false;
    res.json({
        song: song,
        singer: singer,
        topic: topic
    });
}

//[GET] /songs/detail/:slugSong
module.exports.getDetail = async (req, res) => {

    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).json({ message: "Không tìm thấy bài hát" });
    res.json(song);
}

module.exports.createSong = async (req, res) => {

    const song = await Song.find({
        deleted: false,
    })

    if (!song) return res.status(404).json({ message: "Không tìm thấy danh sách bài hát" });
    res.json(song);
}

// module.exports.createPostSong = async (req, res) => {
//     try {
//         req.body.like = parseInt(req.body.like);

//         // Lấy URL từ file upload
//         if (req.files.avatar) {
//             req.body.avatar = req.files.avatar[0].path; // hoặc .url nếu bạn dùng Cloudinary
//         }

//         if (req.files.audio) {
//             req.body.audio = req.files.audio[0].path; // hoặc .url nếu bạn dùng Cloudinary
//         }

//         const song = new Song(req.body);
//         await song.save();
//         res.json(song);
//     } catch (error) {
//         res.status(500).json({ error: "Đã xảy ra lỗi khi tạo bài hát." });
//     }
// }

module.exports.createPostSong = async (req, res) => {
    try {
        // console.log("Body:", req.body);
        // console.log("Files:", req.files);

        req.body.like = parseInt(req.body.like) || 0;

        if (req.files?.avatar?.[0]) {
            req.body.avatar = req.files.avatar[0].path;
        }

        if (req.files?.audio?.[0]) {
            req.body.audio = req.files.audio[0].path;
        }

        const song = new Song(req.body);
        console.log(song);
        await song.save();

        res.status(201).json(song);
    } catch (error) {
        console.error("Lỗi khi tạo bài hát:", error);
        res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi tạo bài hát." });
    }
}


module.exports.editSong = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Song.findOne({
            _id: id,
            deleted: false
        });
        const records = await Song.find({
            deleted: false,
        })
        const newRecords = createTreeHelper.tree(records);
        res.json({
            data: data,
            records: newRecords
        })
    } catch (error) {
        console.error("Lỗi sửa bài hát:", error);
        return res.status(500).json({ message: "Lỗi server khi sửa bài hát." });
    }
}

module.exports.editPatchSong = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position);
        const songEdit = await Song.updateOne({ _id: id }, req.body);
        res.json({
            songEdit: songEdit
        })
        console.log("Dữ liệu nhận được:", req.body);

    } catch (error) {
        console.error("Lỗi sửa bài hát Error:", error);
        return res.status(500).json({ message: "Lỗi server errort." });
    }
}
module.exports.deleteSong = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await Song.updateOne(
            { _id: id },
            {
                $set: {
                    deleted: true,
                    deletedAt: new Date(),
                }
            }
        );
        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy bài hát để xoá." });
        }
        return res.json({ message: "Xoá bài hát thành công." });
    } catch (error) {
        console.error("Lỗi xoá bài hát:", error);
        return res.status(500).json({ message: "Lỗi server khi xoá bài hát." });
    }
};
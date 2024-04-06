const Review = require('../models/review.schema');

//เพิ่มรีวิว
module.exports.add = async (req, res) => {
    try {
        const data = new Review({
            name: req.body.name,
            review: req.body.review,
            rating: req.body.rating,
        });

        const add = await data.save();
        return res
            .status(200)
            .send({
                status: true,
                message: "เพิ่มรีวิวสำเร็จ",
                data: add,
            });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

//ดึงข้อมูลรีวิวทั้งหมด
module.exports.getAllReview = async (req, res) => {
    try {
        const review = await Review.find()
        return res.status(200).send({ status: true, data: review })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ดึงข้อมูลรีวิว by id
module.exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        return res.status(200).send({ status: true, data: review })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//แก้ไขข้อมูลรีวิว
module.exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.status(200).send({ status: true, data: review })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ลบข้อมูลรีวิว
module.exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id)
        return res.status(200).send({ status: true, data: review })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

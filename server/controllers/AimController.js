const Aim = require("../models/Aim");
const Item = require("../models/Item");

exports.create = async (req, res) => {
    const { name, duration, count, categoryId, date } = req.body;

    if (!name || !duration || !count || !categoryId || !date) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var aim = new Aim();
        aim.name = name;
        aim.duration = duration;
        aim.count = count;
        aim.categoryId = categoryId;
        aim.date = date;
        await aim.save();

        res.status(201).json({ message: "Запись успешно создана" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readByCategoryId = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var aims = await Aim.find({ categoryId: id });

        const aimsEx = await Promise.all(aims.map(async aim => {
            const items = await Item.find({ aimId: aim._id });

            const aimObj = aim.toObject();
            aimObj.items = items;
            return aimObj;
        }));

        res.status(201).json(aimsEx);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }

    try {
        var aim = await Aim.findOne({ _id: id });
        if (!aim) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        const items = await Item.find({ aimId: aim._id });

        const aimObj = aim.toObject();
        aimObj.items = items;

        res.status(201).json(aimObj);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var aim = await Aim.findOne({ _id: id });
        if (!aim) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }
        aim.name = name;
        aim = await aim.save();

        const items = await Item.find({ aimId: aim._id });

        const aimObj = aim.toObject();
        aimObj.items = items;

        res.status(201).json(aimObj);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }

    try {
        var aim = await Aim.findOne({ _id: id });
        if (!aim) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        await Aim.deleteOne({ _id: aim._id });

        res.status(201).json({ message: "Запись успешно удалена" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}
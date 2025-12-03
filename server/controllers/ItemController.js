const Item = require("../models/Item");

exports.create = async (req, res) => {
    const { name, imagePath, description, aimId, date, categoryId } = req.body;
    if (!name || !description || !date || !categoryId) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }

    try {
        var item = new Item();
        item.name = name;
        item.imagePath = imagePath;
        item.description = description;
        item.aimId = aimId;
        item.categoryId = categoryId;
        item.date = date;
        await item.save();

        res.status(201).json({ message: "Запись успешно создана" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readByAimId = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var items = await Item.find({ aimId: id });

        res.status(201).json(items);
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
        var items = await Item.find({ categoryId: id });

        res.status(201).json(items);
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
        var item = await Item.findOne({ _id: id });
        if (!item) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        res.status(201).json(item);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    const { id, name, imagePath, description } = req.body;
    if (!id || !name || !description) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var item = await Item.findOne({ _id: id });
        if (!item) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }
        item.name = name;
        if (!item.imagePath || !imagePath || !imagePath.includes(item.imagePath))
            item.imagePath = imagePath;
        item.description = description;
        item = await item.save();

        res.status(201).json(item);
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
        var item = await Item.findOne({ _id: id });
        if (!item) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        await Item.deleteOne({ _id: item._id });

        res.status(201).json({ message: "Запись успешно удалена" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}
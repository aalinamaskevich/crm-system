const Category = require("../models/Category");
const Aim = require("../models/Aim");
const Item = require("../models/Item");

exports.create = async (req, res) => {
    const { name, accountId } = req.body;
    if (!name || !accountId) {
        res.status(400).json({ keyword: "ID", message: "Недостаточно данных" });
        return;
    }
    try {
        var category = new Category();
        category.name = name;
        category.accountId = accountId;
        await category.save();

        res.status(201).json({ message: "Запись успешно создана" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readByAccountId = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }
    try {
        var categories = await Category.find({ accountId: id });

        const categoriesEx = await Promise.all(categories.map(async category => {
            const aims = await Aim.find({ categoryId: category._id });
            const itemsNoCategory = await Item.find({ categoryId: category._id, aimId: null });

            const aimsEx = await Promise.all(aims.map(async aim => {
                const items = await Item.find({ aimId: aim._id });

                const aimObj = aim.toObject();
                aimObj.items = items;
                return aimObj;
            }));

            const categoryObj = category.toObject();
            categoryObj.aims = aimsEx;
            categoryObj.items = itemsNoCategory;
            return categoryObj;
        }));

        res.status(201).json(categoriesEx);
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
        var category = await Category.findOne({ _id: id });
        if (!category) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        const aims = await Aim.find({ categoryId: category._id });
        const itemsNoCategory = await Item.find({ categoryId: category._id, aimId: null });

        const aimsEx = await Promise.all(aims.map(async aim => {
            const items = await Item.find({ aimId: aim._id });

            const aimObj = aim.toObject();
            aimObj.items = items;
            return aimObj;
        }));

        const categoryObj = category.toObject();
        categoryObj.aims = aimsEx;
        categoryObj.items = itemsNoCategory;

        res.status(201).json(categoryObj);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).json({ keyword: "ID", message: "Недостаточно данных" });
        return;
    }
    try {
        var category = await Category.findOne({ _id: id });
        if (!category) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }
        category.name = name;

        category = await category.save();

        const aims = await Aim.find({ categoryId: category._id });
        const itemsNoCategory = await Item.find({ categoryId: category._id, aimId: null });
        const aimsEx = await Promise.all(aims.map(async aim => {
            const items = await Item.find({ aimId: aim._id });

            const aimObj = aim.toObject();
            aimObj.items = items;
            return aimObj;
        }));

        const categoryObj = category.toObject();
        categoryObj.aims = aimsEx;
        categoryObj.items = itemsNoCategory;

        res.status(201).json(categoryObj);
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
        var category = await Category.findOne({ _id: id });
        if (!category) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        await Category.deleteOne({ _id: category._id });

        res.status(201).json({ message: "Запись успешно удалена" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}
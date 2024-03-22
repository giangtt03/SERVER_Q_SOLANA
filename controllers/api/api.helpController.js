const Help = require('../../models/api/Help');

module.exports = {
    createHelp: async (req, res) => {
        try {
            const { textH } = req.body;
            const newHelp = new Help({ textH });
            await newHelp.save();
            res.status(201).json(newHelp);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getAllHelps: async (req, res) => {
        try {
            const helps = await Help.find();
            res.status(200).json(helps);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getHelpById: async (req, res) => {
        try {
            const help = await Help.findById(req.params.id);
            if (help) {
                res.status(200).json(help);
            } else {
                res.status(404).json({ message: 'Không tìm thấy bản ghi' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

};

const express = require('express');
const router = express.Router();

/* --------------------------------- ROUTES --------------------------------- */

/**
 * Verify a code
 * @param codeName Route parameter - specifies the code to verify
 * @param code Body parameter - the code value to verify
 * @returns True if the code is correct, false otherwise
 */
router.post('/check/code/:codeName', (req, res) => {
    const codeName = req.params.codeName;
    const { code } = req.body;

    switch (codeName) {
        case 'master':
            res.status(200).json(code === process.env.MASTER_CODE);
            break;

        default:
            res.status(400).json({ error: 'Invalid code name' });
            break;
    }
});

/**
 * Get the length of a code
 * @param codeName Route parameter - specifies the code to verify
 * @returns The length of the code
 */
router.get('/get/code/length/:codeName', (req, res) => {
    const codeName = req.params.codeName;

    switch (codeName) {
        case 'master':
            res.status(200).json(process.env.MASTER_CODE.length);
            break;

        default:
            res.status(400).json({ error: 'Invalid code name' });
            break;
    }
});

module.exports = router;

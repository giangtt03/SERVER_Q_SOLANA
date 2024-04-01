const express = require('express');
const router = express.Router();
const nft = require('../controllers/nftController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

// Middleware để kiểm tra session
router.use(sessionMiddleware);

router.get('/', nft.getAllnfts);
router.get('/mintNfts', nft.mintNfts);
// router.post('/tranfers', nft.exchangeNFT);



module.exports = router;

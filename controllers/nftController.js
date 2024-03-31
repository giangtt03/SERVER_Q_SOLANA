const { Connection, PublicKey, Transaction, TransactionInstruction, SystemProgram } = require('@solana/web3.js');
const UserScore = require('../models/api/User');

const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('DZkW5YeDqC1xCeYrHqTa7a34wVsntPqkXtNj9R14Jnre');
exports.getAllnfts = (req, res) => {
  const user = req.session.user;
  console.log("User:", user);
  res.render('blockchain/getAllnfts', { user });
};

exports.mintNfts = (req, res) => {
  const user = req.session.user;
  console.log("User:", user);
  res.render('blockchain/nft', { user });
};

// exports.exchangeNFT = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     // Lấy thông tin điểm của người dùng từ cơ sở dữ liệu
//     const user = await UserScore.findOne({ userId });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Kiểm tra xem người dùng có đủ điểm để đổi NFT không
//     if (user.totalScore < 200) {
//       return res.status(400).json({ success: false, message: 'Insufficient score to exchange NFT' });
//     }

//     // Tạo một instruction để chuyển điểm từ người dùng đến chương trình NFT
//     const instruction = new TransactionInstruction({
//       keys: [
//         { pubkey: new PublicKey(req.user.solanaAddress), isSigner: true, isWritable: true },
//         { pubkey: programId, isSigner: false, isWritable: true },
//       ],
//       programId,
//       data: Buffer.from([1]), // Giá trị 1 để xác định hành động là đổi điểm thành NFT
//     });

//     // Tạo giao dịch và thêm instruction
//     const transaction = new Transaction().add(instruction);

//     // Ký và gửi giao dịch
//     const signature = await connection.sendTransaction(transaction, [req.user.solanaAddress]);

//     // Trừ điểm của người dùng
//     user.totalScore -= 200;
//     await user.save();

//     return res.status(200).json({ success: true, message: 'NFT exchanged successfully', signature });
//   } catch (error) {
//     console.error('Error exchanging NFT:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };
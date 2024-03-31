// const bs58 = require('bs58');
// const User = require('../../models/api/User');
// const express = require('express');
// const router = express.Router();
// const { Connection, PublicKey, Transaction, TransactionInstruction, Keypair } = require('@solana/web3.js');

// // Hàm chuyển đổi từ mảng byte sang chuỗi hex
// function arrayBufferToHex(buffer) {
//     return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
// }

// router.post('/transfer-nft', async (req, res) => {
//     const { userId, nftId, requestTime } = req.body;
//     console.log("req.body:", req.body);

//     // Thông tin ví Phantom
//     const adminPrivateKey = "3L38PQm9yYAKHkUfGYmuQpmhXaubu7jdfSbykKLvQWbZgJX862WFVs8mRoChb4EWbXdtqotwtpZ9Hw1Xh9RmfK1t";
//     const adminPublicKey = "DZkW5YeDqC1xCeYrHqTa7a34wVsntPqkXtNj9R14Jnre";

//     console.log("Private key phantom", adminPrivateKey);

//     try {
//         // Tìm người dùng theo ID
//         const user = await User.findById(userId);

//         // Kiểm tra xem người dùng có tồn tại không
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isValidBase58 = (str) => {
//             try {
//                 const decoded = bs58.decode(str);
//                 return decoded.length === 32; // Kiểm tra độ dài của kết quả giải mã
//             } catch (error) {
//                 return false; // Trả về false nếu không thể giải mã từ base58
//             }
//         };

//         // Kiểm tra nftId
//         console.log("Checking validity of nftId...");
//         console.log("nftId:", nftId);
//         const isValidNftId = isValidBase58(nftId) && bs58.decode(nftId).length === 32;
//         if (!isValidNftId) {
//             console.log("Invalid nftId:", nftId);
//             return res.status(400).json({ message: 'Invalid NFT ID' });
//         }

//         // Kiểm tra user.solanaAddress
//         console.log("Checking validity of user.solanaAddress...");
//         console.log("user.solanaAddress:", user.solanaAddress);
//         const isValidUserSolanaAddress = isValidBase58(user.solanaAddress) && bs58.decode(user.solanaAddress).length === 32;
//         if (!isValidUserSolanaAddress) {
//             console.log("Invalid user.solanaAddress:", user.solanaAddress);
//             return res.status(400).json({ message: 'Invalid user Solana address' });
//         }

//         // Kiểm tra adminPublicKey
//         console.log("Checking validity of adminPublicKey...");
//         console.log("adminPublicKey:", adminPublicKey);
//         const isValidAdminPublicKey = isValidBase58(adminPublicKey) && bs58.decode(adminPublicKey).length === 32;
//         if (!isValidAdminPublicKey) {
//             console.log("Invalid adminPublicKey:", adminPublicKey);
//             return res.status(400).json({ message: 'Invalid admin public key' });
//         }

//         // Chuyển đổi từ base58 sang buffer
//         const privateKeyBuffer = Buffer.from(bs58.decode(adminPrivateKey));
//         console.log("Private key buffer:", privateKeyBuffer);

//         // Tạo đối tượng khóa riêng tư từ buffer
//         const adminWallet = Keypair.fromSecretKey(privateKeyBuffer);
//         console.log("adminWallet", adminWallet);

//         // Kiểm tra khóa riêng tư của adminWallet
//         console.log("Admin private key:", arrayBufferToHex(adminWallet.secretKey));
//         const secretKey = adminWallet.secretKey;
//         if (!secretKey) {
//             console.error("Admin private key is undefined.");
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         // Kiểm tra xem khóa riêng tư có tồn tại không
//         if (!adminWallet || !adminWallet.secretKey) {
//             console.error("Admin private key is undefined.");
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }

//         // Tạo kết nối tới mạng Solana
//         const connection = new Connection("https://api.devnet.solana.com", "confirmed");

//         // Lấy recentBlockhash từ mạng Solana
//         console.log("Fetching recent blockhash...");
//         const { blockhash } = await connection.getRecentBlockhash();
//         console.log("Recent blockhash:", blockhash);

//         // Kiểm tra recentBlockhash
//         if (!blockhash) {
//             console.log("Recent blockhash is undefined or invalid:", blockhash);
//             return res.status(500).json({ message: 'Invalid recent blockhash' });
//         }

//         // Lấy ID của chương trình token
//         const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
//         console.log("Token program ID:", TOKEN_PROGRAM_ID.toBase58());

//         // Tạo một instruction để chuyển NFT
//         const transferInstruction = new TransactionInstruction({
//             keys: [
//                 { pubkey: new PublicKey(nftId), isSigner: false, isWritable: true }, // Địa chỉ token NFT
//                 { pubkey: new PublicKey(user.solanaAddress), isSigner: false, isWritable: true }, // Địa chỉ ví của người dùng
//                 { pubkey: new PublicKey(adminPublicKey), isSigner: true, isWritable: false } // Địa chỉ ví của admin
//             ],
//             programId: TOKEN_PROGRAM_ID,
//             data: Buffer.alloc(0), // Không có dữ liệu cho instruction này
//         });

//         // Tạo giao dịch chứa instruction để chuyển NFT
//         console.log("Creating transaction...");
//         const transaction = new Transaction().add(transferInstruction);
//         transaction.recentBlockhash = blockhash;

//         // Thêm người trả phí vào giao dịch
//         transaction.feePayer = adminWallet.publicKey;

//         // Ký giao dịch với khóa riêng tư của admin
//         console.log("Signing transaction...");
//         console.log("Admin private key:", arrayBufferToHex(adminWallet.secretKey));
//         if (!adminWallet.secretKey) {
//             console.error("Admin private key is undefined.");
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         console.log("Đối tượng giao dịch trước khi ký:", transaction);

//         transaction.sign(adminWallet);

//         console.log("adminWallet.secretKey có được xác định trước khi ký không:", adminWallet.secretKey !== undefined);

//         // Gửi giao dịch và chờ xác nhận
//         console.log("Sending transaction...");
//         const signature = await connection.sendTransaction(transaction, [adminWallet]);
//         console.log("Transaction sent. Waiting for confirmation...");

//         // Phản hồi với thông báo thành công và thông tin thời gian gửi yêu cầu
//         res.json({ message: 'NFT transferred successfully', requestTime: requestTime });
//     } catch (error) {
//         console.error('Error transferring NFT:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// module.exports = router;

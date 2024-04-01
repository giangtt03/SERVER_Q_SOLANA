// const WebSocket = require('ws');

// // Tạo máy chủ WebSocket
// const wss = new WebSocket.Server({ port: 6002 });

// // Xử lý kết nối mới
// wss.on('connection', function connection(ws) {
//   console.log('New connection');

//   // Xử lý tin nhắn từ client
//   ws.on('message', function incoming(message) {
//     console.log('Received:', message);
//   });

//   // Gửi tin nhắn cho client
//   ws.send('Vupixinhvler!');
// });

// module.exports = { wss };

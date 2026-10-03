# Khu Huấn Luyện Bắn Súng 3D

## Chạy chơi đơn (không cần cài gì)
Mở `public/index.html` bằng trình duyệt. Cần có mạng để tải three.js và font.

## Chơi 1v1 online
Cần cài [Node.js](https://nodejs.org) (bản 18 trở lên), rồi trong thư mục này chạy:

    npm install
    npm start

1. Máy chạy server mở `http://localhost:3000`, bấm **ĐẤU 1v1 ONLINE → TẠO PHÒNG**, chọn bản đồ ở menu.
2. Bạn bè mở địa chỉ server rồi bấm **VÀO PHÒNG** và nhập mã 4 chữ cái.
3. Chủ phòng bấm **BẮT ĐẦU**. Trận 60 giây, ai hạ gục nhiều hơn thì thắng. Bị hạ sẽ hồi sinh sau 3 giây.

Bạn bè cần truy cập được máy bạn:
- Cùng Wi-Fi: dùng địa chỉ `Cùng Wi-Fi: http://192.168.x.x:3000` mà server in ra khi khởi động.
- Khác mạng: chạy `npx cloudflared tunnel --url http://localhost:3000` (hoặc ngrok) rồi gửi link được cấp, hoặc đưa thư mục này lên Render / Railway / Glitch (server đọc biến `PORT`).

## Cấu trúc
    server.js           máy chủ: phát file + chuyển tin giữa 2 người trong phòng
    public/index.html   khung HTML
    public/css/style.css, net.css
    public/js/   core → map → player → state → effects → weapons → update
                 → replay → input → menu → net → anim → main   (nạp theo đúng thứ tự này)

`anim.js` là toàn bộ hoạt ảnh nhân vật (đứng thở, chạy, nhảy, nạp đạn, bị hạ gục); `player.js` dựng mô hình có khung xương cho nó dùng. `net.js` là toàn bộ phần chơi mạng. Các file còn lại là code gốc, chỉ thêm vài dòng gọi sang `net.js`.

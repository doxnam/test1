## Ý tưởng
- Mức độ khó của đề: 200 điểm
- Chức năng của web: Nhập vào một chuỗi ký tự (19 < length < 1001) để thực hiện encode Base64, URL
- Lỗ hổng trong chức năng: Có thể kiểm soát được function nào sẽ được gọi để encode và truyền dữ liệu tùy ý qua POST request gây ra lỗi

## Cách giải
Gửi một POST request với:
- `encoder` = `__defineSetter__`
- `input` = `FLAG_SESSIONID` (ví dụ: `FLAG_w1ePBvHZo1hDcQK2BEKC-JORehNOa60o`)

Sau đó nhanh tay nhấn nút ENCODE hoặc gửi tiếp một POST request

Vì request đầu tiên sẽ thay đổi setter của `FLAG_SESSIONID`, và request sau lại cố đặt `FLAG_SESSIONID` thành `flagEncoder`. Nó sẽ sinh ra thông báo lỗi có chứa nội dung của biến `flagEncoder` thu được flag
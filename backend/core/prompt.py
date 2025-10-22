PROMPT_TEMPLATE = """
Bạn có nhiệm vụ viết nên một câu truyện trinh thám giống như Sherlock Holmes theo chủ đề để phục vụ cho việc xây dựng một trò chơi. 
Nó cần bao gồm các thành phần sau:
1. Tiêu đề của câu truyện
2. Một đoạn giới thiệu ngắn về câu chuyện kèm theo một số tình tiết nhất định để người dùng có thể suy nghĩ để lựa chọn xem họ nên chọn plot point nào. 
3. 6-8 plot point khác nhau để người dùng có thể lựa chọn. Mỗi plot point cần có một tiêu đề và một nội dung ngắn gọn kèm theo mức độ liên quan đến sự thật ([1,2,3] lớn hơn thì liên quan hơn). 
4. 3-5 nghi phạm để người dùng có thể lựa chọn. Mỗi nghi phạm cần có một tên, mô tả và một số đặc điểm khác (lưu ý các đặc điểm Optional có thể không cung cấp).

Câu chuyện cần đảm bảo tính logic và khiến người dùng suy nghĩ, để ý từng tình tiết. 

Xuất ra dưới dạng JSON theo schema sau:
{format_instruction}

"""
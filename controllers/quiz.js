
const app = {
    //Hiển thị danh sách các câu hỏi
    renderListQuiz: async function () {
        // B1: Lấy danh sách các câu hỏi
        const data = await getAllQuiz();// bất đồng bộ
        console.log(data);
        // B2: Đổ dữ liệu ra danh sách
        // kiểm tra xem dât có tồn tại hay không (dùng: ?.) duyệt qua các phần tử trong mảng và trả về giá trị là mảng
        const listQuiz = data?.map((item,index)=>{
            //2.1 Nếu isActive là trạng thái true thì hiển thị k thì ngược lại
            if (item.isActive) {
                return `
                <a href="#" data-id="${item.id}" class="quiz-items list-group-item list-group-item-action list-group-item-primary">
                   ${item.title} : ${item.description}
                </a>
            `
            }
            
        }).join("") // join chuyển 1 mảng về 1 chuỗi
        //console.log(listQuiz);
        // 2.2 lấy element (div #list_quiz)
        const listQuizElement = document.getElementById('list_quiz');
        // 2.3 Đổ ra màn hình thông qua innerHTML 
        listQuizElement.innerHTML=listQuiz;
        this.handleClickQuiz()

    },
    handleClickQuiz: function () {
        // 1. Lấy danh sách (mảng) các quiz
      const quizItem =   document.querySelectorAll('.quiz-items');
      //console.log(quizItem);
        // 2. Khai báo sự kiện
        quizItem.forEach((item)=>{
            // dùng hàm addEventListener để gắn sự kiện cho item (click vào từng quiz)
            item.addEventListener('click', ()=>{
                //console.log(123);
                // 3. Xác nhận
                const title = item.textContent;
                if (window.confirm(`Bạn có chắc chắn làm quiz: ${title}`)) {
                    //console.log("Làm");
                    //Lấy id
                    //C1:
                    // const id = item.dataset.id;
                    // console.log(id);
                    //C2:
                    const id = item.getAttribute("data-id");
                    //4.chuyển trang
                    window.location = `question.html?id=${id}`;
                }
            })
            // trong hàm addEventListener thì 'click' : tên sự kiện
            // sau đó là tạo 1 function để chạy các câu lệnh bên trong
        })
    },
    start: function () {
        // render: hiển thị giao diện

        // handle: Thực thi logic

        this.renderListQuiz();
    }
}

app.start();
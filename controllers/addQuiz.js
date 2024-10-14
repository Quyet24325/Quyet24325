import { addQuiz } from "../services/api.js";
const app = {
    handleAdd: function(){
        // 1 Bắt sự kiện submit
        const form = document.getElementById('addForm').addEventListener('submit',async (event)=>{
            event.preventDefault();//ngăn chặn hành vi load lại trang
            // 2.lấy input 
            const inputTitle = document.getElementById('title');
            const inputIsActive = document.getElementById('isActive');
            const inputTime = document.getElementById('time');
            const inputDescription = document.getElementById('description');
            // 3. validate
            if (!inputTitle.value.trim()) {
                alert("Bạn chưa nhập tên Quiz");
                inputTitle.focus();
                return;// ngăn chặn thực thi các tác vụ tiếp theo
            }
            if (!inputTime.value.trim()) {
                alert("Bạn chưa nhập thời gian làm bài");
                inputTime.focus();
                return;
            }


            // 4. Lấy dữ liệu
            const data = {
                title: inputTitle.value,
                isActive: inputIsActive.value,
                time: inputTime.value,
                description: inputDescription.value || ""
            } 
            // console.log(data);
            // 5.thêm mới vào db 
            const res = await addQuiz(data);
            // alert("Thành công");
            window.location = `addQuestion.html?id=${res.id}`
            console.log(res);
            
            
        })
        
        
    },


    start: function () {
        this.handleAdd();
    }
}
app.start();
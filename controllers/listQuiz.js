import { getAllQuiz ,deleteQuiz} from "../services/api.js";

const app = {
    renderListQuiz: async function () {
        // 1. Lấy danh sách quiz
        const data = await getAllQuiz();
        console.log(data);
        // 2.Duyệt mảng data và in ra màn hình
        document.querySelector("tbody").innerHTML = data.map((item, index) => {
            return `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${item.title}</td>
                <td>${item.isActive ? `<span class="badge text-bg-success">Kích hoạt</span>` : `<span class="badge text-bg-danger">Chưa kích hoạt</span>`}</td>
                <td>${item.time}</td>
                <td>${item.description}</td>
                <td><button data-id="${item.id}" class="btn_delete btn btn-danger">Xóa</button></td>
            </tr>
            `
        }).join("");

        this.handleDelete();
    },

    handleDelete: function(){
        const btnDelete = document.querySelectorAll('.btn_delete');
        btnDelete.forEach((item)=>{
            item.addEventListener('click',()=>{
                if (window.confirm('Bạn có chắc chắn muốn xóa quiz không')) {
                    const id = item.dataset.id;
                    deleteQuiz(id);
                }
            })
        })
    },
    start: function () {
        this.renderListQuiz()
    }
}

app.start();
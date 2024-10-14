import { getAllQuiz } from "../services/api.js";

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
                <td></td>
            </tr>
            `
        }).join("");

    },

    start: function () {
        this.renderListQuiz()
    }
}

app.start();
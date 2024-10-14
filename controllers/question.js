
import { getQuizById, getQuestionByIdQuiz } from '../services/api.js'
var listQuestion = [];
var listAnswerSubmit = [];
const btnSubmit = document.getElementById('btn_submit');
var isSubmit = false;

const app = {
    getQuizandQuestion: async function () {


        //1 Lấy id trên url
        const searchParam = new URLSearchParams(window.location.search);
        // console.log(searchParam);
        if (searchParam.has('id')) {
            const id = searchParam.get('id')
            // console.log(id);
            //Phần 1: Thông tin quiz
            //2 Lấy dữ liệu theo id của quiz
            const dataQuiz = await getQuizById(id);
            // 2.1 Đếm ngược thời gian
            this.countDown(dataQuiz.time);

            // console.log(dataQuiz);
            //3 hiển thị ra giao diện
            this.renderQuizInfor(dataQuiz);

            //=================================
            //Phần 2: thông tin question
            listQuestion = await getQuestionByIdQuiz(id);
            // console.log(listQuestion);
            this.renderListQuestion(listQuestion)
        }
    },

    renderQuizInfor: function (data) {
        document.getElementById('quiz_heading').innerHTML = data.title;
        document.getElementById('quiz_description').innerHTML = data.description;

    },

    renderListQuestion: function (list) {
        // 1. Tráo câu hỏi
        list = this.random(list);
        // console.log(list);
        // 2. Duyệt qua mảng câu hỏi
        const questionItem = list?.map((item, index) => {
            // render các câu trả lời
            const listAnswers = this.renderAnsers(item.answers, item.type, item.id);
            // 3. Thay đổi nội dung câu hỏi
            return `
            <div class="question_item border border-2 rounded p-4 mb-2">
                <h4 class="question_number" id="${item.id}">Câu hỏi: ${index + 1}</h4>
                <h5 class="question_title" >
                    ${item.questionTiltle}
                </h5>
                <div class="answer_items mt-3">
                   ${listAnswers}
                </div>
            </div>
            `
        }).join("")
        document.getElementById('question_container').innerHTML = questionItem
    },

    renderAnsers: function (listAnswers, type, idQuestion) {
        //listAnswers : danh sách câu hỏi
        //type: kiểu câu hỏi: 1: radio  2: checkbox 
        //idQuestion: id của câu hỏi
        //1 tráo câu trả lời
        listAnswers = this.random(listAnswers);
        //2 Duyệt qua mảng câu trả lời
        return listAnswers?.map((ans, index) => {
            return `
            <div class="form-check fs-5 mb-3">
                <input class="form-check-input border border-2 border-primary" role="button" type="${type == 1 ? 'radio' : 'checkbox'}" 
                name="question_${idQuestion}" 
                id="answer_${idQuestion}_${ans.id}"
                data-idquestion="${idQuestion}"
                data-idanswer="${ans.id}">
                <label class="form-check-label" role="button" for="answer_${idQuestion}_${ans.id}">
                    ${ans.answerTitle} 
                </label>
            </div>
            `
        }).join("");
    },
    // sắp xếp thứ tự ngẫu nhiên
    // array.sort((a,b)=>a-b) : sắp xếp theo thứ tự tăng dần
    // array.sort((a,b)=>b-a) : sắp xếp theo thứ tự giảm dần
    random: function (array) {
        return array.sort(() => { return Math.random() - Math.random() })
    },

    handleSubmit: function () {
        btnSubmit.addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn nộp bài không")) {
                isSubmit = true;
                // 0. disable nút input (Người dùng không thể thay đổi đáp án khi đã submit)
                this.handleSubmitForm()
            }

        })
    },

    handleSubmitForm: function (array) {
        const inputAll = document.querySelectorAll('input');
        inputAll.forEach((item) => {
            // Hủy hành vi mặc định của sự kiện
            item.addEventListener('click', (e) => {
                e.preventDefault()
            })
        })

        // I Lấy thông tin đáp án mà người dùng chọn
        // 1. Lấy tất cả câu trả lời theo từng câu hỏi
        const listAnswersUser = document.querySelectorAll('.answer_items');
        // console.log(listAnswersUser);
        // 2. Duyệt qua từng nhóm câu trả lời

        listAnswersUser?.forEach((answers) => {
            // console.log({answers});
            const data = {
                idQuestion: '',
                idAnswers: [],
            }
            const inputs = answers.querySelectorAll('input')
            //3. Duyệt mảng các câu trả lời
            inputs?.forEach((ans) => {
                if (ans.checked) {
                    // console.log(ans);
                    // console.log(ans.dataset.idquestion);
                    // console.log(ans.getAttribute('data-idquestion'));
                    data.idQuestion = ans.dataset.idquestion;
                    data.idAnswers.push(ans.dataset.idanswer)

                }
            })
            // console.log(data);
            if (data.idAnswers && data.idAnswers.length) {
                listAnswerSubmit.push(data)
            }
        })
        // console.log(listAnswerSubmit);
        //Kiểm tra đáp án xem có chính xác không
        this.checkAnswers(listAnswerSubmit)  
    },
    checkAnswers: function (listAnswerSubmit) {
        // 1. Lưu trữ kết quả kiểm tra
        const checkResult = [];
        // console.log(listAnswerSubmit);
        // console.log(listQuestion); // danh sách câu hỏi từ getQuizandQuestion

        // 2. duyệt qua các đáp án mà người dùng lựa chọn
        const listStatus = [];
        let countRight = 0;

        listAnswerSubmit.forEach((ansUser) => {
            // ansUser
            // console.log(ansUser);
            // 2.1 tìm câu hỏi có đáp án trong mảng listQuestion(lấy từ db)
            const findQuestion = listQuestion.find((ques) => { return ques.id == ansUser.idQuestion })
            // console.log(findQuestion);
            // 2.2 so sánh giá trị của 2 mảng
            //  ansUser.idAnswers: danh sách đáp của user (mảng)
            // findQuestion.correctAnser: đáp án chính xác lấy từ db (mảng)
            //ansUser.idAnswers: danh sách đáp án của User(mảng)
            // findQuestion.correctAnser: danh sách đáp án chính xác lấy từ db(mảng)
            const isCheck = this.checkEqual(ansUser.idAnswers, findQuestion.correctAnser);
            // 2.3 Lưu trữ trạng thái đúng/sai của câu hỏi

            if (isCheck) {
                // nếu đúng tăng count lên 1
                countRight++
            }
            // lưu trữ trạng thái đúng hoặc sai của câu hỏi đã trả lời
            listStatus.push({
                idQuestion: findQuestion.id,
                status: isCheck
            })
        })
        // hiên thị trạng thaid đúng hoặc sai của câu hỏi đã trả lời
        this.renderStatus(listStatus);
        // thông báo
        alert(`Ban tra loi dung ${countRight}/${listQuestion.length}`)
        // console.log(listStatus);
    },

    checkEqual: function (arr1, arr2) {
        // kiểm tra hai mảng có bằng nhau không
        //1. kiểm tra độ dài 2 mảng
        if (arr1.length != arr2.length)
            return false
        // 2. Kiểm tra giá trị
        //2.1 Sắp xếp thứ tự hai mảng tăng hoặc giảm dần
        arr1 = arr1.sort()
        arr2 = arr2.sort()
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false
            }
        }
        return true
    },



    renderStatus: function (listStatus) {
        listStatus.forEach((item) => {
            const title = document.getElementById(item.idQuestion);
            title.innerHTML = `${title.textContent} ${item.status ? `<span class="badge text-bg-success">Đúng</span>` : `<span class="badge text-bg-danger">Sai</span>`}`
            // console.log(item);

        })
    },
    countDown: function (time) {
        const that = this;
        function handleTime() {
            //1. tính toán đổi giây sang phút:giây
            const minute = Math.floor(time / 60)
            // console.log(minute);

            const seccond = time % 60;
            // console.log(seccond);
            //2.lấy id"timer"
            const timeElement = document.getElementById('timer');
            timeElement.innerHTML = `${minute<10 ? '0':''}${minute}:${seccond<10 ? '0':''}${seccond}`

            // giảm thời gian sau 1s 
            time--;
            if (isSubmit) {
                clearInterval(timeInter);
            }
            if (time<0) {
                //submit bài làm
                // btnSubmit.click();
                that.handleSubmitForm();
                clearInterval(timeInter);
                timeElement.innerHTML = `Hết thời gian làm bài`
            }
        }
        const timeInter = setInterval(handleTime, 1000)


    },

    reset: function () {
        const btnReset = document.getElementById("btn_reset");
        btnReset.addEventListener("click",()=>{
            if (window.confirm("Bạn có muốn làm lại không")) {
               window.location.reload(); 
            }
        })
    },
    strart: function () {
        this.getQuizandQuestion();
        this.handleSubmit();
        this.reset();
    }
}

app.strart();
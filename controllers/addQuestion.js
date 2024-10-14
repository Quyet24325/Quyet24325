import { addQuestions } from "../services/api.js";

const app = {
    rendleQuestion: function () {
        // 1. Lấy độ dài của mảng 
        const currentQuestion = document.querySelectorAll('.question_item')?.length + 1 || 1;
        // console.log(currentQuestion);
        // 2.thêm mới dữ liệu question 

        const listQuestion = document.getElementById('list_question');

        const divElement = document.createElement('div');
        divElement.classList = 'question_item border border-2 rounded p-4 mb-2';
        // console.log(divElement);
        divElement.innerHTML = `
         <h4 class="question_number">Câu hỏi: ${currentQuestion}</h4>
            <div class="mb-3">
                <label for="question_${currentQuestion}" class="form-label">Nội dung câu hỏi</label>
                <textarea class="form-control" id="questionConten_${currentQuestion}" rows="3"></textarea>
            </div>
            <div class="answer_items mt-3">
                <div class="form-check fs-5 mb-3">
                    <!-- radio -->
                    <input class="form-check-input border border-2 border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_1">
                    <!-- text answer -->
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${currentQuestion}_1"
                            placeholder="Nhập nội dung đáp án 1">
                    </div>
                </div>

                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input border border-2 border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_2">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${currentQuestion}_2"
                            placeholder="Nhập nội dung đáp án 2">
                    </div>
                </div>

                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input border border-2 border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_3">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${currentQuestion}_3"
                            placeholder="Nhập nội dung đáp án 3">
                    </div>
                </div>

                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input border border-2 border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_4">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${currentQuestion}_4"
                            placeholder="Nhập nội dung đáp án 4">
                    </div>
                </div>


            </div>
        </div>
        `

        listQuestion.appendChild(divElement)

        const contenQuestion = document.getElementById(`questionConten_${currentQuestion}`)
        contenQuestion?.focus();
        contenQuestion?.scrollIntoView({ behavior: "smooth" });
    },



    handleAdd: function () {
        document.getElementById('btn_add').addEventListener("click", () => {
            this.rendleQuestion();
        })
    },

    handleSubmit: function () {
        document.getElementById('btn_submit').addEventListener("click",async () => {
            // 1. lấy ra các câu hỏi và trả lời theo nhóm
            const listData = document.querySelectorAll('.question_item')
            // console.log(listData);
            //1.2 lấy id của quiz trên url
            const searchParam = new URLSearchParams(window.location.search);
            let idQuiz;
            if (searchParam.has("id")) {
                idQuiz = searchParam.get("id");
                // console.log(id);

            }
            const data = []
            for (var i = 0; i < listData.length; i++) {
                // 2.1 Lấy nội dung câu hỏi
                const questionContent = document.getElementById(`questionConten_${i + 1}`)
                // console.log(questionContent);

                //2.2 lấy radio
                const check = listData[i].querySelectorAll('input[type="radio"]')
                // console.log(check);
                //2.3 lấy nội dung đáp án
                const answerlist = listData[i].querySelectorAll('input[type="text"]')
                console.log(answerlist);

                //3 validate

                const isCheck = this.validate(questionContent, check, answerlist);
                console.log(isCheck);
                if (!isCheck) {
                    break;
                }
                const item = {
                    questionTiltle: questionContent.value,
                    answers: [],
                    quizId: idQuiz,
                    type: 1,
                    correctAnser: []
                }
                answerlist.forEach((ans,index)=>{
                    item.answers.push({
                        id: (index+1).toString(),
                        answerTitle: ans.value
                    });
                })
                check.forEach((check,index)=>{
                    if(check.checked){
                        item.correctAnser.push((index+1).toString())
                    }
                })
                // console.log(item);
                data.push(item);
                
            }
            console.log(data);
            // Thêm mới các câu hỏi vào db
            if (data.length == listData.length) {
                await addQuestions(data)
                window.location = 'listQuiz.html';
                alert("Thêm thành công")
            }
            
        })
    },

    validate: function (questionContent, check, answerlist) {
        //  validate câu hỏi
        if (!questionContent.value.trim()) {
            alert('Bạn chưa nhập nội dung câu hỏi');
            questionContent.focus();
            return false;
        }
        //  validate đáp án đúng
        var isCheckRadio = false;
        for (var i = 0; i < check.length; i++) {
            // nếu có ít nhất 1 radio được lựa chọn
            if (check[i].checked == true) {
                isCheckRadio = true;
                break;
            }

        }
        if (!isCheckRadio) {
            alert('Bạn cần lựa chọn đáp án đúng');
            check[0].focus();
            return false;
        }

        // validate đáp án
        var isCheckAnswer = true;
        for (var i = 0; i < answerlist.length; i++) {
            if (!answerlist[i].value.trim()) {
                alert('Cần nhập nội dung đáp án');
                answerlist[i].focus();
                isCheckAnswer = false;
                break;
            }
        }
        if (!isCheckAnswer) {
            return false;
        }


        return true;
    },

    start: function () {
        this.rendleQuestion();
        this.handleAdd();
        this.handleSubmit();
    }
}
app.start()
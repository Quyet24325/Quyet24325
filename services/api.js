export const getAllQuiz = async () => {
    try {
        // call api lấy danh sách getAllQuiz
        const res = await fetch('http://localhost:3000/quizs');//call api: bất đồng bộ
        //await: tác dụng chờ cho câu lệnh res chạy xong mới chạy xuống câu lệnh bên dưới
        const data = await res.json();
        //console.log(data); // đồng bộ
        return data;
    } catch (error) {
        alert('Lỗi');
    }
}

export const getQuestionByIdQuiz = async (idQuiz) => {
    try {
        // call api lấy danh sách question (câu hỏi theo id của quiz)
        const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`);//call api: bất đồng bộ
        //await: tác dụng chờ cho câu lệnh res chạy xong mới chạy xuống câu lệnh bên dưới
        const data = await res.json();
        //console.log(data); // đồng bộ
        return data;
    } catch (error) {
        alert('Lỗi');
    }
}


export const getQuizById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/quizs/${id}`)
        const data = await res.json();
        return data;
    } catch (error) {
        alert(error)
    }
}

export const addQuiz = async (data) => {
    try {
        const res = await fetch(`http://localhost:3000/quizs`, {
            method: "post",// phương thức thêm mới
            headers: {
                'Conten-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const dataRes = await res.json();
        return dataRes;
    } catch (error) {
        alert(error)
    }
}

export const addQuestions = async (datas) => {
    try {
        datas.forEach(async (item) => {
            await fetch('http://localhost:3000/questions', {
                method: "post",//phương thức thêm mới
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
        })
    } catch (error) {
        alert("Lỗi")
    }
}
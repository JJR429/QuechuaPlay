
var app = new Vue({
    el: '#app',
    data: {
        level: 1,
        cant:10,
        content:1,
        response: {
            error: true,
            data: [],
            message:'Initial'
        },
        q_index: 0,
        q_rights: 0,
        q_points: 0,
        q_answers:[],
        btn_1: {
            normal: true,
            isCorrect: false,
            notCorrect: false
        },
        btn_2: {
            normal: true,
            isCorrect: false,
            notCorrect: false
        },
        btn_3: {
            normal: true,
            isCorrect: false,
            notCorrect: false
        },
        user: {
            username: '',
            points:0,
            rank:0,
            email:'',
        },
        timerEnabled: true,
        timerCount: 60,
        ramdom_options: Math.floor(Math.random() * 6) + 1,
    },
    created() {
        // this.getData();
        // console.log(this.date);
        this.getQuestions(this.level,this.cant);
    },
    methods: {
        changeContent (index){
            this.content = index;
            if(this.content == 2){
                this.play();
            }
            if(this.content == 3){
                this.pause();
                this.timerCount = 60;
            }
            if(index == 1){
                this.q_index = 0;
                this.q_rights = 0;
                this.q_points = 0;
                this.q_answers = [];
                this.pause();
                this.timerCount = 60;
            }
        },
        resetBtnColors(){
            this.btn_1.normal = true;
            this.btn_1.isCorrect = false;
            this.btn_1.notCorrect = false;
            this.btn_2.normal = true;
            this.btn_2.isCorrect = false;
            this.btn_2.notCorrect = false;
            this.btn_3.normal = true;
            this.btn_3.isCorrect = false;
            this.btn_3.notCorrect = false;
        },
        nextQuestion (){
            this.resetBtnColors();
            this.ramdom_options = Math.floor(Math.random() * 6) + 1;
            if(this.q_index == this.response.data.length-1){
                this.content = 3;
                this.changeContent(3);
            } else {
                this.q_index++;
            }
        },
        answerQuestion (index, answer, points, btn){
            let resp = 0;
            if(answer >= 0){
                if(answer == 0){
                    this.q_rights++;
                    this.q_points = parseInt(this.q_points) + parseInt(points);
                    resp = 1;
                    this.changeColorBtn(btn,resp);
                } else {
                    resp = 0;
                    this.changeColorBtn(btn,resp);
                }
            }
            if(index == this.q_answers.length){
                this.q_answers.push(resp);
                console.log(this.q_answers);
            }
            // this.nextQuestion();
        },
        getPoints (){
            let sum = 0;
            for (let index = 0; index < this.q_answers.length; index++) {
                sum = this.q_answers[index] + sum;
                
            }
            let point_x = 0;
            if(this.level == 1){
                point_x = 5;
            }
            if(this.level == 2){
                point_x = 10;
            }
            if(this.level == 3){
                point_x = 15;
            }
            return sum * point_x;
        },
        getCorrectAnswers (){
            let sum = 0;
            for (let index = 0; index < this.q_answers.length; index++) {
                sum = this.q_answers[index] + sum;
                
            }
             return sum;
        },
        changeColorBtn(btn,resp){
            if(resp==1){
                if(btn==1){
                    this.btn_1.normal = false;
                    this.btn_1.isCorrect = true;
                    this.btn_1.notCorrect = false;
                }
                if(btn == 2){
                    this.btn_2.normal = false;
                    this.btn_2.isCorrect = true;
                    this.btn_2.notCorrect = false;
                } 
                if(btn == 3){
                    this.btn_3.normal = false;
                    this.btn_3.isCorrect = true;
                    this.btn_3.notCorrect = false;
                }
            } else {
                if(btn==1){
                    this.btn_1.normal = false;
                    this.btn_1.isCorrect = false;
                    this.btn_1.notCorrect = true;
                }
                if(btn == 2){
                    this.btn_2.normal = false;
                    this.btn_2.isCorrect = false;
                    this.btn_2.notCorrect = true;
                } 
                if(btn == 3){
                    this.btn_3.normal = false;
                    this.btn_3.isCorrect = false;
                    this.btn_3.notCorrect = true;
                }
            }
        },
        validateEmail(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return false;
            } else {
                return true;
            }
        },
        async getQuestions(level,cant) {
            //call axios to sing up
            let _data = new FormData();
            _data.set("level", level);
            _data.set("cant", cant);
            axios({
                method: "post",
                url: "http://localhost/quechuarank/api/v1/",
                data: _data,
                headers: { "content-type": "application/x-www-form-urlencoded"}
            })
            .then(response => {
                //handle response
                console.log('SERVER API');
                // console.log(response);
                this.response.data = response.data.data;
                this.response.error = response.data.error;
                this.response.message = response.data.message;
                console.log(response.data)
                // return response;
            })
            .catch(response => {
                //handle error
                console.log('ERROR AXIOS');
                console.log(response);
                this.response.data = [];
                this.response.error = true;
                this.response.message = 'AXIOS_ERROR';
                // return Promise.reject(error);
            });

        },
        play() {
            this.timerEnabled = true;
        },

        pause() {
            this.timerEnabled = false;
        }
    },
    watch: {

        timerEnabled(value) {
            if (value) {
                setTimeout(() => {
                    this.timerCount--;
                }, 1000);
            }
        },

        timerCount: {
            handler(value) {

                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => {
                        this.timerCount--;
                    }, 1000);
                }

            },
            immediate: true // This ensures the watcher is triggered upon creation
        }

    }
})
let intersectY = '';
let intersectX = '';
let dots = [];
const canvas = document.querySelector("#canvas");
const button = document.querySelector('.btn_collapse');
let ctx = canvas.getContext('2d');




class Initialize{
    constructor() {
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
        this.x = '';
        this.y = '';
        this.startPositionX = '';
        this.startPositionY = '';
        this.endPositionX = '';
        this.endPositionY = '';
    }

    startApp(){

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.addEventListener('click', this.mouseDown.bind(this));
        canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        canvas.addEventListener('contextmenu', this.mouseContext.bind(this));
        button.addEventListener('click',this.hideLines.bind(this));
    }

    position(){
        if (this.startPositionX === '' && this.startPositionY === '') {
            this.startPositionX = this.x;
            this.startPositionY = this.y;
            ctx.beginPath();
            ctx.moveTo(this.startPositionX, this.startPositionY);
        }
        else if (this.startPositionX !== '' && this.startPositionY !== '' && this.endPositionX === '' && this.endPositionY === '') {
            this.endPositionX = this.x;
            this.endPositionY = this.y;

            dots.push([this.startPositionX, this.startPositionY, this.endPositionX, this.endPositionY]);
            this.startPositionX = '';
            this.startPositionY = '';
            this.endPositionX = '';
            this.endPositionY = '';
            this.point(...dots);
        }
    }
    mouseDown(event){
        this.x = event.pageX - event.target.offsetLeft;
        this.y = event.pageY - event.target.offsetTop;
        this.position();
    }

    get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        let s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;

        let s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            intersectX = Math.round(p0_x + (t * s1_x));
            intersectY = Math.round(p0_y + (t * s1_y));
        }

        return 0;
    }

    buildCircle(color){
        ctx.beginPath();
        ctx.moveTo(intersectX, intersectY);
        ctx.arc(intersectX, intersectY, 4, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.lineTo(intersectX, intersectY);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    point(...dots){
        for (let i = 0; i < dots.length; i++) {
            for (let k = i; k < dots.length; k++) {
                this.get_line_intersection(...dots[i], ...dots[k]);
                this.buildCircle('black')
            }
        }
    }

    lineVisible(...dots){
        for (let i = 0; i < dots.length; i++) {
            ctx.beginPath();
            ctx.moveTo(dots[i][0], dots[i][1]);
            ctx.lineTo(dots[i][2], dots[i][3]);
            ctx.stroke();
            ctx.closePath()
        }
    }


    mouseMove(event){
        if (this.startPositionX !== '' && this.startPositionY !== '' && this.endPositionX === '' && this.endPositionY === '') {

            this.x = event.pageX - event.target.offsetLeft;
            this.y = event.pageY - event.target.offsetTop;

            ctx.beginPath();
            ctx.moveTo(this.startPositionX, this.startPositionY);
            ctx.lineTo(this.x, this.y);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            ctx.stroke();
            ctx.closePath()

            for (let i = 0; i < dots.length; i++) {
                this.get_line_intersection(this.startPositionX, this.startPositionY, this.x, this.y, ...dots[i]);
                this.buildCircle('black');
            }

            this.lineVisible(...dots)

           this.point(...dots)
        }

    }
    mouseContext(event){
        event.preventDefault();
        this.startPositionX = '';
        this.startPositionY = '';
        this.x = '';
        this.y = '';
        ctx.clearRect(0, 0, this.width, this.height);
        this.lineVisible(...dots)
        this.point(...dots)
    }

    hideLines(){

        for (let i = 0; i < dots.length; i++) {
            console.log(dots[i][0],dots[i][0]-100, dots[i][1], dots[i][2], dots[i][3])
            setInterval(()=>{
                ctx.beginPath();
                ctx.moveTo(dots[i][0], dots[i][1]);
                ctx.lineTo(dots[i][2], dots[i][3]);
                ctx.strokeStyle = 'white';
                ctx.stroke();
                ctx.closePath()
            },2000)
            setInterval(()=>{
                ctx.beginPath();
                ctx.moveTo(dots[i][0], dots[i][1]);
                ctx.lineTo(dots[i][2], dots[i][3]);
                ctx.strokeStyle = 'white';
                ctx.stroke();
                ctx.closePath()

                for (let i = 0; i < dots.length; i++) {
                    for (let k = i; k < dots.length; k++) {
                        this.get_line_intersection(...dots[i], ...dots[k]);
                        this.buildCircle('white')
                    }
                }
            },1000)

        }
        setTimeout(()=>ctx.clearRect(0,0,innerWidth,innerHeight),3000)


    }





}


let app = new Initialize();
app.startApp();

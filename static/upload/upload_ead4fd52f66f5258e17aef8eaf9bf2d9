console.log("ooo")
var klikniete = "";
var kliked = false
var ogon = [];
var position = "DOWN"
var lapstogo = 4
var borders = new Path2D()
var bordersin = new Path2D()
var lost=true
class motor {
    constructor(x, y, color, way) {
        this.way = way;
        this.x = x;
        this.y = y;
    }
}
document.onkeydown = (e) => {
    if (e.key == "ArrowLeft") {
        stuser.way = (stuser.way - 5) % 360
    }
    if (e.key == "ArrowRight") {
        stuser.way = (stuser.way + 5) % 360
    }
    if (e.key == "ArrowLeft") {
        nduser.way = (nduser.way - 5) % 360
    }
    if (e.key == "ArrowRight") {
        nduser.way = (nduser.way + 5) % 360
    }

    kliked = false
}
let stuser = new motor(400, 370, "#dddddd", 0)
let nduser = new motor(400, 360, "#dddddd", 0)



function kDown(e) {
    klikniete = e.which
    kliked = true;
}
function kUp(e) {
    kliked = false;
}

setInterval(function () {

    stuser.x = stuser.x + Math.cos(stuser.way * Math.PI / 180)*lost;
    stuser.y = stuser.y + Math.sin(stuser.way * Math.PI / 180)*lost;


    var c = document.getElementById("myCanvas");


    var background = c.getContext("2d");
    background.rect(0, 0, 800, 400);
    background.fillStyle = "white";
    background.fill()
    background.stroke();

    borders = c.getContext("2d");
    borders.beginPath();
    borders.arc(200, 200, 200, 0.5 * Math.PI, 1.5 * Math.PI);
    borders.arc(600, 200, 200, 1.5 * Math.PI, 0.5 * Math.PI);
    borders.closePath();
    borders.stroke();
    borders.fillStyle = "green";
    borders.fill()


    bordersin = c.getContext("2d");
    bordersin.beginPath();
    bordersin.arc(200, 200, 100, 0.5 * Math.PI, 1.5 * Math.PI);
    bordersin.arc(600, 200, 100, 1.5 * Math.PI, 0.5 * Math.PI);
    bordersin.closePath();
    bordersin.stroke();
    bordersin.fillStyle = "#ffffff";
    bordersin.fill()




    if (stuser.x < 410 && stuser.x > 390) {
        if (stuser.y > 200 && position == "UP") {
            position = "DOWN"
            lapstogo--
            if (lapstogo == -1) {

                lapstogo = "WIN!!!"
                stop()
            }
        }
        if (stuser.y < 200 && position == "DOWN") {
            position = "UP"
        }

        console.log(position)
        document.getElementById("lapstogo").innerHTML = lapstogo
    }








//ogon
    let helper = {}
    helper.x = stuser.x
    helper.y = stuser.y
    ogon[ogon.length] = (helper)


    for (let i = Math.min(120, ogon.length); i >= 0; i = i - 3) {
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(ogon[i].x, ogon[i].y, 2, 0, 2 * Math.PI);
        ctx.globalAlpha = 0.01 * i;
        ctx.stroke();

    }
    for (let i = 0; i < 120; i++) {
        ogon[i] = ogon[i + 1]
    }
    ogon.length--
    var playier = c.getContext("2d");
    let image = document.createElement("img")
    image.src = "motor.jpg"



    playier.globalAlpha = 1;
    playier.save()
    playier.translate(stuser.x, stuser.y)
    playier.rotate(stuser.way * Math.PI / 180)
    playier.drawImage(image, - 15, -10, 30, 20)
    playier.restore()

    ctx.beginPath();
    ctx.moveTo(390, 300);
    ctx.lineTo(390, 400);
    ctx.stroke();


    let p1c1 = Math.sqrt(Math.pow(stuser.x - 200, 2) + Math.pow(stuser.y - 200, 2))
    let p1c2 = Math.sqrt(Math.pow(stuser.x - (200 + 400), 2) + Math.pow(stuser.y - 200, 2))

    if (p1c1 < 100 || p1c2 < 100) {
        console.log("kolizja1")
        stop()
    }



    if (p1c1 > 200 && stuser.x < 200) {
        console.log("kolizja2")
        stop()
    }
    if (p1c2 > 200 && stuser.x > 600) {
        console.log("kolizja3")
        stop()
    }


    if (stuser.x > 200 && stuser.x < 600 && stuser.y < 300 && stuser.y > 100) {
        stop()
        console.log("kolizja4")
    }
    if (stuser.y < 0 || stuser.x < 0 || stuser.y > 400 || stuser.x > 800) {
        stop()
        console.log("kolizja5")

    }
    function stop(){
        lost=false
    }




}, 10);
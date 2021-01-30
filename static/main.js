let transfer = ''
transfer = document.getElementById("data").getAttribute("name")
const dataTransfer = JSON.parse("[" + transfer + "]")[0]
let nodes = listNodes(dataTransfer)
// // find all participating nodes
function listNodes(dataTransfer){
    let nodes =[]
    for(let i = 0; i<dataTransfer.length ; i++){
        for(let j =0; j<2; j++){
            if(!nodes.includes(dataTransfer[i][j])){
                nodes.push(dataTransfer[i][j])
            }
        }
    }
    return nodes
}


if(transfer!='[]'){

    // const control = document.querySelector('#control')
    // control.style.display = "flex";/

    // var slider = document.getElementById("myRange");
    // var output = document.getElementById("demo");
    // output.innerHTML = slider.value; // Display the default slider value

    // // Update the current slider value (each time you drag the slider handle)
    // slider.oninput = function() {
    //     output.innerHTML = this.value;
    // }

    // console.log()


    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d');
    const canvas2 = document.querySelector('#canvas2')
    const ctx2 = canvas2.getContext('2d');


    const nodeRadius = 20
    const center={
        x : canvas.width/2,
        y : canvas.height/2
    }

    function drawPathCircle(){
        ctx.arc(center.x, center.y, 200, 0, Math.PI *2)
        ctx.fillStyle='blue';
        ctx.stroke();
    }

    // draws nodes with reference to center of the canvas
    function angleDrawNodes(nodeName, angle){

        let theta = Math.PI / 180 * angle 
        let x = -200 * Math.cos(theta)
        let y = -200 * Math.sin(theta)

        let pos = []
        posX = center.x + x
        posY = center.y + y
        pos.push(posX, posY)
        
        ctx.moveTo(posX+nodeRadius, posY)
        ctx.arc(posX, posY, nodeRadius, 0 , Math.PI * 2)
        ctx.fillStyle='blue';
        ctx.stroke();
        ctx.font = "20px Arial"
        ctx.fillText(nodeName,posX-6, posY+8)

        return pos
    }
    // function posDrawNodes(nodeName ,posX, posY){
    //     ctx.moveTo(posX+nodeRadius, posY)
    //     ctx.arc(posX, posY, nodeRadius, 0 , Math.PI * 2)
    //     ctx.fillStyle='blue';
    //     ctx.stroke();
    //     ctx.font = "20px Arial"
    //     ctx.fillText(nodeName,posX-6, posY+8)
    // }

    // function calcCoordinates(){
    //     let len = nodes.length
    //     let addAngle = 360 / len
    //     let curAngle = 0
    //     let pos = []
    //     let coordinates = {}
    //     let theta
    //     let x, y

    //     for(let i = 0; i < len; i++){
    //         theta = Math.PI / 180 * curAngle 
    //         x = -200 * Math.cos(theta)
    //         y = -200 * Math.sin(theta)
            
    //         let posX = center.x + x
    //         let posY = center.y + y
    //         pos.push(posX, posY)
            
    //         curAngle = curAngle + addAngle
    //         coordinates[nodes[i]] = pos
    //     }
    //     return coordinates 

    // }

    function nodeCoordinates(nodes){
        let len = nodes.length
        let theta = 360 / len
        let angle = 0;
        let pos = []
        let coordinates = {}

        for(let i = 0; i < len; i++){
            pos = angleDrawNodes(nodes[i], angle)
            angle = angle + theta

            coordinates[nodes[i]] = pos
        }
        return coordinates 
    }

    function drawLine(pos1X, pos1Y, pos2X, pos2Y){
        ctx.moveTo(pos1X, pos1Y)
        ctx.lineTo(pos2X, pos2Y)
        ctx.stroke()
    }

    function findAllLink(dataTransfer){
        let link =[]
        let data
        for(let i=0;i<dataTransfer.length; i++){
            data = dataTransfer[i]
            data = JSON.stringify(data)
            if(!link.includes(data)){
                link.push(data)
            }
        }
        return JSON.parse("["+link+"]")
    }
    function drawPath(link, coordinates){
        
        for(let i=0;i<link.length ; i++){
            let pos1 = link[i][0]
            let pos2 = link[i][1]
            let pos1X, pos1Y, pos2X, pos2Y

            console.log(link[i])
            pos1X = coordinates[pos1][0]
            pos1Y = coordinates[pos1][1]

            pos2X = coordinates[pos2][0]
            pos2Y = coordinates[pos2][1]

            drawLine(pos1X, pos1Y, pos2X, pos2Y)
        }
    }


    

    // drawPathCircle();
    let coordinates = nodeCoordinates(nodes);
    console.log(coordinates)

    let link = findAllLink(dataTransfer)
    console.log(link)

    drawPath(link, coordinates)

    function shootData(pos1, pos2, speed){

        const data = {
            pos1X: Math.round(pos1[0]),
            pos1Y: Math.round(pos1[1]),
            pos2X: Math.round(pos2[0]),
            pos2Y: Math.round(pos2[1]),
            dx: 0,
            dy:1,
            speed: speed
        }
        if(data.pos2X == data.pos1X){
            data.dx = (1/(data.pos2Y - data.pos1Y))* data.speed
        }
        if(data.pos2Y == data.pos1Y){
            data.dx = data.speed
        }
        else{
            data.dx = ((data.pos2X - data.pos1X)/(data.pos2Y - data.pos1Y))* data.speed
        }
        if(data.dx < 0){
            data.dx *= -1
        }

        if(Math.abs(data.pos2X - data.pos1X) > 200 || Math.abs(data.pos2Y - data.pos1Y) > 200){
            data.dx *= 2.1
            data.dy *= 2.1
        }
        if(data.pos2X - data.pos1X > 300 || data.pos2Y - data.pos1Y > 300){
            data.dx *= 2.5
            data.dy *= 2.5
        }

        data.dy = data.dy * data.speed
        let movX = data.pos1X
        let movY = data.pos1Y
    
        function drawCircle(movX, movY) {
            ctx2.beginPath();
            ctx2.arc(movX, movY, 5, 0, Math.PI * 2);
            ctx2.fillStyle = 'purple';
            ctx2.fill();
          }
          
          function update() {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
          
            drawCircle(movX, movY);
    
            if((data.pos1X <= data.pos2X) && (movX <= data.pos2X)){
                  movX += data.dx; //move right
            }
            if(data.pos1X >= data.pos2X && (movX >= data.pos2X)){
                    movX -= data.dx //move left
            }
            if(data.pos1Y <= data.pos2Y && (movY <= data.pos2Y)){
                  movY += data.dy; //move down
            }
            if((data.pos1Y >= data.pos2Y) && (movY >= data.pos2Y)){
                    movY -= data.dy; //move up
            }       
            requestAnimationFrame(update);
          }        
          update();
    }
    
    let i = 0
    let speed = 5
    let delay = 3000 /speed
    
    let anim = setInterval(function(){
        
        let pos1 = coordinates[dataTransfer[i][0]]
        let pos2 = coordinates[dataTransfer[i][1]]
        // speed =

        shootData(pos1, pos2, speed)
        i++
        if(i == dataTransfer.length)
            clearInterval(anim)
        }
        ,delay)
    // console.log("Simulation Complete!")
    
}
else{
    console.log("null")
}
//========BASE.JS========
const dropFirst = (array) =>{ array.shift(); return array}
const dropLast = (array) =>{ array.pop(); return array}
const modPoints = (obj1,obj2) => {
  let obj = {}
  Object.keys(obj1).map(point => obj[point] = obj1[point] + obj2[point])
  return obj
}

// convert negative coordinates to positive for a proper draw on canvas e.g {x:-1,y:2} => {x:19,y:2}
const remainder = canvasWidth => point => {
   
    Object.keys(point).map(key => point[key] = point[key]<0 ? (point[key] % canvasWidth) + canvasWidth : point[key] % canvasWidth)
    
    return point
   
 }

 const  random = max => point => {
    let obj = {}
    
    Object.keys(point).map(key => obj[key] = 
    Math.floor(Math.random() * Math.floor((max-1)-1)+1))
    return obj
  }

 const samePoint = (test,target) => Object.keys(target).every(key => target[key] === test[key])
 const willEatSelf = arr => arr.filter(x => samePoint(x,arr[0])).length > 1
 const willEatApple = (test,target) => samePoint(test,target)

   const notVallidMove = (move1,move2) => {
    return Object.keys(move1).map(key => {
       return move1[key] + move2[key] 
    }).every(v => v === 0)
  }
  

// =======SNAKE.JS =======
const initialState = () => ({
    cols:20,
    rows:20,
    moves:[{x:1,y:0}],
    snake:[],
    apple:{x:16,y:2}
});


const updateState = state => ({
    cols:state.cols,
    rows:state.rows,
    moves:updateMoves(state),
    snake:updateSnake(state),
    apple:state.apple//randomApple,
 })
 
 
 const checkInteractions =  (state, array)  => {

    if(willEatSelf(array)) return []
    
    if(willEatApple(state.apple,array[0])) {  
         state.apple = random(state.rows)(state.apple)
         return array
    } 
     return dropLast(array) 
   }
 
 const updatePoints = state => {
    state.snake.unshift(remainder(state.rows)(modPoints(state.snake[0],state.moves[0])));
    return state.snake
  }

  const enqueueMove = (state,nextMove) => {

    if (!notVallidMove(state.moves[state.moves.length-1],nextMove)) state.moves.push(nextMove)
    
    return state
     
  }  

const updateMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
   
const updateSnake = state => state.snake.length == 0 ? [{x:2,y:2}] :  checkInteractions(state,updatePoints(state))
   
// =========WEB.JS========
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let state = initialState()

//scale points
const x = p => p * Math.floor(canvas.width/state.cols)
const y = p => p * Math.floor(canvas.height/state.rows)

//draw on canvas
const draw = () => {
    //draw background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    //draw snake
    state.snake.map( p => {
        ctx.fillStyle = 'rgb(58, 170, 13)'
        ctx.fillRect(x(p.x),y(p.y),x(1),y(1))
    })
    
    //draw apple
    ctx.fillStyle = 'rgb(200, 0, 0)'
    ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1),y(1))

    //background if snake crashes
     if(state.snake.length == 0){
      ctx.fillStyle = 'rgb(200, 0, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
     }

}

document.addEventListener('keydown', function(e){

    switch(true){

        case e.code === 'ArrowUp':
             state  =    enqueueMove(state, {x:0,y:-1});
             break;
        
        case e.code === 'ArrowDown':
             state  =    enqueueMove(state, {x:0,y:1});
             break;
         
        case e.code === 'ArrowLeft':   
             state  =   enqueueMove(state, {x:-1,y:0});
             break;
    
        case e.code === 'ArrowRight':   
             state  =   enqueueMove(state, {x:1,y:0});
             break;
             
        default:     
    }      
 })

// Animation loop

const step = timeStamp1 => timeStamp2 => {
    if (timeStamp2 - timeStamp1 > 100) {
        state = updateState(state)
        draw()
        window.requestAnimationFrame(step(timeStamp2))
    } else {
        window.requestAnimationFrame(step(timeStamp1))
    }
}

draw();
window.requestAnimationFrame(step(0))




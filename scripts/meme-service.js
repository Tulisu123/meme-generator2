'use strict'

let gMeme = {
    id:getRandomId(),
    selectedImgId: 1,
    selectedLineIdx:0,
    dataUrl:'',
    lines:[]
}

let gKeywordSearchCountMap = {'funny': 0, 'cat':16, 'baby':12}


function getMeme(){
    return gMeme
}

function getImageById(ImgId){
    return gImgs.find(img => img.id === ImgId)
}

function updateGmemeText(text){
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function updateGmemeLineColor(lineColor){
    gMeme.lines[gMeme.selectedLineIdx].lineColor = `${lineColor}`
}

function updateGmemeFillColor(fillColor){
    gMeme.lines[gMeme.selectedLineIdx].fillColor = `${fillColor}`
}

function increaseFontSize(){
    gMeme.lines[gMeme.selectedLineIdx].size += 5
}

function decreaseFontSize(){
    gMeme.lines[gMeme.selectedLineIdx].size -= 5
}

function alignLeft(){
    gMeme.lines[gMeme.selectedLineIdx].pos.x -= 50
}

function alignRight(){
    gMeme.lines[gMeme.selectedLineIdx].pos.x += 50
}


function alignCenter(center){
    gMeme.lines[gMeme.selectedLineIdx].pos.x = center
}

function updateGmeme(savedMeme){
    gMeme = JSON.parse(JSON.stringify(savedMeme))
}

function updateGmemeFont(selectedFont){
    gMeme.lines[gMeme.selectedLineIdx].font = `${selectedFont}`
}

function addLine(posX,posY,txt = 'Enter text'){
    gMeme.selectedLineIdx++
    gMeme.lines.push({
        txt,
        size:30,
        lineColor:'black',
        fillColor:'black',
        font:'impact',
        pos:{
            x: posX,
            y: posY
        }
    })
}

'use strict'

let gCanvas = document.querySelector('canvas')
let gCtx = gCanvas.getContext('2d')

let isDragging = false;
let dragStartPos = { x: 0, y: 0 };
let selectedLinePos = { x: 0, y: 0 };
let gSavedMemes = loadMemeFromLocalStorage() || []

let gIsEditingMeme = false

function renderEditView() {
    addDragListeners()
    addListeners()
    resizeCanvas()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')

    gCanvas.width = elContainer.clientWidth
    gCanvas.height = elContainer.clientHeight
    renderMeme()
}

function renderImage(imgSource) {
    const img = new Image()
    img.src = `${imgSource}`

    gCanvas.height = (img.naturalHeight / img.naturalWidth) * gCanvas.width;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function renderMeme(removeMark = false) {
    let meme = getMeme()
    if(meme.lines.length === 0) onAddLine()

    let { url: imageUrl } = getImageById(meme.selectedImgId)
    let selectedLine = meme.lines[meme.selectedLineIdx]

    renderImage(imageUrl);
    updateActions(selectedLine);

    meme.lines.forEach((line) => {
        drawText(line);
    })

    if (!removeMark && selectedLine) {
        markSelectedLine(selectedLine);
    }
}

function drawText(line) {
    const fontSize = line.size
    const txt = line.txt
    const lineColor = line.lineColor
    const fillColor = line.fillColor
    const lineFont = line.font

    gCtx.beginPath()

    const pos = {}
    pos.x = line.pos.x
    pos.y = line.pos.y

    gCtx.lineWidth = 1.5
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = 'center'
    gCtx.font = `${fontSize}px ${lineFont}`

    gCtx.strokeStyle = lineColor
    gCtx.fillStyle = fillColor

    gCtx.fillText(txt, pos.x, pos.y)
    gCtx.strokeText(txt, pos.x, pos.y)
    gCtx.closePath();
}

function onChangeSelectedLine() {
    let meme = getMeme()
    if (meme.lines.length < 2) return

    meme.selectedLineIdx++
    if (meme.selectedLineIdx === meme.lines.length) meme.selectedLineIdx = 0

    let selectedLine = meme.lines[meme.selectedLineIdx]

    renderMeme()
    markSelectedLine(selectedLine)
}

function updateActions(line) {
    document.querySelector('.row-one-container .input-text').value = line.txt
}

function markSelectedLine(line) {
    console.log('selectedLine', line)
    const fontSize = line.size;
    const txt = line.txt;
    const pos = { x: line.pos.x, y: line.pos.y };

    gCtx.font = `${fontSize}px ${line.font}`;

    const textWidth = gCtx.measureText(txt).width;
   
    const paddingX = 10;
    const paddingY = 10;

    const rectX = pos.x - textWidth / 2 - paddingX;
    const rectY = pos.y - fontSize / 2 - paddingY / 2;
    const rectWidth = textWidth + paddingX * 2;
    const rectHeight = fontSize + paddingY
    gCtx.beginPath();
    gCtx.fillStyle = 'black';
    gCtx.strokeStyle = 'black';
    gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    gCtx.closePath();
}

function onTextInput(txt) {
    updateGmemeText(txt)
    renderMeme()
}

function onDeleteLine() {
    let meme = getMeme()
    let selectedLineIdx = meme.selectedLineIdx

    meme.lines.splice(selectedLineIdx, 1)
    meme.selectedLineIdx = 0

    renderMeme()
}

function getPosY() {
    let meme = getMeme()
    let positionY

    if (meme.lines.length === 0) {
        positionY = 50
    } else {
        const lastLine = meme.lines[meme.lines.length - 1]
        positionY = lastLine.pos.y + 50
    }
    return positionY
}

function moveToGallery() {
    resetMeme()
    document.querySelector('.gallery').classList.remove('display-none');
    document.querySelector('.edit-meme').classList.add('display-none');
    document.querySelector('.saved-meme').classList.add('display-none');
}

function resetMeme() {
    let meme = getMeme()
    meme.lines = []
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onAddLine() {
    let meme = getMeme()
    meme.selectedLineIdx = meme.lines.length - 1

    const posX = gCanvas.width / 2
    const posY = getPosY()
    addLine(posX, posY)
    renderMeme()
}

function onChangeLineColor(color) {
    updateGmemeLineColor(color)
    renderMeme()
}

function onChangeFillColor(color) {
    updateGmemeFillColor(color);
    renderMeme()
}

function onIncreaseFont() {
    increaseFontSize()
    renderMeme()
}

function onDecreaseFont() {
    decreaseFontSize()
    renderMeme()
}

function onAlignLeft() {
    alignLeft()
    renderMeme()
}

function onAlignCenter() {
    alignCenter(gCanvas.width / 2)
    renderMeme()
}

function onAlignRight() {
    alignRight()
    renderMeme()
}

function onDownloadMeme(){
    const dataUrl = gCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'meme.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function onChangeFont(){
    const selectElement = document.getElementById('selectbar')
    const selectedFont = selectElement.value
    updateGmemeFont(selectedFont)
    renderMeme()
}

function getLinePos(x, y) {
    let meme = getMeme();
    for (let i = 0; i < meme.lines.length; i++) {
        let line = meme.lines[i];

        console.log('line poses', line.pos.x, line.pos.y)

        const textWidth = gCtx.measureText(line.txt).width;
        const padding = 10;
        const rectX = line.pos.x - textWidth / 2 - padding; // Adjusted to center text horizontally
        const rectY = line.pos.y - line.size / 2 - padding; // Adjusted to center text vertically
        const rectWidth = textWidth + padding * 2;
        const rectHeight = line.size + padding * 2;


        if (x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight) {
            return i;
        }
    }
    return null;
}

function addListeners() {
    gCanvas.addEventListener('click', (event) => {
        console.log(gCanvas.width, gCanvas.height)

        const gRect = gCanvas.getBoundingClientRect()

        let mouseX = event.clientX - gRect.left
        let mouseY = event.clientY - gRect.top

        const selectedLineIdx = getLinePos(mouseX, mouseY)
        console.log('selectedLine in listener', selectedLineIdx)
        if (selectedLineIdx !== null) {
            let meme = getMeme();
            meme.selectedLineIdx = selectedLineIdx
            renderMeme();

        } else {
            renderMeme(true)
        }
    })

}


/////dragging impl
function addDragListeners() {
    gCanvas.addEventListener('mousedown', onMouseDown)
    gCanvas.addEventListener('mousemove', onMouseMove)
    gCanvas.addEventListener('mouseup', onMouseUp)
}

function onMouseDown(event) {
    const gRect = gCanvas.getBoundingClientRect()

    const mouseX = event.clientX - gRect.left
    const mouseY = event.clientY - gRect.top

    const selectedLineIdx = getLinePos(mouseX, mouseY)
    if (selectedLineIdx !== null) {
        isDragging = true
        let meme = getMeme()
        meme.selectedLineIdx = selectedLineIdx
        dragStartPos = { x: mouseX, y: mouseY }
        selectedLinePos = { ...meme.lines[selectedLineIdx].pos } //creates a transparent variable 
    }
}

function onMouseMove(event) {
    if (!isDragging) return

    const gRect = gCanvas.getBoundingClientRect()

    const mouseX = event.clientX - gRect.left
    const mouseY = event.clientY - gRect.top

    const dx = mouseX - dragStartPos.x
    const dy = mouseY - dragStartPos.y

    let meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.pos.x = selectedLinePos.x + dx
    line.pos.y = selectedLinePos.y + dy

    renderMeme()
}

function onMouseUp() {
    isDragging = false
}
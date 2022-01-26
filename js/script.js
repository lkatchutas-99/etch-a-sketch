window.onload = () => {
    
    // Modal Selectors
    const modal = document.querySelector('.modal');
    
    // Text input selectors
    const modalPixelSelector = document.querySelector('.first-pixel-selector');
    const pixelSelector = document.querySelector('.pixel-selector');

    // Div Selectors
    const content = document.querySelector('.content');
    const firstStripe = document.querySelector('.first-stripe');
    const secondStripe = document.querySelector('.second-stripe');
    const thirdStripe = document.querySelector('.third-stripe');
    const etchContainer = document.querySelector('.etch-container');

    // Button/hover selectors
    const blackButton = document.querySelector('.black-button');
    const allColorsButton = document.querySelector('.all-colors-button');
    const chooseColorButton = document.querySelector('.choose-color-button');
    const clearBoardButton = document.querySelector('.clear-board-button');
    const viewGridHover = document.querySelector('.view-grid');
    const eraserButton = document.querySelector('.eraser');

    // Node Lists
    const setSize = document.querySelectorAll('.set-pixels');
    const colorModeButtons = document.querySelectorAll('.color-mode-buttons');
    
    // Data object
    let data = {
        currentColumns: [],
        colorMode: '',
        pixelAmt: 0,
        hslColor: 0,
        blackIntervalID: '',
        rgbIntervalID: '',
        allColorsIntervalID: '',
        eraserIntervalID: ''
    };

    // ---------------------------------------------------------------------------------------
    // Initialize board

    // Display and hide pixel lines
    viewGridHover.addEventListener('mouseover', showGrid);
    viewGridHover.addEventListener('mouseout', hideGrid);

    // clear 
    clearBoardButton.addEventListener('click', setAllPixelsWhite)
    setSize.forEach(i => i.addEventListener('click', setPixels));
    
    buildPixels(viewGridHover, 3, 'view-grid-row', 'view-grid-column');

    // Show pixel borders
    function showGrid () {
        if (data.pixelAmt < 64) {
            data.currentColumns.forEach(i => i.style.border = 'solid');
        }
    }

    // hide pixel borders
    function hideGrid () {
        if (data.pixelAmt < 64) {
            data.currentColumns.forEach(i => i.style.border = 'none');
        }
    }

    // Remove all pixels from board
    function removeAllPixels() {
        while (etchContainer.firstChild) {
            etchContainer.removeChild(etchContainer.lastChild);
        }
    }

    // Set Pixels white
    function setAllPixelsWhite () {
        data.currentColumns.forEach(i => {
            i.style.backgroundColor = 'white';
            data.colorMode = 'eraser';
        });
    }

    // Initialize/reset pixels
    function setPixels() {
        if (!modalPixelSelector.value && !pixelSelector.value) {
            alert('Invalid value, Cannot enter an empty value')
        }
        else if (isNaN(parseInt(modalPixelSelector.value)) && isNaN(parseInt(pixelSelector.value))) {
            alert('Invalid value, Must enter a number.');
        }
        else if ((modalPixelSelector.value < 2 || modalPixelSelector.value > 100) && (pixelSelector.value < 2 || pixelSelector.value > 100)) {
            alert('Invalid value, Must enter a number between 2 and 100 inclusive');
        }
        else {
            stopButtonVisualEffects();
            data.colorMode = 'eraser'
            removeAllPixels();
            data.pixelAmt = modal.style.display === 'none' ? pixelSelector.value : modalPixelSelector.value
            buildPixels(etchContainer, data.pixelAmt, 'row', 'column');
            content.style.pointerEvents = 'auto';
            modal.style.display = 'none';
            data.currentColumns = document.querySelectorAll('.column');
            data.currentColumns.forEach(i => i.addEventListener('mouseover', drawPixel));
            modalPixelSelector.value = '';
            pixelSelector.value = '';
        }
    }

    // Add pixels to anything
    function buildPixels(currentContainer, size, rowClass, columnClass) {
        let column = document.createElement('div');
        column.classList.add(columnClass);
        for (let i = 0; i < size; i++) {

            let row = document.createElement('div');
            row.classList.add(rowClass);
            for (let j = 0; j < size; j++) {
                row.appendChild(column.cloneNode(true));
            }
            currentContainer.appendChild(row.cloneNode(true));
        }
    }

    //-----------------------------------------------------------------------
    // Mode Changer

    // Increase color
    function increaseHsl() {
        if (data.hslColor > 360) data.hslColor = 0;
        allColorsButton.style.cssText = `background-color: hsl(${data.hslColor++}, 100%, 50%);`;
    }

    // alternate RGB strips for each call
    function alternateRgbStripes() {
        if (firstStripe.style.backgroundColor === 'red') {
            firstStripe.style.backgroundColor = 'blue';
            secondStripe.style.backgroundColor = 'red';
            thirdStripe.style.backgroundColor = 'green';
        }
        else if (firstStripe.style.backgroundColor === 'blue') {
            firstStripe.style.backgroundColor = 'green';
            secondStripe.style.backgroundColor = 'blue';
            thirdStripe.style.backgroundColor = 'red';
        }
        else {
            firstStripe.style.backgroundColor = 'red';
            secondStripe.style.backgroundColor = 'green';
            thirdStripe.style.backgroundColor = 'blue';
        }
    }

    // Alternate black and white for each call
    function alternateBlackWhite() {
        if (blackButton.style.backgroundColor === 'black') {
            blackButton.style.backgroundColor = 'white'
        }
        else {
            blackButton.style.backgroundColor = 'black';
        }
    }

    // alternate eraser button color
    function alternateEraser () {
        console.log(eraserButton.style.backgroundColor);
        if (eraserButton.style.backgroundColor === 'white') {
            eraserButton.style.backgroundColor = '#fa9cb0'
        }
        else {
            eraserButton.style.backgroundColor = 'white'
        }
    }

    // Stop all button visual effects
    function stopButtonVisualEffects () {
        clearInterval(data.blackIntervalID);
        clearInterval(data.rgbIntervalID);
        clearInterval(data.allColorsIntervalID);
        clearInterval(data.eraserIntervalID);
    }

    // change color mode when a button is clicked
    function changeColorMode() {
        stopButtonVisualEffects();
        blackButton.style.backgroundColor = 'black';
        allColorsButton.style.backgroundColor = 'white';
        eraserButton.style.backgroundColor = '#fa9cb0';
        
        let setMode = this.attributes[0].value;

        switch (setMode) {
        case 'black':
            data.blackIntervalID = setInterval(alternateBlackWhite, 500);
            break;
        case 'RGB': 
            data.rgbIntervalID = setInterval(alternateRgbStripes, 300);
            break;
        case 'all': 
            data.allColorsIntervalID = setInterval(increaseHsl, 45);
            break;
        case 'eraser': {
            data.eraserIntervalID = setInterval(alternateEraser, 800);
        }
        }
        
        data.colorMode = setMode;
    }
    
    // Initialize
    colorModeButtons.forEach(i => i.addEventListener('click', changeColorMode));

    //------------------------------------------------------------------------------------------------------------
    // Pixel settings

    // Generate random color
    function generateAnyColor(pixel) {
        let rgb = [];
        for (let i = 0; i < 3; i++) {
            rgb.push(Math.floor(Math.random() * 256));
        }
        pixel.style.backgroundColor = buildRgb(rgb);
    }

    // Generate red, blue or green
    function generateRGB(pixel) {
        let rgb = Math.floor(Math.random() * 3);
        pixel.style.backgroundColor = rgb === 0 ? 'rgb(255, 0, 0)' : rgb === 1 ? 'rgb(0, 255, 0)' : 'rgb(0, 0, 255)';
    }

    // Build RGB with its updated values
    function buildRgb(rgb) {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    // Darken given color by 10%
    function generateDarkenedColor(rgbVal) {
        rgbVal -= (255 * .1);
        return rgbVal;
    }
    
    // Retrieve darkened colors
    function getDarkenedColor(rgb) {
        let individualRgbValues = rgb.substr(rgb.indexOf('(') + 1, rgb.length - 5).split(', ');

        for (let i = 0; i < individualRgbValues.length; i++) {
            if (individualRgbValues[i] != 0) {
                individualRgbValues[i] = generateDarkenedColor(individualRgbValues[i]);
            }
        }
        return individualRgbValues;
    }

    // Set darken color to element
    function setDarkenedColor(elem) {
        let subtractedRGB = getDarkenedColor(elem.style.backgroundColor);
        elem.style.backgroundColor = buildRgb(subtractedRGB);
    }

    // Set pixel to black
    function setPixelBlack(pixel) {
        pixel.style.backgroundColor = 'black';
    }

    // Set pixel to white
    function setPixelWhite(pixel) {
        pixel.style.backgroundColor = 'white';
    }

    // Set pixel to chosen 
    function setChosenColor(pixel) {
        pixel.style.backgroundColor = chooseColorButton.value;
    }

    // Change pixel's color depending on mode
    function drawPixel() {
        if (!this.style.backgroundColor || this.style.backgroundColor === 'white') {
            if (data.colorMode === 'black') {
                setPixelBlack(this);
            }

            else if (data.colorMode === 'RGB') {
                generateRGB(this);
            }

            else if (data.colorMode === 'all') {
                generateAnyColor(this);
            }
            else if (data.colorMode === 'choose') {
                setChosenColor(this);
            }
        }
        else if (data.colorMode === 'eraser') {
            setPixelWhite(this)
        }
        else {
            setDarkenedColor(this);
        }
    }
}
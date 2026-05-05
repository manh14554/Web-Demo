(function () {
    const GRID_COLS = 12;
    const GRID_ROWS = 20;
    const VISIBLE_ROWS = 18;          // last 2 rows are clipped
    const GRID_COLOR = "#D2EFFF";
    const GRID_COLOR_DARK = "#A9D9F4";
    const BOARD_FILL = "#F9FDFF";
    const INK_COLOR = "#132322";
    const INK_WIDTH = 3;

    const canvas = document.getElementById("drawing-canvas");
    const board = document.querySelector(".drawing-blueprint");
    const clearButton = document.getElementById("drawing-clear");
    const saveButton = document.getElementById("drawing-save");

    if (!canvas || !board) {
        return;
    }

    const ctx = canvas.getContext("2d");
    const strokes = [];
    let activeStroke = null;
    let isDrawing = false;

    /**
     * Derive a square cell size from the wrapper's current width so the
     * 12-column grid always fits — including phones narrower than 400 px.
     */
    function getCellSize() {
        const wrapper = board.parentElement || board;
        return Math.floor(wrapper.clientWidth / GRID_COLS);
    }

    function getBoardSize() {
        const cell = getCellSize();
        const dpr = window.devicePixelRatio || 1;
        return {
            cell,
            width: cell * GRID_COLS,
            height: cell * GRID_ROWS,           // full 20-row canvas height
            visibleHeight: cell * VISIBLE_ROWS, // 18-row clipped height
            dpr
        };
    }

    function resizeCanvas() {
        const { cell, width, height, visibleHeight, dpr } = getBoardSize();

        // Size the <canvas> element to the full 20-row grid
        canvas.width  = Math.round(width  * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width  = `${width}px`;
        canvas.style.height = `${height}px`;

        // Clip the section so only the top 18 rows are visible
        board.style.width    = `${width}px`;
        board.style.height   = `${visibleHeight}px`;
        board.style.overflow = "hidden";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }

    function drawGridLine(x1, y1, x2, y2, isDark) {
        ctx.strokeStyle = isDark ? GRID_COLOR_DARK : GRID_COLOR;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawGrid(width, height, cell) {
        ctx.save();
        ctx.fillStyle = BOARD_FILL;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;

        // Vertical lines — one between each column
        for (let col = 1; col < GRID_COLS; col++) {
            const x = col * cell;
            drawGridLine(x, 0, x, height, col % 4 === 0);
        }

        // Horizontal lines — one between each row (all 20)
        for (let row = 1; row < GRID_ROWS; row++) {
            const y = row * cell;
            drawGridLine(0, y, width, y, row % 4 === 0);
        }

        // Outer boundary — drawn around the visible area only (VISIBLE_ROWS)
        const visibleHeight = cell * VISIBLE_ROWS;
        ctx.strokeStyle = GRID_COLOR_DARK;
        ctx.lineWidth = 1;
        // Inset by 0.5 px so the stroke sits fully inside the canvas edge
        ctx.strokeRect(0.5, 0.5, width - 1, visibleHeight - 1);

        ctx.restore();
    }

    function drawStroke(stroke) {
        if (!stroke || stroke.length === 0) {
            return;
        }

        ctx.save();
        ctx.strokeStyle = INK_COLOR;
        ctx.lineWidth = INK_WIDTH;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (stroke.length === 1) {
            ctx.fillStyle = INK_COLOR;
            ctx.beginPath();
            ctx.arc(stroke[0].x, stroke[0].y, INK_WIDTH / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);

        for (let i = 1; i < stroke.length; i += 1) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }

        ctx.stroke();
        ctx.restore();
    }

    function redraw() {
        const { cell, width, height } = getBoardSize();
        drawGrid(width, height, cell);
        strokes.forEach(drawStroke);
    }

    function getPoint(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(event) {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        isDrawing = true;

        const point = getPoint(event);
        activeStroke = [point];
        strokes.push(activeStroke);

        ctx.save();
        ctx.fillStyle = INK_COLOR;
        ctx.beginPath();
        ctx.arc(point.x, point.y, INK_WIDTH / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function continueDrawing(event) {
        if (!isDrawing || !activeStroke) {
            return;
        }

        event.preventDefault();
        const point = getPoint(event);
        const previousPoint = activeStroke[activeStroke.length - 1];
        activeStroke.push(point);

        ctx.save();
        ctx.strokeStyle = INK_COLOR;
        ctx.lineWidth = INK_WIDTH;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(previousPoint.x, previousPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.restore();
    }

    function stopDrawing(event) {
        if (!isDrawing) {
            return;
        }

        isDrawing = false;
        activeStroke = null;

        if (event && canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
        }
    }

    function clearDrawing() {
        strokes.length = 0;
        activeStroke = null;
        redraw();
    }

    function saveDrawing() {
        // Capture only the visible 18 rows by drawing onto a temporary canvas
        const { cell, width, visibleHeight, dpr } = getBoardSize();
        const tmp = document.createElement("canvas");
        tmp.width  = Math.round(width         * dpr);
        tmp.height = Math.round(visibleHeight * dpr);
        const tmpCtx = tmp.getContext("2d");
        tmpCtx.drawImage(canvas, 0, 0);

        const link = document.createElement("a");
        link.download = "my-drawing.png";
        link.href = tmp.toDataURL("image/png");
        link.click();
    }

    canvas.addEventListener("pointerdown",   startDrawing);
    canvas.addEventListener("pointermove",   continueDrawing);
    canvas.addEventListener("pointerup",     stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("pointerleave",  stopDrawing);

    if (clearButton) {
        clearButton.addEventListener("click", clearDrawing);
    }

    if (saveButton) {
        saveButton.addEventListener("click", saveDrawing);
    }

    window.addEventListener("resize", resizeCanvas);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resizeCanvas);
    } else {
        resizeCanvas();
    }
})();
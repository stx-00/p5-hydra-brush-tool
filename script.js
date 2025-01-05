let time = new Date();
let zoomSlider;
let sizeSlider;
let hyperSlider;
let shapeSlider;
let backgroundSlider;
let sliderActive = false; // Flag to indicate slider activity
let sliderClicked = false; // Flag to indicate if the slider was just clicked
let buttonClicked = false; // Flag to indicate if a button is clicked

// Eco-mode for rendering only if the window is focused
window.onblur = function () {
  noLoop();
};
window.onfocus = function () {
  loop();
};

/* CUSTOM FUNCTIONS FOR P5LIVE */
// keep fullscreen if window resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// custom ease function
function ease(iVal, oVal, eVal) {
  return (oVal += (iVal - oVal) * eVal);
}

// processing compatibility
function println(msg) {
  print(msg);
}

function mouseReleased() {
  buttonClicked = false; // Reset the flag when the mouse is released
  sliderActive = false; // Reset slider activity if needed
}

// var credits = {
//   names: [
//     "Sarah.Choi", // feel free to link yourself <a href="URL" target="_blank">first.lastname</a>
//     "Yevheniia.Semenova",
//     "Siiri.Tännler",
//   ],
//   class: "IDCE HGK – MA – Digital Cultures",
//   description: "Hydra Brush Tool",
// };

/*	
	_hydra_multi // cc teddavis.org 2021	
	extends _hydra_scope for multiple instances
*/

let libs = ["https://unpkg.com/hydra-synth", "includes/libs/hydra-synth.js"];

let sel;
let pgSel = 0;
let synthCount = 8; // # of hydra instances
let cleverlayer; // layer on which we draw

// gen hydra instances
let pg = [synthCount],
  hc = [synthCount],
  synth = [synthCount];

for (let i = 0; i < synthCount; i++) {
  hc[i] = document.createElement("canvas"); // hydra canvas + custom size
  hc[i].width = 200; // set resolution width
  hc[i].height = 200; // set resolution height

  synth[i] = new Hydra({
    detectAudio: false, // no mic
    canvas: hc[i], // use hydra canvas
    makeGlobal: false, // scoped
  }).synth; // scoped hydra
}

// sandbox - start
// access each instance via synth[index]

synth[0]
  .osc(() => zoomSlider.value() / 5, 1, 0.3)
  .kaleid([3, 4, 5, 7, 8, 9, 10].fast(0.1))
  .color(0.5, 0.3)
  .colorama(0.4)
  .rotate(0.009, () => Math.sin(time) * -0.001)
  .modulateRotate(synth[0].src(synth[0].o0), () => Math.sin(time) * 0.003)
  .modulate(synth[0].src(synth[0].o0), 0.9)
  .mask(
    synth[0]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .scale(0.9)
      .modulate(synth[0].noise(0.6, () => hyperSlider.value()))
  )
  .out();
//

synth[1]
  .voronoi(() => zoomSlider.value(), 0, 1)
  .mult(
    synth[1]
      .osc(10, 0.1, () => hyperSlider.value() * 3)
      .saturate(3)
      .kaleid(200)
  )
  .mask(
    synth[1]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .modulate(synth[1].src(synth[1].o0), 0.5)
      .add(synth[1].src(synth[1].o0), 0.8)
      .scrollY(-0.01)
      .scale(0.99)
      .modulate(
        synth[1].voronoi(() => hyperSlider.value(), 1),
        0.008
      )
      .luma(0.3)
      .color(15, 25, 1)
  )
  .out();

synth[2]
  .osc(() => zoomSlider.value(), 0.28, 0.3)
  .rotate(0, 0.1)
  .mask(
    synth[2]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .mult(synth[2].osc(10, 0.1))
      .modulate(synth[2].osc(10).rotate(0, -0.1), 1)
  )
  .modulate(synth[2].noise(0.6, () => hyperSlider.value()))
  .color(2.83, 0.91, () => hyperSlider.value() * 50)
  .out();

synth[3]
  .osc(() => zoomSlider.value(), 1, 2)
  .kaleid()
  .mult(
    synth[3].osc(20, 0.001, 0).mask(
      synth[3].shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
    )
  )
  .modulateScale(synth[3].osc(10, 0), -0.03)
  .modulate(synth[3].noise(0.6, () => hyperSlider.value()))
  .scale(0.8, () => 1.05 + 0.1 * Math.sin(0.05 * time))
  // .luma(0.1)
  .out();

synth[4]
  .osc(() => zoomSlider.value(), 2, 3)
  .modulateScale(synth[4].osc(40, 0, 1).kaleid(8))
  .mask(
    synth[4]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .repeat(2, 4)
      .modulate(synth[4].noise(0.6, () => hyperSlider.value()))
  )
  .out();

synth[5]
  .osc(() => zoomSlider.value(), 0.25, 0.25)
  .mask(
    synth[5]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.1
      )
      .modulate(synth[5].noise(4.6, () => hyperSlider.value()))
      // .diff(synth[0].src(synth[0].o0))
      .scale(0.72)
      .color(0.5, 5, 1, 0, 1)
      // .scale(0.99)
      .luma(1)
      .saturate(5)
    // .color(1, 0, 3)
    // .invert()
  )
  .out();

synth[6].voronoi(2, 0.5, 0.3);
synth[6]
  .osc(() => zoomSlider.value(), 2, 1)
  .mask(
    synth[6]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .mult(
        synth[6]
          .osc(10, 0.1, () => Math.sin(time) * 3)
          .saturate(3)
          .kaleid(200)
      )
      .modulate(synth[6].src(synth[6].o0), 0.5)
      .modulate(synth[6].noise(0.6, () => hyperSlider.value()))
      .add(synth[6].src(synth[6].o0), 0.8)
      .scrollY(-0.01)
      .scale(0.99)
      .modulate(synth[6].voronoi(8, 1), 0.008)
      .luma(0.3)
  )
  .out();

//Ô	speed = 0.1

synth[7]
  .noise(() => zoomSlider.value(), 0.5, 1)
  .color(
    () => Math.sin(time * Math.random()) * 0.5 + 0.5,
    () => Math.cos(time * Math.random()) * 0.5 + 0.5,
    () => Math.sin(time * Math.random() * 1.5) * 0.5 + 0.5
  )
  .rotate(0.009, () => Math.sin(time) * 1)
  .saturate(10)
  .mask(
    synth[7]
      .shape(
        () => shapeSlider.value(),
        () => sizeSlider.value(),
        0.01
      )
      .modulate(synth[7].src(synth[7].o0), 0.5)
      .modulate(synth[7].noise(0.6, () => hyperSlider.value()))
      .mult(
        synth[7]
          .voronoi(10, 0.1, () => Math.sin(time) * 3)
          .saturate(3)
          .shift(0.5)
        // .kaleid(200)
      )
      .modulateRotate(synth[7].src(synth[7].o0), () => Math.sin(time) * 2)
      .scrollX(10)
      .scrollY(2)
      .color(0.5, 0.8, 50)
      .luma()
      // .invert()

      .repeatX(1)
      .repeatY(1)
  )
  .out();

// synth[7]
//   .solid([1, 0, 0], [0, 1, 0], [0, 0, 1], 1)
//   .mask(
//     synth[7].shape(
//       () => shapeSlider.value(),
//       () => sizeSlider.value(),
//       0.01
//     )
//   )
//   .out();

// sandbox - stop

function setup() {
  createCanvas(windowWidth, windowHeight);

  buildGUI();

  background(0);
  noStroke();

  cleverlayer = createGraphics(width, height);

  imageMode(CENTER);
  cleverlayer.imageMode(CENTER);

  // Prevent text selection while drawing
  let canvasElement = document.querySelector("canvas");
  canvasElement.addEventListener("mousedown", (e) => e.preventDefault());
  canvasElement.addEventListener("mousemove", (e) => e.preventDefault());

  // prep synth layers
  for (let i = 0; i < synthCount; i++) {
    pg[i] = createGraphics(hc[i].width, hc[i].height);
  }
}

function draw() {
  // Draw the background
  background(backgroundSlider.value());

  // Always draw the persistent layer (cleverlayer)
  image(cleverlayer, width / 2, height / 2);

  // Grab + apply hydra textures
  pg[pgSel].clear();
  pg[pgSel].drawingContext.drawImage(
    hc[pgSel],
    0,
    0,
    pg[pgSel].width,
    pg[pgSel].height
  );

  // Skip drawing on the canvas if a slider is active
  if (!sliderActive && !buttonClicked) {
    // Brush logic when the mouse is pressed
    if (mouseIsPressed) {
      cleverlayer.image(pg[pgSel], mouseX, mouseY);
    }
  }

  // Render the brush preview
  // Show the brush preview even when sliders are active
  if (!idle) {
    image(pg[pgSel], mouseX, mouseY);
  }
}

function buildGUI() {
  let guiWrapper = createDiv("").class("guiWrapper");
  let guiContent = createDiv("").parent(guiWrapper).class("guiContent");

  let guiInfo = createDiv("").parent(guiContent).class("guiInfo");
  let title = createDiv("p5*hydra brushes").parent(guiInfo).class("title");

  let trashButton = createDiv("trash")
    .parent(guiInfo)
    .class("trashButton button");
  trashButton.mousePressed(() => {
    buttonClicked = true;
    clearCanvas();
  });

  let saveButton = createDiv("save").parent(guiInfo).class("saveButton button");
  saveButton.mousePressed(() => {
    buttonClicked = true;
    saveCanvas();
  });

  let addButton = createDiv("add").parent(guiInfo).class("addButton button");
  addButton.mousePressed(() => {
    buttonClicked = true;
    // Add button functionality here
  });

  let printButton = createDiv("print")
    .parent(guiInfo)
    .class("printButton button");
  printButton.mousePressed(() => {
    buttonClicked = true;
    // Print button functionality here
  });

  let infoButton = createDiv("?").parent(guiInfo).class("infoButton button");

  let infoText; // To store the reference to the text element

  infoButton.mousePressed(() => {
    buttonClicked = true;

    // Check if the infoText already exists
    if (!infoText) {
      infoText = createDiv(
        'This tool lets you draw with brushes built using <a href="https://p5js.org/" target="_blank" style="color: #000000; text-decoration: underline;">p5.js</a> and <a href="https://hydra.ojack.xyz/" target="_blank" style="color: #000000; text-decoration: underline;">hydra</a>.<br><br>Pick a brush from the dropdown menu.<br>Start drawing by pressing down your mouse or swiping with your finger.<br>Adjust the sliders to change how it behaves.<br><br>Hate your sketch? Trash it.<br>Love your sketch? Save it (PNG).<br><br>Want to create more? Add your drawing to the print queue.<br>Keep drawing as many pages as you like, then hit print to compile them into a PDF.<br><br>This tool was designed and built by <a href="https://www.siiritaennler.ch/" target="_blank" style="color: #000000; text-decoration: underline;">Siiri Tännler</a> and mentored by <a href="https://teddavis.org/" target="_blank" style="color: #000000; text-decoration: underline;">Ted Davis</a>.<br><br>A first version of this tool was created in collaboration with Sarah Choi and Yevheniia Semenova during a class taught by Ted Davis at IDCE HGK/FHNW.<br><br>Source code'
      )
        .parent(guiWrapper)
        .class("infoText");

      // Position the text relative to the "?" button
      const infoButtonPosition = infoButton.position(); // Get the position of the "?" button
      const selectBrushPosition = selectBrush.position(); // Get the position of "select your brush"

      infoText.style("position", "absolute");
      infoText.style("top", `${infoButtonPosition.y}px`); // Align with "?" button
      infoText.style("left", `${selectBrushPosition.x}px`); // Align left with "select your brush"
    } else {
      // Toggle visibility
      infoText.style(
        "display",
        infoText.style("display") === "none" ? "block" : "none"
      );
    }
  });

  let column2 = createDiv("").parent(guiContent).class("column2");

  let selectBrush = createDiv("").parent(column2).class("selectWrapper"); //for select brush

  let column3 = createDiv("").parent(guiContent).class("column3");

  let sliderBackground = createDiv("").parent(column3).class("sliderWrapper"); //for backgroundSlider
  let sliderHydraZoom = createDiv("").parent(column3).class("sliderWrapper"); //for
  let sliderBrushSize = createDiv("").parent(column3).class("sliderWrapper");
  let sliderBrushShape = createDiv("").parent(column3).class("sliderWrapper");
  let sliderHyperActive = createDiv("").parent(column3).class("sliderWrapper");

  label("select your brush", selectBrush);
  sel = createSelect().parent(selectBrush).class("select");
  sel.option("brush 0", 0);
  sel.option("brush 1", 1);
  sel.option("brush 2", 2);
  sel.option("brush 3", 3);
  sel.option("brush 4", 4);
  sel.option("brush 5", 5);
  sel.option("brush 6", 6);
  sel.option("brush 7", 7);

  sel.changed(function () {
    pgSel = sel.value();
  });

  label("background", sliderBackground);
  backgroundSlider = createSlider(0, 255, 255, 1)
    .parent(sliderBackground)
    .class("slider")
    .input(() => {
      sliderActive = true;
      adjustTextColor(); // Call this function to adjust text color
    })
    .mousePressed(() => {
      sliderClicked = true;
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  label("hydra zoom", sliderHydraZoom);
  zoomSlider = createSlider(10, 255, 10, 0)
    .parent(sliderHydraZoom)
    .class("slider")
    .input(() => (sliderActive = true))
    .mousePressed(() => {
      sliderClicked = true;
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  label("brush size", sliderBrushSize);
  sizeSlider = createSlider(0.1, 1, 0.5, 0.001)
    .parent(sliderBrushSize)
    .class("slider")
    .input(() => (sliderActive = true))
    .mousePressed(() => {
      sliderClicked = true;
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  label("brush shape", sliderBrushShape);
  shapeSlider = createSlider(3, 12, 50, 0.001)
    .parent(sliderBrushShape)
    .class("slider")
    .input(() => (sliderActive = true))
    .mousePressed(() => {
      sliderClicked = true;
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  label("hyper active", sliderHyperActive);
  hyperSlider = createSlider(0.5, 10, 3, 0.05)
    .parent(sliderHyperActive)
    .class("slider")
    .input(() => (sliderActive = true))
    .mousePressed(() => {
      sliderClicked = true;
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  // Set the selected option to "brush1".
  sel.selected("title of brush0", 0);

  function clearCanvas() {
    cleverlayer.clear();
    background(0);
  }

  function saveCanvas() {
    var filename = "p5-hydra-brush-sketch.png";
    cleverlayer.save(filename);
  }

  function label(txt, parent) {
    createDiv(txt).parent(parent).class("label");
  }

  function adjustTextColor() {
    const backgroundValue = backgroundSlider.value();
    const textColor = backgroundValue <= 45 ? "white" : "black"; // Adjust threshold as needed

    // Update the dropdown text color
    const selectElements = document.querySelectorAll(".select");
    selectElements.forEach((select) => {
      select.style.color = textColor;
    });

    if (backgroundValue <= 45) {
      guiWrapper.addClass("light-text");
    } else {
      guiWrapper.removeClass("light-text");
    }
  }
}

// screen saver
let idleTimer; // Timer for detecting inactivity
let idleDrawingTimer; // Timer for limiting auto-drawing duration
let idle = false; // Flag to track if user is idle
let idlePos = { x: 0, y: 0 }; // Current position for idle drawing
let idleVelocity = { x: 0, y: 0 }; // Velocity vector for smooth movement
let angle = 0; // Angle for creating curved movement
let speed = 3; // Base speed of movement
let idleDuration = 60000; // Auto-drawing duration (1 minute)

function startIdleDrawing() {
  idle = true;

  // Hide the cursor
  noCursor();

  // Initialize random starting position for idle drawing
  idlePos.x = mouseX || random(width); // Fallback to random if cursor is outside canvas
  idlePos.y = mouseY || random(height);

  // Set a random initial velocity
  idleVelocity.x = random(-speed, speed);
  idleVelocity.y = random(-speed, speed);

  // Set a timer to stop auto-drawing after a minute
  idleDrawingTimer = setTimeout(stopIdleDrawing, idleDuration);

  drawCurvedPath(); // Start the continuous curved drawing
}

function stopIdleDrawing() {
  idle = false; // Stop idle mode
  cursor(); // Restore the cursor
  clearTimeout(idleDrawingTimer); // Clear the auto-drawing timer
}

function resetIdleTimer() {
  clearTimeout(idleTimer); // Clear existing inactivity timer
  if (idle) {
    stopIdleDrawing(); // Stop idle drawing if it’s running
  }
  idleTimer = setTimeout(startIdleDrawing, 8000); // Adjust time here for when screensaver kicks in
}

function drawCurvedPath() {
  if (!idle) return; // Stop drawing if not idle

  // Update position based on velocity
  idlePos.x += idleVelocity.x;
  idlePos.y += idleVelocity.y;

  // Add a slight curve to the velocity using trigonometry for spirals and circles
  idleVelocity.x += 0.1 * cos(angle) + random(-0.05, 0.05); // Add randomness for organic motion
  idleVelocity.y += 0.1 * sin(angle) + random(-0.05, 0.05);
  angle += random(0.02, 0.05); // Gradual angle change for smooth curves

  // Check canvas boundaries and bounce off if necessary
  if (idlePos.x <= 0 || idlePos.x >= width) {
    idleVelocity.x *= -1; // Reverse direction on x-axis
    angle += PI / 2; // Add a sharp turn for bouncing effect
  }
  if (idlePos.y <= 0 || idlePos.y >= height) {
    idleVelocity.y *= -1; // Reverse direction on y-axis
    angle += PI / 2; // Add a sharp turn for bouncing effect
  }

  // Use the currently selected brush to draw
  cleverlayer.image(pg[pgSel], idlePos.x, idlePos.y);

  // Continue drawing after a short delay
  setTimeout(drawCurvedPath, 50); // Adjust delay for smoother or faster movement
}

// Attach event listeners for user activity
window.addEventListener("mousemove", resetIdleTimer);
window.addEventListener("mousedown", resetIdleTimer);
window.addEventListener("keydown", resetIdleTimer);
window.addEventListener("touchstart", resetIdleTimer);

// Initialize idle timer
resetIdleTimer();

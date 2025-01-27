let time = new Date();
let zoom;
let size;
let hyper;
let shape;
let rotate;
let sliderActive = false; // for not drawing while using sliders
let sliderClicked = false; //
let buttonClicked = false; //
let printQueue = []; //
let queueCounter; //

//////////////////////////////////////////////////////////////// from P5LIVE

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

////////////////////////////////////////////////////////////////

// this is important for not drawing while clicking buttons or using sliders

function mouseReleased() {
  buttonClicked = false; //
  sliderActive = false; //
}

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
  hc[i].width = 500; // set resolution width
  hc[i].height = 500; // set resolution height

  synth[i] = new Hydra({
    detectAudio: false, // no mic
    canvas: hc[i], // use hydra canvas
    makeGlobal: false, // scoped
  }).synth; // scoped hydra
}

//////////////////////////////////////////////////////////////////////

// sandbox - start
// access each instance via synth[index]
// each synth is a brush

// prismatic pulse
synth[0]
  .osc(() => zoom.value() / 5, 1, 0.3)
  .kaleid([3, 4, 5, 7, 8, 9, 10].fast(0.1))
  .color(0.5, 0.3)
  .colorama(0.4)
  .rotate(0.009, () => Math.sin(time) * -0.001)
  .modulateRotate(synth[0].src(synth[0].o0), () => Math.sin(time) * 0.003)
  .modulate(synth[0].src(synth[0].o0), 0.9)
  .mask(
    synth[0]
      .shape(
        () => shape.value(),
        () => 0.5,
        0.01
      )
      .scale(0.9)
      .modulate(synth[0].noise(0.6, () => hyper.value()))
      .rotate(
        () => rotate.value(),
        () => rotate.value() / 5
      )
  )
  .out();

// acid loop
synth[1]
  .voronoi(() => zoom.value(), 0, 1)
  .mult(
    synth[1]
      .osc(10, 0.1, () => hyper.value() * 3)
      .saturate(3)
      .kaleid(200)
  )
  .mask(
    synth[1]
      .shape(
        () => shape.value(),
        () => 0.5,
        0.01
      )
      .modulate(synth[1].src(synth[1].o0), 0.5)
      .add(synth[1].src(synth[1].o0), 0.8)
      .scrollY(-0.01)
      .scale(0.99)
      .modulate(
        synth[1].voronoi(() => hyper.value(), 1),
        0.008
      )
      .luma(0.3)
      .color(15, 25, 1)
      .rotate(
        () => rotate.value(),
        () => rotate.value() / 5
      )
  )
  .out();

// cotton candy cascade
synth[2]
  .osc(() => zoom.value(), 0.28, 0.3)
  // .rotate(0, 0.1)
  .mask(
    synth[2]
      .shape(
        () => shape.value(),
        () => 0.5,
        0.01
      )
      // .mult(synth[2].osc(10, 0.1))
      .modulate(synth[2].osc(10).rotate(0, -0.1), 1)
      .rotate(
        () => rotate.value(),
        () => rotate.value() / 15
      )
  )
  .modulate(synth[2].noise(0.6, () => hyper.value()))
  .color(2.83, 0.91, () => hyper.value() * 50)
  .out();

// spectrum serpent
synth[3]
  .osc(() => zoom.value(), 1, 2)
  .kaleid()
  .mult(
    synth[3]
      .osc(20, 0.001, 0)
      .mask(
        synth[3].shape(
          () => shape.value(),
          () => 0.5,
          0.01
        )
      )
      .rotate(
        () => rotate.value(),
        () => rotate.value()
      )
  )
  .modulateScale(synth[3].osc(10, 0), -0.03)
  .modulate(synth[3].noise(0.6, () => hyper.value()))
  .scale(0.8, () => 1.05 + 0.1 * Math.sin(0.05 * time))
  .out();

// electric fern
synth[4]
  .osc(() => zoom.value(), 2, 3)
  .modulateScale(synth[4].osc(40, 0, 1).kaleid(8))
  .mask(
    synth[4]
      .shape(
        () => shape.value(),
        () => 0.5,
        0.01
      )
      .repeat(2, 4)
      .modulate(synth[4].noise(0.6, () => hyper.value()))
      .rotate(
        () => rotate.value() / 50,
        () => rotate.value() / 50
      )
  )
  .out();

// canyon breeze
synth[5]
  .osc(() => zoom.value(), 0.25, 0.25)
  .rotate(0, 0.1)
  .rotate(() => rotate.value())
  .mask(
    synth[5]
      .shape(
        () => shape.value() * 10,
        () => 0.5,
        0.1
      )
      .modulate(synth[5].noise(4.6, () => hyper.value()))
      .scale(0.72)
      .color(0.5, 5, 1, 0, 1)
      .luma(1)
      .saturate(5)
      .rotate(
        () => rotate.value(),
        () => rotate.value()
      )
  )
  .out();

// ocean flame
synth[6].voronoi(2, 0.5, 0.3);
synth[6]
  .osc(() => zoom.value(), 2, 1)
  .mask(
    synth[6]
      .shape(
        () => shape.value(),
        () => 0.5,
        0.01
      )
      .mult(
        synth[6]
          .osc(10, 0.1, () => Math.sin(time) * 3)
          .saturate(3)
          .kaleid(200)
      )
      .modulate(synth[6].src(synth[6].o0), 0.5)
      .modulate(synth[6].noise(0.6, () => hyper.value()))
      .add(synth[6].src(synth[6].o0), 0.8)
      .scrollY(-0.01)
      .scale(0.99)
      .modulate(synth[6].voronoi(8, 1), 0.008)
      .luma(0.3)
      .rotate(
        () => rotate.value(),
        () => rotate.value() / 2
      )
  )
  .out();

// technicolor bloom
synth[7]
  .noise(() => zoom.value(), 0.5, 1)
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
        () => shape.value(),
        () => 0.5,
        0.01
      )
      .modulate(synth[7].src(synth[7].o0), 0.5)
      .modulate(synth[7].noise(0.6, () => hyper.value()))
      .mult(
        synth[7]
          .voronoi(10, 0.1, () => Math.sin(time) * 3)
          .saturate(3)
          .shift(0.5)
      )
      .modulateRotate(synth[7].src(synth[7].o0), () => Math.sin(time) * 2)
      .scrollX(10)
      .scrollY(2)
      .color(0.5, 0.8, 50)
      .luma()

      .repeatX(1)
      .repeatY(1)
      .rotate(
        () => rotate.value(),
        () => rotate.value()
      )
  )
  .out();

////////////////////////////////////////////////////////////////////// sandbox - stop

function setup() {
  createCanvas(windowWidth, windowHeight);

  buildGUI();

  // initialize the cursor position in the center of the canvas
  mouseX = width / 2;
  mouseY = height / 2;

  // disable sliders if on mobile
  // if (window.innerWidth <= 768) {
  //   document.querySelector(".column3").style.display = "none";
  // }

  background(0);
  noStroke();
  noSmooth();

  cleverlayer = createGraphics(width, height);

  imageMode(CENTER);
  cleverlayer.imageMode(CENTER);

  // prevent text selection while drawing
  let canvasElement = document.querySelector("canvas");
  canvasElement.addEventListener("mousedown", (e) => e.preventDefault());
  canvasElement.addEventListener("mousemove", (e) => e.preventDefault());
  canvasElement.addEventListener("touchstart", (e) => e.preventDefault()); // For touch
  canvasElement.addEventListener("touchmove", (e) => e.preventDefault()); // For touch

  // ensure GUI elements are interactive on mobile
  document.querySelectorAll(".guiWrapper").forEach((el) => {
    el.addEventListener("touchstart", (e) => e.stopPropagation());
    el.addEventListener("touchmove", (e) => e.stopPropagation());
  });

  // prep synth layers
  for (let i = 0; i < synthCount; i++) {
    pg[i] = createGraphics(hc[i].width, hc[i].height);
  }
}

////////////////////////////////////////////////////////////////////// for mobile

function touchStarted(e) {
  // Check if the touch is on a GUI element
  if (
    e.target.closest(".guiWrapper") ||
    ["BUTTON", "INPUT", "SELECT"].includes(e.target.tagName)
  ) {
    return true; // Allow default interaction for GUI elements
  }

  // Prevent default interaction only on canvas
  if (touches.length > 0 && !sliderActive && !buttonClicked) {
    const touch = touches[0];
    cleverlayer.image(
      pg[pgSel],
      touch.x,
      touch.y,
      pg[pgSel].width * scl,
      pg[pgSel].height * scl
    );
  }

  return false; // Prevent default interaction on the canvas
}

function touchMoved(e) {
  // Check if the touch is on a GUI element
  if (
    e.target.closest(".guiWrapper") ||
    ["BUTTON", "INPUT", "SELECT"].includes(e.target.tagName)
  ) {
    return true; // Allow default interaction for GUI elements
  }

  // Prevent default interaction only on canvas
  if (touches.length > 0 && !sliderActive && !buttonClicked) {
    const touch = touches[0];
    cleverlayer.image(
      pg[pgSel],
      touch.x,
      touch.y,
      pg[pgSel].width * scl,
      pg[pgSel].height * scl
    );
  }

  return false; // Prevent default interaction on the canvas
}

function mousePressed(e) {
  // Prevent drawing if interacting with GUI elements
  if (
    e.target.closest(".guiWrapper") ||
    e.target.tagName === "BUTTON" ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "SELECT"
  ) {
    return true; // Allow default interaction for GUI elements
  }

  // Allow drawing on the canvas
  if (!sliderActive && !buttonClicked) {
    cleverlayer.image(
      pg[pgSel],
      mouseX,
      mouseY,
      pg[pgSel].width * scl,
      pg[pgSel].height * scl
    );
  }
}

function touchEnded() {
  buttonClicked = false; // Reset button interaction
  sliderActive = false; // Reset slider interaction
}

//////////////////////////////////////////////////////////////////////

function draw() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  background(isDarkMode ? 0 : 255);

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

  scl = size.value();

  if (!sliderActive && !buttonClicked) {
    if (mouseIsPressed || (touches.length > 0 && !idle)) {
      const x = touches.length > 0 ? touches[0].x : mouseX;
      const y = touches.length > 0 ? touches[0].y : mouseY;
      cleverlayer.image(
        pg[pgSel],
        x,
        y,
        pg[pgSel].width * scl,
        pg[pgSel].height * scl
      );
    }
  }

  if (!idle) {
    const x = touches.length > 0 ? touches[0].x : mouseX;
    const y = touches.length > 0 ? touches[0].y : mouseY;
    image(pg[pgSel], x, y, pg[pgSel].width * scl, pg[pgSel].height * scl);
  }
}

function buildGUI() {
  let guiWrapper = createDiv("").class("guiWrapper");
  let guiContent = createDiv("").parent(guiWrapper).class("guiContent");

  ///////////////////////////////////////////////////////////////////////////
  //guiInfo is the 1st column with the button

  let guiInfo = createDiv("").parent(guiContent).class("guiInfo");
  let title = createDiv("p5*hydra paint").parent(guiInfo).class("title");

  let trashButton = createDiv("trash")
    .parent(guiInfo)
    .class("trashButton button");
  trashButton.mousePressed(() => {
    buttonClicked = true;
    clearCanvas();
  });

  // for trashing drawing
  function clearCanvas() {
    cleverlayer.clear();
  }

  let saveButton = createDiv("save").parent(guiInfo).class("saveButton button");
  saveButton.mousePressed(() => {
    buttonClicked = true;
    saveCanvas();
  });

  // for saving drawing
  function saveCanvas() {
    var filename = "p5-hydra-paint-sketch.png";
    cleverlayer.save(filename);
  }

  let addButton = createDiv("add").parent(guiInfo).class("button");
  addButton.mousePressed(() => {
    buttonClicked = true;
    const canvasData = cleverlayer.canvas.toDataURL(); // Convert canvas to image data
    printQueue.push(canvasData); // Add the image to the print queue
    updatePrintCounter(printButton); // Update the counter
    clearCanvas(); // Clear the canvas after adding
  });

  let printButton = createDiv("print").parent(guiInfo).class("button");
  printButton.mousePressed(() => {
    if (printQueue.length === 0) {
      alert("add drawings to the print queue!");
      return;
    }

    // Detect device orientation
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Open a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");
    const printDocument = printWindow.document;

    // Write the basic HTML structure into the print window
    printDocument.write(`
      <html>
        <head>
          <title>p5*hydra paint print queue</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
  
              .page {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh; /* Full viewport height for centering */
                page-break-after: always; /* Ensure each drawing is on its own page */
              }
  
              img {
                max-width: 100%;
                max-height: 100%; /* Prevent images from overflowing the page */
              }
  
              @page {
                size: A4 ${
                  isPortrait ? "portrait" : "landscape"
                }; /* Dynamic page size */
                margin: 3mm; /* Remove margins for full-page centering */
              }
            }
          </style>
        </head>
        <body>
    `);

    // Add each drawing wrapped in a centered container
    printQueue.forEach((item) => {
      printDocument.write(`
        <div class="page">
          <img src="${item}" alt="p5*hydra painting">
        </div>
      `);
    });

    // Close the HTML structure
    printDocument.write(`
        </body>
        <script>
          window.addEventListener('afterprint', function() {
            window.close();
          });
  
          setTimeout(() => {
            if (!document.hidden) {
              window.close();
            }
          }, 500);
        </script>
      </html>
    `);
    printDocument.close();

    // Automatically trigger the print dialog
    printWindow.print();

    // Clear the print queue after printing
    printQueue = [];
    updatePrintCounter(printButton); // Update the counter after clearing
  });

  let infoButton = createDiv("?").parent(guiInfo).class("infoButton button");
  let infoText; // To store the reference to the text element

  infoButton.mousePressed(() => {
    buttonClicked = true;

    if (!infoText) {
      // Create the info text
      infoText = createDiv(
        'p5*hydra paint lets you draw with brushes built using <a href="https://p5js.org/" target="_blank" style="color: #000000; text-decoration: underline;">p5.js</a> and <a href="https://hydra.ojack.xyz/" target="_blank" style="color: #000000; text-decoration: underline;">hydra</a>.<br><br>Hate your sketch? Trash it.<br>Love your sketch? Save it to download as an image.<br><br>Want to fill a sketchbook? Add your drawing to the print queue.<br>Keep drawing as many pages as you like, then hit print.<br><br>This tool was designed and built by <a href="https://www.siiritaennler.ch/" target="_blank" style="color: #000000; text-decoration: underline;">Siiri Tännler</a> and mentored by <a href="https://teddavis.org/" target="_blank" style="color: #000000; text-decoration: underline;">Ted Davis</a>.<br><br>A first version of this tool was created in collaboration with Sarah Choi and Yevheniia Semenova during a class taught by Ted Davis at IDCE HGK/FHNW.<br><br><a href="https://github.com/stx-00/p5-hydra-brush-tool" target="_blank" style="color: #000000; text-decoration: underline;">GitHub</a>'
      )
        .parent(guiWrapper)
        .class("infoText");

      // Position the text relative to the "?" button and "select brush"
      const infoButtonPosition = infoButton.position();
      const selectBrushPosition = selectBrush.position();

      infoText.style("position", "absolute");
      infoText.style("top", `${infoButtonPosition.y}px`);
      infoText.style("left", `${selectBrushPosition.x}px`);

      // Ensure visibility
      infoText.style("display", "block");
    } else {
      // Toggle visibility
      infoText.style(
        "display",
        infoText.style("display") === "none" ? "block" : "none"
      );
    }
  });

  let darkModeButton = createDiv("dark")
    .parent(guiInfo)
    .class("darkModeButton button");
  darkModeButton.mousePressed(() => {
    buttonClicked = true;
    toggleDarkMode();
  });

  ///////////////////////////////////////////////////////////////////////////

  // column2 is select brush
  let column2 = createDiv("").parent(guiContent).class("column2");

  let selectBrush = createDiv("").parent(column2).class("selectWrapper"); //for select brush

  label("select your brush", selectBrush);
  sel = createSelect().parent(selectBrush).class("select");
  sel.option("→ prismatic pulse", 0);
  sel.option("→ acid loop", 1);
  sel.option("→ cotton candy cascade", 2);
  sel.option("→ spectrum serpent", 3);
  sel.option("→ electric fern", 4);
  sel.option("→ canyon breeze", 5);
  sel.option("→ ocean flame", 6);
  sel.option("→ technicolor bloom", 7);

  sel.changed(function () {
    pgSel = sel.value();
  });

  ///////////////////////////////////////////////////////////////////////////

  // column 3 are the sliders
  let column3 = createDiv("").parent(guiContent).class("column3");

  let sliderToggle = createDiv("+ adjust")
    .parent(column3)
    .class("sliderToggleButton button");

  sliderToggle.mousePressed(() => {
    const sliderWrappers = document.querySelectorAll(
      ".column3 > .sliderWrapper"
    );

    // Get current visibility state of sliders
    const slidersVisible = sliderWrappers[0].style.display !== "none";

    // Toggle visibility of just the sliders
    sliderWrappers.forEach((wrapper) => {
      wrapper.style.display = slidersVisible ? "none" : "flex";
    });

    // Update button text
    sliderToggle.html(slidersVisible ? "+ adjust" : "- hide");
  });

  let sliderBrushSize = createDiv("").parent(column3).class("sliderWrapper"); // for brush size
  let sliderBrushShape = createDiv("").parent(column3).class("sliderWrapper"); // for brush shape
  let sliderRotate = createDiv("").parent(column3).class("sliderWrapper"); //for rotate
  let sliderHydraZoom = createDiv("").parent(column3).class("sliderWrapper"); // for hydra zoom
  let sliderHyperActive = createDiv("").parent(column3).class("sliderWrapper"); // for hyper activity of brush

  label("size", sliderBrushSize);
  size = createSlider(0.1, 1, 0.4, 0.001)
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

  label("shape", sliderBrushShape);
  shape = createSlider(5, 40, 30, 0)
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

  label("rotate", sliderRotate);
  rotate = createSlider(0, 10, 0, 0)
    .parent(sliderRotate)
    .class("slider")
    .input(() => {
      sliderActive = true;
      adjustTextColor(); // Call this function to adjust text color
    })
    .mousePressed(() => {
      sliderClicked = true; // to not draw when sliders are active
      sliderActive = true;
    })
    .mouseReleased(() => {
      sliderActive = false;
      setTimeout(() => (sliderClicked = false), 100);
    });

  label("zoom", sliderHydraZoom);
  zoom = createSlider(5, 70, 15, 0)
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

  label("hyper", sliderHyperActive);
  hyper = createSlider(0.5, 10, 3, 0.05)
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

  // Set the selected option to "brush1" —— not sure this is wokrin
  sel.selected("title of brush0", 0);

  ///////////////////////////////////////////////////////////////////////////

  function label(txt, parent) {
    createDiv(txt).parent(parent).class("label");
  }

  if (window.innerWidth <= 768) {
    // Initially hide sliders on mobile
    const sliderWrappers = document.querySelectorAll(
      ".column3 > .sliderWrapper"
    );
    sliderWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
  }
}

// print counter
function updatePrintCounter(printButton) {
  if (printQueue.length > 0) {
    printButton.html(`print (${printQueue.length})`); // Show the counter if there are drawings
  } else {
    printButton.html("print"); // Remove the counter when the queue is empty
  }
}

function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");

  // Update button text
  const darkModeButton = document.querySelector(".darkModeButton");
  if (darkModeButton) {
    darkModeButton.textContent = isDarkMode ? "light" : "dark";
  }

  // Update background color
  if (isDarkMode) {
    background(0);
  } else {
    background(255);
  }
}

////////////////////////////////////////////////////////////////////////////////////////

// screen saver, auto drawing!
let idleTimer; // Timer for detecting inactivity
let idleDrawingTimer; // Timer for limiting auto-drawing duration
let idle = false; // Flag to track if user is idle
let idlePos = { x: 0, y: 0 }; // Current position for idle drawing
let idleVelocity = { x: 0, y: 0 }; // Velocity vector for smooth movement
let angle = 0; // Angle for creating curved movement
let speed = 3; // Base speed of movement
let idleDuration = 40000; // Auto-drawing duration

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
  idleTimer = setTimeout(startIdleDrawing, 20000); // Adjust time here for when screensaver kicks in
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
  cleverlayer.image(
    pg[pgSel],
    idlePos.x,
    idlePos.y,
    pg[pgSel].width * scl,
    pg[pgSel].height * scl
  );

  // Continue drawing after a short delay
  setTimeout(drawCurvedPath, 50); // Adjust delay for smoother or faster movement
}

// Attach event listeners for user activity
window.addEventListener("mousemove", resetIdleTimer);
window.addEventListener("mousedown", resetIdleTimer);
window.addEventListener("keydown", resetIdleTimer);
window.addEventListener("touchstart", resetIdleTimer);
window.addEventListener("touchmove", resetIdleTimer);

// Initialize idle timer
resetIdleTimer();

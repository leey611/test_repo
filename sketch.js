let myData;
let sizeSelect
let toppingSelect

function preload() {
  myData = loadJSON("boba.json");
}

function setup() {
  createCanvas(1000, 1000);
  myData = myData.data;
  sizeSelect = createSelect(); // create a select element for size
  sizeSelect.position(0, 0)
  sizeSelect.option("any") // add options
  sizeSelect.option("medium")
  sizeSelect.option("large")
  
  toppingSelect = createSelect() // create a select element for topping
  toppingSelect.position(100, 0)
  toppingSelect.option("any");
  toppingSelect.option("boba")
  toppingSelect.option("none")
  
}

function draw() {
  background(255);
  let filterData
  let selectedSize = sizeSelect.selected()
  let selectedTopping = toppingSelect.selected()
  let filteredData = [];
  
  for (let i = 0; i < myData.length; i++) {
    let item = myData[i];
    let sizeMatch = false;
    let toppingMatch = false;

    // check drink size
    if (selectedSize === "any") {
      sizeMatch = true;
    } else if (item.drink_size === selectedSize) {
      sizeMatch = true;
    } 

    // check topping
    if (selectedTopping === "any") {
      toppingMatch = true
    } else if (item.topping === selectedTopping) {
      toppingMatch = true; // matches a specific topping, like 'boba'
    } else if (!item.topping && selectedTopping === "none") {
      toppingMatch = true
    } 
    // if both match, add to filteredData
    if (sizeMatch && toppingMatch) {
      filteredData.push(item);
    }
  }

  
  for (let i = 0; i < filteredData.length; i++) {
    let flower = filteredData[i];
    let x = (i + 1) * 180;
    let sugar_level = flower.sugar_level;
    let y = map(sugar_level, 0, 100, 1000, 0);
    let base_color = flower.base_color;
    let petalCount = flower.quantity;
    let drink_size = flower.drink_size;
    let topping = flower.topping;
    let drink = flower.drink
    let base = flower.base
    drawFlower(x, y, petalCount, base_color, drink_size, topping, sugar_level, drink, base);
  }
}

function drawFlower(x, y, petalCount, base_color, drink_size, topping, sugar_level, drink, base) {
  // mouse distance to the center of flower
  let distance = dist(mouseX, mouseY, x, y)
  
  // draw stem
  push();
  translate(x, y);
  line(0, 0, 0, height);
  pop();

  // begin a new, independent flower group
  push();
  translate(x, y);
  // rotate flower group if mouse is close
  if (distance < 15) {
    rotate(frameCount/30)
  }
  
  for (let i = 0; i < petalCount; i++) {
    push();
    rotate((TWO_PI / petalCount) * i); // use when using RADIUS mode

    if (drink_size === "small") {
      strokeWeight(1)
    } else if (drink_size === "medium") {
      strokeWeight(2)
    } else {
      strokeWeight(3)
    }
    fill(base_color);
    ellipse(50, 0, 80, 30);
    line(0, 0, 50, 0);
    if (topping !== "") {
      circle(50, 0, 5);
    }
    pop()
  }

  // draw middle circle
  let middle_color = color("#e956fc"); // turn a color into a p5js color
  let transparency = map(sugar_level, 0, 100, 100, 255)
  middle_color.setAlpha(transparency)
  fill(middle_color);
  circle(0, 0, 30);
  pop(); // end the new, independent flower group

  // draw leaves
  push();
  translate(x, y);
  for (let i = 0; i < petalCount; i++) {
    let y = 80 + (i + 1) * 40;
    push();
    translate(0, y);
    rotate(-PI / 4);
    rect(0, 0, 20, 10);
    pop();
  }
  pop();
  
  // draw tooltip
  push()
  if (distance < 30) {
    fill(0); 
    textSize(12);
    noStroke();
    textAlign(LEFT, TOP);
    text(
      `       Drink: ${drink}
       Base: ${base}
       Size: ${drink_size}
       Topping: ${topping || "none"}
       Sugar: ${sugar_level}%`,
       x + 10,
       y + 10
    );
  }
  pop()
}

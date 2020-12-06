var dog, dogIMG, dogIMG1;
var database;
var food, foodStock;
var feedTime, lastFeed;
var feed, addFood, foodOBJ;



function preload()
{
  dogIMG = loadImage("images/dogImg.png");
  dogIMG1 = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(1000, 400);
  database = firebase.database();

  foodOBJ = new Food();

  dog = createSprite(800,200,150,150);
  dog.addImage(dogIMG);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);


  addFood = createButton("add food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);

  foodOBJ.display();
  feedTime = database.ref('FeedTime');
  feedTime.on("value", function(data){
    lastFeed = data.val();
  })

  drawSprites();

  fill(255, 255, 254);
  textSize(15);
  if(lastFeed >= 12){
    text("Last Feed: " + lastFeed%12 + " pm", 350, 30);
  }
  else if(lastFeed === 0){
    text("Last Feed: 12 am", 350, 30);
  }
  else{
    text("Last Feed: " + lastFeed + " am", 350, 30);
  }
}


function readStock(data){
  food = data.val();
  foodOBJ.updateFoodStock(food);
}


function feedDog(){
  dog.addImage(dogIMG1);
  foodOBJ.updateFoodStock(foodOBJ.getFoodStock()-1);
  database.ref('/').update({
    Food: foodOBJ.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodOBJ.updateFoodStock(foodOBJ.getFoodStock()+1);
  database.ref('/').update({
    Food: foodOBJ.getFoodStock()
  })
}

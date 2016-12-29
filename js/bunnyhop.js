  var stage, w, h, loader, score, hscore;
  var sky, grant, ground, hill, hill2, carrot, rock, cloud, hs = 0
      , count = 0
      , groundSpeed = 450
      , hillSpeed = 30
      , hill2Speed = 45
      , cloudSpeed = 15
      , gameOn = false;

  function init() {
      //            examples.showDistractor();
      stage = new createjs.Stage("gameCanvas");
      // grab canvas width and height for later calculations:
      w = stage.canvas.width;
      h = stage.canvas.height;
      manifest = [
          {
              src: "bunnysprite10.png"
              , id: "grant"
                }
                , {
              src: "sky.png"
              , id: "sky"
                }
                , {
              src: "ground.png"
              , id: "ground"
                }
                , {
              src: "art/hill1.png"
              , id: "hill"
                }
                , {
              src: "art/hill2.png"
              , id: "hill2"
                }
                , {
              src: "rock.png"
              , id: "rock"
                }, {
              src: "carrot.png"
              , id: "carrot"
                }, {
              src: "cloud.png"
              , id: "cloud"
                }
		];
      loader = new createjs.LoadQueue(false);
      loader.addEventListener("complete", handleComplete);
      loader.loadManifest(manifest, true, "images/");
  }

  function handleComplete() {
      //            examples.hideDistractor();
      sky = new createjs.Shape();
      sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
      var groundImg = loader.getResult("ground");
      ground = new createjs.Shape();
      ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
      ground.tileW = groundImg.width;
      ground.y = h - groundImg.height;
      //add backgrounds
      hill = new createjs.Bitmap(loader.getResult("hill"));
      hill.setTransform(300, h - hill.image.height * 4 - groundImg.height, 5, 5);
      hill.alpha = 0.8;
      hill2 = new createjs.Bitmap(loader.getResult("hill2"));
      hill2.setTransform(0, h - hill2.image.height * 3 - groundImg.height, 4, 4);
      //add cloud
      cloud = new createjs.Bitmap(loader.getResult("cloud"));
      cloud.setTransform(550, 30, 4, 4);
      cloud.alpha = 0.7;
      //add carrots and rocks
      carrot = new createjs.Bitmap(loader.getResult("carrot"));
      carrot.setTransform(550, 60, 3, 3);
      carrot.scaleX = carrot.scaleY = 0.5;
      rock = new createjs.Bitmap(loader.getResult("rock"));
      rock.setTransform(800, 270, 3, 3);
      rock.scaleX = rock.scaleY = 0.5;
      //add bunny
      var spriteSheet = new createjs.SpriteSheet({
          framerate: 10
          , "images": [loader.getResult("grant")]
          , "frames": {
              "regX": 82
              , "height": 370
              , "count": 10
              , "regY": 0
              , "width": 307
          }, // define two animations, run (loops, 1.5x speed) and jump (returns to run):
          "animations": {
              "run": [0, 1, "run", 1]
              , "jump": [2, 9, "run"]
          }
      });
      grant = new createjs.Sprite(spriteSheet, "run");
      grant.x = 100;
      grant.y = 25;
      grant.scaleX = 0.8;
      grant.scaleY = 0.8;
      //add highest score
      hscore = new createjs.Text("HS: 0", "20px Arial", "#3c3c3c");
      hscore.x = w - 230;
      hscore.y = 0;
      hscore.outline = true;
      //add score text
      score = new createjs.Text("Score: 0", "20px Arial", "blue");
      score.x = w - 150;
      score.y = 0;
      score.outline = true;
      stage.addChild(sky, cloud, hill, hill2, ground, grant, carrot, rock, hscore, score);
      //            stage.addEventListener("stagemousedown", spaceClicked);
      this.document.onkeydown = spaceClicked;
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener("tick", tick);
  }

  function handleJumpStart() {
      grant.gotoAndPlay("jump");
      //            console.log(Math.random());
  }

  function tick(event) {
      if (count > 0 && !gameOn) {
          return;
      }
      count++;
      var deltaS = event.delta / 1000;
      var position = grant.x + 150 * deltaS;
      var grantW = grant.getBounds().width * grant.scaleX;
      //            grant.x = (position >= w + grantW) ? -grantW : position;
      //move the ground
      ground.x = (ground.x - deltaS * groundSpeed) % ground.tileW;
      //move carrots and rocks
      carrot.x = (carrot.x - deltaS * groundSpeed);
      if (carrot.x + carrot.image.width * carrot.scaleX <= 0) {
          carrot.x = w + Math.random() * 1000;
      }
      rock.x = (rock.x - deltaS * groundSpeed);
      if (rock.x + rock.image.width * rock.scaleX <= 0) {
          rock.x = w + Math.random() * 1000;
      }
      //move hills
      hill.x = (hill.x - deltaS * hillSpeed);
      if (hill.x + hill.image.width * hill.scaleX <= 0) {
          hill.x = w;
      }
      hill2.x = (hill2.x - deltaS * hill2Speed);
      if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
          hill2.x = w;
      }
      //move clouds
      cloud.x = (cloud.x - deltaS * cloudSpeed);
      if (cloud.x + cloud.image.width * cloud.scaleX <= 0) {
          cloud.x = w;
          var ran = Math.random();
          cloud.scaleX = cloud.scaleY = (ran * 0.5) + 3;
          cloud.y = ran * 60;
      }
      //update the score
      if (count % 10 == 0) {
          score.text = "Score:  " + count / 5;
      }
      stage.update(event);
  }

  function spaceClicked() {
      if (gameOn) {
          handleJumpStart();
      }
      else {
          gameOn = true;
      }
  }

  function updateHS() {
      hscore.text = "HS: " + hs;
  }
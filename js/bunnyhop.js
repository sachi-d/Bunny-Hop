  var stage, w, h, loader, score, hscore;
  var sky, bunny, ground, hill, hill2, carrot, points, rock, cloud, hscoreText = 0
      , scoreText = 0
      , count = 0
      , lastScore = 0
      , groundSpeed = 450
      , hillSpeed = 30
      , hill2Speed = 45
      , cloudSpeed = 15
      , gameOn = false
      , isHit = false;

  function init() {
      //            examples.showDistractor();
      stage = new createjs.Stage("gameCanvas");
      // grab canvas width and height for later calculations:
      w = stage.canvas.width;
      h = stage.canvas.height;
      var sounds = [
          {
              src: "jump.mp3"
              , id: "jump"
          }, {
              src: "carrot-tink.mp3"
              , id: "point"
          }, {
              src: "rock.mp3"
              , id: "hit"
          }
       ];
      manifest = [
          {
              src: "bunnyspriteHit.png"
              , id: "bunny"
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
                }, {
              src: "plusPoints.png"
              , id: "plusPoints"
                }
		];
      loader = new createjs.LoadQueue(false);
      createjs.Sound.registerSounds(sounds, "sounds/");
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
      carrot.setTransform(550, 60, 0.5, 0.5);
      points = new createjs.Bitmap(loader.getResult("plusPoints"));
      points.setTransform(560, 40, 0.3, 0.3);
      points.alpha = 0;
      rock = new createjs.Bitmap(loader.getResult("rock"));
      rock.setTransform(800, 270, 0.5, 0.5);
      //add bunny
      var spriteSheet = new createjs.SpriteSheet({
          framerate: 10
          , "images": [loader.getResult("bunny")]
          , "frames": {
              "height": 370
              , "count": 15
              , "regY": 0
              , "width": 307
          }, // define two animations, run (loops, 1.5x speed) and jump (returns to run):
          "animations": {
              "run": [0, 1, "run", 1]
              , "jump": [2, 9, "run"]
              , "hit": [10]
          }
      });
      bunny = new createjs.Sprite(spriteSheet, "run");
      bunny.x = 100;
      bunny.y = 25;
      bunny.scaleX = 0.8;
      bunny.scaleY = 0.8;
      //add highest score
      hscore = new createjs.Text("HS: 0", "20px Arial", "#090");
      hscore.x = w - 230;
      hscore.y = 10;
      hscore.outline = true;
      //add score text
      score = new createjs.Text("Score: 0", "20px Arial", "#00b");
      score.x = w - 120;
      score.y = 10;
      score.outline = true;
      stage.addChild(sky, cloud, hill, hill2, ground, bunny, carrot, points, rock, hscore, score);
      stage.addEventListener("stagemousedown", trigFunc);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener("tick", tick);
  }

  function startNewGame() {
      bunny.gotoAndStop("run");
      gameOn = false, isHit = false, carrot.x += 300, rock.x += 700, count = 0, lastScore = 0, points.alpha = 0, points.x = carrot.x, score.text = "Score: 0";
  }

  function handleJumpStart() {
      createjs.Sound.play("jump");
      bunny.gotoAndPlay("jump");
  }

  function tick(event) {
      if (count > 0 && !gameOn) {
          return;
      }
      count++;
      //check hit
      var deltaS = event.delta / 1000;
      //move the ground
      ground.x = (ground.x - deltaS * groundSpeed) % ground.tileW;
      //move carrots and rocks
      carrot.x = (carrot.x - deltaS * groundSpeed);
      if (carrot.x + carrot.image.width * carrot.scaleX <= 0) {
          var carrotX = w + Math.random() * 1000;
          carrot.x = carrotX;
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
      //handle opacity of points
      if (points.alpha > 0) {
          points.alpha -= 0.03;
      }
      //update the score
      if (count % 10 == 0) {
          scoreText = Math.round(count / 50);
          score.text = "Score:  " + scoreText;
      }
      //hit carrot
      var pt = carrot.localToLocal(70, 60, bunny);
      if (bunny.hitTest(pt.x, pt.y)) {
          handleCarrotHit();
      }
      //hit rock
      pt = rock.localToLocal(50, 50, bunny);
      if (bunny.hitTest(pt.x, pt.y)) {
          handleRockHit();
      }
      stage.update(event);
  }

  function trigFunc(event) {
      if (gameOn) {
          //          else {
          handleJumpStart();
          //          }
      }
      else {
          if (isHit) {
              startNewGame();
          }
          else {
              gameOn = true;
              bunny.play();
          }
      }
  }

  function updateHS() {
      if (hscoreText < scoreText) {
          hscoreText = scoreText;
          hscore.text = "HS: " + hscoreText;
      }
  }

  function handleRockHit() {
      createjs.Sound.play("hit");
      gameOn = false;
      isHit = true;
      bunny.gotoAndStop("hit");
      updateHS();
  }

  function handleCarrotHit() {
      if (count - lastScore > 100) {
          createjs.Sound.play("point");
          count += 1000;
          lastScore = count;
          points.x = carrot.x;
          points.alpha = 1;
      }
  }
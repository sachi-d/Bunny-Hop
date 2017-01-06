  var stage, w, h, loader, score, hscore;
  var sky, bunny, ground, hill, hill2, carrot, rock, cloud, hs = 0
      , count = 0
      , groundSpeed = 100
      , hillSpeed = 30
      , hill2Speed = 45
      , cloudSpeed = 15
      , gameOn = false;
  var rockMin = 500
      , rockMax = 0;

  function init() {
      //            examples.showDistractor();
      stage = new createjs.Stage("gameCanvas");
      // grab canvas width and height for later calculations:
      w = stage.canvas.width;
      h = stage.canvas.height;
      manifest = [
          {
              src: "bunnysprite10.png"
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
                }
		];
      loader = new createjs.LoadQueue(false);
      loader.addEventListener("complete", handleComplete);
      loader.loadManifest(manifest, true, "images/");
  }

  function handleComplete() {
      rock = new createjs.Bitmap(loader.getResult("rock"));
      rock.setTransform(800, 270, 0.5, 0.5);
      stage.addChild(rock);
      this.document.onkeydown = spaceClicked;
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener("tick", tick);
  }

  function handleJumpStart() {
      //      bunny.gotoAndPlay("jump");
      //            console.log(Math.random());
  }

  function tick(event) {
      rock.alpha = 0.7;
      var p = rock.globalToLocal(stage.mouseX, stage.mouseY);
      if (rock.hitTest(p.x, p.y)) {
          rock.alpha = 1;
      }
      var deltaS = event.delta / 1000;
      rock.x = (rock.x - deltaS * groundSpeed);
      if (rock.x + rock.image.width * rock.scaleX <= 0) {
          rock.x = w + Math.random() * 1000;
      }
      stage.update(event);
  }

  function spaceClicked(event) {
      if (event.keyCode !== 32) {
          return;
      }
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
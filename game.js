import { initNewspaper, checkHeadliner } from './newspaper.js';

// Create the application helper and add its render target to the page
const app = new PIXI.Application();

// define the size of objects
const app_height = window.innerHeight * 0.9;
const app_width = window.innerWidth * 0.9;
const newpaper_width = 0.35;

await app.init({ 
    width: app_width, 
    height: app_height,
    background: '#eeeeee' 
})
document.body.appendChild(app.canvas);

// STUFF FOR DRAGGABLE 
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

// objects to be referenced
const stories = new Array();

// Create the sprite and add it to the stage
const bunny_texture = await PIXI.Assets.load('bunny.png');
bunny_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


// initialize the newspaper object
const newspaper = initNewspaper(app_height, app_width, newpaper_width, bunny_texture);
app.stage.addChild(newspaper);

// populates the screen with sprites
for (let i = 0; i < 10; i++) {
    const draggable = createDraggableObject(Math.floor(Math.random() * app.screen.width), Math.floor(Math.random() * app.screen.height));
    // Add it to the stage
    app.stage.addChild(draggable);

    stories.push(draggable);
}



app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    console.log(stories);
    stories.forEach((story) => {
        story.rotation += 0.1 * time.deltaTime;
    });
});



function createDraggableObject(x, y) {
    // Create our little bunny friend..
    const draggable = new PIXI.Sprite(bunny_texture);

    // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    draggable.eventMode = 'static';
    draggable.cursor = 'pointer';
    draggable.anchor.set(0.5);
    draggable.on('pointerdown', onDragStart, draggable);
    draggable.x = x;
    draggable.y = y;


    //possibly changed in the future
    draggable.scale.set(3);

    //possibly moved to different function
    addText(draggable, "something")

    return draggable;
}

function onDragMove(event) {
    if (dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
}

function onDragStart() {
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    this.alpha = 0.5;
    dragTarget = this;
    app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        checkHeadliner(dragTarget);
        dragTarget = null;
    }
}

function addText(sprite, text) {
    if (sprite.children[0]) {
        sprite.removeChild(sprite.children[0])
    }
    // add text on top
    const sprite_text = new PIXI.Text(text,
    {
      fill : 0x666666,
      align : 'center',
      cacheAsBitmap: true, // for better performance
    });    

    sprite_text.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;

    sprite_text.anchor.x = sprite_text.anchor.y = 0.5;
    sprite_text.scale.set(0.5);
    sprite.addChild(sprite_text);
}
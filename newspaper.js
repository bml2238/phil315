// Create the application helper and add its render target to the page
const app = new PIXI.Application();
const app_height = window.innerHeight * 0.9;
const app_width = window.innerWidth * 0.9;

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

// bad practice but whatever
const headliner_height = 0.25;  // headline always takes up the whole width
const normal_height  = 0.3;     // standard stories are squares
const small_height   = 0.3;
const small_width    = 0.15;
const newspaper_slots = new Map();

// these will be the coordinates for where the headliner is on screen
let headliner_x0;
let headliner_xx;
let headliner_y0;
let headliner_yy;

// Create the sprite and add it to the stage
const bunny_texture = await PIXI.Assets.load('bunny.png');
bunny_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const newspaper = initNewspaper();
app.stage.addChild(newspaper);

// populates the screen with sprites
for (let i = 0; i < 10; i++) {
    createDraggableObject(Math.floor(Math.random() * app.screen.width), Math.floor(Math.random() * app.screen.height));
}

function initNewspaper() {
    const container = new PIXI.Container();
    const headliners = new Array();

    // just for sizing reference
    const bunny_sample = new PIXI.Sprite(bunny_texture);

    // creating newspaper grid
    const newpaper_width = 0.35
    const grid_height = Math.floor(app_height / bunny_sample.height) - 1;
    const grid_width = Math.round(Math.floor(app_width / bunny_sample.height) * newpaper_width);
    const grid_slots = new Array(grid_height);

    // initializing story sizes in grid units
    const headliner_grid_height = Math.round(grid_height * headliner_height);
    const normal_grid_height = Math.round(grid_height * normal_height);
    const small_grid_height = Math.round(grid_height * small_height);
    const small_grid_width = Math.round(grid_height * small_width);

    // populating grid
    for (let i = 0; i < grid_height; i++) {
        grid_slots[i] = new Array();
        for (let k = 0; k < grid_width; k++) {
            const bunny = new PIXI.Sprite(bunny_texture);

            // headliner collision
            if (i > 0 && i <= headliner_grid_height &&
                k != 0 && k != (grid_width - 1)) {
                headliners.push(bunny);
                bunny.alpha = 0;
            }

            bunny.x = k * 40;
            bunny.y = i * 40;
            container.addChild(bunny);
        }
    }

    // set headliner dimensions for checking later
    headliner_x0 = headliners[0].position.x;
    headliner_y0 = headliners[0].position.y;
    headliner_xx = headliners[headliners.length - 1].position.x + bunny_sample.width;
    headliner_yy = headliners[headliners.length - 1].position.y + bunny_sample.height;

    newspaper_slots.set("headliners", headliners);
    return container;
}

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

    // Add it to the stage
    app.stage.addChild(draggable);
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

function checkHeadliner(sprite) {
    if (sprite.x > headliner_x0 && sprite.x < headliner_xx) {
        if (sprite.y > headliner_y0 && sprite.y < headliner_yy) {
            sprite.x = Math.round((headliner_x0 + headliner_xx) / 2);
            sprite.y = Math.round((headliner_y0 + headliner_yy) / 2);

            //TODO: change dimensions of story to match headline space
        }
    }
}
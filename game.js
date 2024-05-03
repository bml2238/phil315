import { initNewspaper, checkStorySlot, getHeadliner, removeFromPaper } from './newspaper.js';
import { getStory } from './stories.js';

// Create the application helper and add its render target to the page
const app = new PIXI.Application();

// define the size of the app
const app_height = window.innerHeight * 0.95;
const app_width = window.innerWidth * 0.95;

await app.init({ 
    width: app_width, 
    height: app_height,
    background: '#eeeeee', 
})
document.body.appendChild(app.canvas);

// STUFF FOR DRAGGABLE 
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

// game preferences
const newpaper_width = 0.35;
const new_story_interval = 10 * 1000;   // 10 seconds (in milliseconds)
const starting_stories = 3;         // +1 for < stuff
const story_spawn_x = 0.5;
const default_story_height = 40;
const max_stories_spawned = 12;


// Bunny texture, to be replaced (sadly)
const bunny_texture = await PIXI.Assets.load('bunny.png');
bunny_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


// objects to be referenced (bad practice whatever)
const stories = new Array();

// initialize the newspaper stuff
const newspaper = initNewspaper(app_height, app_width, newpaper_width, bunny_texture);
app.stage.addChild(newspaper);


// create the drawer where stories will spawn
const drawer_texture = await PIXI.Assets.load('drawer.png');
drawer_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
const drawer = new PIXI.Sprite(drawer_texture);
drawer.anchor = 0.5;
drawer.x = story_spawn_x * app_width;
drawer.y = app_height - default_story_height * 2;   // somewhat arbitrary in order to make it look right
drawer.scale.set(0.8);
const sprite_text = new PIXI.Text("new stories spawn here", {
    fontFamily: "Courier New",
    fontSize: 20,
    fill : 0x666666,
    align : 'center',
    cacheAsBitmap: true, // for better performance
});    
sprite_text.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;
sprite_text.anchor.x = sprite_text.anchor.y = 0.5;
//sprite_text.scale.set(0.5);
drawer.addChild(sprite_text);
app.stage.addChild(drawer);
// i tried to move all this to another function and it broke so just 


setInterval(function() {
    if (stories.length < max_stories_spawned) {
        createStory("story");
    }
 }, new_story_interval) // 2 seconds = 2000 miliseconds

// initial game state
for (let i = 0; i < starting_stories; i++) {
    createStory("story");
}


function createStory(spawnZone) {
    let spawn_x = 0;
    let spawn_y = 0;

    if (spawnZone == "story") {
        spawn_x = story_spawn_x * app_width;
        spawn_y = app_height - default_story_height - 25;
    }

    const draggable = createDraggableObject(spawn_x, spawn_y);
    draggable.rotation = Math.random() * 5;
    // Add it to the stage
    app.stage.addChild(draggable);

    let story = getStory();
    story.sprite = draggable;

    addText(draggable, story.headline, story.expected_readers);
    
    //possibly moved to different function
    //addText(draggable, text)

    stories.push(story);
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

    // reorient stories when you pick them up
    dragTarget.rotation = 0;

    const story = getStoryFromSprite(dragTarget);
    removeFromPaper(story);

    app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        const story = getStoryFromSprite(dragTarget);
        checkStorySlot(story);
        dragTarget = null;
    }
}

function addText(sprite, text, subtext = '') {
    if (sprite.children[0]) {
        sprite.removeChild(sprite.children[0])
    }
    // add text on top
    const sprite_text = new PIXI.Text(text, {
      fill : 0x000000,
      align : 'center',
      fontFamily: "Courier New",
      fontSize: 40,
      wordWrap : true,
      wordWrapWidth : sprite.width * 4,
      cacheAsBitmap: true, // for better performance
    });    

    sprite_text.scaleMode = PIXI.SCALE_MODES.NEAREST;
    sprite_text.anchor.x = sprite_text.anchor.y = 0.5;
    sprite_text.scale.set(0.15 + 1/text.length);    // longer text is slightly smaller
    sprite.addChild(sprite_text);
}

function getStoryFromSprite(sprite) {
    return stories.find((story) => story.sprite == sprite);
}
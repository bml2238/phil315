import { initNewspaper, checkStorySlot, removeFromPaper, submitPaper } from './newspaper.js';
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
const new_story_interval = 7 * 1000;   // 10 seconds (in milliseconds)
const starting_stories = 3;         // +1 for < stuff
const story_spawn_x = 0.5;
const default_story_height = 40;
const max_stories_spawned = 12;
const source_slot_width = 0.25;
const source_check_interval = 10 * 1000; 


// Bunny texture, to be replaced (sadly)
const bunny_texture = await PIXI.Assets.load('bunny.png');
bunny_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


// objects to be referenced (bad practice whatever)
const stories = new Array();
const source_slots = new Array();

// initialize the newspaper stuff
const newspaper = initNewspaper(app_height, app_width, newpaper_width, bunny_texture);
app.stage.addChild(newspaper);
const story_texture = await PIXI.Assets.load('story.png');
story_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


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

// functions like the drawer
createSourceSlots();

createSubmitButton();


setInterval(function() {
    if (stories.length < max_stories_spawned) {
        createStory("story");
    }
    else {
        drawer.alpha = 0.5;
    }
 }, new_story_interval) // 2 seconds = 2000 miliseconds

// initial game state
for (let i = 0; i < starting_stories; i++) {
    createStory("story");
}



function createSourceSlots() {
    createSourceSlot(1);
    createSourceSlot(2);
    createSourceSlot(3);

    console.log(source_slots);
}

function createSourceSlot(index) {
    const source = new PIXI.Sprite(drawer_texture);

    source.anchor.x = source.anchor.y = 0.5;
    // halfway between far right and the start of the source slot area
    source.x = app_width - Math.round(app_width * source_slot_width * 0.5);
    // either 1/6, 1/2, or 5/6 of the way down
    source.y = Math.round(app_height * ((index / 3) - 1/6));

    const sprite_text = new PIXI.Text("place story here to check sources", {
        fontFamily: "Courier New",
        fontSize: 15,
        fill : 0x666666,
        align : 'center',
        cacheAsBitmap: true, // for better performance
    });    
    sprite_text.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;
    sprite_text.anchor.x = sprite_text.anchor.y = 0.5;
    source.addChild(sprite_text);

    source_slots[index - 1] = source;

    app.stage.addChild(source);
}

function createStory(spawnZone, title = '') {
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


    if (spawnZone == "story") {
        let story;
        // make sure the player always has at least 5 true stories to publish
        if (needTrueStory) {
            story = getStory(true);
        }
        else {
            story = getStory();
        }

        story.sprite = draggable;
    
        addText(draggable, story.headline, story.expected_readers);

        stories.push(story);
    }
    else {
        addText(draggable, title);
        return draggable;
    }
}

function createSubmitButton() {
    const button = new PIXI.Sprite(bunny_texture);

    // place button next to newspaper
    button.x = app_width * newpaper_width + button.width;
    button.y = button.height;
    button.anchor.y = 0.5;
    button.scale.set(2);

    const sprite_text = new PIXI.Text("Submit paper?", {
        fill : 0x000000,
        fontFamily: "Courier New",
        fontSize: 16,
        cacheAsBitmap: true, // for better performance
      });   

    // text to the right of the sprite
    sprite_text.anchor.x = -0.2;
    sprite_text.anchor.y = 0.5;

    button.addChild(sprite_text);

    // submit paper function
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointerdown', confirmSubmit, button);

    app.stage.addChild(button);
}

function createDraggableObject(x, y) {
    // Create our little bunny friend..
    const draggable = new PIXI.Sprite(story_texture);

    // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    draggable.eventMode = 'static';
    draggable.cursor = 'pointer';
    draggable.anchor.set(0.5);
    draggable.on('pointerdown', onDragStart, draggable);
    draggable.x = x;
    draggable.y = y;

    //possibly changed in the future
    draggable.height = 70;
    draggable.scale.set(0.75);

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

    // move the story to the top
    app.stage.removeChild(dragTarget);
    app.stage.addChild(dragTarget);

    const story = getStoryFromSprite(dragTarget);
    removeFromPaper(story);

    app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;

        const story = getStoryFromSprite(dragTarget);
        if (story) {
            if (dragTarget.x < (app_width * newpaper_width)) {
                checkStorySlot(story);
            }
            else if (dragTarget.x > (app_width - app_width * source_slot_width)) {
                checkSources(story);
            }
        }
        
        dragTarget = null;
    }
}

function addText(sprite, text, subtext = '') {
    if (sprite.children[0]) {
        sprite.removeChild(sprite.children[0]);
    }

    const container = new PIXI.Container();

    const sprite_text = new PIXI.Text(text, {
      fill : 0x000000,
      align : 'center',
      fontFamily: "Courier New",
      fontSize: 40,
      wordWrap : true,
      wordWrapWidth : sprite.width * 2,
      cacheAsBitmap: true, // for better performance
    });    

    sprite_text.scaleMode = PIXI.SCALE_MODES.NEAREST;
    sprite_text.resolution = 0.4;
    sprite_text.anchor.x = sprite_text.anchor.y = 0.5;
    sprite_text.scale.set(0.6 + 1/text.length);    // longer text is slightly smaller
    container.addChild(sprite_text);

    if (subtext != '') {
        subtext = "expected readers: " + subtext;
        const sprite_subtext = new PIXI.Text(subtext, {
            fill : 0x000000,
            align : 'center',
            fontFamily: "Courier New",
            fontSize: 40,
            wordWrap : true,
            wordWrapWidth : sprite.width * 100,
            cacheAsBitmap: true, // for better performance
          }); 
        sprite_subtext.scaleMode = PIXI.SCALE_MODES.NEAREST;
        sprite_subtext.resolution = 0.4;
        sprite_subtext.anchor.x = sprite_subtext.anchor.y = 0.5;
        sprite_subtext.scale.set(0.5);    // longer text is slightly smaller
        sprite_subtext.x = sprite_text.x;
        sprite_subtext.y = sprite_text.y + sprite_text.height/2 + 7;    // the + is for padding
        container.addChild(sprite_subtext);
    }

    sprite.addChild(container);
}

function getStoryFromSprite(sprite) {
    return stories.find((story) => story.sprite == sprite);
}

function checkSources(story) {
    //TODO: some confirmation message?
    startCheckSources(story);
}

function startCheckSources(story) {
    const sprite = story.sprite;
    
    let current_slot;
    if (sprite.y < (app_height / 3)) {
        current_slot = 1;
    }
    else if (sprite.y < 2 * (app_height / 3)) {
        current_slot = 2;
    }
    else {
        current_slot = 3;
    }

    // if slot is tinted, it's already used
    if (source_slots[current_slot - 1].alpha < 1) {
        return;
    }

    // move story to center of slot
    sprite.x = app_width - Math.round(app_width * source_slot_width * 0.5);
    sprite.y = Math.round(app_height * ((current_slot / 3) - 1/6));

    // disable slot and story
    const source_slot = source_slots[current_slot - 1];
    sprite.alpha = 0.3;
    source_slot.alpha = 0.3;
    sprite.off('pointerdown', onDragStart, sprite);
    sprite.on('pointerdown', currentlyChecking, sprite);

    const some_time = setTimeout(() => {
        endCheckSources(story, some_time);
    }, source_check_interval);
}

function endCheckSources(story, timeout) {
    const sprite = story.sprite;
    console.log(timeout);

    // re-enable story
    sprite.off('pointerdown', currentlyChecking, sprite);
    sprite.on('pointerdown', onDragStart, sprite);
    sprite.alpha = 1;

    // create source objects
    spawnSource(story, story.source1)
    if (story.source2) {
        spawnSource(story, story.source2)
    }
    if (story.source3) {
        spawnSource(story, story.source2)
    }

    // move story out
    sprite.x = sprite.x - (app_width * source_slot_width);
    sprite.y += (Math.random() * 50) - 25;   // little wiggle
}

function spawnSource(story, source) {
    const story_source = createStory("source", source);
    story_source.scale.set(0.6);

    // place source in the source slot
    story_source.anchor.x = story_source.anchor.y = 0.5;
    story_source.x = story.sprite.x;
    story_source.y = story.sprite.y;

    // arbitrary color to differentiate from normal stories
    story_source.tint = 0xFFB6C1;
}

function currentlyChecking() {
    console.log("sorry the story is in progress")
}

function confirmSubmit() {
    const button = this;
    console.log(button);

    if (button.children[0]) {
        button.removeChild(button.children[0]);
    }

    // change sprite text
    const sprite_text = new PIXI.Text("Are you sure?", {
        fill : 0x000000,
        fontFamily: "Courier New",
        fontSize: 16,
        cacheAsBitmap: true, // for better performance
      });   

    // text to the right of the sprite
    sprite_text.anchor.x = -0.2;
    sprite_text.anchor.y = 0.5;

    button.addChild(sprite_text);

    // change click function to actual submit
    button.off('pointerdown', confirmSubmit, button);
    button.on('pointerdown', submitPaperClick, button);
    
    // the "cancel" function
    button.on('pointerleave', cancelSubmit, button);
}

function cancelSubmit() {
    const button = this;
    
    // "reset" the button by remaking it
    app.stage.removeChild(button);
    createSubmitButton();
}

function submitPaperClick() {
    // just calling cancelSubmit didn't work
    const button = this;
    
    // "reset" the button by remaking it
    app.stage.removeChild(button);
    createSubmitButton();

    // actual submit function
    submitPaper();
}

function needTrueStory() {
    const stories_remaining = max_stories_spawned - stories.length;

    let true_stories = 0;
    stories.forEach((story) => {
        if (story.is_true) {
            true_stories++;
        }
    });

    if (true_stories >= 5) {
        return false;
    }
    else if ((5 - true_stories) == stories_remaining) {
        return true;
    }
    
    return false;
}
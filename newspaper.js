// these will be the coordinates for where the headliner is on screen
let headliner_x0;
let headliner_xx;
let headliner_y0;
let headliner_yy;

// these are the coordinates of the other news stories
let other_x0;
let other_xx;
let other_y0;
let other_yy;
let center_line;
let col1_divide;
let col2_divide;

// bad practice but whatever
const headliner_height = 0.25;  // headline always takes up the whole width
const normal_height  = 0.6;    // percent of 'other story' block that the normal story height takes up
const newspaper_slots = new Map();

let headliner = undefined;
const story_slots = new Array();

export function initNewspaper(app_height, app_width, newpaper_width, bunny_texture) {
    const container = new PIXI.Container();
    const headliners = new Array();

    // just for sizing reference
    const bunny_sample = new PIXI.Sprite(bunny_texture);

    // creating newspaper grid
    const grid_height = Math.floor(app_height / bunny_sample.height) - 1;
    const grid_width = Math.round(Math.floor(app_width / bunny_sample.height) * newpaper_width);
    const grid_slots = new Array(grid_height);

    // initializing story sizes in grid units
    const headliner_grid_height = Math.round(grid_height * headliner_height);

    // populating grid
    for (let i = 0; i < grid_height; i++) {
        grid_slots[i] = new Array();
        for (let k = 0; k < grid_width; k++) {
            const bunny = new PIXI.Sprite(bunny_texture);
            bunny.x = k * 40;
            bunny.y = i * 40;
            container.addChild(bunny);

            // ignore borders
            if (i == 0 || i == (grid_height - 1) || 
                k == 0 || k == (grid_width - 1)) {
                continue;
            }

            // headliner collision
            if (i > 0 && i <= headliner_grid_height) {
                headliners.push(bunny);
                bunny.alpha = 0;
                continue;
            }

            // max height below headliner, final border
            const min_height = headliner_grid_height + 1
            const max_height = grid_height - 1;
            
            if (i == (min_height + 1) && k == 1) {
                bunny.alpha = 0.1;
                other_x0 = bunny.position.x;
                other_y0 = bunny.position.y;
            }
            else if (i == (max_height - 1) && k == (grid_width - 2)) {
                bunny.alpha = 0.1;
                other_xx = bunny.position.x + bunny_sample.width;
                other_yy = bunny.position.y + bunny_sample.height;
            }
        }
    }

    // set headliner dimensions for checking later
    headliner_x0 = headliners[0].position.x;
    headliner_y0 = headliners[0].position.y;
    headliner_xx = headliners[headliners.length - 1].position.x + bunny_sample.width;
    headliner_yy = headliners[headliners.length - 1].position.y + bunny_sample.height;

    // set other story dimensions for checking later
    center_line = (other_x0 + other_xx) / 2;
    col1_divide = (other_yy - other_y0) * normal_height + other_y0;
    col2_divide = (other_yy - other_y0) * (1 - normal_height) + other_y0;

    newspaper_slots.set("headliners", headliners);
    return container;
}

export function checkStorySlot(story) {
    const sprite = story.sprite;
    if (sprite.x < headliner_x0 ||      // too high
        sprite.y < headliner_y0 ||      // too far left
        sprite.x > other_xx     ||      // too far right
        sprite.y > other_yy) {          // too low
            return
    }      

    if (checkHeadliner(story)) {
        setHeadliner(story)

        //TODO: match headliner dimensions
        return;
    }
    if (sprite.x < center_line) {
        if (sprite.y < col1_divide) {
            setSlot(story, 0)
        }
        else {
            setSlot(story, 1)
        }
    }
    else {
        if (sprite.y < col2_divide) {
            setSlot(story, 2)
        }
        else {
            setSlot(story, 3)
        }
    }
}

function checkHeadliner(story) {
    const sprite = story.sprite;
    if (sprite.x > headliner_x0 && sprite.x < headliner_xx) {
        if (sprite.y > headliner_y0 && sprite.y < headliner_yy) {
            return true;
        }
    }

    return false;
}

function setHeadliner(story) {
    const sprite = story.sprite;
    // if there already is a headliner, replace it
    if (headliner) {
        headliner.sprite.x = headliner_xx + 200;           // move the other headliner out of the way
        headliner.sprite.y += (Math.random() * 50) - 25;   // little wiggle
    }
    sprite.x = Math.round((headliner_x0 + headliner_xx) / 2);
    sprite.y = Math.round((headliner_y0 + headliner_yy) / 2);
    headliner = story;
}

function setSlot(story, slot_num) {
    const sprite = story.sprite;
    if (story_slots[slot_num]) {
        story_slots[slot_num].sprite.x = other_xx + 200;
        story_slots[slot_num].sprite.y += (Math.random() * 50) - 100;
    }
    switch(slot_num) {
        case 0: 
            sprite.x = Math.round((other_x0 + center_line) / 2);
            sprite.y = Math.round((other_y0 + col1_divide) / 2);
            story_slots[0] = story;
            break;
        case 1: 
            sprite.x = Math.round((other_x0 + center_line) / 2);
            sprite.y = Math.round((col1_divide + other_yy) / 2);
            story_slots[1] = story;
            break
        case 2: 
            sprite.x = Math.round((center_line + other_xx) / 2);
            sprite.y = Math.round((other_y0 + col2_divide) / 2);
            story_slots[2] = story;
            break
        case 3: 
            sprite.x = Math.round((center_line + other_xx) / 2);
            sprite.y = Math.round((col2_divide + other_yy) / 2);
            story_slots[3] = story;
            break
        default:
            return
    }
}

export function removeFromPaper(story) {
    if (story == headliner) {
        headliner = undefined;
    }
    else if (story_slots.some(slot => slot == story)) {
        story_slots[story_slots.indexOf(story)] = undefined;
    }
}

export function getHeadliner() {
    return story_slots;
}

export function calculateScore() {
    let score = 0;

    if (headliner) {
        score += headliner.expected_readers * 2;
    }

    story_slots.forEach((story) => {
        if(story) {
            score += story.expected_readers;
        }
    });

    return score;
}

export function submitPaper() {
    console.log("uwu???");
}
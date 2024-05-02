// these will be the coordinates for where the headliner is on screen
let headliner_x0;
let headliner_xx;
let headliner_y0;
let headliner_yy;

// bad practice but whatever
const headliner_height = 0.25;  // headline always takes up the whole width
const normal_height  = 0.3;     // standard stories are squares
const small_height   = 0.3;
const small_width    = 0.15;
const newspaper_slots = new Map();

let headliner = undefined;

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

export function checkStorySlot(sprite) {
    if (checkHeadliner(sprite)) {
        // if there already is a headliner, replace it
        if (headliner) {
            headliner.x += 400;                         // move the other headliner out of the way
            headliner.y += (Math.random() * 50) - 25;   // little wiggle
        }
        setHeadliner(sprite)

        //TODO: match headliner dimensions
    } 
    else {
        // moving the current headliner out of the slot
        if (headliner == sprite) {
            headliner = undefined;
        }
    }

    console.log(headliner);
}

function checkHeadliner(sprite) {
    if (sprite.x > headliner_x0 && sprite.x < headliner_xx) {
        if (sprite.y > headliner_y0 && sprite.y < headliner_yy) {
            return true;
        }
    }

    return false;
}

function setHeadliner(sprite) {
    sprite.x = Math.round((headliner_x0 + headliner_xx) / 2);
    sprite.y = Math.round((headliner_y0 + headliner_yy) / 2);
    headliner = sprite;
}

export function getHeadliner() {
    return headliner;
}
//globals
var text = document.getElementById("text");
var img = document.getElementById("img");
var txtIn = "left";
var btn = "";
var message = "";
var pLocation = "";
var sandwich = [];
var kitchen = [];
var items = [];
var gameOver = false;

window.addEventListener("load", init);

//classes for rooms and items
//the lines got blurred a little by the end
function Room(x) {
    this.name = x;
    this.img = "";
    this.opener = "";
    this.contents = "";
    this.openclose = "closed";

    this.left = function () {
        pLocation = pLocation - 1;
    }
    this.right = function () {
        pLocation = pLocation + 1;
    }
    this.up = function () {
        message = "<span>There isn't anything above here. </span>";
    }
    this.down = function () {
        message = "<span>There isn't anything below here. </span>";
    }
    this.open = function () {
        message = "<span>There isn't anything to open here. </span>";
    }
    this.close = function () {
        message = "<span>There isn't anything to close here. </span>";
    }
    this.use = function () {
        message = "<span>There isn't anything to use here. </span>";
    }
}

function Item(x) {
    this.name = x;
    this.dispName = this.name;
    this.description = "";
    this.location = 99;
    this.getMsg = "";
    this.take = function () {
        message = this.getMsg;
        this.location = 101;
    }
    this.use = function () {
        message = "<span>What about the <span>" + this.dispName + "? </span></span>";
    }
}

//makeWorld() and makeItems() populate the world
//with the rooms and inventory items in the game
//locations are keyed to rooms, but 99=hidden,
//100=used and 101=player  inventory
//I ran out of time and didn't have as much time to
//clean these up as I had thought
function makeWorld() {
    kitchen[0] = new Room("cupboard");
    kitchen[1] = new Room("counter");
    kitchen[2] = new Room("sink");
    kitchen[3] = new Room("oven");
    kitchen[4] = new Room("fridge");
    kitchen[5] = new Room("prep");

    //cupboard
    //complete
    kitchen[0].contents = "<span>The <span>cupboard</span> is <span>closed</span> right now. </span>";
    kitchen[0].opener = "<span>You're looking at the <span>cupboard. </span></span>";
    kitchen[0].img = "<img src='img/cupboard-1.png'alt='The cupboard is closed.'>";
    kitchen[0].down = function () {
        pLocation = 1;
    }
    kitchen[0].left = function () {
        pLocation = 5;
    }
    kitchen[0].right = function () {
        pLocation = 2;
    }
    kitchen[0].open = function () {
        switch (kitchen[0].openclose) {
            case "closed":
                kitchen[0].openclose = "open";
                kitchen[0].contents = "<span>The <span>cupboard</span> is <span>open. </span></span>";
                if (items[0].location != 99) {
                    kitchen[0].img = "<img src='img/cupboard-3.png'alt='The cupboards are open.'>";
                } else if (items[0].location == 99) {
                    kitchen[0].img = "<img src='img/cupboard-2.png'alt='The cupboards are open.'>";
                    items[0].location = 0;
                }
                break;
            case "open":
                message = "<span>The <span>cupboard</span> is already open. </span>";
                break;
            default:
                message = "error";
        }
    }
    kitchen[0].close = function () {
        switch (kitchen[0].openclose) {
            case "closed":
                message = "<span>The <span>cupboard</span> is already <span>close</span>d. </span>";
            case "open":
                kitchen[0].openclose = "closed";
                kitchen[0].contents = "<span>The <span>cupboard</span> is <span>close</span>d. </span>";
                kitchen[0].img = "<img src='img/cupboard-1.png'alt='The cupboards are closed.'>";
                if (items[0].location == 0) {
                    items[0].location = 99;
                }
                break;
            default:
                message = "error";
        }
    }
    kitchen[0].use = function () {
        switch (kitchen[0].openclose) {
            case "open":
                kitchen[0].close();
                break;
            case "closed":
                kitchen[0].open();
                break;
            default:
                message = "error";
        }
    }

    //counter
    //complete
    kitchen[1].img = "<img src='img/counter.png'alt='The kitchen counter.'>";
    kitchen[1].opener = "<span>This is the kitchen <span>counter. </span></span>";
    kitchen[1].contents = "<span>The <span>microwave</span> is here. Above you is the <span>cupboard. </span></span>";
    kitchen[1].up = function () {
        pLocation = 0;
    }
    kitchen[1].left = function () {
        pLocation = 5;
    }
    kitchen[1].use = function () {
        items[1].use();
    }

    //sink
    //complete
    kitchen[2].img = "<img src='img/sink.png'alt='The kitchen sink.'>";
    kitchen[2].opener = "<span>It's the <span>sink. </span></span>";
    kitchen[2].contents = "<span>Not much to say about it. </span>";
    kitchen[2].use = function () {
        switch (items[4].location) {
            case 101:
                if (items[4].washed == true) {
                    message = "<span>The <span>lettuce</span> has already been washed.</span>";
                } else if (items[4].washed == false) {
                    items[4].washed = true;
                    items[4].dispName = "clean lettuce";
                    message = "<span>You wash the <span>lettuce</span> in the <span>sink.</span> Much better now. </span>";
                };
                break;
            default:
                message = "<span>Not much to do here right now. </span>";
        }
    }

    //oven
    //complete
    kitchen[3].img = "<img src='img/oven-1.png'alt='The oven is closed.'>";
    kitchen[3].opener = "<span>This is the kitchen <span>oven. </span></span>";
    kitchen[3].contents = "<span>The oven is currently <span>close</span>d. </span>";
    kitchen[3].open = function () {
        switch (kitchen[3].openclose) {
            case "closed":
                kitchen[3].openclose = "open";
                kitchen[3].contents = "The <span>oven</span> is currently <span>open. </span></span>";
                kitchen[3].img = "<img src='img/oven-2.png'alt='The oven is open.'>";
                break;
            default:
                message = "The <span>oven</span> is already <span>open</span>. ";
        }
    }
    kitchen[3].close = function () {
        switch (kitchen[3].openclose) {
            case "open":
                kitchen[3].openclose = "closed";
                kitchen[3].contents = "<span>The <span>oven</span> is currently <span>close</span>d.</span>";
                kitchen[3].img = "<img src='img/oven-1.png'alt='The oven is closed.'>";
                break;
            default:
                message = "<span>The <span>oven</span> is already <span>close</span>d. </span>";
        }
    }
    kitchen[3].use = function () {
        switch (pLocation) {
            case 3:
                switch (kitchen[3].openclose) {
                    case "open":
                        switch (items[5].location) {
                            case 101:
                                switch (items[5].cooked) {
                                    case true:
                                        message = "<span>The <span>bacon</span> is already cooked. </span>";
                                        break;
                                    default:
                                        items[5].cooked = true;
                                        items[5].dispName = "cooked bacon";
                                        message = "<span>You cook the <span>bacon</span> in the oven. </span>";
                                }
                                break;
                            default:
                                message = "<span>You don't have anything to <span>use</span> with the <span>oven. </span></span>";
                        }
                        break;
                    default:
                        kitchen[3].open();
                }
                break;
            default:
                message = "<span>What about the <span>oven? </span></span>";
        }
    }

    //fridge
    //complete
    kitchen[4].img = "<img src='img/fridge-1.png'alt='The fridge is closed.'>";
    kitchen[4].opener = "<span>This is where the <span>fridge</span> is. </span>";
    kitchen[4].contents = "<span>The fridge is <span>close</span>d. </span>";
    kitchen[4].open = function () {
        switch (kitchen[4].openclose) {
            case "closed":
                kitchen[4].openclose = "open";
                kitchen[4].contents = "<span>The fridge is <span>open </span> right now. </span>";
                for (var i = 3; i < 7; i++) {
                    if (items[i].location == 99) {
                        items[i].location = 4;
                    }
                }
                kitchen[4].checkFridge();
                break;
            default:
                message = "<span>The <span>fridge</span> is already <span>open. </span>";
        }
    }
    kitchen[4].close = function () {
        switch (kitchen[4].openclose) {
            case "open":
                kitchen[4].openclose = "closed";
                kitchen[4].contents = "<span>The <span>fridge</span> is <span>close</span>d. </span>";
                kitchen[4].img = "<img src='img/fridge-1.png'alt='The fridge is closed.'>";
                for (var i = 3; i < 7; i++) {
                    if (items[i].location == 4) {
                        items[i].location = 99;
                    }
                }
                break;
            default:
                message = "<span>The <span>fridge</span> is already <span>close</span>d. </span>";
        }
    }
    kitchen[4].checkFridge = function () {
        var empty = true;
        for (var i = 3; i < 7; i++) {
            if (items[i].location == 4) {
                empty = false;
            }
        }
        switch (empty) {
            case true:
                kitchen[4].img = "<img src='img/fridge-3.png'alt='The fridge is open.'>";
                break;
            default:
                kitchen[4].img = "<img src='img/fridge-2.png'alt='The fridge is open.'>";
        }
    }
    kitchen[4].use = function () {
        switch (kitchen[4].openclose) {
            case "open":
                kitchen[4].close();
                break;
            default:
                kitchen[4].open();
        }
    }

    //prep
    kitchen[5].img = "<img src='img/prep.png'alt='The food preperation area.'>";
    kitchen[5].opener = "<span>You're standing in the food <span>prep</span> area. </span>"
    kitchen[5].contents = "<span>This is the perfect place to <span>make</span> a sandwich. </span";
    kitchen[5].right = function () {
        pLocation = 1;
    }
    kitchen[5].use = function () {
        switch (items[7].location) {
            case 101:
                if (items[7].sliced == true) {
                    message = "<span>The <span>tomato</span> has already been sliced.</span>";
                } else if (items[7].sliced == false) {
                    items[7].sliced = true;
                    items[7].dispName = "sliced tomato";
                    message = "<span>You use the <span>knife</span> to slice a <span>tomato. </span></span>";
                }
                break;
            default:
                message = "<span>You don't have anything for the <span>knife</span> the cut. </span>";
        }
    }

}

function makeItems() {
    items[0] = new Item("plates");
    items[1] = new Item("microwave");
    items[2] = new Item("pan");
    items[3] = new Item("bread");
    items[4] = new Item("lettuce");
    items[5] = new Item("bacon");
    items[6] = new Item("mayonnaise");
    items[7] = new Item("tomato");
    items[8] = new Item("placeholder");
    items[9] = new Item("knife");

    //plates

    items[0].description = "<span>There are some <span>plates. </span>";
    items[0].location = 99;
    items[0].getMsg = "<span>You got a <span>plates. </span></span>";
    items[0].dispName = "plate";
    items[0].take = function () {
        kitchen[0].img = "<img src='img/cupboard-3.png'alt='The cupboards are open.'>";
        message = items[0].getMsg;
        items[0].dispName = "plate";
        items[0].location = 101;
    };
    items[0].use = function () {
        switch (items[0].location) {
            case 101:
                if (pLocation === 5) {
                    items[0].location = 100;
                    message = "<span>You set the <span>plate</span> down, ready to hold a sandwich. </span>";
                } else if (pLocation !== 5) {
                    message = "<span>You can't go setting <span>plates</span> willy-nilly around the kitchen. </span>";
                }
                break;
            case 0:
                GetItem("plates");
                break;
            default:
                message = "<span>Yes, what about the <span>plate? </span></span>";
        }
    };

    items[1].description = "<span>The <span>microwave</span> is here.";
    items[1].location = 1;
    items[1].use = function () {
        switch (pLocation) {
            case 1:
                switch (items[5].location) {
                    case 101:
                        switch (items[5].cooked) {
                            case true:
                                message = "<span>The <span>bacon</span> is already cooked. </span>";
                                break;
                            default:
                                items[5].cooked = true;
                                items[5].dispName = "cooked bacon";
                                message = "<span>You cook the <span>bacon</span> in the microwave. </span>";
                        }
                        break;
                    default:
                        message = "<span>You don't have anything to cook in the <span>microwave. </span></span>";
                }
                break;
            default:
                message = "<span>What about the <span>microwave? </span></span>";
        }
    }

    items[2].description = "<span>There is a <span>pan</span> on the stovetop. </span>";
    items[2].location = 3;
    items[2].use = function () {
        switch (pLocation) {
            case 3:
                switch (items[5].location) {
                    case 101:
                        switch (items[5].cooked) {
                            case true:
                                message = "<span>The <span>bacon</span> is already cooked. </span>";
                                break;
                            default:
                                items[5].cooked = true;
                                items[5].dispName = "cooked bacon";
                                message = "<span>You cook the <span>bacon</span> in the <span>pan. </span></span>";
                        }
                        break;
                    default:
                        message = "<span>You don't have anything to cook with the <span>pan. </span></span>";
                }
                break;
            default:
                message = "<span>What about the <span>pan? </span></span>";
        }
    }

    items[3].description = "<span>There is some <span>bread. </span></span>";
    items[3].location = 99;
    items[3].getMsg = "<span>You got the <span>bread. </span></span>";
    items[3].slices = 2;
    items[3].take = function () {
        message = items[3].getMsg;
        items[3].location = 101;
        kitchen[4].checkFridge();
    }
    items[3].use = function () {
        switch (pLocation) {
            case 5:
                switch (items[3].location) {
                    case 101:
                        if (items[0].location === 100) {
                            if (items[3].slices === 1) {
                                console.log("slices 1->0");
                                items[3].slices = 0;
                                items[3].location = 100;
                                sandwich.unshift("bread");
                                gameOver = true;
                            } else if (items[3].slices === 2) {
                                console.log("slices 2->1");
                                sandwich.unshift("bread");
                                items[3].slices = 1;
                                message = "<span>You set down a slice of <span>bread. </span></span>";
                            }
                        } else if (items[0].location !== 100) {
                            message = "<span>You can't put the <span>bread</span> directly on the counter, you barbarian! </span>";
                        }
                        break;
                    default:
                        GetItem("bread");
                }
                break;
            default:
                GetItem("bread");
        }
    }

    items[4].description = "<span>There is some <span>lettuce.  </span></span>";
    items[4].location = 99;
    items[4].getMsg = "<span>You got the <span>lettuce. </span></span>";
    items[4].washed = false;
    items[4].take = function () {
        message = items[4].getMsg;
        items[4].location = 101;
        kitchen[4].checkFridge();
    }
    items[4].use = function () {
        switch (pLocation) {
            case 5:
                switch (items[4].location) {
                    case 101:
                        if (items[0].location === 100) {
                            items[4].location = 100;
                            sandwich.unshift("lettuce");
                            message = "<span>You set the <span>lettuce</span> on top of the <span>" + sandwich[1] + ". </span></span>";
                        } else if (items[0].location !== 100) {
                            message = "<span>You can't put the <span>lettuce</span> directly on the counter! </span>";
                        }
                        break;
                    default:
                        GetItem("lettuce");
                }
                break;
            case 2:
                switch (items[4].location) {
                    case 101:
                        kitchen[2].use();
                        break;
                    default:
                        GetItem("lettuce");
                }
                break;
            default:
                GetItem("lettuce");
        }
    }


    items[5].description = "<span>There is some <span>bacon. </span></span>";
    items[5].location = 99;
    items[5].getMsg = "<span>You got the <span>bacon. </span></span>";
    items[5].cooked = false;
    items[5].take = function () {
        message = items[5].getMsg;
        items[5].location = 101;
        kitchen[4].checkFridge();
    }
    items[5].use = function () {
        switch (pLocation) {
            case 5:
                switch (items[5].location) {
                    case 101:
                        if (items[0].location === 100) {
                            items[5].location = 100;
                            sandwich.unshift("bacon");
                            message = "<span>You set the <span>bacon</span> on top of the <span>" + sandwich[1] + ". </span></span>";
                        } else if (items[0].location !== 100) {
                            message = "<span>You can't put the <span>bacon</span> directly on the counter! </span>";
                        }
                        break;
                    default:
                        GetItem("bacon");
                }
                break;
            default:
                GetItem("bacon");
        }
    }

    items[6].description = "<span>There is some <span>mayonnaise. </span></span>";
    items[6].location = 99;
    items[6].getMsg = "<span>You got the <span>mayonnaise. </span></span>";
    items[6].take = function () {
        message = items[6].getMsg;
        items[6].location = 101;
        kitchen[4].checkFridge();
    }
    items[6].use = function () {
        switch (pLocation) {
            case 5:
                switch (items[6].location) {
                    case 101:
                        if (items[0].location === 100) {
                            items[6].location = 100;
                            sandwich.unshift("mayo");
                            if (sandwich[1] === "bread") {
                                message = "<span>You spread the <span>mayonnaise</span> on top of the <span>" + sandwich[1] + ". </span></span>";
                            } else if (sandwich[1] === undefined) {
                                message = "<span>You smear some <span>mayonnaise</span> directly on the <span>plate. </span></span>";
                            } else if (sandwich[1] !== "bread") {
                                message = "<span>You clumsily smear the <span>mayonnaise</span> on top of the <span>" + sandwich[1] + ". </span></span>";
                            };
                        } else if (items[0].location !== 100) {
                            message = "<span>You can't put the <span>mayonnaise</span> directly on the counter! </span>";
                        }
                        break;
                    default:
                        GetItem("mayonnaise");
                }
                break;
            default:
                GetItem("mayonnaise");
        }
    }

    items[7].description = "<span>Some <span>tomatoes</span> are on the counter. </span>";
    items[7].location = 5;
    items[7].getMsg = "<span>You got a <span>tomato. </span></span>";
    items[7].sliced = false;
    items[7].use = function () {
        switch (pLocation) {
            case 5:
                switch (items[7].location) {
                    case 101:
                        if (items[0].location === 100) {
                            items[6].location = 100;
                            sandwich.unshift("tomato");
                            if (items[7].sliced === false) {
                                message = "<span>You place a whole <span>tomato</span> on the sandwich. </span>";
                            } else if (items[7].sliced === true) {
                                message = "<span>You place the <span>tomato</span> slices on the sandwich. </span>";
                            };
                        } else if (items[0].location !== 100) {
                            message = "<span>The counter still has some <span>tomatoes .</span> </span>";
                        }
                        break;
                    default:
                        GetItem("tomato");
                }
                break;
            default:
                GetItem("tomato");
        }
    }


    items[9].description = "<span>There is a <span>knife. </span></span>";
    items[9].location = 5;

}

//checks if a player can take an item
//and if legal changes the location to 101
function GetItem(x) {
    console.log("Getting " + x);
    var match = false;

    if (match === false) {
        for (var i = 0; i < items.length; i++) {
            if (x == items[i].name) {
                match = i;
            }
        }
    }

    if (match !== false) {
        switch (items[match].location) {
            case 101:
                message = "<span>You already got it. </span>";
                console.log("case 101");
                break;
            case 99:
                message = "<span>You can't get that from here! </span>";
                console.log("case 99");
                break;
            case pLocation:
                items[match].take();
                console.log("case match");
                break;
            default:
                message = "<span>You can't get that from here! </span>";
                console.log("case default");
        }
    } else {
        message = "<span>Get what? </span>";
    }
    console.log("Done getting");
}

//checks the items to see if any are
//in location 101, and returns true
function invCheck(x) {
    match = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i].location === x) {
            match = true;
        }
    }
    return match;
}

//shows all items in location 101
function invDisplay() {
    if (invCheck(101) == true) {
        text.innerHTML += "<br /><br /><span><span>Inventory:</span> ";
        for (var i = 0; i < items.length; i++) {
            if (items[i].location === 101) {
                text.innerHTML += "<span>[" + items[i].dispName + "] </span>";
            }
        }
    }
}

//checks if the sandwich array
//has content, then displays
function sandDisplay() {
    if (sandwich.length !== 0) {
        text.innerHTML += "<br /><span><span>Sandwich:</span> ";
        for (var i = 0; i < sandwich.length; i++) {
            text.innerHTML += "<span>[" + sandwich[i] + "] </span>";
        }
        text.innerHTML += "</span>";
    };

    for (var i = 0; i < sandwich.length; i++) {};
}

//initialization stuff
function keydownHandler(event) {
    if (event.keyCode === 13) {
        txtIn = document.getElementById("txtIn").value;
        txtIn = txtIn.toLowerCase();
        play(txtIn);
    }
}

function clickHandler(event) {
    txtIn = document.getElementById("txtIn").value;
    txtIn = txtIn.toLowerCase();
    play(txtIn);
}

function init() {
    makeWorld();
    makeItems();
    pLocation = 5;
    render(txtIn);
}

//storage
function save() {
    var savedLocation = pLocation.toString();
    var slices = items[3].slices;
    var washed = items[4].washed;
    var cooked = items[5].cooked;
    var sliced = items[7].sliced;
    localStorage.setItem("savePlayer", savedLocation);
    localStorage.setItem("saveSlices", slices);
    localStorage.setItem("saveWashed", washed);
    localStorage.setItem("saveCooked", cooked);
    localStorage.setItem("saveSliced", sliced);

    for (var i = 0; i < kitchen.length; i++) {
        localStorage.setItem("open" + kitchen[i].name, kitchen[i].openclose);
    }
    for (var i = 0; i < kitchen.length; i++) {
        localStorage.setItem("img" + kitchen[i].name, kitchen[i].img);
    }

    for (var i = 0; i < items.length; i++) {
        localStorage.setItem(items[i].name, items[i].location.toString());
    }

    message = "<span><span>Save</span> completed. </span>";
}

function load() {
    var savedLocation = localStorage.getItem("savePlayer");
    savedLocation = parseInt(savedLocation);
    pLocation = savedLocation;
    
    items[3].slices = localStorage.getItem("saveSlices");
    items[4].washed = localStorage.getItem("saveWashed");
    items[5].cooked = localStorage.getItem("saveCooked");
    items[7].sliced = localStorage.getItem("saveSliced");


    for (var i = 0; i < kitchen.length; i++) {
        kitchen[i].openclose = localStorage.getItem("open" + kitchen[i].name);
    }
    for (var i = 0; i < kitchen.length; i++) {
        kitchen[i].img = localStorage.getItem("img" + kitchen[i].name);
    }

    for (var i = 0; i < items.length; i++) {
        items[i].location = parseInt(localStorage.getItem(items[i].name));
    }


    message = "<span><span>Load</span> completed. </span>";
}

function reset() {
    localStorage.clear();
    init();
}

//game functions
function render(x) {
    //message from previous action
    if (message !== "") {
        text.innerHTML = message + "<br /><br />";
        text.innerHTML += kitchen[pLocation].opener;
    } else if (message === "") {
        text.innerHTML = kitchen[pLocation].opener;
    }

    //displays room conents
    text.innerHTML += kitchen[pLocation].contents;
    img.innerHTML = kitchen[pLocation].img;
    for (var i = 0; i < items.length; i++) {
        if (items[i].location === pLocation) {
            text.innerHTML += items[i].description;
        }
    }

    //optional output
    invDisplay();
    sandDisplay();

    //input area
    inArea.innerHTML = "<br /><span><span>Input:</span><input type='text' id='txtIn' name='test' value='" + x + "' autofocus></span>";
    inArea.innerHTML += "<button type='button' id='btn'>Enter</button><br /><br /></div>";

    txtIn = document.getElementById("txtIn");
    txtIn.addEventListener("keydown", keydownHandler, false);
    btn = document.getElementById("btn");
    btn.addEventListener("click", clickHandler);

}

function play(x) {
    message = "";

    txtArray = x.split(" ");
    cmd = txtArray[0];

    //meant to turn this into a method
    if (cmd === "tomatoes") {
        cmd = "tomato";
    };
    if (cmd === "plates") {
        cmd = "plate";
    };
    if (cmd === "mayo") {
        cmd = "mayonnaise";
    };
    if (cmd === "cupboards") {
        cmd = "cupboard";
    };

    if (gameOver === false) {
        switch (cmd) {
            //movement
            case "up":
                kitchen[pLocation].up();
                render(cmd);
                break;
            case "down":
                kitchen[pLocation].down();
                render(cmd);
                break;
            case "left":
                kitchen[pLocation].left();
                render(cmd);
                break;
            case "right":
                kitchen[pLocation].right();
                render(cmd);
                break;
            case "cupboard":
                pLocation = 0;
                render(cmd);
                break;
            case "counter":
                pLocation = 1;
                render(cmd);
                break;
            case "sink":
                pLocation = 2;
                render(cmd);
                break;
            case "fridge":
                pLocation = 4;
                render(cmd);
                break;
            case "prep":
                pLocation = 5;
                render(cmd);
                break;
                //interactions
            case "open":
                kitchen[pLocation].open();
                render(cmd);
                break;
            case "close":
                kitchen[pLocation].close();
                render(cmd);
                break;
            case "use":
                switch (pLocation) {
                    case 3:
                        message = "<span>Use the <span>oven</span> or the <span>pan</span> on the stovetop? </span>";
                        break;
                    default:
                        kitchen[pLocation].use();
                }
                render(cmd);
                break;
            case "make":
                switch (pLocation) {
                    case 5:
                        message = "<span>To <span>make</span> a sandwich, you will need a <span>plate</span> and the ingredients. Set down a <span>plate</span>, and then place each ingredient, in order. When you place the second slice of <span>bread</span>, you will be graded on your sandwich.</span>";
                        invDisplay();
                        break;
                    default:
                        message = "<span>This is not the proper location to <span>prep</span> a sandwich. </span>";
                }
                render(cmd);
                break;
                //kitchen
            case "pan":
                items[2].use();
                render(cmd);
                break;
            case "oven":
                switch (pLocation) {
                    case 3:
                        kitchen[3].use();
                        break;
                    default:
                        pLocation = 3;
                }
                render(cmd);
                break;
                //items
            case "plate":
                items[0].use();
                render(cmd);
                break;
            case "microwave":
                items[1].use();
                render(cmd);
                break;
            case "bread":
                items[3].use();
                render(cmd);
                break;
            case "lettuce":
                items[4].use();
                render(cmd);
                break;
            case "bacon":
                items[5].use();
                render(cmd);
                break;
            case "mayonnaise":
                items[6].use();
                render(cmd);
                break;
            case "tomato":
                items[7].use();
                render(cmd);
                break;
            case "knife":
                kitchen[5].use();
                render(cmd);
                break;
                //localStorage commands
            case "save":
                if (typeof (Storage) !== "undefined") {
                    save();
                } else {
                    message = "Unable to save right now.";
                }
                render(cmd);
                break;
            case "load":
                if (typeof (Storage) !== "undefined") {
                    load();
                } else {
                    message = "Unable to load right now.";
                }
                render(cmd);
                break;
            case "reset":
                if (typeof (Storage) !== "undefined") {
                    reset();
                    init();
                }
                break;
            default:
                switch (pLocation) {
                    case 101:
                        message = cmd + " isn't an item you can add to a sandwich.";
                        break;
                    default:
                        message = cmd + " isn't a command.";
                        render(cmd);
                }
        }
    } else if (gameOver === true) {
        end(sandwich);
    }
    console.log("completed play");
}

function end(x) {
    var score = 0;
    var failure = false;
    var mayoArray = [];
    var wet = false;
    var frygate = false;
    var sliced = false;
    var clean = false;
    var soggy = false;
    var bacon = "";
    var lettuce = "";
    var tomato = "";
    var blt = [];
    text.innerHTML = "You made a sandwich.";
    inArea.innerHTML = "";

    text.innerHTML += "<br /><span><span>Sandwich:</span><ul>";
    for (var i = 0; i < sandwich.length; i++) {
        text.innerHTML += "<li>" + sandwich[i] + "</li>";
    }
    text.innerHTML += "</ul></span>";

    for (var i = 0; i < sandwich.length; i++) {};

    blt = x.slice(0);

//    checks for all ingredients, quality of
    //ingredients, and amount of mayo
    for (var i = 0; i < x.length; i++) {
        if (blt[i] === "mayo") {
            mayoArray.push(i);
        };
        if (blt[i] === "bacon") {
            bacon = "yes";
            if (items[5].cooked === true) {
                frygate = true;
            }
        };
        if (blt[i] === "lettuce") {
            lettuce = "yes";
            if (items[4].clean === true) {
                clean = true;
            }
        };
        if (blt[i] === "tomato") {
            tomato = "yes";
            if (items[7].sliced === true) {
                sliced = true;
            }
        };
    }

    if (frygate === true) {
        if (bacon === "yes" && lettuce === "yes" && tomato == "yes") {
            score = 55;

            text.innerHTML += "<br /><br />";

            text.innerHTML += "[<span><span> Mayo</span>: " + mayoArray.length + "]</span>";

            switch (mayoArray.length) {
                case 0:
                    score += 10;
                    break;
                case 1:
                    score += 15;
                    break;
                case 2:
                    score += 15;
                    break;
                default:
                    text.innerHTML += "<span><span>WET</span></span>";
            }

            text.innerHTML += "<span>[ <span>Bacon</span>: " + bacon + " ]</span>";

            text.innerHTML += "<span>[ <span>Lettuce</span>: " + lettuce;

            if (items[4].washed === true) {
                text.innerHTML += " <i>washed</i> ";
                score += 15;
            }
            if (items[4].washed === false) {
                text.innerHTML += " <i>unwashed</i> ";
            }

            text.innerHTML += " ]</span>";

            text.innerHTML += "<span>[ <span>Tomato</span>: " + tomato;

            if (items[7].sliced === true) {
                text.innerHTML += " <i>sliced</i> ";
                score += 15;
            }
            if (items[7].sliced === false) {
                text.innerHTML += " <i>whole*</i> ";
                inArea.innerHTML = "<span>*weird choice</span>";
                score -= 10;
            }

            text.innerHTML += " ]</span>";

            //add this
            //tomato in middle
        }

    } else {
        text.innerHTML += "<br /><span>You made a sandwhich with <span>raw bacon. Complete failure.</span></span>";
    }

    text.innerHTML += "<br /><br /><span><span>FINAL SCORE: </span>" + score + "<span>";
}

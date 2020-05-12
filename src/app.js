/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, Cam } from 'scenes';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import Score from "/../src/Score.js"

const OIMO = require('oimo');
const THREE = require('three')

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new Cam();
//camera.position.set(0,350,500); // Set position like this
//camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

const renderer = new WebGLRenderer({ antialias: true });
var meshs = [];
var grounds = [];

// three var
var meshs = [];
var grounds = [];

var isMobile = false;
var antialias = true;

var fps = [0,0,0,0];
var ToRad = 0.0174532925199432957;
var type = 1;
var infos;

// temp color fixes
var blue = new THREE.MeshLambertMaterial({color: 0x0000FF});
blue.color = new THREE.Color(0x0000FF);
var green = new THREE.MeshLambertMaterial({color: 0x7bc059});
green.color = new THREE.Color(0x7bc059);


const canvas = renderer.domElement;

const controls = new OrbitControls( camera, canvas );

var gameStarted = false;




// add JQUERY!
injectScriptAndUse();
function injectScriptAndUse() {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
  script.onload = function() {
    // hide the parameter bar initially
    $(".dg.main.a").attr("id", "parameters");
    $(".dg.main.a").hide();

  };
  head.appendChild(script);
}

// add CSS
injectCSS();
function injectCSS() {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.href = "/src/style.css";
  link.type="text/css";
  link.rel="stylesheet";
  head.appendChild(link);
}


function startGame() {
    let count = 0;
    // fade out the title and instructions
    $(".titleScreen").fadeOut('slow', function() {
        // Set up controls
        controls.update();
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 4;
        controls.maxDistance = 2000;
        controls.update();

        // show score
        if (count == 0) {
            currScore.showScore();
            $(".dg.main.a").show();
        }
        count = 1;

        gameStarted = true; 
    });

    
}



// move to diff file to modularize
class Score {
    constructor(initialscore) {
            this.element = document.createElement("DIV");
            this.element.style.width = "16px"; 
            this.element.style.height = "20px"; 
            this.element.style.position = "absolute"; 
            this.element.style.top = "50%"; 
            this.element.style.left = "50%"; 
            this.element.style.transform = "translate(-2500%, -50%)"; 
            this.element.style['align-items'] = "flex-end"; 
            // this.element.style['background-color'] = "#5dbcd2"; 
            this.element.style.border = "1px solid #ffffff"; 

            this.element.style['text-align'] = "center";
            this.element.style.display = "none"; 
            this.id = "scoreContainer";

            let score = document.createElement("DIV");
            score.id = "score";
            score.style['z-index'] = "3";
            score.style['background-color']="#5dbcd2"
            score.style.height = "20px";
            score.style.width = "16px";
            score.style.width = "16px";
            score.style['color'] = "#000000";
            score.innerText="10";
            // score.style.width = "20";
            // score.style.height = "20";

            this.element.appendChild(score);



            document.body.appendChild(this.element);


    }
    showScore() {
        this.element.style.display = "block";
        this.element.style['z-index'] = "2"

        // for some reason need to access element's children have changes be reflected
        let children = this.element.children;
        for (let child of children) {
            if (child.id == "score") {
                child.innerText = "0";
            }
        }

        let beaker = document.createElement("DIV");
        beaker.style.width = "16px"; 
        // beaker.style.height = "150px"; 
        beaker.style.position = "absolute"; 
        beaker.style.top = "50%"; 
        beaker.style.left = "50%"; 
        beaker.transform = "translate(-5000%, -50%)"; 
        // beaker.style['align-items'] = "flex-end"; 
        // beaker.style['background-color'] = "#5dbcd2"; 
        // beaker.style.border = "1px solid #ffffff"; 

        beaker.style['text-align'] = "center";
        beaker.style.display = "none"; 
        beaker.style['z-index'] = "2";
        beaker.classList.add("beaker");
        let glass = document.createElement("DIV");
        glass.classList.add("glass");
        beaker.appendChild(glass);
        let water = document.createElement("DIV");
        water.classList.add("water");
        glass.appendChild(water);

        this.element.appendChild(beaker);

       
    }
    updateScore(newScore) {
        let children = this.element.children;
        for (let child of children) {
            if (child.id == "score") {
                child.innerText = newScore;
            }
        }
        // this.element.innerText = newScore;
        // let score = document.getElementById("score");
        // score.innerText="0";
    }
}    


var currScore = new Score(0);
var winning_points = 0;
var losing_points = 0;

//-----------------------------------------------------------------------
// DEFINITION OF OMIOS PRIMITIVES
//-----------------------------------------------------------------------
var geos = {};
var mats = {};
var types, sizes, positions, bucketGeometry;
var geoBox = new THREE.BoxGeometry(1,1,1);
var geoCyl = new THREE.CylinderGeometry( 0.5, 0.5, 1, 6, 1 );
var materialType = 'MeshBasicMaterial';


// geometrys
geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1));
bucketGeometry = new THREE.BufferGeometry();

// materials
mats['sph']    = new THREE[materialType]( {shininess: 10, map: basicTexture(0), name:'sph' } );
mats['box']    = new THREE[materialType]( {shininess: 10, map: basicTexture(2), name:'box' } );
mats['cyl']    = new THREE[materialType]( {shininess: 10, map: basicTexture(4), name:'cyl' } );
mats['ssph']   = new THREE[materialType]( {shininess: 10, map: basicTexture(1), name:'ssph' } );
mats['sbox']   = new THREE[materialType]( {shininess: 10, map: basicTexture(3), name:'sbox' } );
mats['scyl']   = new THREE[materialType]( {shininess: 10, map: basicTexture(5), name:'scyl' } );
mats['ground'] = new THREE[materialType]( {shininess: 10, color:0x3D4143, transparent:true, opacity:0.5 } );
mats['beaker'] = new THREE[materialType]( {shininess: 100, color: 0xC2C2C2, transparent:true, opacity:0.95} );


//oimo vars
var world = null;
var bodys = [];

var loader = new OBJLoader();

// load a resource
loader.load(
    // resource URL
    'models/virus/virus.obj',
    // called when resource is loaded
    function ( object ) {
        let geo = object.children[0].geometry;
        geo.translate(0, -10.5, 0);
        geos['virus'] = geo;
        populate(1);

    },
    // called when loading is in progresses
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);


initOimoPhysics();



// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    window.requestAnimationFrame(onAnimationFrameHandler);
    if (gameStarted) {
        canvas.style.display = "block";
        controls.update();
        camera.update(meshs[0].position);
        updateOimoPhysics();
        handleCollisions();
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        currScore.updateScore(winning_points-losing_points);
    }   
    else {
        canvas.style.display = "none";


    }
};

window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

// ADD THIS TO PLAYER CLASS WHEN IMPLEMENTED
var movingUp = false;
var movingLeft = false;
var movingDown = false;
var movingRight = false;
const keyDownHandler = (e) => {
    if (e.code == "KeyW") {
        movingUp = true;
    } else if (e.code == "KeyS") {
        movingDown = true;
    } else if (e.code == "KeyA") {
        movingLeft = true;
    } else if (e.code == "KeyD") {
        movingRight = true;
    } else if (e.keyCode == "32" && gameStarted==false) {
        startGame();
    }
}
const keyUpHandler = (e) => {
    if (e.code == "KeyW") {
        movingUp = false;
    } else if (e.code == "KeyS") {
        movingDown = false;
    } else if (e.code == "KeyA") {
        movingLeft = false;
    } else if (e.code == "KeyD") {
        movingRight = false;
    }
}
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keydown', keyDownHandler, false);
window.addEventListener('keyup', keyUpHandler, false);

 //----------------------------------
 //  OIMO PHYSICS
 //----------------------------------

function initOimoPhysics(){

    // world setting:( TimeStep, BroadPhaseType, Iterations )
    // BroadPhaseType can be 
    // 1 : BruteForce
    // 2 : Sweep and prune , the default 
    // 3 : dynamic bounding volume tree

    world = new OIMO.World({    timestep: 1/120, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0,-9.8,0] });
    initbucketGeometry();
    let x, y, z, w, h, d;

    //---------------------------------------------
    // PLAYER DECLARATION (TODO: MODULARIZE THIS)

    x = 100
    y = 100
    z = 100
    w = 20
    h = 20

    /*let player_body = world.add({type:'cylinder', size:[w*0.5,h], pos:[0,100,0], move:true, world:world});
    let player_mesh = new THREE.Mesh(geos.cylinder, mats.sph);
    player_mesh.position.set(0, 100, 0);
    player_mesh.scale.set( w * 0.5, h, w * 0.5 ); */

    let player_body = world.add({
    type:types,
    size:sizes,
    pos:[x,y,z],
    posShape:positions,
    move:true, 
    world:world, 
    name:'box1', 
    config:[0.2, 0.4,0.1],
    restitution:.01,
    });

    //bodys[i] = b.body;
    let player_mesh = new THREE.Mesh( bucketGeometry, mats['cyl' ] );

    //meshs[i].castShadow = true;
    //meshs[i].receiveShadow = true;


    //player_mesh.castShadow = true;
    //player_mesh.receiveShadow = true;
    meshs[0] = player_mesh;
    bodys[0] = player_body;
    // 
    scene.add( player_mesh );
    //setInterval(updateOimoPhysics, 1000/60);


    // SCENE PHYSICS DECLARATIONS 
    var ground0 = world.add({size:[40, 40, 390], pos:[-180,20,0], world:world});
    var ground1 = world.add({size:[40, 40, 390], pos:[180,20,0], world:world});
    var ground2 = world.add({size:[400, 80, 400], pos:[0,-40,0], world:world});

    addStaticBox([40, 40, 390], [-180,20,0], [0,0,0]);
    addStaticBox([40, 40, 390], [180,20,0], [0,0,0]);
    addStaticBox([400, 80, 400], [0,-40,0], [0,0,0]);
    //populate(1)

}


function populate(n) {
    var type;
    var max = 100;
    if(n===1) type = 1
    else if(n===2) type = 2;
    else if(n===3) type = 3;
    else if(n===4) type = 4;

    // reset old
    //clearMesh();
    //world.clear();
    //bodys=[];

    //add ground

    var x, y, z, w, h, d;

    let i = 0

    while (i++ < max){
        var t;
        if(type===4) t = Math.floor(Math.random()*3)+1;
        else t = type;
        x = -100 + Math.random()*200;
        z = -100 + Math.random()*200;
        y = 100 + Math.random()*1000;

        w = 10 + Math.random()*10;
        h = 10 + Math.random()*10;
        d = 10 + Math.random()*10;

      
        if(t===1){
            var random = Math.random();
            let model_scale = 1;
            if (random < 0.5) {
                var mat = blue;
                var geo = geos.sphere
            }
            else {
                var mat = green;
                var geo = geos.virus
                model_scale = .09
            }

            bodys[i] = world.add({type:'sphere', size:[w*0.5], pos:[x,y,z], move:true, world:world, restitution:.01});
            meshs[i] = new THREE.Mesh( geo, mat);
            meshs[i].scale.set( w*0.5*model_scale, w*0.5*model_scale, w*0.5*model_scale );
            // let debug = new THREE.Mesh( geos.sphere, mats.box );
            // debug.scale.set( w * 0.5, w * 0.5, w * 0.5 );
            // debug.position.copy(bodys[i].position)
            // scene.add(debug);
        } else if(t===2){
            bodys[i] = world.add({type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world});
            meshs[i] = new THREE.Mesh( geos.box, mats.box );
            meshs[i].scale.set( w, h, d );
        } else if(t===3){
            bodys[i] = world.add({type:'cylinder', size:[w*0.5,h], pos:[x,y,z], move:true, world:world});
            meshs[i] = new THREE.Mesh( geos.cylinder, mats.cyl );
            meshs[i].scale.set( w*0.5, h, w*0.5 );
        }

        meshs[i].castShadow = true;
        meshs[i].receiveShadow = true;

        scene.add( meshs[i] );
    }


    //add object
 
}

function addStaticBox(size, position, rotation) {
    var mesh = new THREE.Mesh( geos.box, mats.ground );
    mesh.scale.set( size[0], size[1], size[2] );
    mesh.position.set( position[0], position[1], position[2] );
    mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
    scene.add( mesh );
    grounds.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
}

function initbucketGeometry() {
    let w = 50
    let h = 40
    types = [ 'box', 'box', 'box', 'box', 'box'];
    sizes = [ w,5,w,  4,h,w,  w,h,4,  4,h,w,  w,h,4];
    positions = [ 0,0,0,  w/2,10,0,  0,10,w/2,   -1*(w/2),10,0,    0,10,-1*(w/2)];

    var g = new THREE.Geometry();
    var mesh, n, m;
    for(var i=0; i<types.length; i++){
        n = i*3;
        m = new THREE.Matrix4().makeTranslation( positions[n+0], positions[n+1], positions[n+2] );
        m.scale(new THREE.Vector3(sizes[n+0], sizes[n+1], sizes[n+2]));
        g.merge(geoBox,m);
        g.computeBoundingBox();
    }
    bucketGeometry = new THREE.BufferGeometry();
    bucketGeometry.fromGeometry( g );
}

function clearMesh(){
    var i=meshs.length;
    while (i--) scene.remove(meshs[ i ]);
    i = grounds.length;
    while (i--) scene.remove(grounds[ i ]);
    grounds = [];
    meshs = [];
}

function updateOimoPhysics() {
    if(world==null) return;

    world.step();

    var x, y, z, mesh, body, i = bodys.length;

    updatePlayerPos();

    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        if(!body.sleeping){

            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());

            // change material
            //if(mesh.material.name === 'sbox') mesh.material = mats.box;
            //if(mesh.material.name === 'ssph') mesh.material = mats.sph;
            //if(mesh.material.name === 'scyl') mesh.material = mats.cyl; 

            // reset position
            if(mesh.position.y<-100){
                x = -100 + Math.random()*200;
                z = -100 + Math.random()*200;
                y = 100 + Math.random()*1000;
                body.resetPosition(x,y,z);
            }
        } else {
            ///if(mesh.material.name === 'box') mesh.material = mats.sbox;
            //if(mesh.material.name === 'sph') mesh.material = mats.ssph;
            //if(mesh.material.name === 'cyl') mesh.material = mats.scyl;
        }
    }

}

function gravity(g){
    nG = document.getElementById("gravity").value
    world.gravity = new OIMO.Vec3(0, nG, 0);
}

function updatePlayerPos() {
    let player_mesh = meshs[0];
    let player_body = bodys[0];
    let speed_scale = 1;
    if (movingUp) {
        player_body.linearVelocity.add(new OIMO.Vec3(0, 0, -1 * speed_scale))
    }
    if (movingLeft) {
        player_body.linearVelocity.add(new OIMO.Vec3(-1 * speed_scale, 0, 0));
    }
    if (movingRight) {
        player_body.linearVelocity.add(new OIMO.Vec3(speed_scale, 0, 0));
    }
    if (movingDown) {
        player_body.linearVelocity.add(new OIMO.Vec3(0, 0, speed_scale));
    }
    if (!(movingUp || movingDown || movingLeft || movingRight)) {
        player_body.linearVelocity.scaleEqual(0.95)
    }
    if (player_body.position.y != 10.2) {
        player_body.position.y = 10.2;
    }
    player_body.angularVelocity = new OIMO.Vec3(0, 0, 0)
    player_body.quaternion.x = 0;
    player_body.quaternion.y = 0;
    player_body.quaternion.z = 0;
    player_mesh.position.copy(player_body.getPosition());
    player_mesh.quaternion.copy(player_body.getQuaternion());

}




//----------------------------------
//  COLLISIONS
//----------------------------------
// check();

// function check() {
//     let playerBody = bodys[0];
//     let playerMesh = meshs[0];
//     console.log(playerBody.)
// }

function handleCollisions() {
    // Shape type
    var SHAPE_NULL = 0;
    var SHAPE_SPHERE = 1;
    var SHAPE_BOX = 2;
    var SHAPE_CYLINDER = 3;
    var SHAPE_PLANE = 4;
    var SHAPE_PARTICLE = 5;
    var SHAPE_TETRA = 6;


    let objNum = bodys.length;

    let playerBody = bodys[0];
    let playerMesh = meshs[0];
    // start from 1 bc 0 is the player object
    for (let i = 1; i < objNum; i++) {
        let body = bodys[i];
        let mesh = meshs[i];
        if (body.type == SHAPE_SPHERE) {
            let caught = sphereCaught(playerBody, playerMesh, body, mesh);
            if (caught) {
                // console.log(bodys.length);
                if(meshs[i].material === green) losing_points++;
                else winning_points++;
                bodys.splice(i, 1);
                scene.remove(meshs[i]);
                mesh.geometry.dispose();
                mesh.material.dispose();
                mesh = undefined;
                body = undefined;
                meshs.splice(i, 1);
                i--;
                objNum--;

                // console.log(bodys.length);
                // console.log(winning_points - losing_points);
            }
        }
        else if (body.type == SHAPE_BOX) {
            boxCollisions(playerBody, playerMesh, body, mesh);
        }
        else if (body.type == SHAPE_CYLINDER) {
            cylinderCollisions(playerBody, playerMesh, body, mesh);
        }

    }
}

function sphereCaught(playerBody, playerMesh, body, mesh) {
    let r = body.shapes.radius;

    let playerCenter = playerBody.position;

    let vec = new THREE.Vector3().subVectors(playerCenter, body.pos);

    let centerToSphereSurface = vec.clone().normalize().multiplyScalar(r);
    let closestSpherePoint = body.position.clone().add(centerToSphereSurface);
    // let closestSpherePoint = body.position;
    let minX = playerBody.position.x - playerBody.shapes.halfWidth;
    let maxX = playerBody.position.x + playerBody.shapes.halfWidth;
    let minY = playerBody.position.y - playerBody.shapes.halfWidth;
    let maxY = playerBody.position.y + playerBody.shapes.halfWidth;
    let minZ = playerBody.position.z - playerBody.shapes.halfHeight;
    let maxZ = playerBody.position.z + playerBody.shapes.halfHeight;

    // console.log(minX, maxX, " and ", minY, maxY, " and ", minZ, maxZ);
    // console.log(body.position.x, body.position.y, body.position.z)

    let inside = false;
    // let's say sphere is "caught" if 1/3 of the sphere is inside the player
    if (closestSpherePoint.x > minX && closestSpherePoint.x < maxX
        && closestSpherePoint.y > minY && closestSpherePoint.y < maxY
        && closestSpherePoint.z > minZ && closestSpherePoint.z < maxZ
        && maxZ - closestSpherePoint.z > r/3
        ) {
        inside = true;
    }
    return inside;

}

function boxCollisions() {
    
}

function cylinderCollisions() {
    
}


//----------------------------------
//  TEXTURES
//----------------------------------

function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    var size = 1024;
    c.width = 16; c.height = size;
    var gradient = ct.createLinearGradient(0,0,0,size);
    var i = color[0].length;
    while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
    ct.fillStyle = gradient;
    ct.fillRect(0,0,16,size);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}

function basicTexture(n){
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var color;
    if(n===0) color = "#3884AA";// sphere58AA80
    if(n===1) color = "#61686B";// sphere sleep
    if(n===2) color = "#AA6538";// box
    if(n===3) color = "#61686B";// box sleep
    if(n===4) color = "#AAAA38";// cyl
    if(n===5) color = "#61686B";// cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}



//----------------------------------
//  POINTS
//----------------------------------

function updateScore() {
    // A line somewhere  else in the code base that has access to highScore
    score.updateScore(winning_points-losing_points);
}



//----------------------------------
//  SCREENS
//----------------------------------
// Create opening screen
createOpeningScreen();

function createOpeningScreen() {
    // overarching container containing both start screen and canvas for the game
    let allContainer = document.createElement("DIV");
    allContainer.style.position = "relative";

     // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    canvas.style.display = 'block'; // Removes padding below canvas
    canvas.style.position = "relative"; // I ADDED THIS!
    canvas.id = "mainCanvas";
    canvas.style['z-index'] = "1";
    allContainer.style.margin = 0; // Removes margin around page
    allContainer.style.overflow = 'hidden'; // Fix scrolling
    allContainer.id = "allContainer";
    // document.body.appendChild(canvas);
    allContainer.appendChild(canvas);


    // create start screen
    let startScreenDiv = document.createElement("DIV");
    startScreenDiv.style.position = "relative";
    startScreenDiv.className = "titleScreen";

        let title = document.createElement("DIV");
        title.innerText = "Catcher";
        title.style['font-size'] = "96px"; 
        title.style.width = "100%"; 
        title.style['text-align'] = "center";
        title.style['color'] = "#000000";
        title.id = "title";
        title.className = "titleScreen";
        // element.style.transform = "translate(0%, -50%)"; 
        startScreenDiv.appendChild(title);

        // instruction container and instructions
        let instructionContainer = document.createElement("DIV");
        instructionContainer.style['border-radius'] = "20px";
        instructionContainer.style['display'] = "inline-block";
        instructionContainer.style['flex-wrap'] = "wrap";
        instructionContainer.style['background-color'] = "ffffff";
        instructionContainer.style['text-align'] = "center";
        instructionContainer.style['padding'] = "30px";
        instructionContainer.style['background-color'] = "#9EC1A3";
        instructionContainer.className = "titleScreen";
        startScreenDiv.appendChild(instructionContainer);

            let instructions = document.createElement("DIV");
            instructions.innerHTML = "Catch the PPE equipment and vaccine materials while avoiding the virus particles!</br>Press the space bar to start the game!";
            instructions.style['font-size'] = "20px"; 
            instructions.style.width = "100%"; 
            instructions.style['text-align'] = "center";
            instructions.style['color'] = "#8075FF";
            instructions.id = "instructions";
            instructions.className = "titleScreen";
            // element.style.transform = "translate(0%, -50%)"; 
            instructionContainer.appendChild(instructions);

    allContainer.appendChild(startScreenDiv);
         

    // place parameter bar in proper position
    let params = document.getElementsByClassName("dg ac");
    let param = params[0];
    param.parentNode.removeChild(param);
    allContainer.appendChild(param);
    param.style['z-index'] = "2";


   


    document.body.appendChild(allContainer);
    allContainer.position = "absolute";
    canvas.position = "absolute";


    // Create background image and body CSS
    document.body.style['font-family'] = "Lucida Console";
    document.body.style['height'] = "100%";
    document.body.style['background-image'] = "url('../images/tubes3.jpg')";
    document.body.style['background-size'] = "cover";
    document.body.style['text-align'] = "center";
    document.body.style.margin = "0px";

    let s = new Score(0);
    currScore = s;

        


}






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
import { SeedScene } from 'scenes';

const OIMO = require('oimo');
const THREE = require('three')

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
camera.position.set(0,350,500); // Set position like this
camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

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




// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls( camera, canvas );
controls.update();
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 2000;
controls.update();

//-----------------------------------------------------------------------
// DEFINITION OF OMIOS PRIMITIVES
//-----------------------------------------------------------------------
var geos = {};
var mats = {};

var materialType = 'MeshBasicMaterial';


// geometrys
geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1));

// materials
mats['sph']    = new THREE[materialType]( {shininess: 10, map: basicTexture(0), name:'sph' } );
mats['box']    = new THREE[materialType]( {shininess: 10, map: basicTexture(2), name:'box' } );
mats['cyl']    = new THREE[materialType]( {shininess: 10, map: basicTexture(4), name:'cyl' } );
mats['ssph']   = new THREE[materialType]( {shininess: 10, map: basicTexture(1), name:'ssph' } );
mats['sbox']   = new THREE[materialType]( {shininess: 10, map: basicTexture(3), name:'sbox' } );
mats['scyl']   = new THREE[materialType]( {shininess: 10, map: basicTexture(5), name:'scyl' } );
mats['ground'] = new THREE[materialType]( {shininess: 10, color:0x3D4143, transparent:true, opacity:0.5 } );


//oimo vars
var world = null;
var bodys = [];


initOimoPhysics();



// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    updateOimoPhysics();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
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
    
    let x, y, z, w, h, d;

    //---------------------------------------------
    // PLAYER DECLARATION (TODO: MODULARIZE THIS)

    x = 100
    y = 100
   	z = 100
    w = 20
    h = 10

    let player_body = world.add({type:'cylinder', size:[w*0.5,h], pos:[0,10,0], move:true, world:world});
	let player_mesh = new THREE.Mesh( geos.cylinder, mats.cyl );
	player_mesh.scale.set( w*0.5, h, w*0.5 );



	player_mesh.castShadow = true;
	player_mesh.receiveShadow = true;
	meshs[0] = player_mesh;
	bodys[0] = player_body;

	scene.add( player_mesh );
    //setInterval(updateOimoPhysics, 1000/60);


    // SCENE PHYSICS DECLARATIONS 
    var ground0 = world.add({size:[40, 40, 390], pos:[-180,20,0], world:world});
    var ground1 = world.add({size:[40, 40, 390], pos:[180,20,0], world:world});
    var ground2 = world.add({size:[400, 80, 400], pos:[0,-40,0], world:world});

    addStaticBox([40, 40, 390], [-180,20,0], [0,0,0]);
    addStaticBox([40, 40, 390], [180,20,0], [0,0,0]);
    addStaticBox([400, 80, 400], [0,-40,0], [0,0,0]);
    populate(1)
}


function populate(n) {
    var type;
    var max = 100
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
            bodys[i] = world.add({type:'sphere', size:[w*0.5], pos:[x,y,z], move:true, world:world});
            meshs[i] = new THREE.Mesh( geos.sphere, mats.sph );
            meshs[i].scale.set( w*0.5, w*0.5, w*0.5 );
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
	if (player_body.position.y != 5.0) {
		player_body.position.y = 5;
	}
	player_body.angularVelocity = new OIMO.Vec3(0, 0, 0)
	player_mesh.position.copy(player_body.getPosition());
    player_mesh.quaternion.copy(player_body.getQuaternion());

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
import * as Dat from 'dat.gui';
import { Scene, Color, CubeTextureLoader, LatheBufferGeometry } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import RIGHT from '../../../src/textures/right.png';
import LEFT from '../../../src/textures/left.png';
import TOP from '../../../src/textures/top.png';
import BOT from '../../../src/textures/bottom.png';
import FRONT from '../../../src/textures/front.png';
import BACK from '../../../src/textures/back.png';


class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            //gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

       
        var loader = new CubeTextureLoader();

        const texture = loader.load([
            RIGHT,
            LEFT,
            TOP,
            BOT,
            FRONT,
            BACK,
        ]);

        // Set background to a nice color
        this.background = texture;

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        this.add(lights);

        // Populate GUI
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
    }
}

export default SeedScene;

import * as Dat from 'dat.gui';
import { Scene, Color, CubeTextureLoader, LatheBufferGeometry } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';


class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

       
        var loader = new CubeTextureLoader();

        const texture = loader.load([
            './src/textures/right.png',
            './src/textures/left.png',
            './src/textures/top.png',
            './src/textures/bottom.png',
            './src/textures/front.png',
            './src/textures/back.png',
        ]);

        // Set background to a nice color
        this.background = texture;

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        //lights.castShadow = true;
        this.add(lights);
        debugger;
        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;

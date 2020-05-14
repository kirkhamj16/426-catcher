import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Cam extends PerspectiveCamera {

    constructor() {
        // Call parent Scene() constructor
        super( 60, window.innerWidth / window.innerHeight, 1, 5000 );
		this.position.set(0,250,200); // Set position like this
		this.lookAt(new Vector3(0,0,0)); // Set look at coordinate like this
	}
	update(playerPos) {
        this.position.x = playerPos.x;
        this.position.z = playerPos.z + 200
        this.lookAt(playerPos)
    }
}


export default Cam;

import { Group, SpotLight, AmbientLight, HemisphereLight, CameraHelper, DirectionalLight, DirectionalLightShadow, DirectionalLightHelper } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const direct = new DirectionalLight(0xffffff, 1.5);
        direct.position.set(200, 100, 200);
        direct.castShadow = true;
     
        const test = new DirectionalLightHelper(direct);
        // const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);
       
        this.add(direct, test, dir);
        direct.shadow.camera.left = -200;
        direct.shadow.camera.bottom = -100;
        direct.shadow.camera.right = 200;
        direct.shadow.camera.top = 100;
        direct.shadow.near = 50;
        const cameraHelper1 = new CameraHelper(direct.shadow.camera);
        this.add(cameraHelper1);
       // cameraHelper1.update();

        
    }
}

export default BasicLights;

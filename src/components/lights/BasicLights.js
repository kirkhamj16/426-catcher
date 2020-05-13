import { Group, SpotLight, AmbientLight, HemisphereLight, CameraHelper, DirectionalLight, DirectionalLightShadow, DirectionalLightHelper } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0x0000ff, 0.9, 500, 1, 0, 0);
        const direct = new DirectionalLight(0xffffff, 0.6);
        direct.position.set(0, 400, 0);
        direct.castShadow = true;
     
        const test = new DirectionalLightHelper(direct);
        //const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(0, 400, 0);
        dir.target.position.set(0, 0, 0);
        dir.castShadow = true;
       
        this.add(direct, test, dir);
        //direct.shadow.camera
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

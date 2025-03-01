import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Mesh, PlaneGeometry, Group} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default class ThreeScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private orbitControls: OrbitControls;
  private boardGroup: Group;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.dampingFactor = 0.005;
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableZoom = false;

    this.init();
    this.animate = this.animate.bind(this);
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private init(): void {
    this.camera.position.z = 7;

    this.assembleBoard();
  }

  private animate(): void {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  private update(): void {
    this.orbitControls.update();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private drawTile(x: number, y: number, totalX: number, totalY: number): void {
    const geo = new PlaneGeometry();
    const mat = new MeshBasicMaterial({color: (x + y) % 2 === 0 ? '#ffffff' : '#000000'});
    const mesh = new Mesh(geo, mat);

    const pos = 1;
    const posX = pos * x;
    const posY = pos * y;

    const meshScaleX = mesh.scale.x;
    const meshScaleY = mesh.scale.y;

    mesh.position.set(posX + meshScaleX / 2 - meshScaleX * totalX / 2, posY + meshScaleY / 2 - meshScaleY * totalY / 2, 0);
    this.boardGroup.add(mesh);
  }

  private assembleBoard(): void {
    const width = 8;
    const height = 8;

    this.boardGroup = new Group();
    this.scene.add(this.boardGroup);

    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {
            this.drawTile(i, j, width, height);
        }
    }
  }
}
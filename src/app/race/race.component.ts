import { Component, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-race',
  standalone: true,
  imports: [],
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private car!: THREE.Mesh;
  private trackMeshes: THREE.Mesh[] = [];
  private keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  private speed = 0;
  private maxSpeed = 0.2;
  private acceleration = 0.01;
  private deceleration = 0.02;
  private turnSpeed = 0.03;

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.createTrack();
    this.createCar();
    this.animate();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (this.keys.hasOwnProperty(event.key)) {
      // @ts-ignore
      this.keys[event.key] = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent): void {
    if (this.keys.hasOwnProperty(event.key)) {
      // @ts-ignore
      this.keys[event.key] = false;
    }
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('raceCanvas') as HTMLCanvasElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  private trackSegments = [
    { width: 10, length: 100, position: { x: 0, y: 0, z: -25 }, rotation: 0 },
    { width: 10, length: 100, position: { x: 0, y: 0, z: -125 }, rotation: 0 },
    { width: 10, length: 100, position: { x: 10, y: 0, z: -225 }, rotation: 0 },
    { width: 20, length: 100, position: { x: 20, y: 0, z: -325 }, rotation: 0 },
    
  ];

  private createTrack(): void {
    const textureLoader = new THREE.TextureLoader();
    const trackTexture = textureLoader.load('./track-texture.bmp');
    trackTexture.wrapS = THREE.RepeatWrapping;
    trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 10);

    for (let i = 0; i < this.trackSegments.length - 1; i++) {
      const segment1 = this.trackSegments[i];
      const segment2 = this.trackSegments[i + 1];

      // Create the current track segment
      const trackGeometry = new THREE.PlaneGeometry(segment1.width, segment1.length);
      const trackMaterial = new THREE.MeshBasicMaterial({ map: trackTexture });
      const track = new THREE.Mesh(trackGeometry, trackMaterial);
      track.rotation.x = -Math.PI / 2;
      track.position.set(segment1.position.x, segment1.position.y, segment1.position.z);
      this.scene.add(track);
      this.trackMeshes.push(track);

      // get end corners of the current track segment
      const end1 = new THREE.Vector3(-segment1.width / 2, 0, segment1.length / 2);
      const end2 = new THREE.Vector3(segment1.width / 2, 0, segment1.length / 2);

      // get start corners of the next track segment i.e. the closest corners to the current segment
      const start1 = new THREE.Vector3(-segment2.width / 2, 0, -segment2.length / 2);
      const start2 = new THREE.Vector3(segment2.width / 2, 0, -segment2.length / 2);

      // calculate the angle between the two segments
      const angle = end1.angleTo(start1);
      // calculate the distance between the two segments
      const distance = end1.distanceTo(start1);
      const fillMesh = new THREE.Mesh(new THREE.PlaneGeometry(segment1.width, distance), trackMaterial);
      fillMesh.rotation.x = -Math.PI / 2;
      fillMesh.position.set(segment1.position.x, segment1.position.y, segment1.position.z - segment1.length / 2 - distance / 2);
      this.scene.add(fillMesh);
      this.trackMeshes.push(fillMesh);


    }

    // Add the last track segment
    const lastSegment = this.trackSegments[this.trackSegments.length - 1];
    const lastTrackGeometry = new THREE.PlaneGeometry(lastSegment.width, lastSegment.length);
    const lastTrackMaterial = new THREE.MeshBasicMaterial({ map: trackTexture });
    const lastTrack = new THREE.Mesh(lastTrackGeometry, lastTrackMaterial);
    lastTrack.rotation.x = -Math.PI / 2;
    lastTrack.position.set(lastSegment.position.x, lastSegment.position.y, lastSegment.position.z);
    this.scene.add(lastTrack);
    this.trackMeshes.push(lastTrack);
  }

  private createCar(): void {
    const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.car = new THREE.Mesh(carGeometry, carMaterial);
    this.car.position.set(0, 0.25, 0);
    this.scene.add(this.car);
  }

  private updateCar(): void {
    if (this.keys.ArrowUp) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else {
      this.speed = Math.max(this.speed - this.deceleration, 0);
    }

    if (this.keys.ArrowLeft) {
      this.car.rotation.y += this.turnSpeed;
    }
    if (this.keys.ArrowRight) {
      this.car.rotation.y -= this.turnSpeed;
    }

    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(this.car.quaternion);
    direction.multiplyScalar(this.speed);

    this.car.position.add(direction);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.updateCar();
    this.renderer.render(this.scene, this.camera);
  }
}
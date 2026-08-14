import * as THREE from 'three';
import { RoboticArm } from './RoboticArm.js';

/**
 * Rover · a stylised, fully procedural Mars rover ("DAWN").
 *
 * Built from Three.js primitives — no external model files. The geometry
 * is grouped so RoverPhysics can pose the wheels, RoboticArm can drive
 * joint angles, and camera rigs can attach to named children.
 *
 * Named nodes (searchable via group.getObjectByName):
 *   root, chassis, mast, camera-eye,
 *   bogie-left, bogie-right,
 *   wheel-fl, wheel-ml, wheel-rl,
 *   wheel-fr, wheel-mr, wheel-rr,
 *   arm-root (+ joints defined in RoboticArm.js).
 */
export class Rover {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'rover-root';

    this._buildChassis();
    this._buildWheels();
    this._buildMast();
    this._buildSolarPanels();
    this._buildAntenna();
    this._buildLights();

    this.arm = new RoboticArm();
    this.arm.root.position.set(0.6, 0.55, -0.9);
    this.arm.root.name = 'arm-root';
    this.chassis.add(this.arm.root);

    // Rover-relative bounding info reused by camera rig + physics.
    this.wheelBaseX = 1.8;   // longitudinal
    this.wheelBaseZ = 1.3;   // lateral
    this.wheelRadius = 0.32;

    // Book-keeping state.
    this.velocity = new THREE.Vector3();
    this.heading = 0;   // rotation.y in radians
    this.speed = 0;     // signed forward speed, m/s
    this.steer = 0;     // current steering angle
  }

  _buildChassis() {
    const chassis = new THREE.Group();
    chassis.name = 'chassis';

    // Main body — a rectangular tray, matte white with orange trim panels.
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe6e2da, roughness: 0.55, metalness: 0.25 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xc66b1e, roughness: 0.5,  metalness: 0.3 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.4, metalness: 0.7 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.55, 1.5), bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    body.receiveShadow = true;
    chassis.add(body);

    // Top deck — where the mast + solar panels sit.
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.3), accentMat);
    deck.position.y = 0.9;
    deck.castShadow = true;
    chassis.add(deck);

    // Signature orange side panels.
    for (const sx of [-0.77, 0.77]) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.11, 0.03), trimMat);
      stripe.position.set(0, 0.55, sx);
      chassis.add(stripe);
    }

    // Front bumper with camera port.
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 1.55), accentMat);
    bumper.position.set(1.2, 0.55, 0);
    bumper.castShadow = true;
    chassis.add(bumper);

    // Payload box on the rear deck.
    const payload = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.55), bodyMat);
    payload.position.set(-0.75, 1.13, 0);
    payload.castShadow = true;
    chassis.add(payload);

    // Small vent grille (aesthetic detail).
    for (let i = 0; i < 5; i++) {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.05), accentMat);
      g.position.set(-1, 0.9, -0.55 + i * 0.2);
      chassis.add(g);
    }

    this.chassis = chassis;
    // The chassis is nested under root so we can rotate for yaw and
    // still let physics move root.position independently.
    this.root.add(chassis);
  }

  _buildWheels() {
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x2b2f34, roughness: 0.75, metalness: 0.15 });
    const rimMat   = new THREE.MeshStandardMaterial({ color: 0xd8d3ca, roughness: 0.4,  metalness: 0.7 });

    // Rocker-bogie: two side subassemblies. Each carries three wheels.
    this.bogies = {};
    this.wheels = {};

    for (const side of ['left', 'right']) {
      const bogie = new THREE.Group();
      bogie.name = `bogie-${side}`;
      const zSign = side === 'left' ? -1 : 1;
      bogie.position.set(0, 0.35, zSign * 0.75);
      this.chassis.add(bogie);
      this.bogies[side] = bogie;

      const positions = [
        { name: 'f', x:  1.0 },
        { name: 'm', x:  0.0 },
        { name: 'r', x: -1.0 },
      ];
      for (const p of positions) {
        // Suspension arm (visual only).
        const arm = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(p.x) + 0.2, 0.06, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x8a8f95, roughness: 0.55, metalness: 0.55 }));
        arm.position.set(p.x * 0.5, 0, 0);
        bogie.add(arm);

        // Wheel = group so we can steer f/r independently.
        const wheelPivot = new THREE.Group();
        wheelPivot.name = `wheel-pivot-${p.name}${side[0]}`;
        wheelPivot.position.set(p.x, -0.35, 0);
        bogie.add(wheelPivot);

        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.22, 24),
          wheelMat
        );
        tire.rotation.x = Math.PI / 2;
        tire.castShadow = true;
        wheelPivot.add(tire);

        // Rim + spokes for character.
        const rim = new THREE.Mesh(new THREE.TorusGeometry(this.wheelRadius * 0.65, 0.02, 8, 20), rimMat);
        rim.rotation.x = Math.PI / 2;
        wheelPivot.add(rim);
        for (let s = 0; s < 6; s++) {
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, this.wheelRadius * 1.1, 0.02), rimMat);
          spoke.rotation.z = (s / 6) * Math.PI * 2;
          wheelPivot.add(spoke);
        }

        // Tread grooves (visual pass).
        for (let g = 0; g < 8; g++) {
          const groove = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.03),
            new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.95 }));
          groove.rotation.x = Math.PI / 2;
          groove.rotation.z = (g / 8) * Math.PI * 2;
          groove.position.copy(new THREE.Vector3(
            Math.cos((g / 8) * Math.PI * 2) * this.wheelRadius,
            0,
            Math.sin((g / 8) * Math.PI * 2) * this.wheelRadius
          ));
          wheelPivot.add(groove);
        }

        wheelPivot.userData.tire = tire;
        wheelPivot.userData.isSteered = p.name !== 'm';
        wheelPivot.userData.rowName = `${p.name}${side[0]}`;
        wheelPivot.name = `wheel-${p.name}${side[0]}`;
        this.wheels[`${p.name}${side[0]}`] = wheelPivot;
      }
    }
  }

  _buildMast() {
    const mast = new THREE.Group();
    mast.name = 'mast';
    mast.position.set(0.45, 0.95, 0);
    this.chassis.add(mast);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1), new THREE.MeshStandardMaterial({ color: 0xa3a9b0, roughness: 0.45, metalness: 0.6 }));
    post.position.y = 0.55; post.castShadow = true;
    mast.add(post);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.28), new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.4, metalness: 0.7 }));
    head.position.y = 1.2; head.castShadow = true;
    mast.add(head);

    // Two "eyes" — the science camera.
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x7fd0d4 });
    for (const dx of [-0.12, 0.12]) {
      const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20), eyeMat);
      eye.rotation.x = Math.PI / 2;
      eye.position.set(dx, 1.2, 0.16);
      eye.name = 'camera-eye';
      mast.add(eye);
    }
  }

  _buildSolarPanels() {
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x11294a, roughness: 0.2, metalness: 0.6, emissive: 0x0b1a34, emissiveIntensity: 0.35 });
    for (const dz of [-0.9, 0.9]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.6), wingMat);
      wing.position.set(-0.1, 0.98, dz);
      wing.castShadow = true;
      // Slight tilt outward.
      wing.rotation.z = dz > 0 ? -0.14 : 0.14;
      this.chassis.add(wing);
      // Cell grid lines.
      for (let i = 1; i < 4; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.035, 0.58),
          new THREE.MeshBasicMaterial({ color: 0x6a86a8, transparent: true, opacity: 0.5 }));
        line.position.set(-0.7 + i * 0.35, 0.99, dz);
        line.rotation.z = wing.rotation.z;
        this.chassis.add(line);
      }
    }
  }

  _buildAntenna() {
    const ant = new THREE.Group();
    ant.position.set(-0.9, 1, 0.3);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xd6d1c9, roughness: 0.35, metalness: 0.85 }));
    pole.position.y = 0.45; pole.castShadow = true;
    ant.add(pole);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff5b2e }));
    tip.position.y = 0.95;
    ant.add(tip);
    this.chassis.add(ant);
  }

  _buildLights() {
    // Two small headlamps under the front bumper.
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff3c8 });
    for (const dz of [-0.4, 0.4]) {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16), lampMat);
      lens.rotation.z = Math.PI / 2;
      lens.position.set(1.28, 0.55, dz);
      this.chassis.add(lens);
    }
    // A subtle SpotLight helps at dusk. Kept low-cost.
    this.headlamp = new THREE.SpotLight(0xffe6b8, 0.9, 22, Math.PI / 6, 0.45, 1);
    this.headlamp.position.set(1.25, 0.6, 0);
    this.headlamp.target.position.set(3, 0.4, 0);
    this.chassis.add(this.headlamp, this.headlamp.target);
    this.headlamp.castShadow = false;
  }

  /** Steering setter for the four steered wheels (front + rear). */
  applySteering(angle) {
    this.steer = angle;
    for (const key of ['fl', 'fr']) this.wheels[key].rotation.y = angle;
    // Ackermann-lite: rear wheels counter-steer slightly at low angle for
    // tighter pivot; on real rocker-bogie DAWN rear counter-steers.
    for (const key of ['rl', 'rr']) this.wheels[key].rotation.y = -angle * 0.65;
  }

  /** Roll all wheel tires by an angular delta. */
  rollWheels(delta) {
    for (const key in this.wheels) {
      const pivot = this.wheels[key];
      pivot.userData.tire.rotation.y += delta;
    }
  }
}

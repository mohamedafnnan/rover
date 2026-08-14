import * as THREE from 'three';

/**
 * RoboticArm · a 5-DOF articulated manipulator + gripper.
 *
 * Joint hierarchy (each is a nested Group so we can drive them by name
 * from ArmInspector.js):
 *
 *   arm-root
 *     └─ shoulder-yaw
 *         └─ shoulder-pitch
 *             └─ upper-arm
 *                 └─ elbow
 *                     └─ forearm
 *                         └─ wrist-pitch
 *                             └─ wrist-roll
 *                                 └─ gripper (open/close)
 *
 * The inspector uses `setJoint(name, radians)` to expose interactive
 * sliders — no need to know the internal structure.
 */
export class RoboticArm {
  constructor() {
    const mat = {
      shell: new THREE.MeshStandardMaterial({ color: 0xd8d3ca, roughness: 0.45, metalness: 0.55 }),
      accent: new THREE.MeshStandardMaterial({ color: 0xc66b1e, roughness: 0.4, metalness: 0.5 }),
      joint: new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.4, metalness: 0.75 }),
      grip:  new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.7, metalness: 0.15 }),
    };

    this.root = new THREE.Group();
    this.joints = {};

    // Base plate.
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.1, 20), mat.joint);
    base.castShadow = true;
    this.root.add(base);

    // shoulder-yaw
    const sy = new THREE.Group(); sy.name = 'shoulder-yaw';
    sy.position.y = 0.08;
    this.root.add(sy);
    this.joints['shoulder-yaw'] = sy;
    const sJoint = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), mat.joint);
    sJoint.castShadow = true; sy.add(sJoint);

    // shoulder-pitch (upper arm segment)
    const sp = new THREE.Group(); sp.name = 'shoulder-pitch';
    sp.position.y = 0.06;
    sy.add(sp);
    this.joints['shoulder-pitch'] = sp;
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.12), mat.shell);
    upper.position.y = 0.45; upper.castShadow = true;
    sp.add(upper);
    const upperAccent = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.12, 0.125), mat.accent);
    upperAccent.position.y = 0.25;
    sp.add(upperAccent);

    // elbow
    const el = new THREE.Group(); el.name = 'elbow';
    el.position.y = 0.9;
    sp.add(el);
    this.joints['elbow'] = el;
    const eJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), mat.joint);
    eJoint.castShadow = true; el.add(eJoint);
    // forearm
    const fore = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.75, 0.1), mat.shell);
    fore.position.y = 0.4; fore.castShadow = true;
    el.add(fore);
    const foreAccent = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.1, 0.105), mat.accent);
    foreAccent.position.y = 0.6;
    el.add(foreAccent);

    // wrist-pitch
    const wp = new THREE.Group(); wp.name = 'wrist-pitch';
    wp.position.y = 0.78;
    el.add(wp);
    this.joints['wrist-pitch'] = wp;
    const wJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), mat.joint);
    wJoint.castShadow = true; wp.add(wJoint);

    // wrist-roll
    const wr = new THREE.Group(); wr.name = 'wrist-roll';
    wr.position.y = 0.06;
    wp.add(wr);
    this.joints['wrist-roll'] = wr;
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16), mat.shell);
    roll.position.y = 0.09;
    wr.add(roll);

    // gripper
    const gp = new THREE.Group(); gp.name = 'gripper';
    gp.position.y = 0.18;
    wr.add(gp);
    this.joints['gripper'] = gp;
    // Two fingers that spread with the gripper's rotation.x value.
    const finger1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.05), mat.grip);
    finger1.name = 'finger-a'; finger1.position.set(0.04, 0.09, 0); finger1.castShadow = true;
    gp.add(finger1);
    const finger2 = finger1.clone();
    finger2.name = 'finger-b'; finger2.position.set(-0.04, 0.09, 0);
    gp.add(finger2);
    gp.userData.fingerA = finger1;
    gp.userData.fingerB = finger2;

    // Set a friendly resting pose.
    this.setPose({
      'shoulder-yaw': 0.0,
      'shoulder-pitch': -0.9,
      'elbow': 1.4,
      'wrist-pitch': -0.4,
      'wrist-roll': 0,
      'gripper': 0.5,
    });
  }

  /** Direct joint setter — radians for rotational, 0..1 for the gripper. */
  setJoint(name, value) {
    const j = this.joints[name];
    if (!j) return;
    if (name === 'shoulder-yaw')      j.rotation.y = value;
    else if (name === 'shoulder-pitch') j.rotation.z = value;
    else if (name === 'elbow')          j.rotation.z = value;
    else if (name === 'wrist-pitch')    j.rotation.z = value;
    else if (name === 'wrist-roll')     j.rotation.y = value;
    else if (name === 'gripper') {
      // Convert 0..1 open ratio to finger spread.
      const spread = 0.02 + value * 0.09;
      j.userData.fingerA.position.x =  spread;
      j.userData.fingerB.position.x = -spread;
    }
    this._pose = { ...(this._pose || {}), [name]: value };
  }

  setPose(pose) {
    for (const [k, v] of Object.entries(pose)) this.setJoint(k, v);
  }

  /** A gentle idle animation used when the rover is stationary. */
  idle(elapsed) {
    if (this._locked) return;
    const t = elapsed;
    this.setJoint('shoulder-yaw',   Math.sin(t * 0.3) * 0.15);
    this.setJoint('wrist-roll',     Math.sin(t * 0.7) * 0.4);
  }

  lock(locked)  { this._locked = locked; }
  get pose()    { return { ...(this._pose || {}) }; }
}

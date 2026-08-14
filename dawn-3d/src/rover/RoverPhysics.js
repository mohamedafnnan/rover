import * as THREE from 'three';

/**
 * RoverPhysics · toy-but-satisfying driving physics.
 *
 * We're deliberately NOT integrating a full rigid-body solver. Instead:
 *
 *   · Forward velocity is integrated from throttle with soft accel/decel.
 *   · Yaw rate is a function of forward speed × steering angle (bicycle model).
 *   · Wheel positions are raycast against the heightmap and each bogie is
 *     tilted so the rover visually conforms to terrain.
 *   · Chassis pitch and roll follow the average of the six wheel heights,
 *     giving that satisfying "weighty" suspension feel.
 *
 * Result: cheap, deterministic, and it FEELS like a rover.
 */
const TMP_V = new THREE.Vector3();
const TMP_Q = new THREE.Quaternion();

export class RoverPhysics {
  constructor(rover, terrain) {
    this.rover = rover;
    this.terrain = terrain;

    // Physical parameters — tuned for feel, not realism.
    this.maxSpeed = 8.0;      // m/s
    this.reverseSpeed = 4.0;  // m/s
    this.accel = 6.0;         // m/s^2
    this.brakeDecel = 12.0;   // m/s^2
    this.rolling = 1.6;       // passive deceleration
    this.maxSteer = 0.55;     // rad
    this.steerSpeed = 3.0;    // how fast steering angle catches up

    this.steerAngle = 0;
    // Pose helpers.
    this._up = new THREE.Vector3(0, 1, 0);
  }

  reset(x = 0, z = 0) {
    this.rover.root.position.set(x, this.terrain.heightAt(x, z) + this.rover.wheelRadius + 0.2, z);
    this.rover.root.rotation.set(0, 0, 0);
    this.rover.heading = 0;
    this.rover.speed = 0;
    this.rover.velocity.set(0, 0, 0);
    this.steerAngle = 0;
    this.rover.applySteering(0);
  }

  update(dt, input) {
    const r = this.rover;

    // ---- Throttle → target speed ----
    const targetSpeed = input.throttle > 0
      ? input.throttle * this.maxSpeed
      : input.throttle * this.reverseSpeed;
    const boostMul = 1 + 0.5 * input.boost;
    const targetWithBoost = targetSpeed * boostMul;

    // Approach target speed with accel; brake overrides.
    if (input.brake > 0) {
      r.speed = approach(r.speed, 0, this.brakeDecel * dt);
    } else if (Math.sign(targetWithBoost) === Math.sign(r.speed) || r.speed === 0) {
      r.speed = approach(r.speed, targetWithBoost, this.accel * dt);
    } else {
      // Switching direction: decelerate faster.
      r.speed = approach(r.speed, targetWithBoost, this.accel * 2 * dt);
    }
    // Rolling resistance when throttle idle.
    if (Math.abs(input.throttle) < 0.05 && input.brake === 0) {
      r.speed = approach(r.speed, 0, this.rolling * dt);
    }

    // ---- Steering → target angle ----
    const targetSteer = input.steer * this.maxSteer;
    this.steerAngle = approach(this.steerAngle, targetSteer, this.steerSpeed * dt);
    r.applySteering(this.steerAngle);

    // ---- Yaw update (bicycle-ish) ----
    const wheelbase = r.wheelBaseX;
    const yawRate = (r.speed / wheelbase) * Math.tan(this.steerAngle);
    r.heading += yawRate * dt;

    // ---- Position update ----
    const fwdX = Math.cos(r.heading);
    const fwdZ = Math.sin(r.heading);
    r.root.position.x += fwdX * r.speed * dt;
    r.root.position.z += fwdZ * r.speed * dt;
    r.velocity.set(fwdX * r.speed, 0, fwdZ * r.speed);

    // ---- Clamp inside world bounds ----
    const bound = this.terrain.half - 6;
    r.root.position.x = clamp(r.root.position.x, -bound, bound);
    r.root.position.z = clamp(r.root.position.z, -bound, bound);

    // ---- Terrain follow: sample 6 wheel points ----
    this._settleOnTerrain();

    // ---- Roll wheels visually ----
    const angDelta = (r.speed * dt) / r.wheelRadius;
    r.rollWheels(angDelta);
  }

  _settleOnTerrain() {
    const r = this.rover;
    const heights = [];
    const localPositions = [
      [ r.wheelBaseX / 2,  0,  r.wheelBaseZ / 2],
      [ 0,                 0,  r.wheelBaseZ / 2],
      [-r.wheelBaseX / 2,  0,  r.wheelBaseZ / 2],
      [ r.wheelBaseX / 2,  0, -r.wheelBaseZ / 2],
      [ 0,                 0, -r.wheelBaseZ / 2],
      [-r.wheelBaseX / 2,  0, -r.wheelBaseZ / 2],
    ];
    const cos = Math.cos(r.heading), sin = Math.sin(r.heading);
    let avgY = 0;
    for (const [lx, , lz] of localPositions) {
      // Rotate local offset by heading.
      const wx = r.root.position.x + lx * cos - lz * sin;
      const wz = r.root.position.z + lx * sin + lz * cos;
      const h = this.terrain.heightAt(wx, wz);
      heights.push(h);
      avgY += h;
    }
    avgY /= heights.length;

    // Body sits on the average wheel height.
    r.root.position.y = avgY + r.wheelRadius + 0.15;

    // Pitch: front vs rear.
    const front = (heights[0] + heights[3]) * 0.5;
    const rear  = (heights[2] + heights[5]) * 0.5;
    const pitch = Math.atan2(front - rear, r.wheelBaseX);

    // Roll: left vs right.
    const left  = (heights[0] + heights[1] + heights[2]) / 3;
    const right = (heights[3] + heights[4] + heights[5]) / 3;
    const roll  = Math.atan2(right - left, r.wheelBaseZ);

    // Compose yaw × pitch × roll on the chassis (not root — root keeps yaw only).
    r.root.rotation.set(0, -r.heading, 0);
    // Apply pitch/roll on the chassis child so wheel local transforms stay clean.
    r.chassis.rotation.set(-pitch, 0, -roll);

    // Bogies tilt independently so the front & rear wheels track the ground.
    const bogieL = (heights[0] - heights[2]) * 0.35;
    const bogieR = (heights[3] - heights[5]) * 0.35;
    if (r.bogies?.left)  r.bogies.left.rotation.z  = -bogieL;
    if (r.bogies?.right) r.bogies.right.rotation.z = -bogieR;
  }
}

function approach(cur, target, delta) {
  const diff = target - cur;
  if (Math.abs(diff) <= delta) return target;
  return cur + Math.sign(diff) * delta;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

import * as THREE from 'three';
import { Renderer } from './Renderer.js';
import { Loop } from './Loop.js';
import { Input } from './Input.js';
import { content } from './ContentStore.js';
import { bus } from './EventBus.js';
import { flags, log } from './Debug.js';

import { World } from '../world/World.js';
import { Rover } from '../rover/Rover.js';
import { RoverPhysics } from '../rover/RoverPhysics.js';
import { RoverAudio } from '../rover/RoverAudio.js';
import { CameraRig } from '../camera/CameraRig.js';

import { ProximitySystem } from '../interaction/ProximitySystem.js';
import { ScanSystem } from '../interaction/ScanSystem.js';
import { MissionSystem } from '../interaction/MissionSystem.js';

import { AudioEngine } from '../audio/AudioEngine.js';
import { Ambience } from '../audio/Ambience.js';

import { HUD } from '../ui/HUD.js';
import { Prompt } from '../ui/Prompt.js';
import { Toast } from '../ui/Toast.js';
import { Onboarding } from '../ui/Onboarding.js';
import { Codex } from '../ui/Codex.js';
import { CinematicIntro } from '../ui/CinematicIntro.js';

/**
 * App · the top-level orchestrator.
 *
 * Owns exactly one Renderer, one Loop, one Scene, one Camera, one Rover.
 * Every subsystem is instantiated here and registered with the loop.
 *
 * Non-negotiables enforced here:
 *   · one WebGLRenderer      → this.renderer
 *   · one requestAnimationFrame → this.loop
 *   · one PerspectiveCamera   → this.cameraRig.camera
 *   · scene graph rooted at  → this.world.scene
 */
export class App {
  constructor(canvas, uiRoot) {
    this.canvas = canvas;
    this.uiRoot = uiRoot;
    this.renderer = new Renderer(canvas);
    this.loop = new Loop();
    this.input = new Input();
    this.audio = new AudioEngine();
    this.ambience = new Ambience(this.audio);
  }

  async boot(onProgress) {
    // 1) content
    await content.load((frac) => onProgress?.(frac * 0.5, 'content'));

    // 2) world
    this.world = new World(this.renderer, content);
    onProgress?.(0.7, 'world');

    // 3) rover + physics + audio
    this.rover = new Rover();
    this.roverPhysics = new RoverPhysics(this.rover, this.world.terrain);
    this.roverAudio = new RoverAudio(this.audio);
    this.world.scene.add(this.rover.root);
    this.roverPhysics.reset(0, 6);

    // 4) camera rig
    this.cameraRig = new CameraRig();
    this.cameraRig.attachTarget(this.rover.root);
    this.renderer.attachCamera(this.cameraRig.camera);

    // 5) interaction
    this.proximity = new ProximitySystem(this.rover, this.world.pois, this.input);
    this.scanSystem = new ScanSystem(this.world.rocks, this.world.terrain, this.rover, { spawn: 3 });
    this.world.scene.add(this.scanSystem.group);
    this.missions = new MissionSystem(content);

    // 6) UI
    this.hud = new HUD(this.uiRoot, this.rover, this.world.pois, this.world.terrain, content.site.name);
    this.prompt = new Prompt(this.uiRoot);
    this.toast = new Toast(this.uiRoot);
    this.codex = new Codex(this.uiRoot, content, this.audio);
    this.onboarding = new Onboarding(this.uiRoot);

    // 7) bus wiring
    this._wireEvents();

    // 8) intro overlay (dismissible)
    if (!flags.nointro && !flags.reducedMotion) {
      this.intro = new CinematicIntro(this.uiRoot, content.site.team, content.site.subtitle);
    }

    // 9) register loop systems
    this.loop.add({
      update: (dt, e) => this._update(dt, e),
      lateUpdate: (dt) => this._lateUpdate(dt),
      render: () => this.renderer.render(this.world.scene, this.cameraRig.camera),
    });

    onProgress?.(1, 'ready');
    log('boot complete');
  }

  _wireEvents() {
    // Codex-triggered arm control.
    bus.on('arm:setJoint', ({ joint, value }) => this.rover.arm.setJoint(joint, value));
    bus.on('arm:pose',     ({ pose })          => this.rover.arm.setPose(pose));

    // Scan / storm hooks from panel buttons.
    bus.on('scan:deploy', () => this.scanSystem.deploy());

    // Camera inspection target when Codex opens.
    bus.on('codex:open', ({ poi }) => {
      const t = this.world.pois.byId(poi.id);
      if (t) {
        this.cameraRig.inspectionTarget = t.position.clone();
        this.cameraRig.setMode('inspection', { duration: 0.9 });
      }
    });
    bus.on('codex:close', () => this.cameraRig.setMode('follow', { duration: 0.6 }));

    // Toast bus already handled by Toast component.

    // Landing zone welcome toast on cinematic dismiss.
    bus.on('cinematic:end', () => {
      this.toast.push('Welcome to Mars. Drive to Mission Control.');
    });
  }

  _update(dt, elapsed) {
    // Order matters: input → physics → arm → interaction → world.
    this.input.update();

    // Global one-shots.
    if (this.input.pressed.reset) this.roverPhysics.reset(0, 6);
    if (this.input.pressed.camera) this.cameraRig.cycleMode();
    if (this.input.pressed.escape) this.codex.close();

    this.roverPhysics.update(dt, this.input.state);

    // Idle arm animation while stationary + arm not being manipulated.
    if (Math.abs(this.rover.speed) < 0.05 && !this.codex.open) {
      this.rover.arm.idle(elapsed);
    }

    this.proximity.update();
    this.scanSystem.update(dt, elapsed);
    this.world.update(dt, elapsed, this.rover.root.position);
    this.ambience.update();
    this.roverAudio.update(dt, this.rover.speed);

    this.input.clearOneShots();
  }

  _lateUpdate(dt) {
    // Cameras and UI update after physics so they read final poses.
    this.cameraRig.update(dt);
    this.hud.update();
    if (this.onboarding) this.onboarding.update(dt, this.rover);
  }

  start() { this.loop.start(); }
  stop()  { this.loop.stop(); }
}

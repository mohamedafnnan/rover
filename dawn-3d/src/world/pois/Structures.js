import * as THREE from 'three';
import { POI } from './POI.js';

/**
 * Structures · a family of tiny POI subclasses.
 *
 * Rather than a file-per-type (which would explode into 20 files for
 * geometry that shares most of its code), we keep every structural
 * variation here and export a lookup by POI `type`.
 *
 * Each factory receives `def, terrain` and returns a POI instance whose
 * group carries the unique geometry. Materials use `def.color` so
 * changing a color in content/pois.json is enough to re-theme a location.
 */

// ---------- shared materials ---------- //
const M = {
  panel(color)     { return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.35 }); },
  glow(color, o=0.5) { return new THREE.MeshBasicMaterial({ color, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false }); },
  metal(color=0xc0c6cc){ return new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.85 }); },
  matte(color=0xd3cdc4){ return new THREE.MeshStandardMaterial({ color, roughness: 0.9,  metalness: 0.05 }); },
};

// ==========================================================
// Landing Zone — a rugged pad, a flag, and a crashed shipping crate.
// ==========================================================
class LandingZone extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    // Circular hex pad (matte grey, subdivided).
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius - 2, this.radius - 2, 0.4, 6),
      M.matte(0x6a6058)
    );
    pad.position.y = 0.2;
    pad.receiveShadow = true;
    g.add(pad);

    // Flag pole with FISAT-orange banner.
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 6), M.metal(0xaaaaaa));
    pole.position.set(0, 3, -2.5);
    pole.castShadow = true;
    g.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide }));
    flag.position.set(0.8, 5.2, -2.5);
    g.add(flag);
    return g;
  }
}

// ==========================================================
// Mission Control — hexagonal command hub with an antenna array.
// ==========================================================
class MissionControl extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.5, 3, 6), M.panel(0x272b32));
    base.position.y = 1.5; base.castShadow = true; base.receiveShadow = true;
    g.add(base);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.matte(0xd6c5b1));
    dome.position.y = 3; dome.castShadow = true;
    g.add(dome);
    // Antenna cluster.
    for (let i = 0; i < 3; i++) {
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4), M.metal(0x9ca3af));
      a.position.set(Math.cos(i * 2.09) * 1.4, 6, Math.sin(i * 2.09) * 1.4);
      g.add(a);
    }
    // Glowing rim ring.
    const rim = new THREE.Mesh(new THREE.TorusGeometry(6.1, 0.08, 8, 40), M.glow(this.color, 0.75));
    rim.rotation.x = Math.PI / 2; rim.position.y = 3.02;
    g.add(rim);
    return g;
  }
}

// ==========================================================
// Rover Garage — an open aluminium hangar.
// ==========================================================
class RoverGarage extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 10), M.matte(0x9a8f80));
    floor.position.y = 0.1; floor.receiveShadow = true;
    g.add(floor);
    // Arched roof made of ribs.
    for (let i = -6; i <= 6; i += 2) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(5, 0.15, 8, 32, Math.PI), M.metal(0x9ca3af));
      rib.rotation.z = Math.PI / 2;
      rib.rotation.y = Math.PI / 2;
      rib.position.set(i, 5, 0);
      rib.castShadow = true;
      g.add(rib);
    }
    // Sides.
    const sideG = new THREE.BoxGeometry(14, 5, 0.2);
    for (const z of [-5, 5]) {
      const s = new THREE.Mesh(sideG, M.matte(0xbfb0a0));
      s.position.set(0, 2.5, z); g.add(s);
    }
    return g;
  }
}

// ==========================================================
// Robotic Arm Bay — a pedestal spotlight.
// ==========================================================
class ArmBay extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const podium = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 1.2, 24), M.panel(0x1e232a));
    podium.position.y = 0.6; podium.castShadow = true; podium.receiveShadow = true;
    g.add(podium);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.05, 8, 48), M.glow(this.color, 0.9));
    ring.rotation.x = Math.PI / 2; ring.position.y = 1.22;
    g.add(ring);
    // Beam of light straight up.
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 2.2, 20, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    beam.position.y = 10.5; g.add(beam);
    return g;
  }
}

// ==========================================================
// Department building — themed hexagonal lab.
// A single reusable class; department id decides the accent color.
// ==========================================================
class DepartmentLab extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const cube = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 7), M.panel(0x1f242b));
    cube.position.y = 2; cube.castShadow = true; cube.receiveShadow = true;
    g.add(cube);

    // Slanted roof with color panel.
    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.4, 7.4), M.panel(0x11151a));
    roof.position.y = 4.2; roof.castShadow = true;
    g.add(roof);

    // Signature colored ribbon at eye level.
    const ribbonMat = new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.9 });
    for (const side of [
      { p: [3.51, 2.4, 0],  r: [0, Math.PI / 2, 0] },
      { p: [-3.51, 2.4, 0], r: [0, -Math.PI / 2, 0] },
      { p: [0, 2.4, 3.51],  r: [0, 0, 0] },
      { p: [0, 2.4, -3.51], r: [0, Math.PI, 0] },
    ]) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.35), ribbonMat);
      s.position.set(...side.p);
      s.rotation.set(...side.r);
      g.add(s);
    }
    // Skylight beacon.
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), M.glow(this.color, 1));
    beacon.position.y = 4.7;
    g.add(beacon);
    return g;
  }
}

// ==========================================================
// Testing Area — fenced sandbox with cones.
// ==========================================================
class TestingArea extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    // Sand square.
    const sand = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 20), M.matte(0xc98c58));
    sand.position.y = 0.05; sand.receiveShadow = true;
    g.add(sand);
    // Fence posts.
    for (let i = -10; i <= 10; i += 5) {
      for (const z of [-10, 10]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4), M.metal(0x8a8f95));
        p.position.set(i, 0.7, z); g.add(p);
      }
      for (const x of [-10, 10]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4), M.metal(0x8a8f95));
        p.position.set(x, 0.7, i); g.add(p);
      }
    }
    // Cones.
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xff7a2e, roughness: 0.6 });
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1, 12), coneMat);
      c.position.set(-8 + i * 3.2, 0.5, Math.sin(i) * 4); c.castShadow = true;
      g.add(c);
    }
    return g;
  }
}

// ==========================================================
// Communication Tower — a tall lattice tower.
// ==========================================================
class CommsTower extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const H = 18;
    // Four vertical spars.
    for (const [dx, dz] of [[1,1],[-1,1],[1,-1],[-1,-1]]) {
      const spar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, H), M.metal(0xa3a9b0));
      spar.position.set(dx * 0.9, H/2, dz * 0.9);
      g.add(spar);
    }
    // X-brace rungs.
    for (let y = 1; y < H - 1; y += 1.5) {
      const rung = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 0.06), M.metal(0x7c828a));
      rung.position.set(0, y, -0.9); g.add(rung);
      const rung2 = rung.clone(); rung2.position.set(0, y, 0.9); g.add(rung2);
      const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.3), M.metal(0x7c828a));
      side1.position.set(-0.9, y, 0); g.add(side1);
      const side2 = side1.clone(); side2.position.set(0.9, y, 0); g.add(side2);
    }
    // Dish.
    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.4), M.matte(0xd6d1c9));
    dish.rotation.x = -Math.PI / 3; dish.position.y = H + 0.3; dish.castShadow = true;
    g.add(dish);
    // Blinking red light.
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff2f2f }));
    bulb.position.y = H + 2; g.add(bulb);
    this._bulb = bulb;
    return g;
  }
  update(dt, e) {
    super.update(dt, e);
    if (this._bulb) this._bulb.material.opacity = 0.6 + 0.4 * (Math.sin(e * 4) * 0.5 + 0.5);
  }
}

// ==========================================================
// Solar Farm — a rectangular array of tilted photovoltaic panels.
// ==========================================================
class SolarFarm extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x11294a, roughness: 0.2, metalness: 0.6, emissive: 0x0b1a34, emissiveIntensity: 0.4 });
    const frameMat = M.metal(0xb5bbc1);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 1.6), panelMat);
        panel.rotation.x = -Math.PI / 6;
        panel.position.set(-4.5 + i * 3, 1.3, -2 + j * 2.4);
        panel.castShadow = true; panel.receiveShadow = true;
        g.add(panel);
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3), frameMat);
        post.position.set(panel.position.x, 0.65, panel.position.z);
        g.add(post);
      }
    }
    return g;
  }
}

// ==========================================================
// Research Dome — a large translucent geodesic dome.
// ==========================================================
class ResearchDome extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const domeGeo = new THREE.IcosahedronGeometry(5, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x9fb2c8, roughness: 0.15, metalness: 0.2,
      transparent: true, opacity: 0.35, envMapIntensity: 1, side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(domeGeo, mat);
    dome.position.y = 3; dome.castShadow = true; dome.scale.y = 0.65;
    g.add(dome);
    // Frame wireframe accent.
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(domeGeo), new THREE.LineBasicMaterial({ color: this.color, transparent: true, opacity: 0.6 }));
    wire.position.y = 3; wire.scale.y = 0.65;
    g.add(wire);
    return g;
  }
}

// ==========================================================
// Competition Hall — wide low pavilion with a marquee.
// ==========================================================
class CompetitionHall extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 8), M.panel(0x1c2027));
    body.position.y = 2.25; body.castShadow = true; body.receiveShadow = true;
    g.add(body);
    const marquee = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.4, 8.4), new THREE.MeshBasicMaterial({ color: this.color }));
    marquee.position.y = 4.6; g.add(marquee);
    // "IRC 2026" text plate.
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.3), M.matte(0xe3d8c7));
    plate.position.set(0, 4.6, 4.05);
    g.add(plate);
    return g;
  }
}

// ==========================================================
// Sponsor Plaza — three tiered obelisks (platinum / gold / regular).
// ==========================================================
class SponsorPlaza extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.3, 32), M.matte(0x484138));
    pad.position.y = 0.15; pad.receiveShadow = true;
    g.add(pad);
    const tiers = [
      { color: 0xd5c07a, h: 6, r: 1.1, x: 0 },
      { color: 0xe6b95c, h: 4.6, r: 0.9, x: -4 },
      { color: 0xc66b1e, h: 3.8, r: 0.85, x: 4 },
    ];
    for (const t of tiers) {
      const ob = new THREE.Mesh(
        new THREE.CylinderGeometry(t.r * 0.55, t.r, t.h, 4),
        new THREE.MeshStandardMaterial({ color: t.color, roughness: 0.4, metalness: 0.6 })
      );
      ob.position.set(t.x, t.h / 2 + 0.3, 0);
      ob.castShadow = true;
      g.add(ob);
    }
    return g;
  }
}

// ==========================================================
// Gallery Canyon — a series of tall photo-frame plinths.
// ==========================================================
class GalleryCanyon extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 2.6), M.matte(0x8b7461));
      plinth.position.set(-8 + i * 3.2, 2.25, 0);
      plinth.castShadow = true;
      g.add(plinth);
      const frame = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.4), new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.85 }));
      frame.position.set(-8 + i * 3.2, 2.5, 1.31);
      g.add(frame);
    }
    return g;
  }
}

// ==========================================================
// Achievement Monument — a stepped pyramid of trophies.
// ==========================================================
class AchievementMonument extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(6 - i * 1.2, 0.9, 6 - i * 1.2),
        M.matte(i === 3 ? 0xe0b26a : 0x8a7566)
      );
      step.position.y = 0.45 + i * 0.9;
      step.castShadow = true; step.receiveShadow = true;
      g.add(step);
    }
    const trophy = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2, 6), new THREE.MeshStandardMaterial({ color: 0xf3d38c, roughness: 0.2, metalness: 0.9, emissive: 0x442200, emissiveIntensity: 0.4 }));
    trophy.position.y = 5; trophy.castShadow = true;
    g.add(trophy);
    return g;
  }
}

// ==========================================================
// Timeline Route — a line of milestone markers along a ridge.
// ==========================================================
class TimelineRoute extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), M.metal(0xd8d3ca));
      post.position.set(-7 + i * 2.8, 1, 0);
      post.castShadow = true;
      g.add(post);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: this.color }));
      cap.position.set(-7 + i * 2.8, 2.1, 0);
      g.add(cap);
    }
    return g;
  }
}

// ==========================================================
// Media Hub — a spherical broadcast node.
// ==========================================================
class MediaHub extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 20), M.matte(0x1e232a));
    shell.position.y = 3; shell.castShadow = true;
    g.add(shell);
    const rings = 3;
    for (let i = 0; i < rings; i++) {
      const r = 3.1 + i * 0.4;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 8, 48), M.glow(this.color, 0.6));
      ring.position.y = 3;
      ring.rotation.x = Math.PI / 2 + i * 0.5;
      g.add(ring);
    }
    return g;
  }
}

// ==========================================================
// Recruitment Center — a friendly kiosk with a pulsing sign.
// ==========================================================
class RecruitmentCenter extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const shed = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3, 3.5), M.panel(0x252b33));
    shed.position.y = 1.5; shed.castShadow = true; shed.receiveShadow = true;
    g.add(shed);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(3, 0.9, 0.2), new THREE.MeshBasicMaterial({ color: this.color }));
    sign.position.set(0, 3.7, 1.8); g.add(sign);
    return g;
  }
}

// ==========================================================
// Team Monument — six pillars, one per department, ringed by a plate.
// ==========================================================
class TeamMonument extends POI {
  _buildStructure() {
    const g = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.4, 32), M.matte(0x40382d));
    plate.position.y = 0.2; plate.receiveShadow = true;
    g.add(plate);
    const pillars = 6;
    for (let i = 0; i < pillars; i++) {
      const a = (i / pillars) * Math.PI * 2;
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.5, 3.6 + Math.random() * 1.2, 6),
        M.matte(0xd1c4b0)
      );
      p.position.set(Math.cos(a) * 3.6, 2, Math.sin(a) * 3.6);
      p.castShadow = true;
      g.add(p);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), new THREE.MeshBasicMaterial({ color: this.color }));
      cap.position.copy(p.position); cap.position.y += 2;
      g.add(cap);
    }
    return g;
  }
}

// ==========================================================
// Factory table.
// ==========================================================
const STRUCTURES = {
  landing:      LandingZone,
  hub:          MissionControl,
  rover:        RoverGarage,
  arm:          ArmBay,
  department:   DepartmentLab,
  range:        TestingArea,
  landmark:     null, // decided by id below
  competition:  CompetitionHall,
  sponsors:     SponsorPlaza,
  gallery:      GalleryCanyon,
  achievements: AchievementMonument,
  timeline:     TimelineRoute,
  media:        MediaHub,
  recruitment:  RecruitmentCenter,
  team:         TeamMonument,
};

export function createPOI(def, terrain) {
  let Ctor = STRUCTURES[def.type];
  if (def.type === 'landmark') {
    if (def.id === 'communication-tower') Ctor = CommsTower;
    else if (def.id === 'solar-farm')     Ctor = SolarFarm;
    else if (def.id === 'research-dome')  Ctor = ResearchDome;
    else                                  Ctor = TeamMonument;
  }
  if (!Ctor) Ctor = POI;
  return new Ctor(def, terrain);
}

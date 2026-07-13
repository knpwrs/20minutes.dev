---
title: 'Build a Physics Engine'
order: 16
lessons: 44
size: 'Medium'
tech: ['Rigid-body dynamics', 'Collision detection', 'Impulse resolution']
estMin: 20
desc: 'Simulate 2D rigid bodies: integration, collision detection with SAT, and impulse-based resolution.'
blurb: 'Start with a Vec2 that can add and take a dot product and end with a world that drops a box onto the ground and lets it settle at rest. Every lesson is one concrete spec with exact values: why semi-implicit Euler beats explicit, the impulse that makes a head-on bounce reverse, the minimum-penetration axis from SAT, and the r x n terms that turn a contact into spin.'
overview: |
  Over 44 lessons you build a working 2D rigid-body physics engine from scratch: a Vec2 math kit (add, subtract, scale, dot, length, normalize, and the 2D scalar cross), particles you move with numerical integration (explicit vs semi-implicit Euler, forces, gravity, a force accumulator, and a fixed timestep), rigid bodies with mass and inverse mass so a static body has infinite mass and never moves, shapes (circle, AABB, convex polygon) with world transforms, collision detection that returns an exact contact normal and penetration depth for every shape pair (circle-circle, AABB-AABB, circle-AABB, polygon-polygon and circle-polygon via the Separating Axis Theorem), impulse-based resolution with restitution and positional correction, rotation with moment of inertia and contact-point impulses that produce spin, Coulomb friction, and a world step that integrates, detects, and resolves every frame.

  By the end you have an importable engine and a runnable, asset-free text demo: it steps a small scene under gravity and prints each body's position over time, ending with a box that drops onto the ground and settles at rest without tunneling through it. The engine is deterministic and its public API is fully tested, so every behavior is pinned to an exact value.

  This is a teaching-grade engine built around the standard impulse-with-restitution design that Box2D and similar 2D engines use: sequential-impulse resolution over a per-frame contact list, with positional correction for sinkage. It is honest about what it does not do - it resolves each contact at a single point, derives a Coulomb friction impulse but leaves wiring it into the resolver as the first extension, uses a small fixed number of solver iterations rather than a full warm-started constraint solver, has no continuous collision detection (very fast bodies can tunnel), no joints or resting/sleeping, and a simple grid-free broadphase. What you finish with is the honest core that production 2D engines extend with friction, warm starting, two-point manifolds, and richer constraints.
parts:
  - name: 'A 2D vector kit'
    count: 7
  - name: 'Particles and integration'
    count: 7
  - name: 'Rigid bodies and shapes'
    count: 7
  - name: 'Collision detection'
    count: 9
  - name: 'Collision resolution'
    count: 9
  - name: 'The world step'
    count: 5
caveats:
  note: 'A genuinely working 2D rigid-body engine - semi-implicit integration, mass and inverse mass, circle/box/convex-polygon collision with exact contact manifolds via SAT, and impulse resolution with restitution, positional correction, and rotation behind a world step that settles a scene - but contacts are resolved at a single point, a Coulomb friction impulse is derived yet not applied in the resolver, and there is no warm starting, continuous collision, joints, or sleeping.'
  future:
    - 'Apply the Coulomb friction impulse inside the contact resolver so sliding is damped - the friction term is built and tested but not yet wired into the resolve step'
    - 'Add two-point (clipped) contact manifolds for polygon collisions so a box resting flat is constrained at both corners at once, not a single point'
    - 'Add contact warm starting across frames so stacks stay stable with far fewer solver iterations'
    - 'Add continuous collision detection (or a per-step speed limit) so fast, small bodies cannot tunnel through thin geometry in one step'
    - 'Replace the brute-force pairwise broadphase with a spatial grid or sweep-and-prune as body counts grow'
    - 'Add joints (pin, spring, distance) and a resting/sleeping system so idle stacks stop consuming solver time'
resources:
  - title: 'Physics, Part 3: Collision Response'
    author: 'Chris Hecker'
    url: 'https://www.chrishecker.com/Rigid_Body_Dynamics'
    note: 'The classic rigid-body dynamics series. Part 3 derives the impulse-with-restitution collision response, including the r x n rotational terms, that the resolution chapter is built around.'
  - title: 'Modern 2D Collision and Response (GDC)'
    author: 'Erin Catto (Box2D)'
    url: 'https://box2d.org/publications/'
    note: 'The Box2D author''s GDC talks on sequential impulses, the contact solver, and positional correction - the design this project follows for resolving a per-frame contact list.'
  - title: 'How to Create a Custom Physics Engine'
    author: 'Randy Gaul'
    url: 'https://gamedevelopment.tutsplus.com/series/how-to-create-a-custom-physics-engine--gamedev-12715'
    note: 'A step-by-step impulse-engine tutorial: manifolds, normal and penetration, impulse resolution, positional correction, and friction - the same arc, worked in code.'
  - title: 'Real-Time Collision Detection'
    author: 'Christer Ericson'
    url: 'https://realtimecollisiondetection.net/'
    note: 'The reference for the geometry: closest-point tests, AABBs, and the Separating Axis Theorem used for the polygon collision detection in chapter four.'
  - title: 'Game Physics Engine Development'
    author: 'Ian Millington'
    note: 'A full book that builds a particle engine and then a rigid-body engine in the same order this project does - integration first, then contacts, then rotation.'
  - title: 'Advanced Character Physics'
    author: 'Thomas Jakobsen'
    url: 'https://www.cs.cmu.edu/afs/cs/academic/class/15462-s13/www/lec_slides/Jakobsen.pdf'
    note: 'The Hitman/Verlet paper - a different integration and constraint approach worth reading once you finish, to see the road not taken.'
---

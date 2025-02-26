"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const SolarSystemUi = () => {
  const canvasRef = useRef(null);
  const paneRef = useRef(null);
  

  useEffect(() => {
    if (!canvasRef.current || !paneRef.current) return;

    // Create Scene
    const scene = new THREE.Scene();
    const pane = new Pane({ container: paneRef.current });

    const createTextLabel = (text) => {
      const textCanvas = document.createElement("canvas");
      const ctx = textCanvas.getContext("2d");
    
      textCanvas.width = 1024;
      textCanvas.height = 256;
    
      ctx.font = "bold 100px 'Bricolage Grotesque',serif ";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2 + 30);
    
      const texture = new THREE.CanvasTexture(textCanvas);
      const textMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    
      const textSprite = new THREE.Sprite(textMaterial);
      textSprite.scale.set(15, 5, 1);
      textSprite.position.set(0, 10, -20);
    
      scene.add(textSprite);
      return textSprite;
    };
    
    const textLabel = createTextLabel("Solar System");
  




    // Adding Materials & Textures
    // add textureLoader
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath("/cubeMap/");

    const backgroundCubemap = cubeTextureLoader.load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ]);

    scene.background = backgroundCubemap;

    // adding textures
    const sunTexture = textureLoader.load("/2k_sun.jpg");
    sunTexture.colorSpace = THREE.SRGBColorSpace;
    const mercuryTexture = textureLoader.load("/2k_mercury.jpg");
    mercuryTexture.colorSpace = THREE.SRGBColorSpace;
    const venusTexture = textureLoader.load("/2k_venus_surface.jpg");
    venusTexture.colorSpace = THREE.SRGBColorSpace;
    const earthTexture = textureLoader.load("/2k_earth_daymap.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    const marsTexture = textureLoader.load("/2k_mars.jpg");
    marsTexture.colorSpace = THREE.SRGBColorSpace;
    const moonTexture = textureLoader.load("/2k_moon.jpg");
    moonTexture.colorSpace = THREE.SRGBColorSpace;

    // add stuff here
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
    });

    const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
    sun.scale.setScalar(5);
    scene.add(sun);

    // Adding Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
     scene.add(ambientLight);

    // Adding Point Light
    const pointLight = new THREE.PointLight(0xffffff, 5);
    scene.add(pointLight);

    // add materials
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: mercuryTexture,
    });
    const venusMaterial = new THREE.MeshStandardMaterial({
      map: venusTexture,
    });
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
    });
    const marsMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
    });
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
    });

    // Initialize the Camera (Fixed Parameters)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      750
    );

    camera.position.set(0, 10, 30); // Move back to see the sun

    // Planets Array
    const planets = [
      {
        name: "Mercury",
        radius: 0.5,
        distance: 10,
        speed: 0.01,
        material: mercuryMaterial,
        moons: [],
      },
      {
        name: "Venus",
        radius: 0.8,
        distance: 15,
        speed: 0.007,
        material: venusMaterial,
        moons: [],
      },
      {
        name: "Earth",
        radius: 1,
        distance: 20,
        speed: 0.005,
        material: earthMaterial,
        moons: [
          {
            name: "Moon",
            radius: 0.3,
            distance: 3,
            speed: 0.015,
          },
        ],
      },
      {
        name: "Mars",
        radius: 0.7,
        distance: 25,
        speed: 0.003,
        material: marsMaterial,
        moons: [
          {
            name: "Phobos",
            radius: 0.1,
            distance: 2,
            speed: 0.02,
          },
          {
            name: "Deimos",
            radius: 0.2,
            distance: 3,
            speed: 0.015,
            color: 0xffffff,
          },
        ],
      },
    ];

    const createPlanet = (planet) => {
      const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
      planetMesh.scale.setScalar(planet.radius);
      planetMesh.position.x = planet.distance;
      return planetMesh;
    };

    const createMoon = (moon) => {
      const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
      moonMesh.scale.setScalar(moon.radius);
      moonMesh.position.x = moon.distance;
      return moonMesh;
    };

    // Planet Trails
    const trails = [];
    const trailLength = 150;
    const planetMeshesTrail = []

    

    
    // Display Planets
    const planetMeshes = planets.map((planet) => {
      // create the mesh
      const planetMesh = createPlanet(planet);
      scene.add(planetMesh);

      // loop through each moon create the moon
      planet.moons.forEach((moon) => {
        const moonMesh = createMoon(moon);
        planetMesh.add(moonMesh);
      });

      // Create trail geometry
      const trailGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(trailLength * 3);
      trailGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });

      const trail = new THREE.Line(trailGeometry, trailMaterial);
      scene.add(trail);

      trails.push({ positions, trailGeometry, trail });
      planetMeshesTrail.push(planetMesh);

      
      return planetMesh;
    });

    // Add lights

    // Initialize the Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Update the Renderer Size on Window Resize
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Initialize the Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


  
    let lastCameraPosition = camera.position.clone();
    const fadeText = () => {
      const distanceMoved = lastCameraPosition.distanceTo(camera.position);
      if (distanceMoved > 0.5 || textLabel.material.opacity < 1) {
        textLabel.material.opacity = Math.max(0, textLabel.material.opacity - 0.02);
      }
      lastCameraPosition.copy(camera.position);
    };
    // Animation Loop
    const animate = () => {

      fadeText();

      planetMeshes.forEach((planet, index) => {
        const planetData = planets[index];
        planet.rotation.y += planetData.speed;
        planet.position.x = Math.sin(planet.rotation.y) * planetData.distance;
        planet.position.z = Math.cos(planet.rotation.y) * planetData.distance;

        // loop through each moon
        planet.children.forEach((moon, moonIndex) => {
          const moonData = planetData.moons[moonIndex];
          moon.rotation.y += moonData.speed;
          moon.position.x = Math.sin(moon.rotation.y) * moonData.distance;
          moon.position.z = Math.cos(moon.rotation.y) * moonData.distance;

          
          
        });


         // Update trail
         const trail = trails[index];
         const positions = trail.positions;
         for (let i = (trailLength - 1) * 3; i > 0; i -= 3) {
           positions[i] = positions[i - 3];
           positions[i + 1] = positions[i - 2];
           positions[i + 2] = positions[i - 1];
         }
         positions[0] = planet.position.x;
         positions[1] = planet.position.y;
         positions[2] = planet.position.z;
         trail.trailGeometry.attributes.position.needsUpdate = true;
       
      });

      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <section>
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="threeJS"
        style={{
          backgroundColor: "black",
        }}
      ></canvas>

      {/* Tweakpane UI */}
      <div
        ref={paneRef}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          background: "rgba(0,0,0,0.5)",
          padding: "10px",
          borderRadius: "8px",
        }}
      ></div>
    </section>
  );
};

export { SolarSystemUi };

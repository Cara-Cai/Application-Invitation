import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let camera, scene, renderer;

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 50, 1000);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  // document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("click", onPointerMove);

  const loader = new FontLoader();
  loader.load("helvetiker_bold.typeface.json", function (font) {
    const color = 0x006699;

    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });

    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    //list elements
    const message = "Hi, Welcome to your NYC Experience Invitation";
    const message2 = "  You are to visit MoMA. \n\nModern Museums of Arts";
    const message3 = "           NYU provides free tickets.\n\n                  How do I get them?\n\n    Google 'Free Museum Access NYU'"
    const message4 = "OR \n\nJust click on the tickets and book a free ticket!\n\nScroll down and click Reserve Affiliate Tickets\n\nRemember to bring your ID for free access!";


    const shapes = font.generateShapes(message, 30);
    const shapes2 = font.generateShapes(message2, 10);
    const shapes3 = font.generateShapes(message3, 8);
    const shapes4 = font.generateShapes(message4, 8);

    const geometry = new THREE.ShapeGeometry(shapes);
    const geometry2 = new THREE.ShapeGeometry(shapes2);
    const geometry3 = new THREE.ShapeGeometry(shapes3);
    const geometry4 = new THREE.ShapeGeometry(shapes4);

    geometry.computeBoundingBox();
    geometry2.computeBoundingBox();
    geometry3.computeBoundingBox();
    geometry4.computeBoundingBox();


    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const xMid2 =
      -0.5 * (geometry2.boundingBox.max.x - geometry2.boundingBox.min.x);
      const xMid3 =
      -0.5 * (geometry3.boundingBox.max.x - geometry3.boundingBox.min.x);
      const xMid4 =
      -0.5 * (geometry4.boundingBox.max.x - geometry3.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);
    geometry2.translate(xMid2, 0, 0);
    geometry3.translate(xMid3, 0, 0);
    geometry4.translate(xMid4, 0, 0);
    //area light
    const rectLight = new THREE.RectAreaLight(0x00ff00, 3, 310, 800);

    rectLight.position.set(0, 50, -200);
    rectLight.lookAt(0, 50, 0);
    scene.add(rectLight);
    const rectLightHelper = new RectAreaLightHelper(rectLight);
    scene.add(rectLightHelper);

    const rectLight2 = new THREE.RectAreaLight(0xff0000, 3, 310, 800);
    rectLight2.position.set(-350, 50, -200);
    rectLight2.lookAt(-350, 50, 0);
    scene.add(rectLight2);
    const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
    scene.add(rectLightHelper2);

    const rectLight3 = new THREE.RectAreaLight(0xffff00, 3, 310, 800);
    rectLight3.position.set(350, 50, -200);
    rectLight3.lookAt(350, 50, 0);
    scene.add(rectLight3);
    const rectLightHelper3 = new RectAreaLightHelper(rectLight3);
    scene.add(rectLightHelper3);

    //spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.angle = Math.PI * 0.1;
    spotLight.penumbra = 0.3;
    spotLight.decay = 1;
    spotLight.distance = 300;
    spotLight.position.set(0, 250, 100);
    spotLight.target.position.set(0, 100, 100);
    scene.add(spotLight, spotLight.target);
    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);

    //floor
    const geoFloor = new THREE.BoxGeometry(2000, 0.01, 2000);
    const matStdFloor = new THREE.MeshStandardMaterial({
      color: 0xbcbcbc,
      roughness: 0.1,
      metalness: 0,
    });
    const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
    scene.add(mshStdFloor);

    // make shape ( N.B. edge view not visible )
    //greeting text
    const text = new THREE.Mesh(geometry, matLite);
    text.position.y = 300;
    text.position.z = -150;
    scene.add(text);

    //detail text
    const text2 = new THREE.Mesh(geometry2, matDark);
    text2.position.y = 200;
    text2.position.z = -150;
    scene.add(text2);

    const text3 = new THREE.Mesh(geometry3, matLite);
    text3.position.y = 200;
    text3.position.z = -150;
    text3.position.x = -350;
    scene.add(text3);

    const text4 = new THREE.Mesh(geometry4, matLite);
    text4.position.y = 200;
    text4.position.z = -150;
    text4.position.x = 325;
    scene.add(text4);
    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          const hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }

    shapes.push.apply(shapes, holeShapes);

    const lineText = new THREE.Object3D();

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      const points = shape.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      geometry.translate(xMid, 300, 0);

      const lineMesh = new THREE.Line(geometry, matDark);
      lineText.add(lineMesh);
    }

    scene.add(lineText);

    render();
  }); //end load function

  // //load model
  // const modelloader = new GLTFLoader();

  // modelloader.load('lottery_tickets_and_receipt/scene.gltf', function (gltf) {
  //   const ticket = gltf.scene
  //   ticket.position.set(-10, 100, 100)
  //   ticket.rotateY(90)
  //   scene.add(gltf.scene);

  // });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 5, 0);
  controls.minDistance = 400;
  controls.maxDistance = 1000;

  controls.maxPolarAngle = Math.PI / 2;

  controls.update();

  controls.addEventListener("change", render);

  window.addEventListener("resize", onWindowResize);
} // end init

//load model
const modelloader = new GLTFLoader();

modelloader.load("lottery_tickets_and_receipt/scene.gltf", function (gltf) {
  const ticket = gltf.scene;
  console.log(ticket)
  ticket.position.set(-10, 100, 100);
  ticket.rotateY(90);
  ticket.scale.set(2,2,2);
  ticket.name = "Tickets";
  console.log(ticket);
  scene.add(gltf.scene);
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  
  renderer.render(scene, camera);
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  ticketcollected();
}

function ticketcollected() {
  raycaster.setFromCamera(pointer, camera);
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects);
  // console.log(scene)

  // if ( intersects.length > 0 && intersects[0].object.name ==="Tickets") {

  //   console.log("Tickets are clicked")
  //       // window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
  // }

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name === "defaultMaterial") {
      window.open('https://tickets.moma.org/orders/198/calendar?cart=true&eventId=60a3f702deb5fe0c5ac0cde4&ticketsaffiliate=1699315444&_gl=1*60etxs*_ga*NTQwNTAyMzg4LjE2OTkyMTU2Nzk.*_ga_8QY3201SLC*MTY5OTMxNTIxNC4yLjEuMTY5OTMxNTQ0Ny41Ny4wLjA.&_ga=2.86070168.1631737612.1699315214-540502388.1699215679&_gac=1.178465424.1699215689.EAIaIQobChMI6Yui1NetggMVRNbICh189wZJEAAYASACEgIGSfD_BwE', '_blank');
    }
  }
}

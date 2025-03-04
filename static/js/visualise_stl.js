function initViewer(containerId, stlPath) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 200);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    scene.add(new THREE.AmbientLight(0x888888));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    const loader = new THREE.STLLoader();
    loader.load(stlPath, function(geometry) {
      geometry.center();
      const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(1000, 1000, 1000);
      scene.add(mesh);
      controls.target.copy(mesh.position);
    });
    
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }


function initViewerObjPly(containerId, objPath1, objPath2, plyPath) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x202020);
  scene.background = new THREE.Color(0xffffff);


  // Create camera
  const camera = new THREE.PerspectiveCamera(
    5,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set( 0.09564545842054463  ,  3.2012337552481345  ,  -0.003577559494795382 );
  camera.up.set(0,0,1);
  

  // Create renderer and attach to container
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add lighting
  scene.add(new THREE.AmbientLight(0x888888,  0.8));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true
  
  
  // Load the OBJ model1
  const objLoader1 = new THREE.OBJLoader();
  objLoader1.load(objPath1, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({ color: 0x8a8a8d });
      }
    });

    scene.add(obj);

  });


  // Load the OBJ model1
  const objLoader2 = new THREE.OBJLoader();
  objLoader2.load(objPath2, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({ color: 0xe0ac69 });
      }
    });

    scene.add(obj);

  });



  // Load the PLY model
  const plyLoader = new THREE.PLYLoader();
  plyLoader.load(plyPath, (geometry) => {
    // No need to compute vertex normals when rendering points.
    geometry.computeBoundingBox();
  
    // Create a PointsMaterial.
    const material = new THREE.PointsMaterial({
      size: 0.03,         
      color: 0x002fff,
      vertexColors: geometry.hasAttribute('color')
    });
  
    // Create a Points object instead of a Mesh.
    const points = new THREE.Points(geometry, material);
    scene.add(points);
  
    // Set OrbitControls target to the center of the bounding box.
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    controls.target.copy(center);
  });
  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // console.log(camera.position);
  }
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}
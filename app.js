let scene;
let camera;
let renderer;
let earthmesh;
let dragControls;

function main() {
    const canvas = document.querySelector('#c');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // Earth geometry and material
    const earthgeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const eatrhmaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: new THREE.TextureLoader().load('texture/earthmap1k.jpg'),
        bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpg'),
        bumpScale: 0.3,
    });

    earthmesh = new THREE.Mesh(earthgeometry, eatrhmaterial);
    scene.add(earthmesh);

    // Ambient light
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    // Point light
    const pointerlight = new THREE.PointLight(0xffffff, 0.9);
    pointerlight.position.set(5, 3, 5);
    scene.add(pointerlight);

    // Star geometry and material
    const stargeometry = new THREE.SphereGeometry(80, 64, 64);
    const starmaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('texture/galaxy.png'),
        side: THREE.BackSide,
    });

    const starmesh = new THREE.Mesh(stargeometry, starmaterial);
    scene.add(starmesh);

    // Setting up OrbitControls for camera rotation
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // DragControls setup for Earth mesh
    dragControls = new THREE.DragControls([earthmesh], camera, renderer.domElement);

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    dragControls.addEventListener('dragstart', (event) => {
        // When dragging starts, record the current mouse position
        isDragging = true;
    });

    dragControls.addEventListener('drag', (event) => {
        if (isDragging) {
            // Calculate the difference in mouse movement
            const deltaX = event.object.position.x - lastX;
            const deltaY = event.object.position.y - lastY;

            // Apply rotation based on mouse movement
            earthmesh.rotation.y += deltaX * 0.5; // Adjust the multiplier to control speed
            earthmesh.rotation.x += deltaY * 0.5; // Adjust the multiplier to control speed

            // Update last mouse position
            lastX = event.object.position.x;
            lastY = event.object.position.y;
        }
    });

    dragControls.addEventListener('dragend', (event) => {
        // When dragging ends, reset dragging state
        isDragging = false;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        render();
    };

    const render = () => {
        renderer.render(scene, camera);
    };

    animate();

    // Handle resizing for responsiveness
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

window.onload = main;

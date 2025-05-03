// Loading Screen Animation
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  const progressBar = document.querySelector('.progress-bar');
  const stats = document.querySelectorAll('.stat i');
  
  // Simulate loading
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 1000);
  }, 4000); // Total loading time: 4 seconds
});

let scene, camera, renderer, particles, ships = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Create particles (stars)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 10000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00FFFF,
        size: 1,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create Star Wars ships
    createShips();
    
    camera.position.z = 1000;
}

function createShips() {
    const shipTypes = [
        { color: 0x00FFFF, size: 20 }, // Type 1
        { color: 0x00CCCC, size: 15 }, // Type 2
        { color: 0x00EEEE, size: 25 }  // Type 3
    ];

    for (let i = 0; i < 10; i++) {
        const type = shipTypes[Math.floor(Math.random() * shipTypes.length)];
        const geometry = new THREE.BoxGeometry(type.size, type.size, type.size);
        const material = new THREE.MeshBasicMaterial({ 
            color: type.color,
            transparent: true,
            opacity: 0.8
        });
        
        const ship = new THREE.Mesh(geometry, material);
        
        // Random position
        ship.position.x = Math.random() * 2000 - 1000;
        ship.position.y = Math.random() * 2000 - 1000;
        ship.position.z = Math.random() * 2000 - 1000;
        
        // Random rotation
        ship.rotation.x = Math.random() * Math.PI;
        ship.rotation.y = Math.random() * Math.PI;
        
        // Random speed
        ship.userData = {
            speed: {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            }
        };
        
        scene.add(ship);
        ships.push(ship);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    
    // Move ships
    ships.forEach(ship => {
        ship.position.x += ship.userData.speed.x;
        ship.position.y += ship.userData.speed.y;
        ship.position.z += ship.userData.speed.z;
        
        // Wrap around when ships go out of bounds
        if (Math.abs(ship.position.x) > 1000) ship.position.x = -ship.position.x;
        if (Math.abs(ship.position.y) > 1000) ship.position.y = -ship.position.y;
        if (Math.abs(ship.position.z) > 1000) ship.position.z = -ship.position.z;
        
        // Rotate ships
        ship.rotation.x += 0.01;
        ship.rotation.y += 0.01;
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Terminal Button Functionality
const terminalBtn = document.querySelector('.terminal-btn');
const commands = ['system.exe', 'access.dll', 'scan.sys', 'hack.bat'];
let currentCommand = 0;

terminalBtn.addEventListener('click', () => {
  // Add glitch effect
  terminalBtn.classList.add('glitch');
  setTimeout(() => {
    terminalBtn.classList.remove('glitch');
  }, 300);
  
  // Change command text
  const typingText = terminalBtn.querySelector('.typing-text');
  currentCommand = (currentCommand + 1) % commands.length;
  
  // Reset the animation by removing and re-adding the element
  const newTypingText = document.createElement('span');
  newTypingText.className = 'typing-text';
  newTypingText.textContent = commands[currentCommand];
  
  typingText.parentNode.replaceChild(newTypingText, typingText);
  
  // Easter egg: Change background particle colors
  const particleMaterial = particles.material;
  const colors = [0x00FFFF, 0xFF00FF, 0x00FF00, 0xFFFF00];
  particleMaterial.color.setHex(colors[currentCommand]);
  
  // Random ship movement burst
  ships.forEach(ship => {
    const randomFactor = Math.random() * 5 + 2;
    ship.userData.speed.x *= randomFactor;
    ship.userData.speed.y *= randomFactor;
    ship.userData.speed.z *= randomFactor;
    
    // Reset speeds after 2 seconds
    setTimeout(() => {
      ship.userData.speed.x /= randomFactor;
      ship.userData.speed.y /= randomFactor;
      ship.userData.speed.z /= randomFactor;
    }, 2000);
  });
});

init();
animate(); 
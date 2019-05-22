

function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function toggleInfo(){
    var infoWindow = document.getElementById('infowindow');
    if(!infoWindow.style.display || infoWindow.style.display == 'none'){
        infoWindow.style.display = 'block';
    }
    else{
        infoWindow.style.display = 'none';
    }
};

function init(){
    var fps = 10;
    var now;
    var then = Date.now();
    var interval = 1000/fps;
    var delta; 
    var isplaying = true;

    var stepcount = document.getElementById('count');
    var toggleBtn = document.getElementById('toggle');
    var stepBtn = document.getElementById('step'); 
    var clearBtn = document.getElementById('clear'); 
    var randomBtn = document.getElementById('random'); 


    toggleBtn.addEventListener('mousedown', function(e){
        isplaying = !isplaying;
    });
    stepBtn.addEventListener('mousedown', function(e){
        game.step();
        stepcount.innerHTML = game.round;
    });
    clearBtn.addEventListener('mousedown', function(e){
        isplaying = false;
        game.clear();
        game.round = 0;
        stepcount.innerHTML = game.round;
    });
    randomBtn.addEventListener('mousedown', function(e){
        isplaying = false;
        game.randomize();
        game.round = 0;
        stepcount.innerHTML = game.round;
    });

    var canvas = document.getElementById('game');
    var game = new Game(canvas, {
        cellColor:'#aaffe5', 
        cellsX:100, 
        cellsY:100, 
        cellSize:10, 
        gridColor:'#FFFFFF', 
        bgColor:'#000'}
        );
    
    game.randomize();

    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });

    renderer.setClearColor( 0x000000, 0 ); 

    stepcount.innerHTML = game.round;

   

    
    var domEl = document.getElementById('threecontainer');

    renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
    domEl.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera( 55, domEl.offsetWidth / domEl.offsetHeight, 0.01, 400 ); 
    var scene = new THREE.Scene();

    var texture = new THREE.Texture(canvas);
    var cubegeometry = new THREE.BoxGeometry(70,70,70);
    var cubematerial = new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        map:texture
    });

    var cube = new THREE.Mesh(cubegeometry, cubematerial);
   
    var ambientlight = new THREE.AmbientLight(0xffffff, .4);
    var light = new THREE.PointLight( 0xffffff, 1 );
   // light.castShadow = true;
    light.position.set(45,90,140);
    
    camera.position.set(0,0,140);
    scene.add(cube);
    scene.add(light);
    scene.add(ambientlight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enableZoom = true;
    controls.autoRotate = false;
  
    var animate = function(){
        texture.needsUpdate = true;
        frameID = requestAnimationFrame( animate );
        now = Date.now();
        delta = now - then;
        renderer.render( scene, camera );
        cube.rotation.x += .003;
        cube.rotation.y -= .003;
        cube.rotation.z += .001;
        if (delta > interval) {
            
            if (isplaying){
                game.step();
                toggleBtn.innerHTML = 'Stop';
                stepcount.innerHTML = game.round;
                
            }
            else{
                toggleBtn.innerHTML = 'Start';
            }
            then = now - (delta % interval);

        }
    }

    animate();

};

window.onload = init;

var container, scene, light, camera, renderer, mesh, controls, colors;

function draw(name) {
  var points = window.points[name];

  if(mesh) {
    scene.remove(mesh);
  }

  var xSegs = dimensions(points, function(x) { return x[0]; });
  var ySegs = dimensions(points, function(x) { return x[1]; });

  var geometry = new THREE.PlaneGeometry(200, 200, xSegs - 1, ySegs - 1);
  for (var i = 0, l = geometry.vertices.length; i < l; i++) {
    geometry.vertices[i].z = points[i][2];
  }

  var material = new THREE.MeshPhongMaterial({
    color: 0xdddddd, wireframe: true,
    vertexColors : THREE.VertexColors
  });

  for (var i = 0; i < geometry.faces.length; i++) {
    var face = geometry.faces[i];
    var vertexA = geometry.vertices[face.a];
    face.color.setHex(parseInt(colors.colorAt(-vertexA.z), 16));
  }

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  controls.reset();
  camera.position.set(0, -200, 30);
  mesh.position.z = 20;
  mesh.rotation.z = -0.8;
}

function init() {

  container = document.getElementById('webgl');

  console.log(container);
  var width  = container.clientWidth
    , height = window.innerHeight;

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xeeeeee));

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  controls = new THREE.TrackballControls(camera);
  container.appendChild(renderer.domElement);

  colors = new Rainbow();
  colors.setSpectrum('#1a820f', '#1c3cdf', '#960ffe');
  colors.setNumberRange(0, 40);

  animate();
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function dimensions(points, func) {
  return _.uniq(_.map(points, func)).length;
}

init();


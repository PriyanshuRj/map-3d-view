var panorama, viewer, container, infospot, infospot2;

container = document.querySelector('#container');

panorama = new PANOLENS.ImagePanorama('../assets/HMTpano_000001_000000.jpg');

$(document).ready(function () {
    viewer = new PANOLENS.Viewer({
        container: container
      });
      viewer.add(panorama);
})


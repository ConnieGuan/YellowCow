$('#PhotoButton').click(function() {
  $('#PhotoPicker').trigger('click');
  return false;
});

$('#PhotoPicker').on('change', function(e) {
  e.preventDefault();
  if(this.files.length === 0) return;

  function el(id){return document.getElementById(id);} // Get elem by ID

  var canvas  = el("myCanvas");
  var context = canvas.getContext("2d");

  var tf = this.files;

  function readImage(theFile) {
    if ( theFile && theFile[0] ) {
    var FR= new FileReader();
     FR.onload = function(e) {
       var img = new Image();
       img.onload = function() {
         context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
       };
      img.src = e.target.result;
    };       
    FR.readAsDataURL( theFile[0] );
    }
  }

  el("PhotoPicker").addEventListener("change", readImage(tf), false);
});


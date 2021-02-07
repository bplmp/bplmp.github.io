$(document).ready(function() {
  $(".project").on('click', function(e){
    $(this).find(".carousel").carousel('cycle')
  });
});

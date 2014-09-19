function loadData(){
  var chartlist = JSON.parse($.cookie('ChartList'));
  console.log(chartlist);
  // if (!chartlist || !chartlist.length) {}
  if (chartlist!==undefined || !chartlist.length) {
    chartlist.forEach(
      function(value,index){
        var chart = {
          request : 'chart',
          id : value.id,
        }
        var postData = JSON.stringify(chart);
        $.ajax({
          url:'/history/history-detail',
          type:'POST',
          contentType : 'application/json',
          dataType: 'json',
          data:postData,
          success: function (data, status){
            console.log(data);
            $(".swiper-wrapper").append('<div class="swiper-slide"><img src="' + data.image.img +'"/></div>');
          },
          error: function (data, status, e){
            // alert(e);
            console.log(e);
          }
        });
      }
    );
  }

  var mdlist = JSON.parse($.cookie('MarkdownList'));
  console.log(mdlist);
  mdlist.forEach(
      function(value,index){
        $(".slides").append('<section data-markdown><script type="text/template">'+ mdlist[index].data + '</'+'script></section>');       
      }
    );

  if (mdlist!==undefined && mdlist.length) {
    // console.log('initialize aaa');
    Reveal.initialize({
      width: 900,
      height: 540,
      margin: 0.5,
      minScale: 1.0,
      maxScale: 1.0,
      center: true,
      transition: 'liner',
      transitionSpeed: 'fast',
      backgroundTransition: 'slide',

      dependencies: [
        { src: '/js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: '/js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        ]  
    });
  }

  var sketchlist = JSON.parse($.cookie('SketchList'));  
  var childrenList = $(".slides").children();
  sketchlist.forEach(
      function(value,index){
        var sketch = {
          request : 's',
          id : value.id,
        }
        var postData = JSON.stringify(sketch);
        $.ajax({
          url:'/history/history-detail',
          type:'POST',
          contentType : 'application/json',
          dataType: 'json',
          data:postData,
          success: function (data, status){
            $(childrenList[index]).append('<img class="sketch-cover" src="'+ 
              lzw_uncompress(data.image.img) + '"/>');
          },
          error: function (data, status, e){
            alert(e);
          }
        });
      }
  );              

}

function lzw_uncompress(s) {
    var dict = {};
    var data = (s + "").split("");
    // console.log(data);
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            // case (oldPhrase + currChart) for utf-8 character encode in two integers
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}



$(document).ready(function(){
  loadData();
  if (document.body.offsetWidth < 1320) {
    $("body").css("zoom",document.body.offsetWidth/1320);
  }
  var btnStatus = true;
  $(".btn-close").click(function(){
    if (btnStatus) {
      $(".sketch-cover").css("visibility","hidden");
      $(".btn-close")[0].innerHTML = "+";
      btnStatus = false;
    } else {
      $(".sketch-cover").css("visibility","visible");
      $(".btn-close")[0].innerHTML = "×";
      btnStatus = true;
    }
  });
  $(".btn-back").click(function(){
    window.location.href = "/history";
  });

  //chart slide
var mySwiper = new Swiper('.swiper-container',{
    pagination: '.pagination',
    paginationClickable: true,
    mode: 'vertical',
    freeMode: true,
  });
});

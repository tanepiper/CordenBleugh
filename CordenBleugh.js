/*
  CordenBleugh - based on SHAVED BIEBER
  Bookmarklet, Firefox extension, and inline code to clean up those lower regions
  of websites from Bieber mentions.

  by Greg Leuch <http://www.gleuch.com>

  MIT License - http://creativecommons.org/licenses/MIT

  ------------------------------------------------------------------------------------
 
*/

Array.prototype.in_array = function(p_val, sensitive) {for(var i = 0, l = this.length; i < l; i++) {if ((sensitive && this[i] == p_val) || (!sensitive && this[i].toLowerCase() == p_val.toLowerCase())) {return true;}} return false;};
function rgb2hex(rgb) {rgb = rgb.replace(/\s/g, "").replace(/^(rgb\()(\d+),(\d+),(\d+)(\))$/, "$2|$3|$4").split("|"); return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);} 
function hex(x) {var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"); return isNaN(x) ? "00" : hexDigits[(x-x%16)/16] + hexDigits[x%16];}

var $_ = false, $CordenBleugh = document.createElement('script'), local = true;
$CordenBleugh.src = 'http://assets.gleuch.com/jquery-latest.js';
$CordenBleugh.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild($CordenBleugh);


function CordenBleugh_wait() {
  if ((local && typeof(jQuery) == 'undefined') || (!local && typeof(unsafeWindow.jQuery) == 'undefined')) {
    window.setTimeout(CordenBleugh_wait,100);
  } else {
    CordenBleugh_start(local ? jQuery : unsafeWindow.jQuery);
  }
}

function CordenBleugh_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.CordenBleugh = function(data, c) {
      if (!$_.CordenBleugh.settings.finish) $_.CordenBleugh.init();
      $_(data).CordenBleugh(c);
      if (!$_.CordenBleugh.settings.finish) $_.CordenBleugh.finish();
    };
 
    $_.fn.CordenBleugh = function(c) {
      return this.filter(function() {return $_.CordenBleugh.filter(this);}).each(function() {$_.CordenBleugh.shave(this, c);});
    };

    $_.extend($_.CordenBleugh, {
      settings : {hide_bg : true, search: /(james(\s|\-|\_)?)?(corden|corden)/img, replace: '<span class="CordenBleugh" style="color: %C; background-color: %C;">$1$2$3$4$5</span>', starred: '****** ******', init : false, finish : false},

      pluck : function(str) {return str.replace(/(james\s)(corden|corden)/img, '****** ******').replace(/(james\s)(corden|corden)/img, '****** **** ******').replace(/(corden|corden)/img, '******');},

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !(self.className.match('CordenBleugh') || tag == 'head' || tag == 'img' || tag == 'textarea' || tag == 'option' || tag == 'style' || tag == 'script');
        } else {
          return true;
        }
      },

      shave : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '') != '') {
            if (!c) c = $_(self).parent() ? $_(self).parent().css('color') : '#000000';
            text = self.nodeValue.replace($_.CordenBleugh.settings.search, $_.CordenBleugh.settings.replace.replace(/\%C/mg, c) );
            $_(self).after(text);
            self.nodeValue = '';
          }
        } else if (self.nodeType == 1) {
          c = rgb2hex($_(self).css('color'));
          if ($_(self).children().length > 0) {
            $_.CordenBleugh($_(self).contents(), c);
          } else if ($_(self).children().length == 0) {
            text = $_(self).html().replace($_.CordenBleugh.settings.search, $_.CordenBleugh.settings.replace.replace(/\%C/mg, c) );
            $_(self).html(text);
          }
        }
      },

      init : function() {
        $_.CordenBleugh.settings.init = true;
      },

      finish : function() {
        $_(document).each(function() {this.title = $_.CordenBleugh.pluck(this.title);});

        $_('img, input[type=image]').each(function() {
          if ($_(this).attr('alt').match($_.CordenBleugh.settings.search) || $_(this).attr('title').match($_.CordenBleugh.settings.search) || $_(this).attr('src').match($_.CordenBleugh.settings.search)) {
            var r = $_(this), w = r.width(), h = r.height(), c = rgb2hex($_(this).css('color'));
            r.css({background: c, width: r.width(), height: r.height()}).attr('src', 'http://assets.gleuch.com/blank.png').width(w).height(h);
          }
        });

        $_('input[type=text]').each(function() {if ($_(this).val().match($_.CordenBleugh.settings.search) ) $_(this).val( $_.CordenBleugh.pluck($_(this).val()) );});
        $_('textarea, option').each(function() {if ($_(this).html().match($_.CordenBleugh.settings.search) ) $_(this).html( $_.CordenBleugh.pluck($_(this).html()) );});

        var s = document.createElement("style");
        s.innerHTML = ".CordenBleugh {font-size: inherit !important; "+ ($_.CordenBleugh.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_CordenBleugh {"+ ($_.CordenBleugh.settings.hide_bg ? "background-image: none !important;" : "") +"}";
        $_('head').append(s);

        $_.CordenBleugh.settings.finish = true;
      }
    });
  })($_);
  
  $_.CordenBleugh('html', '#000000');
}


if (typeof($_scruff) == 'undefined' || !$_scruff) {CordenBleugh_wait();}
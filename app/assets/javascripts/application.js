window.refresh_events = () => {
  // trigger refersh events on ajax complete
  $(document).off("ajaxSuccess").ajaxSuccess(refresh_events);
  // check for limited version
  if(_g('limited_version'))
    $('.limited_version').html('<span class="font-24 red-text">{ نسخه محدود }</span>')
  // set moment.js locale
  moment.locale('fa');
  // catch links with valid links and relocate the window as desired!
  $('a[href]:not([href^="#"])').off('click').on('click', (e) => {
    e.preventDefault();
    goto($(e.target).attr('href'))
  })
  // make img clickables
  $('img.clickable').off('click').on('click', (e) => {
    e.preventDefault()
    $('body .image-display').remove()
    $('body').addClass('noscrollx').append(`<div class="image-display" onclick="$(this).trigger('close')">
      <img src="${$(e.target).attr('src')}" onclick="event.stopPropagation()"/>
      <a href=#! class="btn red" onclick="$(this).closest('.image-display').trigger('close'); return false"><span class='fa fa-times'></span></a>
    </div>`)
    $('.image-display').off('close').on('close', function() {
      $(this).remove()
      $('body').removeClass('noscroll')
    })
  })
  // force to reset the form on btn[reset] clicks
  $('form [type=reset]').click((e) => { $(e.target).closest('form')[0].reset() })
  // on every form's submit
  $('form').off('submit').on('submit', function(e) {
    e.preventDefault()
    e.stopPropagation()
    // fetch the form's submit
    let data = $(this).serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
    // load uploading files data if there is any?
    if($(this).find('input[type="file"]').length) {
      // for each file inputs
      $(this).find('input[type="file"]').each(function() {
        // if any name defined for it?
        if($(this).attr('name')) {
          // fetch the basic name
          name = $(this).attr('name')
          // if uploading multiple files?
          if(this.files.length > 1) {
            // normalize the name of input (i.e remove the trailing `[]` from the name)
            name = name.replace(/\[\s*\]$/, "")
            // create an array to form data related to the input's name
            data[name] = []
            // for each uploading file
            for(var file of this.files)
              // read the file and push it to the array
              data[name].push(read_file(file.path))
          // if uploading a single file?
          } else if (this.files.length === 1) {
            // read only the uploaded file
            data[name] = read_file(this.files[0].path)
          }
        }
      })
    }
    // append the action should be taken to the data
    send_request($(this).attr('action'), data, $(this).attr('callback'), true)
    // reset after submit!
    $(this)[0].reset()
    // prevent form to really submit
    return false
  });
  // give some time to dom to be completely loaded
  setTimeout(() => {
    // auto-resize all textarea
    autosize($('textarea'));
    // init all modals of current done
    window.modals = M.Modal.init(document.querySelectorAll('.modal'), { onOpenEnd: () => { $('.modal.open [autofocus]').focus() } });
    // init all pushpins
    window.pushpins = M.Pushpin.init(document.querySelectorAll('.pushpin'), { });
    // init all selects
    window.selects = M.FormSelect.init(document.querySelectorAll('select'), { });
    // enable row-bundled table highlighting
    $('table.highlight-bundled > tbody > tr[row-id]').hover(function() {
      $(this)
        .closest('tbody')
        .find('tr[row-id="' + $(this).attr('row-id') + '"]')
        .css('background', '#e7e7e7')
    }, function() {
      $(this)
        .closest('tbody')
        .find('tr[row-id="' + $(this).attr('row-id') + '"]')
        .css('background', 'unset')
    })
    $("input[type=text].date")
      .off('keydown').on('keydown', function(e) {
        if((e.originalEvent.ctrlKey && e.originalEvent.code === "KeyA") ||
            ['ArrowLeft', 'ArrowRight', 'Backspace', 'End', 'Home', 'Delete'].includes(e.originalEvent.code))
          return true
        if({ 8: 'escape', 9: 'tab', 13: 'enter', 16: 'shift', 17: 'control', 18: 'alt' }[e.keyCode])
          return true
        var val = to_latin_numeric($(this).val() + e.key)
        if(val.length < 5)
          return val.match(/^1(3(9[7-9]?)?|4\d?\d?)?$/g) !== null
        else if (val.length < 8)
          return val.match(/^1(39[7-9]|4(\d{2}))[\/\- ](0[1-9]?|1[0-2]?)?$/g) !== null
        else
          return val.match(/^1(39[7-9]|4(\d{2}))[\/\- ](0[1-9]?|1[0-2])[\/\- ](0[1-9]?|1[0-9]?|2[0-9]?|3[0-1]?)?$/g) !== null
      })
  }, 500)
}

$(document).ready(function() {
  // prevent accidentally overflow setting on body
  $('body').css('overflow', '')
  // refresh events for current documents
  refresh_events()
});

window.refresh_events = () => {
  // trigger refersh events on ajax complete
  $(document).off("ajaxSuccess").ajaxSuccess(refresh_events);
  // set moment.js locale
  moment.locale('fa');
  // catch links with valid links and relocate the window as desired!
  $('a[href]:not([href^="#"])').off('click').on('click', (e) => {
    e.preventDefault();
    goto($(e.target).attr('href'))
  })
  // force to reset the form on btn[reset] clicks
  $('form [type=reset]').click((e) => { $(e.target).closest('form')[0].reset() })
  // force to submit on btn[submit] clicks
  $('form [type=submit]').click((e) => { $(e.target).closest('form').submit() })
  // on every form's submit
  $('form').off('submit').on('submit', function(e) {
    e.preventDefault()
    e.stopPropagation()
    // fetch the form's submit
    let data = $(this).serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
    // append the action should be taken to the data
    send_request($(this).attr('action'), data, $(this).attr('callback'))
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
  }, 500)
}

$(document).ready(refresh_events);

$(document).ready(function () {

  //=====tooltip======

  $(document).mouseup(function (e){

    $('.tooltip-button').on('click', function () {
      $('.tooltip-helper').toggleClass('show');
    });

    const helperEl = $(".tooltip-helper");
      if (!helperEl.is(e.target)
        && helperEl.has(e.target).length === 0) {
        helperEl.removeClass('show');
      }
  });


  // ======Form Validation=======

  const paymentForm = $('.payment-form');
  const paymentFormElements = paymentForm.find('.form-control');

  const removeTooltipError = () => {
    paymentFormElements.removeClass('payment-form__error')
  };
  const removeErrors = () => $(paymentFormElements).each((i, field) => {
    field.classList.remove('payment-form__error');
    $(field).parsley().reset()
  });

  const removeErrorOnClickOutside = (e) => {
    if (!e.target.classList.contains('payment-form__error') && !e.target.classList.contains('form-control')) {
      removeErrors();
    }
  };

  const validateInput = (el) => {
    const inp = $(el);
    inp.parsley().validate();
    removeTooltipError();
    inp.addClass('payment-form__error')
  };

  $(paymentFormElements).each((i, field) => {
    const currentField = $(field);

    currentField.keydown(e => {
      if (e.keyCode === 9) {
        validateInput(currentField);
      }

      if (e.keyCode === 13) {
        e.preventDefault();
        validateInput(currentField);
      }
    });
  });

  paymentForm.on('submit', (e) => {
    e.preventDefault();
    let isErrors = false;

    $(paymentFormElements).each((i, field) => {
      const isFieldValid = $(field).parsley().isValid();

      validateInput(field);

      if (!isFieldValid) {
        isErrors = true;
        return false
      }
    });

    if (!isErrors) {
      paymentFormSubmit();
    }
  });

  document.addEventListener('click', removeErrorOnClickOutside);

  const paymentFormSubmit = () => {
    $.ajax({
      type: 'POST',
      url: paymentForm.attr('action'),
      data: paymentForm.serialize(),

      success: function (data) {
        console.log('form submitted successfully');
        console.log(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      },
      complete: function (data) {
        paymentFormElements.val('');
        removeErrors();
      }
    });
  }
});


define(
    [
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/customer-data',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/full-screen-loader',
        'Fintecture_Payment/js/form/form-builder',
        'Magento_Ui/js/modal/alert',
        'mage/translate'
    ],
    function ($, quote, customerData,customer, fullScreenLoader, formBuilder,alert, translate) {
        'use strict';

        return function (messageContainer) {
            var serviceUrl,
                email,
                form;

            if (!customer.isLoggedIn()) {
                email = quote.guestEmail;
            } else {
                email = customer.customerData.email;
            }

            serviceUrl = window.checkoutConfig.payment.fintecture.redirectUrl+'?email='+email;
            fullScreenLoader.startLoader();

            $.ajax(
                {
                    url: serviceUrl,
                    type: 'post',
                    context: this,
                    data: {isAjax: 1},
                    dataType: 'json',
                    success: function (response) {
                        if ($.type(response) === 'object' && !$.isEmptyObject(response)) {
                            $('#fintecture_payment_form').remove();
                            form = formBuilder.build(
                                {
                                    action: response.url
                                }
                            );
                            customerData.invalidate(['cart']);
                            form.submit();
                        } else {
                            fullScreenLoader.stopLoader();
                            alert(
                                {
                                    content: translate('Sorry, something went wrong. Please try again.')
                                }
                            );
                        }
                    },
                    error: function (response) {
                        fullScreenLoader.stopLoader();
                        alert(
                            {
                                content: translate('Sorry, something went wrong. Please try again later.')
                            }
                        );
                    }
                }
            );
        };
    }
);



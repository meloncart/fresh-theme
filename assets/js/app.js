import registerAlertDialog from './controls/alert-dialog.js';
import registerPasswordDialog from './controls/password-dialog.js';
import registerGallerySlider from './controls/gallery-slider.js';
import registerCardSlider from './controls/card-slider.js';
import registerQuantityInput from './controls/quantity-input.js';
import registerCatalogForm from './controls/catalog-form.js';
import registerCheckoutForm from './controls/checkout-form.js';
import registerProductForm from './controls/product-form.js';
import registerPriceSlider from './controls/price-slider.js';
import registerStarRating from './controls/star-rating.js';
import registerSearchAutocomplete from './controls/search-autocomplete.js';
import registerCartFlyout from './controls/cart-flyout.js';
import registerCartPage from './controls/cart-page.js';

// Register controls
registerAlertDialog();
registerPasswordDialog();
registerGallerySlider();
registerCardSlider();
registerQuantityInput();
registerCatalogForm();
registerCheckoutForm();
registerProductForm();
registerPriceSlider();
registerStarRating();
registerSearchAutocomplete();
registerCartFlyout();
registerCartPage();

addEventListener('render', function() {
    // Auto Collapsed List
    document.querySelectorAll('ul.bullet-list li.active').forEach(function(activeLi) {
        var parent = activeLi.closest('ul.collapse');
        while (parent) {
            parent.classList.add('show');
            var caret = parent.previousElementSibling;
            while (caret && !caret.classList.contains('collapse-caret')) {
                caret = caret.previousElementSibling;
            }
            if (caret) {
                caret.classList.remove('collapsed');
            }
            parent = parent.parentElement.closest('ul.collapse');
        }
    });

    // Tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(el) {
        new bootstrap.Tooltip(el);
    });

    // Popovers
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el) {
        if (el.dataset.contentTarget) {
            var targetEl = document.querySelector(el.dataset.contentTarget);
            var popover = new bootstrap.Popover(el, { html: true, content: targetEl });
            el.addEventListener('shown.bs.popover', function() {
                var input = targetEl.querySelector('input');
                if (input) {
                    input.focus();
                }
            });
        }
        else {
            new bootstrap.Popover(el);
        }
    });
});

// Makes the mini cart jump when an update is detected
addEventListener('ajax:update-complete', function(event) {
    const { handler } = event.detail.context;
    if (['onRemoveFromCart', 'onAddToCart'].includes(handler)) {
        var el = document.querySelector('#miniCart');
        if (el) {
            el.classList.remove('animate-shockwave');
            void el.offsetWidth;
            el.classList.add('animate-shockwave');
            setTimeout(function() { el.classList.remove('animate-shockwave'); }, 800);
        }
    }
});

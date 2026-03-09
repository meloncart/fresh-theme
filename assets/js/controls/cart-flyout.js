class CartFlyout extends oc.ControlBase {
    init() {
        this.handler = this.config.handler;
        this.offcanvasEl = this.element.closest('.offcanvas');
        this.updateTimer = null;
    }

    connect() {
        if (this.offcanvasEl) {
            this.onShowBound = this.onShow.bind(this);
            this.offcanvasEl.addEventListener('show.bs.offcanvas', this.onShowBound);
        }

        this.listen('change', '.quantity-field', this.onQuantityChange);
    }

    disconnect() {
        if (this.offcanvasEl && this.onShowBound) {
            this.offcanvasEl.removeEventListener('show.bs.offcanvas', this.onShowBound);
            this.onShowBound = null;
        }

        clearTimeout(this.updateTimer);
    }

    async onShow() {
        await oc.request(this.element, this.handler);
    }

    onQuantityChange() {
        this.element.classList.add('is-updating');

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(async () => {
            await oc.request(this.element, 'onUpdateCart', {
                update: {
                    'shop-checkout/cart-flyout-content': '#cartFlyoutContent',
                    'shop-checkout/mini-cart': '#miniCart'
                }
            });
            this.element.classList.remove('is-updating');
        }, 600);
    }
}

export default function() {
    oc.registerControl('cart-flyout', CartFlyout);
}

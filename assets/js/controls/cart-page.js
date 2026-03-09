class CartPage extends oc.ControlBase {
    init() {
        this.updateTimer = null;
    }

    connect() {
        this.listen('change', '.quantity-field', this.onQuantityChange);
    }

    disconnect() {
        clearTimeout(this.updateTimer);
    }

    onQuantityChange() {
        this.element.classList.add('is-updating');

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(async () => {
            await oc.request(this.element, 'onUpdateCart', {
                update: {
                    'shop-checkout/cart-view': '#cartPartial',
                    'shop-checkout/mini-cart': '#miniCart'
                }
            });
            this.element.classList.remove('is-updating');
        }, 600);
    }
}

export default function() {
    oc.registerControl('cart-page', CartPage);
}

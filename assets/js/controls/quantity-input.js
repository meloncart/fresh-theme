class QuantityInput extends oc.ControlBase {
    connect() {
        this.$qty = this.element.querySelector('input.quantity-field');
        this.listen('click', '.button-plus', this.onIncrementValue);
        this.listen('click', '.button-minus', this.onDecrementValue);
    }

    disconnect() {
        this.$qty = null;
    }

    onIncrementValue(ev) {
        ev.preventDefault();
        var value = parseInt(this.$qty.value, 10);
        if (isNaN(value)) {
            value = 0;
        }

        var max = parseInt(this.$qty.max, 10);
        value++;

        if (!isNaN(max) && value > max) {
            value = max;
        }

        this.$qty.value = value;
        this.$qty.dispatchEvent(new Event('change', { bubbles: true }));
    }

    onDecrementValue(ev) {
        ev.preventDefault();
        var value = parseInt(this.$qty.value, 10);
        if (isNaN(value)) {
            value = 0;
        }

        var min = parseInt(this.$qty.min, 10);
        value--;

        if (!isNaN(min)) {
            value = Math.max(value, min);
        }
        else {
            value = Math.max(value, 0);
        }

        this.$qty.value = value;
        this.$qty.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

export default function() {
    oc.registerControl('quantity-input', QuantityInput);
}

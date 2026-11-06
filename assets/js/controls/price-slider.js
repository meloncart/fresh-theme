import noUiSlider from '../../vendor/nouislider/nouislider.esm.js';

class PriceSlider extends oc.ControlBase {
    init() {
        this.sliderEl = this.element.querySelector('[data-price-range-slider]');
        this.valueEl = this.element.querySelector('[data-price-range-text]');
        this.minInput = this.element.querySelector('[data-filter-price-min]');
        this.maxInput = this.element.querySelector('[data-filter-price-max]');
    }

    connect() {
        var min = this.config.min || 0,
            max = this.config.max || 100000,
            scale = this.config.decimalScale ?? 2,
            step = Math.pow(10, scale);

        this.scale = scale;
        this.symbol = this.config.currencySymbol || '$';
        this.symbolBefore = this.config.symbolBefore !== false;
        this.thousandSeparator = this.config.thousandSeparator || ',';

        noUiSlider.create(this.sliderEl, {
            connect: true,
            behaviour: 'tap',
            step: step,
            start: [min, max],
            range: {
                'min': [min],
                'max': [max]
            },
            format: {
                to: (value) => Math.round(value),
                from: (value) => Number(value)
            }
        });

        this.sliderEl.noUiSlider.on('update', this.proxy(this.onSliderUpdate));
        this.sliderEl.noUiSlider.on('change', this.proxy(this.onSliderChange));
    }

    disconnect() {
        if (this.sliderEl && this.sliderEl.noUiSlider) {
            this.sliderEl.noUiSlider.destroy();
        }
        this.sliderEl = null;
        this.valueEl = null;
        this.minInput = null;
        this.maxInput = null;
    }

    formatPrice(baseValue) {
        var divisor = Math.pow(10, this.scale);
        var number = Math.round(baseValue / divisor);
        var formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);

        if (this.symbolBefore) {
            return this.symbol + formatted;
        }

        return formatted + this.symbol;
    }

    onSliderUpdate(values) {
        if (this.valueEl) {
            this.valueEl.innerHTML = this.formatPrice(values[0]) + ' - ' + this.formatPrice(values[1]);
        }
    }

    onSliderChange(values) {
        if (this.minInput) {
            this.minInput.value = values[0];
        }
        if (this.maxInput) {
            this.maxInput.value = values[1];
        }

        this.element.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

export default function() {
    oc.registerControl('price-slider', PriceSlider);
}

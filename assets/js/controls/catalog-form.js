class CatalogForm extends oc.ControlBase {
    connect() {
        this.listen('change', '[data-filter-manufacturer]', this.onFilterProducts);
        this.listen('change', '[data-filter-facet]', this.onFilterProducts);
        this.listen('change', '[data-filter-rating]', this.onFilterProducts);
        this.listen('change', '[data-control="price-slider"]', this.onFilterProducts);
    }

    onFilterProducts() {
        const data = {};

        const manufacturers = [];
        this.element.querySelectorAll('[data-filter-manufacturer]:checked').forEach(function(el) {
            manufacturers.push(el.value);
        });
        if (manufacturers.length) {
            data.manufacturers = manufacturers;
        }

        const ratings = [];
        this.element.querySelectorAll('[data-filter-rating]:checked').forEach(function(el) {
            ratings.push(el.value);
        });
        if (ratings.length) {
            data.ratings = ratings;
        }

        const filters = {};
        this.element.querySelectorAll('[data-filter-facet]').forEach(function(el) {
            const code = el.dataset.filterFacet;
            let value;
            if (el.tagName === 'SELECT') {
                value = el.value;
            } else if (el.checked) {
                value = el.value;
            }
            if (value) {
                if (!filters[code]) {
                    filters[code] = [];
                }
                filters[code].push(value);
            }
        });
        if (Object.keys(filters).length) {
            data.filters = filters;
        }

        const priceMin = this.element.querySelector('[data-filter-price-min]');
        const priceMax = this.element.querySelector('[data-filter-price-max]');
        if (priceMin) {
            data.priceMin = priceMin.value;
        }
        if (priceMax) {
            data.priceMax = priceMax.value;
        }

        oc.request(this.element, 'onRefreshCatalog', {
            data: data,
            update: this.getUpdateTargets('products')
        });
    }

    getUpdateTargets(...keys) {
        const defaults = {
            products: { partial: 'shop-category/category-products', selector: '#categoryProducts' }
        };

        const result = {};
        for (const key of keys) {
            const config = defaults[key];
            const attrKey = key.charAt(0).toUpperCase() + key.slice(1);
            const partial = this.element.dataset[`partial${attrKey}`] || config.partial;
            const selector = this.element.dataset[`selector${attrKey}`] || config.selector;
            result[partial] = selector;
        }
        return result;
    }
}

export default function() {
    oc.registerControl('catalog-form', CatalogForm);
}

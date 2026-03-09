class SearchAutocomplete extends oc.ControlBase {
    init() {
        this.input = this.element.querySelector('input[type="search"]');
        this.resultsContainer = this.element.querySelector('[data-autocomplete-results]');
        this.debounceTimer = null;
        this.handler = this.config.handler;
    }

    connect() {
        this.listen('input', 'input[type="search"]', this.onInputChange);
        this.listen('keydown', 'input[type="search"]', this.onKeyDown);
        this.listen('focus', 'input[type="search"]', this.onInputFocus);

        this.onDocumentClickBound = this.onDocumentClick.bind(this);
        document.addEventListener('click', this.onDocumentClickBound);
    }

    disconnect() {
        document.removeEventListener('click', this.onDocumentClickBound);
        this.onDocumentClickBound = null;

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }

    onInputChange() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        var term = this.input.value.trim();

        if (term.length < 2) {
            this.close();
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.fetchResults(term);
        }, 300);
    }

    onInputFocus() {
        var term = this.input.value.trim();
        if (term.length >= 2 && this.resultsContainer.innerHTML.trim()) {
            this.open();
        }
    }

    onKeyDown(ev) {
        if (ev.key === 'Escape') {
            this.close();
            this.input.blur();
        }
    }

    onDocumentClick(ev) {
        if (!this.element.contains(ev.target)) {
            this.close();
        }
    }

    async fetchResults(term) {
        await oc.request(this.element, this.handler, {
            data: { term: term }
        });

        this.open();
    }

    open() {
        this.resultsContainer.classList.remove('d-none');
    }

    close() {
        this.resultsContainer.classList.add('d-none');
    }
}

export default function() {
    oc.registerControl('search-autocomplete', SearchAutocomplete);
}

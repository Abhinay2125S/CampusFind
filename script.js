// ---------- Search and category filter (home, lost, found pages) ----------
const searchForm = document.getElementById('search-form');

if (searchForm) {
    const searchInput = document.getElementById('search-input');
    const categoryButtons = document.querySelectorAll('#categories button');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('no-results');
    let activeCategory = 'all';

    function filterCards() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const matchesCategory =
                activeCategory === 'all' || card.dataset.category === activeCategory;
            const matchesText = card.textContent.toLowerCase().includes(query);
            const show = matchesCategory && matchesText;
            card.hidden = !show;
            if (show) {
                visibleCount++;
            }
        });

        noResults.hidden = visibleCount > 0;
    }

    searchInput.addEventListener('input', filterCards);

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        filterCards();
    });

    categoryButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            categoryButtons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            activeCategory = button.dataset.category;
            filterCards();
        });
    });
}

// ---------- Report form (reportlost page) ----------
const reportForm = document.getElementById('report-form');

if (reportForm) {
    const typeRadios = reportForm.querySelectorAll('input[name="type"]');
    const locationLabel = document.getElementById('location-label');
    const dateLabel = document.getElementById('date-label');
    const consent = document.getElementById('consent');
    const submitBtn = document.getElementById('submit-btn');
    const errorBox = document.getElementById('form-error');
    const success = document.getElementById('success');
    const required = reportForm.querySelectorAll('[required]');

    // Labels change with the report type.
    function updateLabels() {
        const isFound = reportForm.querySelector('input[name="type"]:checked').value === 'found';
        locationLabel.textContent = isFound ? 'Found location' : 'Last seen location';
        dateLabel.textContent = isFound ? 'Date found' : 'Date lost';
    }

    typeRadios.forEach(function (radio) {
        radio.addEventListener('change', updateLabels);
    });

    // Submit stays disabled until the guidelines box is ticked.
    consent.addEventListener('change', function () {
        submitBtn.disabled = !consent.checked;
    });

    reportForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let firstInvalid = null;

        required.forEach(function (field) {
            const bad = !field.value.trim() || !field.checkValidity();
            field.classList.toggle('invalid', bad);
            if (bad && !firstInvalid) {
                firstInvalid = field;
            }
        });

        if (firstInvalid) {
            errorBox.textContent = 'Please fill in the highlighted fields.';
            errorBox.hidden = false;
            firstInvalid.focus();
            return;
        }

        errorBox.hidden = true;
        reportForm.hidden = true;
        success.hidden = false;
    });
}
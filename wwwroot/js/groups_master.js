document.addEventListener("DOMContentLoaded", function () {
    var groupedColumnIndex = null;
    var openGroups = {}; // Track which groups are open

    // FIX: One reliable show/hide function based on DOM order (groups are contiguous because we sort by grouped column)
    function syncGroupedRowVisibility() {
        if (groupedColumnIndex === null) return;

        var currentGroup = null;
        var currentOpen = false;

        $('#stationsTable tbody tr').each(function () {
            var $tr = $(this);

            if ($tr.hasClass('group-row')) {
                currentGroup = $tr.data('group');
                currentOpen = $tr.hasClass('open');
                return;
            }

            // Data row: show/hide based on the most recent group header row
            if (currentGroup === null) {
                $tr.show();
                return;
            }

            if (currentOpen) {
                $tr.show();
            } else {
                $tr.hide();
            }
        });
    }

    var table = $('#stationsTable').DataTable({
        dom: '<"dt-top-row"l<"group-zone-holder"><"dt-spacer">f>rtip',
        paging: true,
        searching: true,
        info: true,
        order: [],
        columnDefs: [
            // Center text columns
            { targets: [0, 1, 2, 4, 5], className: 'dt-center' },

            // Right-align numeric columns
            { targets: [6, 7, 8, 9, 10], className: 'dt-right' },

            //Left-align numeric columns
            { targets: [3], className: 'dt-left' }
        ],
        drawCallback: function () {
            if (groupedColumnIndex === null) return;

            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var groupCount = 0;
            var colCount = api.columns().count();

            // Remove existing group rows
            $('#stationsTable tbody tr.group-row').remove();

            api.column(groupedColumnIndex, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    var isOpen = openGroups[group] || false;
                    var groupRow = $(
                        '<tr class="group-row" data-group="' + group + '">' +
                        '<td colspan="' + colCount + '"><span class="group-toggle">' + (isOpen ? '−' : '+') + '</span> ' + group + '</td>' +
                        '</tr>'
                    );

                    if (isOpen) {
                        groupRow.addClass('open');
                    }

                    $(rows).eq(i).before(groupRow);
                    last = group;
                    groupCount++;
                }
            });

            // FIX: Hide/show by traversing DOM in order (no DataTables row lookups needed)
            // Initially everything is hidden unless its group header is open
            syncGroupedRowVisibility();

            // Set up click handlers for group rows
            setupGroupToggleHandlers();
        }
    });

    setTimeout(function () {
        table.columns.adjust().draw(false);
    }, 0);

    $('#groupZone').appendTo('.group-zone-holder');
    $('#groupLegend').appendTo('.group-zone-holder');

    // Function to set up group toggle handlers
    function setupGroupToggleHandlers() {
        // Remove existing handlers
        $('#stationsTable').off('click.groupToggle').off('touchstart.groupToggle');

        // Add new handlers with namespace
        $('#stationsTable').on('click.groupToggle touchstart.groupToggle', 'tbody tr.group-row', function (e) {
            // Prevent default and stop propagation
            e.preventDefault();
            e.stopImmediatePropagation();

            var $row = $(this);
            var group = $row.data('group');
            var isOpen = $row.hasClass('open');

            // Toggle the open state
            $row.toggleClass('open');
            $row.find('.group-toggle').text(isOpen ? '+' : '−');

            // Update our openGroups tracking
            openGroups[group] = !isOpen;

            // FIX: Recompute visibility based on DOM order
            syncGroupedRowVisibility();

            // Prevent default for touch events
            if (e.type === 'touchstart') {
                return false;
            }
        });
    }

    // Set up initial handlers
    setupGroupToggleHandlers();

    // Re-setup handlers after table draw
    table.on('draw.dt', function() {
        setTimeout(setupGroupToggleHandlers, 0);
    });

    $('#stationsTable tbody').on('click', 'tr:not(.group-row)', function () {

        if (!table.data().any()) return;

        var rowData = table.row(this).data();
        if (!rowData) return;

        // Mimics Telerik GridView.CurrentRow.Cells["column"]
        $('#callsignTextBox').val(rowData[0]);
        $('#aff1TextBox').val(rowData[2] || '');
        $('#mediatypeTextBox').val(rowData[1] || '');
        $('#minMGrossTextBox').val(rowData[6] || '');
        $('#maxMGrossTextBox').val(rowData[7] || '');
        $('#maxPayTextBox').val(rowData[8] || '');
        $('#buysRankTextBox').val(rowData[9] || '');
        $('#callsRankTextBox').val(rowData[10] || '');

        $('#stationsTable tbody tr').removeClass('selected');
        $(this).addClass('selected');
    });

    // Function to apply grouping
    function applyGrouping(colIndex, colName) {
        groupedColumnIndex = parseInt(colIndex);
        openGroups = {}; // Reset open groups

        $('#groupZone').html(
            '<strong>Grouped By:</strong> ' +
            '<span class="group-pill">' + colName +
            ' <span class="remove-group">✕</span></span>'
        );

        table.order([groupedColumnIndex, 'asc']).draw();
    }

    // Desktop drag and drop
    $('#stationsTable thead th[draggable="true"]').on('dragstart', function (e) {
        e.originalEvent.dataTransfer.setData('colIndex', $(this).index());
        e.originalEvent.dataTransfer.setData('colName', $(this).text().replace('≡', '').trim());
    });

    $('#groupZone').on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('drag-over');
    }).on('dragleave', function () {
        $(this).removeClass('drag-over');
    });

    $('#groupZone').on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('drag-over');

        var colIndex = e.originalEvent.dataTransfer.getData('colIndex');
        var colName = e.originalEvent.dataTransfer.getData('colName');

        if (colIndex && colName) {
            applyGrouping(colIndex, colName);
        }
    });

    // SIMPLIFIED: Mobile touch-drag-drop using long press
    (function enableTouchHeaderDragDrop() {
        var style = document.createElement('style');
        style.textContent = `
            .th-touch-active {
                background-color: rgba(13, 110, 253, 0.1) !important;
            }
            .drag-over {
                background-color: #e7f1ff !important;
                border-color: #0d6efd !important;
            }
            .drag-ghost {
                position: fixed;
                z-index: 999999;
                pointer-events: none;
                padding: 8px 12px;
                border-radius: 6px;
                background: #0d6efd;
                color: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-size: 14px;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);

        var longPressTimer = null;
        var isDragging = false;
        var dragGhost = null;
        var dragColIndex = null;
        var dragColName = null;

        function createDragGhost(text, x, y) {
            var ghost = document.createElement('div');
            ghost.className = 'drag-ghost';
            ghost.textContent = 'Drag: ' + text;
            ghost.style.left = x + 'px';
            ghost.style.top = y + 'px';
            document.body.appendChild(ghost);
            return ghost;
        }

        function isOverGroupZone(x, y) {
            var zone = document.getElementById('groupZone');
            if (!zone) return false;
            var rect = zone.getBoundingClientRect();
            return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
        }

        // Start drag on long press
        $('#stationsTable thead th[draggable="true"]').on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $th = $(this);
            dragColIndex = $th.index();
            dragColName = $th.text().replace('≡', '').trim();

            $th.addClass('th-touch-active');

            // Start long press timer
            longPressTimer = setTimeout(function() {
                isDragging = true;

                // Create drag ghost
                var touch = e.touches[0] || e.changedTouches[0];
                dragGhost = createDragGhost(dragColName, touch.clientX, touch.clientY);

                // Highlight drop zone
                $('#groupZone').addClass('drag-over');
            }, 500); // 500ms long press
        }).on('touchmove', function (e) {
            if (!isDragging || !dragGhost) return;

            e.preventDefault();
            e.stopPropagation();

            var touch = e.touches[0] || e.changedTouches[0];

            // Move ghost
            dragGhost.style.left = touch.clientX + 'px';
            dragGhost.style.top = touch.clientY + 'px';

            // Check if over drop zone
            var overZone = isOverGroupZone(touch.clientX, touch.clientY);
            $('#groupZone').toggleClass('drag-over', overZone);
        }).on('touchend', function (e) {
            // Clear long press timer
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            $(this).removeClass('th-touch-active');

            if (isDragging && dragGhost) {
                e.preventDefault();
                e.stopPropagation();

                var touch = e.changedTouches[0];
                var overZone = isOverGroupZone(touch.clientX, touch.clientY);

                // Remove ghost
                if (dragGhost.parentNode) {
                    dragGhost.parentNode.removeChild(dragGhost);
                }

                // Apply grouping if dropped on zone
                if (overZone && dragColIndex !== null) {
                    applyGrouping(dragColIndex, dragColName);
                }

                // Clean up
                $('#groupZone').removeClass('drag-over');
                dragGhost = null;
                isDragging = false;
                dragColIndex = null;
                dragColName = null;
            }
        });

        // Prevent default touch behavior on group zone
        $('#groupZone').on('touchstart touchmove touchend', function (e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    })();

    $('#groupZone').on('click', '.remove-group', function () {
        groupedColumnIndex = null;
        openGroups = {};

        $('#groupZone')
            .html('Drag column headers here to group')
            .removeClass('drag-over');

        $('#stationsTable tbody tr').show();
        $('#stationsTable tbody tr.group-row').remove();
        table.order([]).draw();
    });

    const tableEl = document.getElementById("stationsTable");
    const btn = document.getElementById("toggleTableHeaderTheme");

    if (!tableEl || !btn) return;

    btn.addEventListener("click", function () {
        if (tableEl.classList.contains("dt-header-dark")) {
            tableEl.classList.remove("dt-header-dark");
            tableEl.classList.add("dt-header-light");
        } else {
            tableEl.classList.remove("dt-header-light");
            tableEl.classList.add("dt-header-dark");
        }
    });

});

document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    applyTheme(currentTheme);

    themeToggle.addEventListener('click', function () {
        const newTheme = (document.body.classList.contains('dark-theme')) ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-bs-theme', 'dark'); // ✅ apply globally for all views using Bootstrap
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            document.documentElement.setAttribute('data-bs-theme', 'light'); // ✅ apply globally for all views using Bootstrap
            themeToggle.textContent = '🌙 Dark Mode';
        }
    }
});

function updateViewportWidth() {
    document.getElementById("vw").textContent = window.innerWidth;
}

window.addEventListener("resize", updateViewportWidth);
document.addEventListener("DOMContentLoaded", updateViewportWidth);

// ✅ Ensure global theme is applied on this view based on saved preference
(function initGlobalTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-bs-theme', 'dark'); // Bootstrap 5.3.3 global theme
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            document.documentElement.setAttribute('data-bs-theme', 'light'); // Bootstrap 5.3.3 global theme
        }
    } catch (e) {
        console.warn('Theme init failed on Welcome view:', e);
    }
})();


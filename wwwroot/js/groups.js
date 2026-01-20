// /js/groups.js
(function (window, $) {
    'use strict';

    // =============================================================
    // GroupedDT (GROUPING ONLY)
    // - Attaches grouping behavior to an ALREADY initialized DataTable
    // - Drag/drop (desktop) + long-press drag (mobile) -> group-by
    // - Renders group header rows (+/-) and hides/shows grouped rows
    // - NO grid creation
    // - NO row selection
    // - NO textbox filling
    // - NO theme / viewport logic
    // =============================================================

    window.GroupedDT = window.GroupedDT || {};

    var _instanceCounter = 0;
    var _touchStylesInjected = false;

    function injectTouchStylesOnce() {
        if (_touchStylesInjected) return;
        _touchStylesInjected = true;

        var style = document.createElement('style');
        style.id = 'groupedDT_touch_styles_v1';
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
    }

    function init(userOptions) {
        userOptions = userOptions || {};

        var defaults = {
            tableSelector: '#stationsTable',
            groupZoneSelector: '#groupZone',
            groupLegendSelector: '#groupLegend',
            groupZoneEmptyHtml: 'Drag column headers here to group',
            draggableHeaderSelector: 'thead th[draggable="true"]'
        };

        var opts = $.extend(true, {}, defaults, userOptions);

        var ns = '.groupedDT_' + (++_instanceCounter);

        var $table = $(opts.tableSelector);
        if (!$table.length) return null;

        if (!$.fn || !$.fn.dataTable || !$.fn.dataTable.isDataTable($table)) {
            // DO NOT build/init DataTable here. If it isn't already initialized, we bail.
            return null;
        }

        var table = $table.DataTable(); // safe: already initialized
        var $groupZone = $(opts.groupZoneSelector);
        var $groupLegend = $(opts.groupLegendSelector);

        var groupedColumnIndex = null;
        var openGroups = {}; // Track which groups are open

        function ensureHolder() {
            try {
                var container = table.table().container();
                var $container = $(container);
                var $holder = $container.find('.group-zone-holder');

                if (!$holder.length) {
                    var $topRow = $container.find('.dt-top-row');
                    if ($topRow.length) {
                        $holder = $('<div class="group-zone-holder"></div>').appendTo($topRow);
                    } else {
                        $holder = $('<div class="group-zone-holder"></div>').prependTo($container);
                    }
                }

                if ($groupZone.length) $groupZone.appendTo($holder);
                if ($groupLegend.length) $groupLegend.appendTo($holder);
            } catch (e) {
                // no-op
            }
        }

        // FIX: One reliable show/hide function based on DOM order (groups are contiguous because we sort by grouped column)
        function syncGroupedRowVisibility() {
            if (groupedColumnIndex === null) return;

            var currentGroup = null;
            var currentOpen = false;

            $table.find('tbody tr').each(function () {
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

        // Function to set up group toggle handlers
        function setupGroupToggleHandlers() {
            $table.off('click' + ns, 'tbody tr.group-row')
                .off('touchstart' + ns, 'tbody tr.group-row');

            $table.on('click' + ns + ' touchstart' + ns, 'tbody tr.group-row', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var $row = $(this);
                var group = $row.data('group');
                var isOpen = $row.hasClass('open');

                $row.toggleClass('open');
                $row.find('.group-toggle').text(isOpen ? '+' : '−');

                openGroups[group] = !isOpen;

                syncGroupedRowVisibility();

                if (e.type === 'touchstart') {
                    return false;
                }
            });
        }

        function renderGroupRows() {
            if (groupedColumnIndex === null) return;

            var api = table;
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var colCount = api.columns().count();

            $table.find('tbody tr.group-row').remove();

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
                }
            });

            syncGroupedRowVisibility();
            setupGroupToggleHandlers();
        }

        // Function to apply grouping
        function applyGrouping(colIndex, colName) {
            groupedColumnIndex = parseInt(colIndex, 10);
            openGroups = {};

            if ($groupZone.length) {
                $groupZone.html(
                    '<strong>Grouped By:</strong> ' +
                    '<span class="group-pill">' + colName +
                    ' <span class="remove-group">✕</span></span>'
                );
            }

            table.order([groupedColumnIndex, 'asc']).draw();
        }

        function clearGrouping() {
            groupedColumnIndex = null;
            openGroups = {};

            if ($groupZone.length) {
                $groupZone
                    .html(opts.groupZoneEmptyHtml)
                    .removeClass('drag-over');
            }

            $table.find('tbody tr').show();
            $table.find('tbody tr.group-row').remove();
            table.order([]).draw();
        }

        // Desktop drag and drop
        $table.off('dragstart' + ns, opts.draggableHeaderSelector)
            .on('dragstart' + ns, opts.draggableHeaderSelector, function (e) {
                e.originalEvent.dataTransfer.setData('colIndex', $(this).index());
                e.originalEvent.dataTransfer.setData('colName', $(this).text().replace('≡', '').trim());
            });

        // Drop zone handlers
        if ($groupZone.length) {
            $groupZone.off('dragover' + ns)
                .on('dragover' + ns, function (e) {
                    e.preventDefault();
                    $(this).addClass('drag-over');
                })
                .off('dragleave' + ns)
                .on('dragleave' + ns, function () {
                    $(this).removeClass('drag-over');
                })
                .off('drop' + ns)
                .on('drop' + ns, function (e) {
                    e.preventDefault();
                    $(this).removeClass('drag-over');

                    var colIndex = e.originalEvent.dataTransfer.getData('colIndex');
                    var colName = e.originalEvent.dataTransfer.getData('colName');

                    if (colIndex && colName) {
                        applyGrouping(colIndex, colName);
                    }
                });

            // Remove grouping handler
            $groupZone.off('click' + ns, '.remove-group')
                .on('click' + ns, '.remove-group', function () {
                    clearGrouping();
                });
        }

        // SIMPLIFIED: Mobile touch-drag-drop using long press
        (function enableTouchHeaderDragDrop() {
            injectTouchStylesOnce();

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
                if (!$groupZone.length) return false;
                var zone = $groupZone.get(0);
                if (!zone) return false;
                var rect = zone.getBoundingClientRect();
                return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
            }

            $table.off('touchstart' + ns, opts.draggableHeaderSelector)
                .off('touchmove' + ns, opts.draggableHeaderSelector)
                .off('touchend' + ns, opts.draggableHeaderSelector);

            $table.on('touchstart' + ns, opts.draggableHeaderSelector, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $th = $(this);
                dragColIndex = $th.index();
                dragColName = $th.text().replace('≡', '').trim();

                $th.addClass('th-touch-active');

                longPressTimer = setTimeout(function () {
                    isDragging = true;

                    var touch = e.touches[0] || e.changedTouches[0];
                    dragGhost = createDragGhost(dragColName, touch.clientX, touch.clientY);

                    if ($groupZone.length) {
                        $groupZone.addClass('drag-over');
                    }
                }, 500);
            });

            $table.on('touchmove' + ns, opts.draggableHeaderSelector, function (e) {
                if (!isDragging || !dragGhost) return;

                e.preventDefault();
                e.stopPropagation();

                var touch = e.touches[0] || e.changedTouches[0];

                dragGhost.style.left = touch.clientX + 'px';
                dragGhost.style.top = touch.clientY + 'px';

                var overZone = isOverGroupZone(touch.clientX, touch.clientY);
                if ($groupZone.length) {
                    $groupZone.toggleClass('drag-over', overZone);
                }
            });

            $table.on('touchend' + ns, opts.draggableHeaderSelector, function (e) {
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

                    if (dragGhost.parentNode) {
                        dragGhost.parentNode.removeChild(dragGhost);
                    }

                    if (overZone && dragColIndex !== null) {
                        applyGrouping(dragColIndex, dragColName);
                    }

                    if ($groupZone.length) {
                        $groupZone.removeClass('drag-over');
                    }

                    dragGhost = null;
                    isDragging = false;
                    dragColIndex = null;
                    dragColName = null;
                }
            });

            if ($groupZone.length) {
                $groupZone.off('touchstart' + ns + ' touchmove' + ns + ' touchend' + ns)
                    .on('touchstart' + ns + ' touchmove' + ns + ' touchend' + ns, function (e) {
                        if (isDragging) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
            }
        })();

        // Ensure group UI is placed correctly
        ensureHolder();

        // Initial handlers
        setupGroupToggleHandlers();

        // Draw hook for grouping rows
        table.off('draw.dt' + ns).on('draw.dt' + ns, function () {
            setTimeout(function () {
                renderGroupRows();
            }, 0);
        });

        // Initial render if grouping already set via config later
        renderGroupRows();

        return {
            table: table,
            setGrouping: function (colIndex, colName) { applyGrouping(colIndex, colName); },
            clearGrouping: function () { clearGrouping(); }
        };
    }

    window.GroupedDT.init = init;

})(window, window.jQuery);

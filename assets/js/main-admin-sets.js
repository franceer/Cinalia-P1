define(['jquery', 'select2', 'jquery.validation'], function ($, select2, validation) {

    function SetManager() {
        this.select2FR = {
            errorLoading:
                function () { return "Les résultats ne peuvent pas être chargés." },
            inputTooLong:
                function (e) { var t = e.input.length - e.maximum, n = "Supprimez " + t + " caractère"; return t !== 1 && (n += "s"), n },
            inputTooShort:
                function (e) { var t = e.minimum - e.input.length, n = "Saisissez " + t + " caractère"; return t !== 1 && (n += "s"), n },
            loadingMore:
                function () { return "Chargement de résultats supplémentaires…" },
            maximumSelected:
                function (e) { var t = "Vous pouvez seulement sélectionner " + e.maximum + " élément"; return e.maximum !== 1 && (t += "s"), t },
            noResults: function () { return "Aucun résultat trouvé" },
            searching: function () { return "Recherche en cours…" }
        };
        this.setSelect2Tags($('#tags'));
        this.initHandlers();
        this.initFormValidators();

        if (this.inIframe()) {
            $('.modal-hidden').hide();
            $('.add-grouped-button').show();
        }
    }

    SetManager.prototype = function () {
        var initHandlers = function () {
            var t = this;

            $('.table').on('click', 'input[name=select-set]', function (e) {
                var $checked = $(this).closest('.table').find('input[name=select-set]:checked');

                if ($checked.length > 0)
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', false);                
                else
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', true);
            });

            $('.table').on('click', '.edit-button', function (e) {
                $button = $(this);
                $tr = $button.closest('.tr');
                t.setSelect2Tags($tr.find('select[name=tags]'));
                $tr.validate({
                    rules: {
                        name: 'required',
                        tags: 'required',
                        media_character_id: 'required',
                        time_codes: { required: true, number: true }
                    },
                    messages: {
                        name: 'Merci d\'indiquer le nom du décor',
                        tags: 'Merci de choisir un tag',
                        media_character_id: 'Merci de choisir un personnage',
                        time_codes: 'Merci d\'indiquer un time code'
                    },
                    highlight: function (element) {
                        getValidatorParent(element).removeClass('has-success').addClass('has-danger');
                    },
                    unhighlight: function (element) {
                        getValidatorParent(element).removeClass('has-danger').addClass('has-success');
                    },
                    errorPlacement: function (error, element) {
                        error.addClass('form-control-label');
                        error.appendTo(element.closest('.form-group'));
                    }
                });

                $tr.data('htmlBackup', $tr.html());
                $tr.find('.display-field').hide();
                $tr.find('.edit-field').show().first().children().first().focus(function () {
                    var ele = $(this);
                    window.scrollTo(0, ele.offset().top - 150);                   
                }).focus();
                $tr.find('.edit-button').hide();
                $tr.find('.delete-button').hide();
                $tr.find('.save-button').show();
                $tr.find('.close-button').show();
            });

            $('.table').on('click', '.save-button', function (e) {
                var $button = $(this);
                var $tr = $button.closest('.tr');

                if ($tr.data('validator').form()) {
                    toggleLoadingSpinner($button);

                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'decors' }, function (updated) {
                        $tr.replaceWith(updated);
                        $tr = $('.tr.newly-added').removeClass('newly-added');
                        setSelect2Tags($tr.find('select[name=tags]'));
                        toggleLoadingSpinner($button);
                    });
                }
            });

            $('.table').on('click', '.delete-button', function (e) {
                if (confirm('Etes-vous sûr de vouloir supprimer cet élément ?')) {
                    $tr = $(this).closest('.tr');
                    $.ajax({
                        url: '/admin/sets/' + $(this).closest('.tr').find('[name=id]').val(),
                        type: 'DELETE'
                    })
                    .done(function (data) {
                        if (data.status === 'error')
                            showMessages($('#alert-table'), data.message, 'alert-danger');
                        else {
                            $tr.remove();
                            showMessages($('#alert-table'), 'Element supprimé avec succès.', 'alert-success');
                        }
                    });
                }
            });

            $('.table').on('click', '.close-button', function (e) {
                if (confirm('Souhaitez-vous arrêter la modification de cet élement (vos modifications seront perdues) ?')) {
                    $tr = $(this).closest('.tr');
                    $tr.html($tr.data('htmlBackup'));
                    $tr.find('select[name=tags]+.select2-container').remove();
                }
            });

            $('#linked-products, #modify-products-modal').on('click', '.delete-linked-button', function (e) {
                var $table = $(e.target).closest('.table');
                $(e.target).closest('.tr').remove();

                if ($table.children('.tr:not(.thead-inverse)').length === 0)
                    $table.next().show();
            });

            $('#modify-products-modal')
            .on('show.bs.modal', function (e) {
                var $button = $(e.relatedTarget);
                var $clonedProducts = $button.parent().siblings('.linked-products').clone().show();
                var $modalBody = $('#modify-products-modal .modal-body');
                var $wideImg = $modalBody.children('.wide-img');               
                $wideImg.after($clonedProducts);
                var $table = $modalBody.find('.linked-products');                
                $wideImg.show().children('img').attr('src', $button.closest('.tr').find('[name=picture_url]').val());
                $table.children('.tr:not(.thead-inverse)').each(function () {
                    var $tr = $(this);
                    var id = $tr.find('[name=id]').val();
                    var exactMatch = $tr.find('[name=matching_status_id]').is(':checked');
                    var x = $tr.find('[name=x_offset]').val();
                    var y = $tr.find('[name=y_offset]').val();
                    $wideImg.children('.matching-markers').append('<div id="' + id + '" class="matching-icon' + (exactMatch ? ' exact-match' : '') + '" style="top:' + y + '%;left:' + x + '%;"></div>')
                });                

                if ($table.children('.tr:not(.thead-inverse)').length === 0)
                    $table.next().show();
                else
                    $table.next().hide();

                if ($button.hasClass('modify-products-button')) {
                    $(e.target).addClass('edit');
                    $table.data('relatedTarget', $button);
                }
            })
            .on('shown.bs.modal', function (e) {
                var $wideImg = $('#modify-products-modal .modal-body .wide-img');
                $wideImg.height($wideImg.width() * 0.315315315);
            })
            .on('hide.bs.modal', function (e) {
                var $modal = $(e.target);
                var $productsTable = $('#modify-products-modal').find('.linked-products');

                if ($productsTable.data('relatedTarget'))
                    $productsTable.data('relatedTarget').parent().siblings('.linked-products').replaceWith($productsTable.hide());

                $modal.removeClass('edit').find('.linked-products').remove();
                $modal.find('.wide-img img').attr('src', '');
                $modal.find('.matching-markers').empty();
            });

            $('.add-grouped-button').on('click', function (e) {
                var $parentDocument = $(parent.document);
                var $setsTable;

                if ($parentDocument.find('iframe[data-related-target]').length > 0)
                    $setsTable = $parentDocument.find('iframe[data-related-target]+.linked-sets');
                else
                    $setsTable = $parentDocument.find('#linked-sets');

                $('input[name=select-set]:checked').each(function () {
                    var $tr = $(this).closest('.tr');

                    if ($setsTable.find('input[name=id][value=' + $tr.find('input[name=id]').val() + ']').length === 0) {                        
                        $setsTable.append(getSetRow($tr));
                    }
                }).prop('checked', false);

                if ($setsTable.children('.tr:not(.thead-inverse)').length > 0)
                    $setsTable.next().hide();
            });          

            $('#picture_url').on('change', function (e) {
                var $wideImg = $(this).parent().siblings('.wide-img');
                $wideImg.height($wideImg.width() * 0.315315315).children('img').attr('src', $(this).val());
            });

            $('.add-button').on('click', function (e) {
                var $button = $(this);
                var $form = $button.closest('form');
                var validator = $form.data('validator');

                if (validator.form()) {
                    toggleLoadingSpinner($button);

                    addOrUpdateAsset($form, { method: 'POST', target: 'decors' }, function (data) {
                        if (data.status === 'error') {
                            showMessages($('.alert'), data.message, 'alert-danger');
                            toggleLoadingSpinner($button);
                        } else {                            
                            $form.find('select').val('').trigger('change');
                            validator.resetForm();
                            $form.trigger('reset').find('.form-group.has-success').removeClass('has-success');
                            $form.find('#linked-products .tr:not(.thead-inverse)').remove();
                            $form.find('.wide-img').height(0).children('img').attr('src', '');
                            $form.find('.matching-markers').empty();
                            $form.find('.no-associated-products').show();

                            $('.table:not(#linked-products) > .thead-inverse').after(data);
                            $tr = $('.tr.newly-added').removeClass('newly-added');
                            setSelect2Tags($tr.find('select[name=tags]'));

                            showMessages($('#alert-add'), $tr.find('input[name=name]').val() + ' ajouté avec succès', 'alert-success');
                            toggleLoadingSpinner($button);
                            document.getElementsByTagName('body')[0].scrollIntoView();

                            if (inIframe()) {
                                $tr.find('.modal-hidden').hide();
                                var $setsTable = $(parent.document).find('.open-sets-modal+.table');
                                $setsTable.append(getSetRow($tr));

                                if ($setsTable.children('.tr:not(.thead-inverse)').length > 0)
                                    $setsTable.next().hide();
                            }
                        }                        
                    });
                }
            });

            $('#add-products-button').on('click', function (e) {
                var $button = $(e.target);
                $button.hide().prev().show();
                $button.next().attr('src', '/admin/produits').show().attr('data-related-target', 'true').siblings('.no-associated-products, .linked-products, .wide-img').hide();
            });

            $('#back-to-products-button').on('click', function (e) {
                var $button = $(e.target);
                $button.hide().next().show().next().removeAttr('data-related-target').hide().siblings('.linked-products, .wide-img').show();
            });

            $('#add-tag').on('click', function (e) {
                var $addTagForm = $(this).closest('form').data('validator');
                if ($addTagForm.form()) {
                    $.post('/admin/tags', { name: $addTagForm.currentElements.filter('[name=name]').val(), path: $addTagForm.currentElements.filter('[name=path]').val() }, function (data) {
                        if (data.status === 'error')
                            showMessages($('.alert'), data.message, 'alert-danger');
                        else {
                            $addTagForm.currentElements.val('').parent().removeClass('has-success');
                            $('select[name=tags]').append('<option value="' + data.object.id + '" selected>' + data.object.name + ' (' + data.object.path + ')' + '</option>').trigger('change');
                        }
                    });
                }
            });
			
			$('#add-character').on('click', function (e) {
                var $addCharacterForm = $(this).closest('form').data('validator');
                if ($addCharacterForm.form()) {
                    var body = {}
                    $($addCharacterForm.currentForm.elements).not('button').each(function () {
                        body[$(this).attr('name')] = $(this).val();
                    });

                    $.post('/admin/personnages', body, function (data) {
                        if (data.status === 'error')
                            showMessages($('.alert'), data.message, 'alert-danger');
                        else {
                            $addCharacterForm.resetForm();
                            $($addCharacterForm.currentForm).trigger('reset').find('.form-group.has-success').removeClass('has-success');;
                            $('#media_character_id').empty().append('<option value="' + data.object.id + '" selected>' + data.object.firstname + (data.object.lastname ? ' ' + data.object.lastname : '') + '</option>').trigger('change');
                        }
                    });
                }
			});

			$('#linked-products,  #modify-products-modal').on('click', '.img-map-button', function (e) {
			    var $button = $(this);
			    var $tr = $button.closest('.tr');
			    var $table = $button.closest('.table');
			    var wideImg = getWideImage($table);
			    $('body').off('mouseover').css('cursor', 'inherit');
			    wideImg.$.off('click');

			    $('body').on('mouseover',function (e) {
			        $(this).css('cursor', 'crosshair');			        
			    });
			    wideImg.$.on('click', function (e) {
			        $('body').off('mouseover').css('cursor', 'inherit');
			        Number(Math.round(1.005 + 'e2') + 'e-2');
			        var x = Number(Math.round(((e.pageX - wideImg.$.offset().left) / wideImg.$.width() * 100) + 'e3') + 'e-3');
			        var y = Number(Math.round(((e.pageY - wideImg.$.offset().top) / wideImg.$.height() * 100) + 'e3') + 'e-3');
			        $button.siblings('.fa-check').show();
			        $button.siblings('[name=x_offset]').val(x);
			        $button.siblings('[name=y_offset]').val(y);
			        var id = $tr.find('[name=id]').val();
			        var exactMatch = $tr.find('[name=matching_status_id]').is(':checked');
			        wideImg.$.find('.matching-markers #' + id).remove();
			        wideImg.$.children('.matching-markers').append('<div id="' + id + '" class="matching-icon' + (exactMatch ? ' exact-match' : '') + '" style="top:' + y + '%;left:' + x + '%;"></div>')
			    });

			    function getWideImage($table) {
			        var isModal = $table.hasClass('linked-products');
			        var $wideImg = isModal ? $table.closest('.modal-body').find('.wide-img') : $table.closest('form').find('.wide-img');

			        return {
			            $: $wideImg,
			            closestRelative: isModal ? $wideImg.closest('.modal-dialog') : $wideImg.closest('.col-md-12')
			        }
			    }
			});
        };       

        var setSelect2Tags = function ($element) {
            var t = this;

            if (!$element)
                $element = $('select[name=tags]');

            var selectTags = $element.select2({
                width: '100%',
                placeholder: 'Choisissez un tag...',
                tags: true,
                createTag: function (params) {
                    return undefined;
                },
                multiple: true,
                language: t.select2FR,
                ajax: {
                    url: '/admin/tags',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term, // search term
                            page: params.page
                        };
                    },
                    processResults: function (data, params) {
                        params.page = params.page || 1;

                        return {
                            results: data.items,
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    cache: true
                },
                minimumInputLength: 2,
            });

            selectTags.each(function () { $(this).data('select2').$selection.addClass('form-control form-control-danger form-control-success'); });

            $element.on('change', function () {
                $element.closest('form').data('validator').element(this);
            });

            return selectTags;
        };      

        var initFormValidators = function () {
            $('#admin-add-set-form').validate({
                rules: {
                    name: 'required',
                    tags: 'required',
                    picture_url: 'required',
                    time_codes: { required: true, number: true }
                },
                messages: {
                    name: 'Merci d\'indiquer le nom du décor',
                    tags: 'Merci de choisir un tag',
                    picture_url: 'Merci de définir une image',
                    time_codes: 'Merci d\'indiquer un time code'
                },
                highlight: function (element) {
                    getValidatorParent(element).removeClass('has-success').addClass('has-danger');
                },
                unhighlight: function (element) {
                    getValidatorParent(element).removeClass('has-danger').addClass('has-success');
                },
                errorPlacement: function (error, element) {
                    error.addClass('form-control-label');
                    error.appendTo(element.closest('.form-group'));
                }
            });

            $('#add-tag-form').validate({
                rules: {
                    name: 'required',
                    path: 'required'
                },
                messages: {
                    name: 'Merci d\'indiquer le nom du tag',
                    path: 'Merci d\'indiquer le path du tag'
                },
                highlight: function (element) {
                    getValidatorParent(element).removeClass('has-success').addClass('has-danger');
                },
                unhighlight: function (element) {
                    getValidatorParent(element).removeClass('has-danger').addClass('has-success');
                },
                errorPlacement: function (error, element) {
                    error.addClass('form-control-label col-md-6 offset-md-3');
                    error.appendTo(element.closest('.form-group'));
                }
            });

            $('#add-character-form').validate({
                rules: {
                    firstname: 'required'
                },
                messages: {
                    firstname: 'Merci d\'indiquer au minimum le prénom'
                },
                highlight: function (element) {
                    getValidatorParent(element).removeClass('has-success').addClass('has-danger');
                },
                unhighlight: function (element) {
                    getValidatorParent(element).removeClass('has-danger').addClass('has-success');
                },
                errorPlacement: function (error, element) {
                    error.addClass('form-control-label col-md-6 offset-md-3');
                    error.appendTo(element.closest('.form-group'));
                }
            });
        };

        var inIframe = function () {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        };

        function addOrUpdateAsset($container, config, cb) {
            var data = { products: []};

            $container.find('input:not([disabled],[type=search],[name*="select-"],#linked-products input,.linked-products input), select:not(#linked-products select,.linked-products select), textarea').each(function () {
                var $input = $(this);
                var type = $input.attr('type');
                var attrName = $input.attr('name');
                var value;

                if (type && type === 'checkbox')
                    value = $input.is(':checked');
                else if (attrName === 'time_codes')
                    value = [$input.val()];
                else
                    value = $input.val();

                data[$input.attr('name')] = (typeof value !== 'undefined' && value !== '' ? value : null);
            });

            $container.find('#linked-products .tr:not(.thead-inverse), .linked-products .tr:not(.thead-inverse)').each(function () {
                var $tr = $(this);
                var id = $tr.find('[name=id]').val();
                var matchingStatusID = $tr.find('[name=matching_status_id]').is(':checked') ? 1 : 2;                
                var appearingContext = $tr.find('[name=appearing_context]').val();
                var xOffset = $tr.find('[name=x_offset]').val();
                var yOffset = $tr.find('[name=y_offset]').val();
                data.products.push({ product_id: id, matching_status_id: matchingStatusID, appearing_context: appearingContext, x_offset: xOffset, y_offset: yOffset });
            });

            $.ajax({
                url: '/admin/' + config.target + '/' + (config.id ? config.id : ''),
                type: config.method,
                data: data
            })
            .done(cb);
        }

        function getValidatorParent(element) {
            var $parent;
            var $element = $(element);

            if ($element.attr('type') === 'checkbox')
                $parent = $element.parents('.form-check, .form-group');
            else
                $parent = $element.parent();

            return $parent;
        }

        function showMessages($element, message, style) {
            $element
				.attr('class', 'alert ' + style)
				.text(message)
				.removeAttr('hidden');
        }

        function getSetRow($tr) {
            var $clonedRow = $tr.clone();
            $clonedRow.children('.modal-hidden, .td:first-child,.td:nth-of-type(10),.td:nth-of-type(11), .td:nth-of-type(12)').remove();
            $clonedRow.find('.edit-field').remove();
            $clonedRow.find('.display-field').removeClass('display-field');
            $clonedRow.append('<div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>');
            return $('<div class="tr"></div>').append($clonedRow.contents());
        }

        function toggleLoadingSpinner($button) {
            var htmlSpinner = '<i class="fa fa-spinner fa-spin fa-3x fa-fw actions"></i><span class="sr-only">Chargement...</span>';
            if ($button.is(':visible')) {
                $button.hide().after(htmlSpinner);
                $button.siblings('button').hide();
            } else {
                $button.show().siblings('.fa-spinner, .sr-only').remove();
                $button.siblings('button').show();
            }
        }

        return {
            inIframe: inIframe,
            initHandlers: initHandlers,
            setSelect2Tags: setSelect2Tags,
            initFormValidators: initFormValidators
        };
    }();       

    $(function () {
        new SetManager();        
    });
});
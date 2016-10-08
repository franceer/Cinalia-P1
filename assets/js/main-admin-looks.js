define(['jquery', 'select2', 'jquery.validation'], function ($, select2, validation) {

    function LookManager() {
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

    LookManager.prototype = function () {
        var initHandlers = function () {
            var t = this;

            $('.table').on('click', 'input[name=select-look]', function (e) {
                var $checked = $(this).closest('.table').find('input[name=select-look]:checked');

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
                        character_name: 'required',
                        character_type_id: 'required',
                        time_codes: { required: true, number: true }
                    },
                    messages: {
                        name: 'Merci d\'indiquer le nom du look',
                        tags: 'Merci de choisir un tag',
                        character_name: 'Merci d\'indiquer le nom du personnage',
                        character_type_id: 'Merci de choisir un type de personnage',
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

                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'looks' }, function (updated) {
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
                        url: '/admin/looks/' + $(this).closest('.tr').find('[name=id]').val(),
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
                    $tr.find('select[name=media_character_id]+.select2-container').remove();
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
                var $modalBody = $('#modify-products-modal').find('.modal-body');
                $modalBody.children('iframe').after($clonedProducts);
                var $table = $modalBody.find('.linked-products');

                if ($table.children('.tr:not(.thead-inverse)').length === 0)
                    $table.next().show();
                else
                    $table.next().hide();

                if ($button.hasClass('modify-products-button')) {
                    $(e.target).addClass('edit');
                    $table.data('relatedTarget', $button);
                }
            })
            .on('hide.bs.modal', function (e) {
                var $modal = $(e.target);
                var $productsTable = $('#modify-products-modal').find('.linked-products');

                if ($productsTable.data('relatedTarget'))
                    $productsTable.data('relatedTarget').parent().siblings('.linked-products').replaceWith($productsTable.hide());

                $modal.removeClass('edit').find('.linked-products').remove();
            });

            $('.add-grouped-button').on('click', function (e) {
                var $parentDocument = $(parent.document);
                var $looksTable;

                if ($parentDocument.find('iframe[data-related-target]').length > 0)
                    $looksTable = $parentDocument.find('iframe[data-related-target]+.linked-looks');
                else
                    $looksTable = $parentDocument.find('#linked-looks');

                $('input[name=select-look]:checked').each(function () {
                    var $tr = $(this).closest('.tr');

                    if ($looksTable.find('input[name=id][value=' + $tr.find('input[name=id]').val() + ']').length === 0) {                        
                        $looksTable.append(getLookRow($tr));
                    }
                }).prop('checked', false);

                if ($looksTable.children('.tr:not(.thead-inverse)').length > 0)
                    $looksTable.next().hide();
            });          

            $('.add-button').on('click', function (e) {
                var $button = $(this);
                var $form = $button.closest('form');
                var validator = $form.data('validator');

                if (validator.form()) {
                    toggleLoadingSpinner($button);

                    addOrUpdateAsset($form, { method: 'POST', target: 'looks' }, function (data) {
                        if (data.status === 'error') {
                            showMessages($('.alert'), data.message, 'alert-danger');
                            toggleLoadingSpinner($button);
                        } else {                            
                            $form.find('select').val('').trigger('change');
                            validator.resetForm();
                            $form.trigger('reset').find('.form-group.has-success').removeClass('has-success');
                            $form.find('#linked-products .tr:not(.thead-inverse)').remove();
                            $form.find('.no-associated-products').show();

                            $('.table:not(#linked-products) > .thead-inverse').after(data);
                            $tr = $('.tr.newly-added').removeClass('newly-added');
                            setSelect2Tags($tr.find('select[name=tags]'));

                            showMessages($('#alert-add'), $tr.find('input[name=name]').val() + ' ajouté avec succès', 'alert-success');
                            toggleLoadingSpinner($button);
                            document.getElementsByTagName('body')[0].scrollIntoView();

                            if (inIframe()) {
                                $tr.find('.modal-hidden').hide();
                                var $looksTable = $(parent.document).find('.open-looks-modal+.table');
                                $looksTable.append(getLookRow($tr));

                                if ($looksTable.children('.tr:not(.thead-inverse)').length > 0)
                                    $looksTable.next().hide();
                            }
                        }                        
                    });
                }
            });

            $('#add-products-button').on('click', function (e) {
                var $button = $(e.target);
                $button.hide().prev().show();
                $button.next().attr('src', '/admin/produits').show().attr('data-related-target', 'true').next().hide();
            });

            $('#back-to-products-button').on('click', function (e) {
                var $button = $(e.target);
                $button.hide().next().show().next().removeAttr('data-related-target').hide().next().show();
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
            $('#admin-add-look-form').validate({
                rules: {
                    name: 'required',
                    tags: 'required',
                    character_name: 'required',
                    character_type_id: 'required',
                    time_codes: { required: true, number: true }
                },
                messages: {
                    name: 'Merci d\'indiquer le nom du look',
                    tags: 'Merci de choisir un tag',
                    character_name: 'Merci d\'indiquer le nom du personnage',
                    character_type_id: 'Merci de choisir un type de personnage',
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
                    tags: 'Merci d\'indiquer le path du tag'
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

                if(attrName === 'time_codes')
                    value = [$input.val()];
                else
                    value = $input.val();              

                data[$input.attr('name')] = (typeof value !== 'undefined' && value !== '' ? value : null);
            });

            $container.find('#linked-products .tr:not(.thead-inverse), .linked-products .tr:not(.thead-inverse)').each(function () {
                var $tr = $(this);
                var id = $tr.find('[name=id]').val();
                var matchingStatusID = $tr.find('[name=matching_status_id]').is(':checked') ? 1 : 2;
                var bodyLocationID = $tr.find('[name=body_location_id]').val();
                var appearingContext = $tr.find('[name=appearing_context]').val();
                var order = $tr.find('[name=order]').val();
                data.products.push({ product_id: id, matching_status_id: matchingStatusID, body_location_id: bodyLocationID, appearing_context: appearingContext, order: order });
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

        function getLookRow($tr) {
            var $clonedRow = $tr.clone();
            $clonedRow.children('.modal-hidden, .td:first-child,.td:nth-of-type(10), .td:nth-of-type(11),.td:nth-of-type(12)').remove();
            $clonedRow.find('.edit-field').remove();
            $clonedRow.find('.display-field').removeClass('display-field');
            $clonedRow.append('<div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>');
            return $('<div class="tr"></div>').append($clonedRow.contents());
        }

        function toggleLoadingSpinner($button) {
            var htmlSpinner = '<i class="fa fa-spinner fa-spin fa-3x fa-fw actions"></i><span class="sr-only">Chargement...</span>';
            if($button.is(':visible')){
                $button.hide().after(htmlSpinner);
                $button.siblings('button').hide();
            }else{
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
        new LookManager();        
    });
});
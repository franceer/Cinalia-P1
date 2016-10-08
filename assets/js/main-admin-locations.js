define(['jquery', 'select2', 'jquery.validation'], function ($, select2, validation) {

    function LocationManager() {
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

    LocationManager.prototype = function () {
        var initHandlers = function () {
            $('.table').on('click', 'input[name=select-location]', function (e) {
                var $checked = $(this).closest('.table').find('input[name=select-location]:checked');

                if ($checked.length > 0)
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', false);                
                else
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', true);
            });

            $('.table').on('click', '.edit-button', function (e) {
                $button = $(this);
                $tr = $button.closest('.tr');
                setSelect2Tags($tr.find('select[name=tags]'));
                $tr.validate({
                    rules: {
                        name: 'required',
                        tags: 'required',
                        picture_url: 'required'
                    },
                    messages: {
                        name: 'Merci d\'indiquer le nom du produit',
                        tags: 'Merci de choisir un tag',
                        picture_url: 'Merci de définir une image'
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

                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'lieux' }, function (updated) {
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
                        url: '/admin/lieux/' + $(this).closest('.tr').find('[name=id]').val(),
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

            $('.add-grouped-button').on('click', function (e) {
                var $parentDocument = $(parent.document);
                var $locationsTable;

                if ($parentDocument.find('iframe[data-related-target]').length > 0)
                    $locationsTable = $parentDocument.find('iframe[data-related-target]+.linked-locations');
                else
                    $locationsTable = $parentDocument.find('#linked-locations');

                $('input[name=select-location]:checked').each(function () {
                    var $tr = $(this).closest('.tr');

                    if ($locationsTable.find('input[name=id][value=' + $tr.find('input[name=id]').val() + ']').length === 0) {
                        $locationsTable.append(getLocationRow($tr));
                    }
                }).prop('checked', false);

                if ($locationsTable.children('.tr:not(.thead-inverse)').length > 0)
                    $locationsTable.next().hide();
            });          

            $('.add-button').on('click', function (e) {
                var $button = $(this);
                var $form = $button.closest('form');
                var validator = $form.data('validator');

                if (validator.form()) {

                    toggleLoadingSpinner($button);

                    addOrUpdateAsset($form, { method: 'POST', target: 'lieux' }, function (data) {
                        if (data.status === 'error') {
                            showMessages($('.alert'), data.message, 'alert-danger');
                            toggleLoadingSpinner($button);
                        } else {                            
                            $form.find('select').val('').trigger('change');
                            validator.resetForm();
                            $form.trigger('reset').find('.form-group.has-success').removeClass('has-success');
                            $('.table .thead-inverse').after(data);                           
                            $tr = $('.tr.newly-added').removeClass('newly-added');
                            setSelect2Tags($tr.find('select[name=tags]'));

                            showMessages($('#alert-add'), $tr.find('input[name=name]').val() + ' ajouté avec succès', 'alert-success');
                            toggleLoadingSpinner($button);
                            document.getElementsByTagName('body')[0].scrollIntoView();

                            if (inIframe()) {
                                $tr.find('.modal-hidden').hide();
                                var $locationsTable = $(parent.document).find('.open-locations-modal+.table');
                                $locationsTable.append(getLocationRow($tr));

                                if ($locationsTable.children('.tr:not(.thead-inverse)').length > 0)
                                    $locationsTable.next().hide();
                            }
                        }                        
                    });
                }
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
        };
        
        var setSelect2Tags = function ($element) {
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
                language: this.select2FR,
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
            $('#admin-add-location-form').validate({
                rules: {
                    brand_id: 'required',
                    name: 'required',
                    tags: 'required',
                    picture_url: 'required',
                    commercial_url: 'required',
                    price: 'required'
                },
                messages: {
                    brand_id: 'Merci de choisir une marque',
                    name: 'Merci d\'indiquer le nom du produit',
                    tags: 'Merci de choisir un tag',
                    picture_url: 'Merci de renseigner une image',
                    commercial_url: 'Merci de renseigner une url',
                    price: 'Merci de renseigner un prix'
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
            var data = {};

            $container.find('input:not([disabled], [type=search], [name*="select-"]), select, textarea').each(function () {
                var $input = $(this);
                var type = $input.attr('type');
                var value;
                
                if (type && type === 'checkbox') 
                    value = $input.is(':checked');
                else
                    value = $input.val();

                data[$input.attr('name')] = (typeof value !== 'undefined' && value !== '' ? value : null);
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

        function getLocationRow($tr) {
            var $clonedRow = $tr.clone();
            $clonedRow.children('.modal-hidden, .td:first-child,.td:nth-of-type(13),.td:nth-of-type(14)').remove();
            $clonedRow.find('.edit-field').remove();
            $clonedRow.find('.display-field').removeClass('display-field');
            $clonedRow.append('<div class="td"><div class="form-group"><input type="text" name="appearing_context" class="form-control" /></div></div><div class="td"><div class="form-group"><input type="text" name="time_codes" class="form-control" /></div></div><div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>');
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
        new LocationManager();        
    });
});
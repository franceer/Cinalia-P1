define(['jquery', 'select2', 'jquery.validation'], function ($, select2, validation) {

    function ProductManager() {
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
        this.setSelect2Brands($('#brand_id'));
        this.setSelect2Categories($('#categories'));
        this.initHandlers();
        this.initFormValidators();

        if (this.inIframe()) {
            $('.modal-hidden').hide();
            $('.add-grouped-button').show();
        }
    }

    ProductManager.prototype = function () {
        var initHandlers = function () {
            $('.table').on('click', 'input[name=select-product]', function (e) {
                var $checked = $(this).closest('.table').find('input[name=select-product]:checked');

                if ($checked.length > 0)
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', false);                
                else
                    $('.add-grouped-button, .delete-grouped-button').prop('disabled', true);
            });

            $('.table').on('click', '.edit-button', function (e) {
                $button = $(this);
                $tr = $button.closest('.tr');
                setSelect2Brands($tr.find('select[name=brand_id]'));
                setSelect2Categories($tr.find('select[name=categories]'));
                $tr.validate({
                    rules: {
                        brand_id: 'required',
                        name: 'required',
                        categories: 'required',
                        picture_url: 'required',
                        commercial_url: 'required',
                        price: { required: true, number: true }
                    },
                    messages: {
                        brand_id: 'Merci de choisir une marque',
                        name: 'Merci d\'indiquer le nom du produit',
                        categories: 'Merci de choisir une catégorie',
                        picture_url: 'Merci de définir une image',
                        commercial_url: 'Merci d\'indiquer une url commerciale',
                        price: { required: 'Merci d\'indiquer un prix', number: 'Merci d\'indiquer un prix valide' },
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
                    $button.hide().next().hide().after('<i class="fa fa-spinner fa-spin fa-3x fa-fw actions"></i><span class="sr-only">Chargement...</span>');

                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'produits' }, function (updated) {
                        $tr.replaceWith(updated);
                        $tr = $('.tr.newly-added').removeClass('newly-added');
                        setSelect2Brands($tr.find('select[name=brand_id]'));
                        setSelect2Categories($tr.find('select[name=categories]'));
                        $button.show().next().show().siblings('.fa-spinner, .sr-only').remove();
                    });
                }
            });

            $('.table').on('click', '.delete-button', function (e) {
                if (confirm('Etes-vous sûr de vouloir supprimer cet élément ?')) {
                    $tr = $(this).closest('.tr');
                    $.ajax({
                        url: '/admin/produits/' + $(this).closest('.tr').find('[name=id]').val(),
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
                    $tr.find('select[name=brand_id]+.select2-container').remove();
                    $tr.find('select[name=categories]+.select2-container').remove();
                }
            });

            $('.add-grouped-button').on('click', function (e) {
                var $parentDocument = $(parent.document);
                var $productsTable;

                if ($parentDocument.find('iframe[data-related-target]').length > 0)
                    $productsTable = $parentDocument.find('iframe[data-related-target]~.linked-products');
                else
                    $productsTable = $parentDocument.find('#linked-products');

                $('input[name=select-product]:checked').each(function () {
                    var $tr = $(this).closest('.tr');

                    if ($productsTable.find('input[name=id][value=' + $tr.find('input[name=id]').val() + ']').length === 0) {                        
                        $productsTable.append(getProductRow($tr, $productsTable.attr('data-type')));
                    }
                }).prop('checked', false);

                //Hide empty products sentence
                if ($productsTable.children('.tr:not(.thead-inverse)').length > 0)
                    $productsTable.next().hide();
            });          

            $('.add-button').on('click', function (e) {
                var $button = $(this);
                var $form = $button.closest('form');
                var validator = $form.data('validator');

                if (validator.form()) {
                    $button.hide().after('<i class="fa fa-spinner fa-spin fa-3x fa-fw actions"></i><span class="sr-only">Chargement...</span>');

                    addOrUpdateAsset($form, { method: 'POST', target: 'produits' }, function (data) {
                        if (data.status === 'error') {
                            showMessages($('.alert'), data.message, 'alert-danger');
                        } else {                            
                            $form.find('select').val('').trigger('change');
                            validator.resetForm();
                            $form.trigger('reset').find('.form-group.has-success').removeClass('has-success');
                            $('.open-parent-product-modal').text('Choisir un produit');
                            $('.table .thead-inverse').after(data);                           
                            $tr = $('.tr.newly-added').removeClass('newly-added');                            
                            setSelect2Brands($tr.find('select[name=brand_id]'));
                            setSelect2Categories($tr.find('select[name=categories]'));

                            showMessages($('#alert-add'), $tr.find('input[name=name]').val() + ' ajouté avec succès', 'alert-success');
                            $button.show().siblings('.fa-spinner, .sr-only').remove();
                            document.getElementsByTagName('body')[0].scrollIntoView();

                            if (inIframe()) {
                                $tr.find('.modal-hidden').hide();
                                var $productsTable;

                                if ($parentDocument.find('iframe[data-related-target]').length > 0)
                                    $productsTable = $parentDocument.find('iframe[data-related-target]+.linked-products');
                                else
                                    $productsTable = $parentDocument.find('#linked-products');

                                $productsTable.append(getProductRow($tr, $productsTable.attr('data-type')));

                                if ($productsTable.children('.tr:not(.thead-inverse)').length > 0)
                                    $productsTable.next().hide();
                            }
                        }                        
                    });
                }
            });

            $('#add-category').on('click', function (e) {
                var $addCategoryForm = $(this).closest('form').data('validator');
                if ($addCategoryForm.form()) {
                    $.post('/admin/categories', { name: $addCategoryForm.currentElements.filter('[name=name]').val(), path: $addCategoryForm.currentElements.filter('[name=path]').val() }, function (data) {
                        if (data.status === 'error')
                            showMessages($('.alert'), data.message, 'alert-danger');
                        else {
                            $addCategoryForm.currentElements.val('').parent().removeClass('has-success');
                            $('select[name=categories]').append('<option value="' + data.object.id + '" selected>' + data.object.name + ' (' + data.object.path + ')' + '</option>').trigger('change');
                        }
                    });
                }
            });

            $('#parent-product-modal').on('show.bs.modal', function (e) {
                var $button =$(e.relatedTarget);
                $('#add-parent-product').data('relatedTargets', { input: $button.siblings('[name=parent_product_id]'), button: $button });
            });

            $('#add-parent-product').on('click', function (e) {
                var $parentProductIDInputModal = $('#parent-product-id');
                var $parentProductIDInput = $(e.target).data('relatedTargets').input;
                $(e.target).data('relatedTargets').button.text('ID Produit : ' + $parentProductIDInputModal.val());
                $parentProductIDInput.val($parentProductIDInputModal.val());
                $('#parent-product-modal').modal('hide');
                $parentProductIDInputModal.val('');
            });
        };

        var setSelect2Brands = function ($element) {
            if (!$element)
                $element = $('select[name=brand_id]');

            var selectBrands = $element.select2({
                placeholder: 'Choisissez une marque...',
                language: this.select2FR,
                width: '100%',
                multiple: true,
                tags: true,
                maximumSelectionLength: 1
            });
            selectBrands.each(function () { $(this).data('select2').$selection.addClass('form-control form-control-danger form-control-success'); });

            $element.on('change', function () {
                var $form = $element.closest('form');
                $form.data('validator').element(this);
                $form.find('input[name=brand_name]').val($(this).children('option:selected').text());
            });
        };

        var setSelect2Categories = function ($element) {
            if (!$element)
                $element = $('select[name=categories]');

            var selectCategories = $element.select2({
                width: '100%',
                placeholder: 'Choisissez une catégorie...',
                tags: true,
                createTag: function (params) {
                    return undefined;
                },
                multiple: true,
                language: this.select2FR,
                ajax: {
                    url: '/admin/categories',
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

            selectCategories.each(function () { $(this).data('select2').$selection.addClass('form-control form-control-danger form-control-success'); });

            $element.on('change', function () {
                $element.closest('form').data('validator').element(this);
            });

            return selectCategories;
        };

        var initFormValidators = function () {
            $('#admin-add-product-form').validate({
                rules: {
                    brand_id: 'required',
                    name: 'required',
                    categories: 'required',
                    picture_url: 'required',
                    commercial_url: 'required',
                    price: 'required'
                },
                messages: {
                    brand_id: 'Merci de choisir une marque',
                    name: 'Merci d\'indiquer le nom du produit',
                    categories: 'Merci de choisir une catégorie',
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
                    error.addClass('form-control-label col-md-6 offset-md-3');
                    error.appendTo(element.closest('.form-group'));
                }
            });

            $('#add-category-form').validate({
                rules: {
                    name: 'required',
                    path: 'required'
                },
                messages: {
                    name: 'Merci d\'indiquer le nom de la catégorie',
                    path: 'Merci d\'indiquer le path de la catégorie'
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

            $container.find('input:not([disabled], [type=search],[name*="select-"]), select, textarea').each(function () {
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

        function getProductRow($tr, rowType) {
            var rawHTML = {
                movie: '<div class="td"><div class="form-group"><input type="checkbox" name="matching_status_id" value="1" class="form-control" /></div></div><div class="td"><div class="form-group"><input type="text" name="appearing_context" class="form-control" /></div></div><div class="td"><div class="form-group"><input type="text" name="time_codes" class="form-control" /></div></div><div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>',
                look: '<div class="td"><div class="form-group"><input type="checkbox" name="matching_status_id" value="1" class="form-control" /></div></div><div class="td"><div class="form-group"><select name="body_location_id" class="form-control"><option value="1">Tête</option><option value="2">Torse</option><option value="3">Mains</option><option value="4">Jambes</option><option value="5">Pieds</option></select></div></div><div class="td"><div class="form-group"><input type="text" name="appearing_context" class="form-control" /></div></div><div class="td"><div class="form-group"><input type="text" name="order" class="form-control" /></div></div><div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>',
                set: '<div class="td"><div class="form-group"><input type="checkbox" name="matching_status_id" value="1" class="form-control" /></div></div><div class="td"><div class="form-group"><input type="text" name="appearing_context" class="form-control" /></div></div><div class="td"><div class="form-group"><button type="button" class="btn btn-default img-map-button"><i class="fa fa-bullseye" aria-hidden="true"></i></button><i class="fa fa-check" aria-hidden="true"></i><input type="hidden" name="x_offset" /><input type="hidden" name="y_offset" /></div></div><div class="td"><button type="button" class="delete-linked-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>'
            };

            var $clonedRow = $tr.clone();
            $clonedRow.children('.modal-hidden, .td:first-child,.td:nth-of-type(13),.td:nth-of-type(14)').remove();
            $clonedRow.find('.edit-field').remove();
            $clonedRow.find('.display-field').removeClass('display-field');
            $clonedRow.append(rawHTML[rowType]);
            return $('<div class="tr"></div>').append($clonedRow.contents());
        }

        return {
            inIframe: inIframe,
            initHandlers: initHandlers,
            setSelect2Brands: setSelect2Brands,
            setSelect2Categories: setSelect2Categories,
            initFormValidators: initFormValidators
        };
    }();       

    $(function () {
        new ProductManager();        
    });
});
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
                $this = $(this);
                $tr = $this.closest('.tr');
                setSelect2Brands($tr.find('select[name=brand_id]'));
                setSelect2Categories($tr.find('select[name=categories]'));
                $tr.validate({
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
                        price: 'Merci de renseigner un prix',
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
                $tr.find('.display-field').hide();
                $tr.find('.edit-field').show();
                $tr.find('.edit-button').hide();
                $tr.find('.delete-button').hide();
                $tr.find('.save-button').show();
            });

            $('.table').on('click', '.save-button', function (e) {
                var $this = $(this);
                var $tr = $this.closest('.tr');

                if ($tr.data('validator').form()) {
                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'produits' }, function (updated) {
                        $tr.replaceWith(updated);
                        $tr = $('.tr.newly-added').removeClass('newly-added');
                        setSelect2Brands($tr.find('select[name=brand_id]'));
                        setSelect2Categories($tr.find('select[name=categories]'));
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
                            showErrors($('#alert-table'), data.message);
                        else
                            $tr.remove();
                    });
                }
            });

            $('.add-grouped-button').on('click', function (e) {
                var $productsTable = $(parent.document).find('.open-products-modal+.table');
                $('input[name=select-product]:checked').each(function () {
                    var $tr = $(this).closest('.tr');

                    if ($productsTable.find('input[name=id][value=' + $tr.find('input[name=id]').val() + ']').length === 0) {                        
                        $productsTable.append(getProductRow($tr));
                    }
                }).prop('checked', false);
            });

            $('.add-button').on('click', function (e) {
                var $form = $(this).closest('form');
                var validator = $form.data('validator');

                if (validator.form()) {
                    var $container = $('#form-toggle');

                    addOrUpdateAsset($container, { method: 'POST', target: 'produits' }, function (data) {
                        if (data.status === 'error') {
                            showErrors($('.alert'), data.message);
                        } else {
                            var $formElements = $container.find('input:not([disabled]):not([type=search]), select, textarea')
                            $formElements.filter('input, textarea').val('');
                            $formElements.filter('select').val('');
                            $('.open-parent-product-modal').text('Choisir un produit');
                            $('.table .thead-inverse').after(data);                           
                            $tr = $('.tr.newly-added').removeClass('newly-added');                            
                            setSelect2Brands($tr.find('select[name=brand_id]'));
                            setSelect2Categories($tr.find('select[name=categories]'));

                            if (inIframe()) {
                                $tr.find('.modal-hidden').hide();
                                var $productsTable = $(parent.document).find('.open-products-modal+.table');
                                $productsTable.append(getProductRow($tr));
                            }
                        }

                        validator.resetForm();
                    });
                }
            });

            $('#add-category').on('click', function (e) {
                var $addCategoryForm = $(this).closest('form').data('validator');
                if ($addCategoryForm.form()) {
                    $.post('/admin/categories', { name: $addCategoryForm.currentElements.filter('[name=name]').val(), path: $addCategoryForm.currentElements.filter('[name=path]').val() }, function (data) {
                        if (data.status === 'error')
                            showErrors($('.alert'), data.message);
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
                    categories: 'Merci d\'indiquer le path de la catégorie'
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

            $container.find('input:not([disabled]):not([type=search]), select, textarea').each(function () {
                var $input = $(this);
                var value = $input.val();
                data[$input.attr('name')] = (value && value !== '' ? value : null);
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

        function showErrors($element, message) {
            $element
				.attr('class', 'alert alert-danger')
				.text(message)
				.removeAttr('hidden');
        }

        function getProductRow($tr) {
            var $clonedRow = $tr.clone();
            $clonedRow.children('.modal-hidden, .td:first-child,.td:nth-of-type(13),.td:nth-of-type(14)').remove();
            $clonedRow.append('<div class="td"><input type="checkbox" name="matching_status_id" value="1" /></div><div class="td"><input type="text" name="appearing_context" /></div><div class="td"><input type="text" name="time_codes" /></div><div class="td"><button type="button" class="delete-product-button"><i class="fa fa-trash" aria-hidden="true"></i></button></div>');
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
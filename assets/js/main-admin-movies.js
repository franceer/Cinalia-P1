define(['jquery', 'select2', 'jquery.validation'], function ($, select2, validation) {
    function MovieManager() {
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
        this.initHandlers();
        this.initFormValidators();
        this.setSelect2Genres($('#media_genre_id'));
        this.setSelect2Categories($('#categories'));
    }

    MovieManager.prototype = function () {
        var setSelect2Genres = function ($element) {
            if (!$element)
                $element = $('select[name=media_genre_id]');

            var selectBrands = $element.select2({
                placeholder: 'Choisissez un genre...',
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
                $form.find('input[name=media_genre_name]').val($(this).children('option:selected').text());
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
            $('#admin-add-movie-form').validate({
                rules: {
                    name: 'required',
                    theater_release_date: 'required',
                    release_country: 'required',
                    duration: 'required',
                    poster_url: 'required',
                    video_url: 'required',
                    media_genre_id: 'required'                    
                },
                messages: {
                    name: 'required',
                    theater_release_date: 'required',
                    release_country: 'required',
                    duration: 'required',
                    poster_url: 'required',
                    video_url: 'required',
                    media_genre_id: 'required'
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

        var initHandlers = function () {
            $('.table:not(#linked-products)').on('click', '.edit-button', function (e) {
                $this = $(this);
                $tr = $this.closest('.tr');
                setSelect2Genres($tr.find('select[name=media_genre_id]'));
                setSelect2Categories($tr.find('select[name=categories]'));
                $tr.validate({
                    rules: {
                        name: 'required',
                        theater_release_date: 'required',
                        release_country: 'required',
                        duration: 'required',
                        poster_url: 'required',
                        video_url: 'required',
                        media_genre_id: 'required'
                    },
                    messages: {
                        name: 'required',
                        theater_release_date: 'required',
                        release_country: 'required',
                        duration: 'required',
                        poster_url: 'required',
                        video_url: 'required',
                        media_genre_id: 'required'
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
                $tr.find('.edit-button').hide();
                $tr.find('.display-field').hide();
                $tr.find('.edit-field').show();                
                $tr.find('.delete-button').hide();
                $tr.find('.save-button').show();
                $tr.find('.close-button').show();
            });

            $('.table:not(#linked-products)').on('click', '.save-button', function (e) {
                var $this = $(this);
                var $tr = $this.closest('.tr');

                if ($tr.data('validator').form()) {
                    addOrUpdateAsset($tr, { id: $tr.find('[name=id]').val(), method: 'PUT', target: 'films' }, function (updated) {
                        $tr.replaceWith(updated);
                        $tr = $('tr.newly-added').removeClass('newly-added');
                        setSelect2Categories($tr.find('select[name=categories]'));
                    });
                }
            });

            $('.table:not(#linked-products)').on('click', '.delete-button', function (e) {
                if (confirm('Etes-vous sûr de vouloir supprimer cet élément ?')) {
                    $tr = $(this).closest('.tr');
                    $.ajax({
                        url: '/admin/films/' + $(this).closest('.tr').find('[name=id]').val(),
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

            $('.table:not(#linked-products)').on('click', '.close-button', function (e) {
                if (confirm('Souhaitez-vous arrêter la modification de cet élement (vos modifications seront perdues) ?')) {
                    $tr = $(this).closest('.tr');                   
                    $tr.html($tr.data('htmlBackup'));
                    $tr.find('select[name=media_genre_id]+.select2-container').remove();
                    $tr.find('select[name=categories]+.select2-container').remove();
                }
            });

            $('#linked-products').on('click', '.delete-product-button', function (e) {
                $(e.target).closest('.tr').remove();
            });

            $('.add-button').on('click', function (e) {
                if ($(this).closest('form').data('validator').form()) {
                    var $container = $('#form-toggle');

                    addOrUpdateAsset($container, { method: 'POST', target: 'films' }, function (data) {
                        if (data.status === 'error') {
                            showMessages($('#alert-add'), data.message, 'alert-danger');
                        } else {
                            var $formElements = $container.find('input:not([disabled]):not([type=search]), select, textarea')
                            $formElements.filter('input, textarea').val('');
                            $formElements.filter('select').val('');
                            showMessages($('#alert-add'), data.videoMedia.name + ' ajouté avec succès', 'alert-success');
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
        };

        function addOrUpdateAsset($container, config, cb) {
            var data = { products: [] };
            $container.find('input:not([disabled]):not([type=search]):not(#linked-products input), select:not(#linked-products select), textarea:not(#linked-products textarea)').each(function () {
                var $input = $(this);
                var value = $input.val();
                data[$input.attr('name')] = (value && value !== '' ? value : null);
            });

            $container.find('#linked-products .tr:not(.thead-inverse)').each(function () {
                var $tr = $(this);
                var id = $tr.find('[name=id]').val();
                var matchingStatusID = $tr.find('[name=matching_status_id]').is(':checked') ? 1 : 2;
                var appearingContext = $tr.find('[name=appearing_context]').val();
                var timeCodes = $tr.find('[name=time_codes]').val();
                data.products.push({ product_id: id, matching_status_id: matchingStatusID, appearing_context: appearingContext, time_codes: timeCodes });
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
				.attr('class', 'alert '+ style)
				.text(message)
				.removeAttr('hidden');
        }

        return {
            setSelect2Genres: setSelect2Genres,
            setSelect2Categories: setSelect2Categories,
            initFormValidators: initFormValidators,
            initHandlers: initHandlers
        };
    }();

    $(function () {
        new MovieManager();
    });
});
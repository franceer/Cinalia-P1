define(['jquery', 'select2'], function ($, select2) {
    $(function () {
        $('.upload-button').on('click', function () {
            $('#file-upload').click();
            $('.progress-bar').text('0%');
            $('.progress-bar').width('0%');
        });

        $('#file-upload').on('change', function () {

            var files = $(this).get(0).files;

            if (files.length > 0) {
                // One or more files selected, process the file upload
                var file = files[0];
                var formData = new FormData();
                formData.append('file-upload', file, file.name);

                $.ajax({
                    url: '/admin/films',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(data){
                        console.log('upload successful!');
                    },
                    xhr: function() {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();

                            // listen to the 'progress' event
                        xhr.upload.addEventListener('progress', function(evt) {

                            if (evt.lengthComputable) {
                                // calculate the percentage of upload completed
                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);

                                // update the Bootstrap progress bar with the new percentage
                                $('.progress-bar').text(percentComplete + '%');
                                $('.progress-bar').width(percentComplete + '%');

                                // once the upload reaches 100%, set the progress bar text to done
                                if (percentComplete === 100) {
                                    $('.progress-bar').html('Done');
                                }
                            }
                        }, false);

                        return xhr;
                    }   
                });
            }
        });

        $('select[name=brand_id]').on('change', function () {
            $('input[name=brand_name]').val($(this).children('option:selected').text());
        });

        $('table').on('click', '.edit-button', function (e) {
            $this = $(this);
            $tr = $this.closest('tr');
            $tr.find('.display-field').hide();            
            $tr.find('.edit-field').show();
            $tr.find('.edit-button').hide();
            $tr.find('.delete-button').hide();
            $tr.find('.save-button').show();
        });

        $('table').on('click', '.save-button', function (e) {
            var $this = $(this);
            var $tr = $this.closest('tr');
            addOrUpdateAsset($tr, { id: $this.closest('tr').find('[name=id]').val(), method: 'PUT', target: 'produits' }, function (updated) {
                $tr.replaceWith(updated);

                //$.each(updated, function (key, value) {
                //    if (value && value.name)
                //        $tr.find('[data-field-name=' + key + ']').parent().siblings('.display-field').text(value.name);
                //    else
                //        $tr.find('[name=' + key + ']').val(value).parent().siblings('.display-field').text(value);
                //});

                //$tr.find('.display-field').show();
                //$this.hide();
                //$this.siblings('.edit-button').show();
                //$tr.find('.edit-field').hide();
            });
        });

        $('.add-button').on('click', function (e) {
            var $container = $('#form-toggle');

            addOrUpdateAsset($container, { method: 'POST', target: 'produits' }, function (result) {
                if (result.status === 'error') {
                    console.log(result.message);
                } else {
                    var $formElements = $container.find('input:not([disabled]):not([type=search]), select, textarea')
                    $formElements.filter('input, textarea').val('');
                    $formElements.filter('select').val('0');
                    $('.open-parent-product-modal').text('Choisir un produit');
                }
            });           
        });

        $('table').on('click', '.delete-button', function (e) {
            $tr = $(this).closest('tr');
            $.ajax({
                url: '/admin/' + $(this).attr('data-target') + '/' + $(this).closest('tr').find('[name=id]').val(),
                type: 'DELETE'
            })
            .done(function (data) {
                if (data.status === 'error') 
                    console.log(data.message);
                else 
                    $tr.remove();                
            });
        });

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

        $('#add-parent-product').on('click', function (e) {
            var $parentProductIDInput = $('#parent-product-id');
            $('.open-parent-product-modal').text('ID Produit : ' + $parentProductIDInput.val());
            $('#add-parent-product-id').val($parentProductIDInput.val());
            $('#parent-product-modal').modal('hide');
            $parentProductIDInput.val('');
        });

        $('select[name=categories]').select2({
            placeholder: 'Choisissez une catégorie...',
            tags: true,
            createTag: function(params) {
                return undefined;
            },
            multiple: true,
            ajax: {
                url: '/admin/produits/categories',
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
    });
});
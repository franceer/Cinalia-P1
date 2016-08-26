define(['bootstrap', 'tether', 'jquery', 'jquery.validation', 'notify', 'velocity'], function (bootstrap, tether, jquery, validation, notify, velocity) {
    jquery(function () {
        jquery(window).scroll(function () {
            if (jquery(this).scrollTop() > 1) {
                jquery('header').addClass("sticky");
            }
            else {
                jquery('header').removeClass("sticky");
            }
        });

        if (inIframe()) {
            jquery('.modal-hidden').hide();
            jquery('.container').removeClass('container').addClass('container-fluid');
        }

        function inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }   

		jquery('#flash-message').each(function(){
			var $element = jquery(this);
			
			if($element.attr('data-message-type') === 'notify')
			{
				jquery.notify({
					message: $element.text()					
				},{
					element: 'body',
					allow_dismiss: true,
					placement: {
						from: 'top',
						align: 'center'
					},
					offset: 50,
					type: $element.attr('data-style'),
					delay: 5000
				});
			}else{
				jquery($element.attr('data-element') + ' .alert')
				.attr('class', 'alert alert-' + $element.attr('data-style'))
				.text($element.text())
				.removeAttr('hidden');
				
				if($element.attr('data-message-type') === 'nav'){				
					jquery($element.attr('data-actionnable')).click();
				}else if($element.attr('data-message-type') === 'modal'){
					jquery($element.attr('data-actionnable')).modal();
				}	
			}					
		});

		jquery('#main-modal').on('hidden.bs.modal', function (e) {
		    jquery('#iframe-go-back').removeClass('visible');
		});

        jquery('a[data-modal]').on('click', function (e) {
            if (inIframe()) {
                jquery(window.parent.document).find('#iframe-go-back').addClass('visible');
                return;
            }

            e.preventDefault();

            var clicked = jquery(this);

            jquery('#iframe-go-back').attr('href', clicked.attr('href')).children('span').text(clicked.attr('data-modal-type'));
            jquery('#main-modal iframe').attr('src', clicked.attr('href'));
            setTimeout(function () {
                jquery('#main-modal').modal();
            }, 300);
        });

        jquery('#iframe-go-back').on('click', function (e) {
            e.preventDefault();

            var clicked = jquery(this);
            jquery('#main-modal iframe').attr('src', jquery(this).attr('href'));
            clicked.removeClass('visible');
        });
		
		jquery('.down-button').on('click', function(){
			jquery(jquery(this).attr('data-down-to')).velocity('scroll', {duration: 1000, easing: 'easeOutCubic'});			
		})
		
		jquery('#step1 .next').on('click', function (){
			if(signupValidator.form()){
				jquery('#step1').hide('fast');
				jquery('#step2').show('slow').find('#firstname').focus();
			}
		});
		
		jquery('#step2 .back').on('click', function (){
			jquery('#step2').hide('fast');
			jquery('#step1').show('slow').find('#username').focus();
		});
		
		 var signupValidator = jquery('#signup-form').validate({
			 rules:  {
				 firstname: 'required',
                 lastname: 'required',
                 username: {
					 required: true,
					 email: true,
					 minlength: 5,
					 maxlength: 100
				 },
                 password: {
					 required: true,
					 minlength: 5
				 },
				 'confirm-password': {
					 equalTo: '#password',
					 required: true
				 },
				 agree: 'required'
			 },
			 messages: {
				 firstname: 'Merci d\'indiquer votre prénom',
				 lastname: 'Merci d\indiquer votre nom',
				 password: {
					 required: 'Merci d\'indiquer un mot de passe',
					 minlength: 'Votre mot de passe doit comporter 5 charactères minimum'
				 },
				 'confirm-password': {
					 equalTo: 'Les mots de passe doivent correspondre',
					 required: 'Ce champ est requis'
				 },
				 username:
				 {
					 required: 'Merci d\'indiquer votre adresse email', 
					 email: 'Merci de respecter le format d\'email suivant: email@domaine.com'
				 },
				 agree: 'Merci d\'accepter nos conditions d\'utilisation'
			 },
			 highlight: function(element) {					
				 getValidatorParent(element).removeClass('has-success').addClass('has-danger');
			 },
			 unhighlight: function(element) {
				 getValidatorParent(element).removeClass('has-danger').addClass('has-success');
			 },
			 errorPlacement: function(error, element){
				 error.addClass('form-control-label col-md-6 offset-md-3');
				 error.appendTo(element.closest('.form-group'));
			 }
		 });
		 
		 jquery('#reset-form').validate({
			 rules:  {				
                 password: {
					 required: true,
					 minlength: 5
				 },
				 'confirm-password': {
					 equalTo: '#new-password',
					 required: true
				 }
			 },
			 messages: {
				 password: {
					 required: 'Merci d\'indiquer un mot de passe',
					 minlength: 'Votre mot de passe doit comporter 5 charactères minimum'
				 },
				 'confirm-password': {
					 equalTo: 'Les mots de passe doivent correspondre',
					 required: 'Ce champ est requis'
				 }
			 },
			 highlight: function(element) {					
				 getValidatorParent(element).removeClass('has-success').addClass('has-danger');
			 },
			 unhighlight: function(element) {
				 getValidatorParent(element).removeClass('has-danger').addClass('has-success');
			 },
			 errorPlacement: function(error, element){
				 error.addClass('form-control-label col-md-6 offset-md-3');
				 error.appendTo(element.closest('.form-group'));
			 }
		 });
		 
		 jquery('#forgot-form').validate({
			 rules:  {				
                 email: {
					 required: true,
					 email: true
				 }
			 },
			 messages: {				
				 email: {
					 required: 'Vous devez spécifier un email',
					 email: 'Merci de respecter le format d\'email suivant: email@domaine.com'
				 }
			 },
			 highlight: function(element) {					
				 getValidatorParent(element).removeClass('has-success').addClass('has-danger');
			 },
			 unhighlight: function(element) {
				 getValidatorParent(element).removeClass('has-danger').addClass('has-success');
			 },
			 errorPlacement: function(error, element){
				 error.addClass('form-control-label col-md-6 offset-md-3');
				 error.appendTo(element.closest('.form-group'));
			 }
		 });
		
		 function getValidatorParent(element){
			 var $parent;
			 var $element = jquery(element);
			
			 if($element.attr('type') === 'checkbox')
				 $parent = $element.parents('.form-check, .form-group');
			 else
				 $parent = $element.parent();
				
			 return $parent;
		 }
		 
		 jquery('#search-button').on('click', function(e){
			jquery('#search-bar').css('display', 'flex').siblings().css('display', 'none');
			jquery('#top-search-box').focus();
		 });
		 
		 jquery('#close-search-bar-button').on('click', function(e){
			 jquery('#top-search-box').val('');
			 jquery('#search-bar').css('display', 'none').siblings().css('display', 'flex');
		 });
		 
		jquery('#top-search-box, #home-search-box').keypress(function (e) {
			if (e.which === 13) {
				jquery(this).closest('form').submit();
				return false;
			}
		});
		
		jquery('.content').on('click', '.bookmark', function(e){
			var $this = jquery(this);
			
			jquery.post('/save-bookmark', {action: $this.hasClass('bookmarked') ? 'destroy' : 'save', objectID: $this.attr('data-object-id'), objectType: $this.attr('data-object-type')}).done(function(data){
			    if (data.status === 'saved') {
			        $this.addClass('bookmarked');

			        if ($this.text() == 'Sauvegarder')
			            $this.text('Sauvegardé');
			    }
			    else if (data.status === 'destroyed') {
			        $this.removeClass('bookmarked');

			        if ($this.text() == 'Sauvegardé')
			            $this.text('Sauvegarder');
			    }
			    else {
			        jquery.notify({
			            message: data.message
			        }, {
			            element: 'body',
			            allow_dismiss: true,
			            placement: {
			                from: 'top',
			                align: 'center'
			            },
			            offset: 50,
			            type: 'danger',
			            delay: 5000
			        });
			    }
			});
		});

		jquery('.like').on('click', function (e) {
		    var $this = jquery(this);

		    jquery.post('/like', { action: $this.hasClass('liked') ? 'unlike' : 'like', objectID: $this.attr('data-object-id'), objectType: $this.attr('data-object-type') }).done(function (data) {
		        if (data.status === 'liked') {
		            $this.addClass('liked');
		            var $el = jquery('#like-count');
		            $el.text(parseInt($el.text().trim()) + 1)
		        }
		        else if (data.status === 'unliked') {
		            $this.removeClass('liked');
		            var $el = jquery('#like-count');
		            $el.text(parseInt($el.text().trim()) - 1)
		        }
		        else {
		            jquery.notify({
		                message: data.message
		            }, {
		                element: 'body',
		                allow_dismiss: true,
		                placement: {
		                    from: 'top',
		                    align: 'center'
		                },
		                offset: 50,
		                type: 'danger',
		                delay: 5000
		            });
		        }
		    });
		});

		jquery('#top-bar, #contact-us').on('click', function (e) {
		    var $topBar = jquery('#top-bar');
		    var $tchatBox = $topBar.parent();

		    if(!$tchatBox.hasClass('visible')){		        
		        $topBar.css('cursor', 'default').children('button').css('opacity', 1);		        
		        $tchatBox.velocity({ translateY: ['0', '87%'] }, { duration: 200 });
		        $tchatBox.toggleClass('visible');
		    }
		});

		jquery('#top-bar button').on('click', function (e) {
		    e.stopPropagation();
		    var $button = jquery(this);
		    var $tchatBox = $button.closest('#tchat-box');

		    if ($tchatBox.hasClass('visible')) {
		        $button.css('opacity', 0);
		        $tchatBox.children('#top-bar').css('cursor', 'pointer');
		        $tchatBox.velocity({ translateY: ['87%', '0'] }, { duration: 200 });
		        $tchatBox.toggleClass('visible');
		    }
		});

		jquery('#contact-send').on('click', function (e) {
		    jquery.post('/contact', { from: jquery('#contact-email').val(), subject: jquery('#contact-subject').val(), message: jquery('#contact-message').val() }).done(function (data) {
		        if (data.status === 'sent'){
		            jquery.notify({
		                message: data.message
		            }, {
		                element: 'body',
		                allow_dismiss: true,
		                placement: {
		                    from: 'top',
		                    align: 'center'
		                },
		                offset: 50,
		                type: 'success',
		                delay: 5000
		            });

		            jquery('#tchat-box').toggleClass('visible').velocity({ translateY: ['87%', '0'] }, { duration: 200 }).children('#top-bar').css('cursor', 'pointer');
		        }		           
		        else if (data.status === 'error')
		            console.log(data.message);
		    });
		});
    });
});
define(['bootstrap', 'tether', 'jquery', 'velocity', 'jquery.validation'], function (bootstrap, tether, jquery, velocity, validation) {
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

		jquery('#auth-message').each(function(){
			var $element = jquery(this)
			
			if($element.attr('data-message-type') === 'signin'){
				jquery('#signin-nav .alert-danger').text($element.text()).removeAttr('hidden');
				jquery('#login-toggle').click();
			}
			else{
				jquery('#signup-modal .alert-danger').text($element.text()).removeAttr('hidden');
				jquery('#signup-modal').modal();
			}
					
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
                $('#main-modal').modal();
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
			if(validator.form()){
				jquery('#step1').hide('fast');
				jquery('#step2').show('slow');
			}
		});
		
		jquery('#step2 .back').on('click', function (){
			jquery('#step2').hide('fast');
			jquery('#step1').show('slow');
		});
		
		 var validator = jquery('#signup-nav').validate({
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
				 agree: 'required'
			 },
			 messages: {
				 firstname: 'Merci d\'indiquer votre prénom',
				 lastname: 'Merci d\indiquer votre nom',
				 password: {
					 required: 'Merci d\'indiquer un mot de passe',
					 minlength: 'Votre mot de passe doit comporter 5 charactères minimum'
				 },
				 username:
				 {
					 required: 'Merci d\'indiquer votre adresse email', 
					 email: 'Merci de respecter le format d\'email suivant: email@domain.com'
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
		
		jquery('.bookmark').on('click', function(e){
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
			    else if (data.status === 'error')
			        console.log(data.message);
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
		        else if (data.status === 'error')
		            console.log(data.message);
		    });
		});
    });
});
/*
Name: 			Portfolio - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version:	7.0.0
*/
(function($) {

	'use strict';

	/*
	Portfolio on Modal
	*/
	$('a[data-portfolio-on-modal]').magnificPopup({
		mainClass: 'portfolio-modal',
		type: 'inline',
		gallery: {
			enabled: true
		},
		callbacks: {
		  	open: function() {
		  		$('.owl-carousel').owlCarousel('refresh');
		  	},
		  	change: function() {
		  		setTimeout(function(){
			  		$('.owl-carousel').owlCarousel('refresh');
		  		}, 1);
		  	}
		}
	});

	$('a[data-portfolio-close]').on('click', function(e) {
		e.preventDefault();
		$.magnificPopup.instance.close();
		return false;
	});

	$('a[data-portfolio-prev]').on('click', function(e) {
		e.preventDefault();
		$.magnificPopup.instance.prev();
		return false;
	});

	$('a[data-portfolio-next]').on('click', function(e) {
		e.preventDefault();
		$.magnificPopup.instance.next();
		return false;
	});

	/*
	Ajax on Page
	*/
	var ajaxOnPage = {

		pages: [],
		currentPage: 0,
		total: 0,
		$ajaxBox: $('#porfolioAjaxBox'),
		$ajaxBoxContent: $('#porfolioAjaxBoxContent'),

		build: function() {

			var self = this;

			$('a[data-ajax-on-page]').each(function() {
				self.add($(this));
			});

			$(document).on('mousedown', 'a[data-ajax-on-page]', function (ev) {
				if (ev.which == 2) {
					ev.preventDefault();
					return false;
				}
			});

			// Key Press
			$(document.documentElement).on('keyup', function(e) {

				if( !$('.mfp-wrap').get(0) ) {

					// Next
					if (e.keyCode == 39) {
						self.next();
					}

					// Prev
					if (e.keyCode == 37) {
						self.prev();
					}

				}

			});

		},

		add: function($el) {

			var self = this,
				href = $el.attr('data-href');

			self.pages.push(href);
			self.total++;

			$el.on('click', function(e) {
				e.preventDefault();
				self.show(self.pages.indexOf(href));
			});

		},

		events: function() {

			var self = this;

			// Close
			$('a[data-ajax-portfolio-close]').on('click', function(e) {
				e.preventDefault();
				self.close();
			});

			if (self.total <= 1) {

				$('a[data-ajax-portfolio-prev], a[data-ajax-portfolio-next]').remove();

			} else {

				// Prev
				$('a[data-ajax-portfolio-prev]').on('click', function(e) {
					e.preventDefault();
					self.prev();
				});

				// Next
				$('a[data-ajax-portfolio-next]').on('click', function(e) {
					e.preventDefault();
					self.next();
				});

			}

			// Carousel
			if ($.isFunction($.fn['themePluginCarousel'])) {

				$(function() {
					$('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual)').each(function() {
						var $this = $(this),
							opts;

						var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginCarousel(opts);
					});
				});

			}

		},

		close: function() {

			var self = this;

			self.$ajaxBoxContent.empty();
			self.$ajaxBox.removeClass('ajax-box-init').removeClass('ajax-box-loading');

		},

		next: function() {

			var self = this;

			if(self.currentPage + 1 < self.total) {
				self.show(self.currentPage + 1);
			} else {
				self.show(0);
			}
		},

		prev: function() {

			var self = this;

			if((self.currentPage - 1) >= 0) {
				self.show(self.currentPage - 1);
			} else {
				self.show(self.total - 1);
			}
		},

		show: function(i) {

			var self = this;

			self.$ajaxBoxContent.empty();
			self.$ajaxBox.removeClass('ajax-box-init').addClass('ajax-box-loading');

			$('html, body').animate({
				scrollTop: self.$ajaxBox.offset().top - 100
			}, 300, 'easeOutQuad');

			self.currentPage = i;

			if (i < 0 || i > (self.total-1)) {
				self.close();
				return false;
			}

			// Ajax
			$.ajax({
				url: self.pages[i],
				cache: false,
				complete: function(data) {
				
					setTimeout(function() {

						self.$ajaxBoxContent.html(data.responseText).append('<div class="row"><div class="col-md-12"><hr class="tall mt-4"></div></div>');
						self.$ajaxBox.removeClass('ajax-box-loading');

						self.events();

					}, 1000);

				}
			});

		}

	}

	if($('#porfolioAjaxBox').get(0)) {
		ajaxOnPage.build();
	}

	/*
	Ajax on Modal
	*/
	$('a[data-ajax-on-modal]').magnificPopup({
		type: 'ajax',
		tLoading: '<div class="bounce-loader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
		mainClass: 'portfolio-ajax-modal',
		closeBtnInside: true,
		gallery: {
			enabled: true
		},
		callbacks: {
			ajaxContentAdded: function() {

				// Wrapper
				var $wrapper = $('.portfolio-ajax-modal');

				// Close
				$wrapper.find('a[data-ajax-portfolio-close]').on('click', function(e) {
					e.preventDefault();
					$.magnificPopup.close();
				});

				// Remove Next and Close
				if($('a[data-ajax-on-modal]').length <= 1) {
					
					$wrapper.find('a[data-ajax-portfolio-prev], a[data-ajax-portfolio-next]').remove();

				} else {

					// Prev
					$wrapper.find('a[data-ajax-portfolio-prev]').on('click', function(e) {
						e.preventDefault();
						$('.mfp-arrow-left').trigger('click');
						return false;
					});

					// Next
					$wrapper.find('a[data-ajax-portfolio-next]').on('click', function(e) {
						e.preventDefault();
						$('.mfp-arrow-right').trigger('click');
						return false;
					});

				}

				// Carousel
				$(function() {
					$('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual)').each(function() {
						var $this = $(this),
							opts;

						var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginCarousel(opts);
					});
				});

			}
		}
	});

	/*
	Load More
	*/
	var portfolioLoadMore = {

		pages: 0,
		currentPage: 1,
		$wrapper: $('#portfolioLoadMoreWrapper'),
		$btn: $('#portfolioLoadMore'),
		$btnWrapper: $('#portfolioLoadMoreBtnWrapper'),
		$loader: $('#portfolioLoadMoreLoader'),

		build: function() {

			var self = this

			self.pages = self.$wrapper.data('total-pages');

			if(self.pages <= 1) {

				self.$btnWrapper.remove();
				return;

			} else {

				self.$btn.on('click', function() {
					self.loadMore();
				});

				// Infinite Scroll
				if(self.$btn.hasClass('btn-portfolio-infinite-scroll')) {
					self.$btn.appear(function() {
						self.$btn.trigger('click');
					}, {
						data: undefined,
						one: false,
						accX: 0,
						accY: 0
					});
				}

			}

		},
		loadMore: function() {

			var self = this;

			self.$btn.hide();
			self.$loader.addClass('portfolio-load-more-loader-showing').show();

			// Ajax
			$.ajax({
				url: 'ajax/portfolio-ajax-load-more-' + (parseInt(self.currentPage)+1) + '.html',
				complete: function(data) {

					var $items = $(data.responseText);

					setTimeout(function() {

						self.$wrapper.append($items)

						self.$wrapper.isotope('appended', $items);

						self.currentPage++;

						if(self.currentPage < self.pages) {
							self.$btn.show().blur();
						} else {
							self.$btnWrapper.remove();
						}

						// Carousel
						$(function() {
							$('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual)').each(function() {
								var $this = $(this),
									opts;

								var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
								if (pluginOptions)
									opts = pluginOptions;

								$this.themePluginCarousel(opts);
							});
						});

						self.$loader.removeClass('portfolio-load-more-loader-showing').hide();

					}, 1000);

				}
			});

		}

	}

	if($('#portfolioLoadMoreWrapper').get(0)) {
		portfolioLoadMore.build();
	}

	/*
	Pagination
	*/
	var portfolioPagination = {

		pages: 0,
		$wrapper: $('#portfolioPaginationWrapper'),
		$filter: $('#portfolioPaginationFilter'),
		$pager: $('#portfolioPagination'),

		init: function() {

			var self = this;

			self.$filter.on('filtered', function(event, laidOutItems) {
				self.build();
				self.$filter.find('.active').trigger('click');
			});

		},

		calcPages: function() {

			var self = this,
				filter = self.$wrapper.attr('data-filter'),
				itemsPerPage = parseInt(self.$wrapper.attr('data-items-per-page')),
				$activeItems = self.$wrapper.find(filter + '.isotope-item');

			self.$wrapper.find('.isotope-item').removeAttr('data-page-rel');

			$activeItems.each(function(i) {
				var itemPage = Math.ceil((i+1)/itemsPerPage);

				$(this).attr('data-page-rel', ((itemPage == 0) ? 1 : itemPage));

				if (itemPage > 1) {
					$(this).hide();
				}
			});

			self.$wrapper.isotope('layout');

			return Math.ceil($activeItems.length/itemsPerPage);
		},

		build: function() {

			var self = this;

			self.pages = self.calcPages();

			self.$wrapper.removeAttr('data-current-page');

			self.$pager.empty().unbind();

			if(self.pages <= 1) {

				return;

			} else {

				self.$wrapper.attr('data-current-page', 1);

				self.$pager.bootpag({
					total: self.pages,
					page: 1,
					next: '<i class="fas fa-angle-right"></i>',
					prev: '<i class="fas fa-angle-left"></i>'
				}).on('page', function(event, num) {
					self.$wrapper.attr('data-current-page', num);
					self.$filter.find('.active').trigger('click');
				});

			}

			self.$filter.find('.active').trigger('click');

			self.$pager.find('li').addClass('page-item');
			self.$pager.find('a').addClass('page-link');

		}

	}

	if($('#portfolioPagination').get(0)) {
		portfolioPagination.init();
	}

	/*
	Combination Filters
	*/
	if($('#combinationFilters').get(0)) {

		$(window).on('load', function() {

			setTimeout(function() {

				var $grid = $('.portfolio-list').isotope({
					itemSelector: '.isotope-item',
					layoutMode: 'masonry',
					filter: '*',
					hiddenStyle: {
						opacity: 0
					},
					visibleStyle: {
						opacity: 1
					},
					stagger: 30,
					isOriginLeft: ($('html').attr('dir') == 'rtl' ? false : true)
				});

				var filters = {},
					$loader = $('.sort-destination-loader');

				$('.filters').on('click', 'a', function(e) {
					
					e.preventDefault();
					
					var $this = $(this);

					var $buttonGroup = $this.parents('.portfolio-filter-group');
					var filterGroup = $buttonGroup.attr('data-filter-group');
					
					filters[filterGroup] = $this.parent().attr('data-option-value');
					
					var filterValue = concatValues(filters);
					
					$grid.isotope({
						filter: filterValue
					});
				});

				$('.portfolio-filter-group').each(function(i, buttonGroup) {
					var $buttonGroup = $(buttonGroup);
					$buttonGroup.on('click', 'a', function() {
						$buttonGroup.find('.active').removeClass('active');
						$(this).parent().addClass('active');
						$(this).addClass('active');
					});
				});

				var concatValues = function(obj) {
					var value = '';
					for (var prop in obj) {
						value += obj[prop];
					}
					return value;
				}

				$(window).on('resize', function() {
					setTimeout(function() {
						$grid.isotope('layout');
					}, 300);
				});

				if ($loader) {
					$loader.removeClass('sort-destination-loader-showing');

					setTimeout(function() {
						$loader.addClass('sort-destination-loader-loaded');
					}, 500);
				}

			}, 1000);

		});

	}

}).apply(this, [jQuery]);
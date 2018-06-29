(function(window) {
	function getTransformY(value) {
		return Number(value.substring(7).split(',')[5].split(')')[0]);
	}

	function getRotateX(value) {
		return Number(value.split('rotateX(')[1].split('deg)')[0]);
	}

	var config = {
		yearMin: 1940,
		yearMax: 2021,
		currentDate: '2000-01-01'
	};

	var Calendar = {
		startX: 0,
		startY: 0,
		currentX: 0,
		currentY: 0,

		init: function() {
			this.createCalendarItem();
			this.setCurrentData();
			this.bindEvents();
			this.setLayout();
		},

		setLayout: function() {
			var yearItems = document.getElementsByClassName('calendar-year')[0].getElementsByClassName('year-item'),
				currentRotateX = 0,
				currentYear = 2000;

			for (var i = 0; i < yearItems.length; i++) {
				var item = yearItems[i],
					year = parseInt(item.innerHTML),
					distance = currentYear - year,
					rotateX = currentRotateX + distance * 18;

				rotateX = rotateX > 180 ? 180 : rotateX;
				rotateX = rotateX < -180 ? -180 : rotateX;

				item.style.transform = 'rotateX(' + rotateX + 'deg)';
			}
		},

		createCalendarItem: function() {
			this.createYearItem();
			this.createMonthItem();
			this.createDayItem();
		},

		setCurrentData: function() {
			var date = config.currentDate,
				dateItem = date.split('-'),
				year = dateItem[0],
				month = dateItem[1],
				day = dateItem[2];

			this.setCurrentYear(year);
			this.setCurrentMonth(month);
			this.setCurrentDay(day);
			this.setCurrentDateInNumber(year, month, day);

		},

		setCurrentDateInNumber: function(currentYear, currentYmonth, currentDay) {
			var year = document.getElementById('current-year'),
				month = document.getElementById('current-month'),
				day = document.getElementById('current-day');

			year.innerHTML = currentYear;
			month.innerHTML = currentYmonth;
			day.innerHTML = currentDay;

		},

		setCurrentYear: function(year) {
			var calendarYear = document.getElementsByClassName('calendar-year')[0],
				yearMin = config.yearMin,
				initialYear = yearMin + 3,
				transformY = (initialYear - year) * 36;

			calendarYear.style.transform = 'translate3d(0, ' + transformY + 'px, 0)';

		},

		setCurrentMonth: function(month) {
			var calendarMonth = document.getElementsByClassName('calendar-month')[0],
				initialMonth = 4,
				transformY = (initialMonth - month) * 36;

			calendarMonth.style.transform = 'translate3d(0, ' + transformY + 'px, 0)';

		},

		setCurrentDay: function(day) {
			var calendarDay = document.getElementsByClassName('calendar-day')[0],
				initialDay = 4,
				transformY = (initialDay - day) * 36;

			calendarDay.style.transform = 'translate3d(0, ' + transformY + 'px, 0)';

		},

		createYearItem: function() {
			var year = document.getElementsByClassName('calendar-year')[0],
				html = '',
				yearMin = config.yearMin,
				yearMax = config.yearMax;

			for (var i = yearMin; i <= yearMax; i++) {
				html = html + '<div class = "year-item">' + i + '</div>';
			}

			year.innerHTML = html;
		},

		createMonthItem: function() {
			var year = document.getElementsByClassName('calendar-month')[0],
				html = '';

			for (var i = 1; i < 13; i++) {
				html = html + '<div class = "year-item">' + i + '</div>';
			}

			year.innerHTML = html;
		},

		createDayItem: function() {
			var year = document.getElementsByClassName('calendar-day')[0],
				html = '';

			for (var i = 1; i < 32; i++) {
				html = html + '<div class = "year-item">' + i + '</div>';
			}

			year.innerHTML = html;
		},

		bindEvents: function() {
			this.bindCalendarYearEvent();
			this.bindTransitionEndEvent();
		},

		bindTransitionEndEvent: function() {
			var calendar = document.getElementsByClassName('custom-calendar')[0];

			calendar.addEventListener('transitionend', this.transitionEndHandler);
		},

		transitionEndHandler: function() {
			console.log(event);
		},

		bindCalendarYearEvent: function() {
			var _this = this,
				year = document.getElementsByClassName('calendar-year')[0],
				month = document.getElementsByClassName('calendar-month')[0],
				day = document.getElementsByClassName('calendar-day')[0];

			year.addEventListener('touchstart', this.yearTouchStartHandler);
			year.addEventListener('touchmove', this.yearTouchMoveHandler);
			year.addEventListener('touchend', function() {
				_this.yearTouchEndHandler(event, 'year');
			});
			month.addEventListener('touchstart', this.yearTouchStartHandler);
			month.addEventListener('touchmove', this.yearTouchMoveHandler);
			month.addEventListener('touchend', function() {
				_this.yearTouchEndHandler(event, 'month');
			});
			day.addEventListener('touchstart', this.yearTouchStartHandler);
			day.addEventListener('touchmove', this.yearTouchMoveHandler);
			day.addEventListener('touchend', function() {
				_this.yearTouchEndHandler(event, 'day');
			});

		},

		yearTouchStartHandler: function() {
			var _this = Calendar,
				touch = event.targetTouches[0];

			_this.currentX = touch.clientX;
			_this.currentY = touch.clientY;
			console.log(event);
		},

		yearTouchMoveHandler: function() {
			event.preventDefault();

			var _this = Calendar,
				touch = event.targetTouches[0],
				clientX = touch.clientX,
				clientY = touch.clientY,
				year = event.target.parentElement,
				transform = window.getComputedStyle(year).transform,
				transformY = transform == 'none' ? 0 : getTransformY(transform),
				distanceY = clientY - _this.currentY + transformY;

			year.style.transform = 'translate3d(0, ' + distanceY + 'px, 0)';
			year.style.transitionDuration = '3ms';
			// _this.changeLayoutWhenMove(clientY - _this.currentY);
			_this.currentX = clientX;
			_this.currentY = clientY;

		},

		yearTouchEndHandler: function(event, type) {
			var _this = Calendar,
				touch = event.changedTouches[0],
				year = event.target.parentElement,
				transform = window.getComputedStyle(year).transform,
				transformY = transform == 'none' ? 0 : Math.round(getTransformY(transform)),
				remainder = Math.abs(transformY) % 36,
				extraLength, distanceY;

			extraLength = remainder > 18 ? (remainder - 36) : remainder;

			if (transformY < 0) {
				distanceY = transformY + extraLength;
			} else {
				distanceY = transformY - extraLength;
			}

			_this.setChangedData(type, distanceY);
			year.style.transform = 'translate3d(0, ' + distanceY + 'px, 0)';
			year.style.transitionDuration = '100ms';

		},

		changeLayoutWhenMove: function(distance) {
			var yearItems = document.getElementsByClassName('calendar-year')[0].getElementsByClassName('year-item'),
				currentRotateX = 0,
				currentYear = 2000;

			for (var i = 0; i < yearItems.length; i++) {
				var item = yearItems[i],
					rotateX = getRotateX(item.style.transform),
					currentRotateX = rotateX - distance / 2

				item.style.transform = 'rotateX(' + currentRotateX + 'deg)';
			}
		},

		setChangedData: function(type, distanceY) {

			if (type == 'year') {
				var currentYear = document.getElementById('current-year');
				currentYear.innerHTML = config.yearMin + 3 - distanceY / 36;
				month = document.getElementById('current-month'),
					day = document.getElementById('current-day');
			} else if (type == 'month') {
				var currentMonth = document.getElementById('current-month');
				currentMonth.innerHTML = 4 - distanceY / 36;
			} else {
				var currentDay = document.getElementById('current-day');
				currentDay.innerHTML = 4 - distanceY / 36;
			}
		}

	};
	Calendar.init();
})(window);
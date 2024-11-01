//table 동적 업데이트 Ajax용 / 간격 탭간격으로 수정, snake -> camel로 변수명 수정, ₩₩ -> "" + 로 수정

$(document).ready(function() {
	// 페이지 로드 시 테이블을 초기화
	loadTable();

	// 검색 버튼 클릭 시
	$('#searchButton').click(function() {
		loadTable();
	});
	
	// 초기화 버튼 클릭 시
	$('#resetButton').on('click', function() {
		$('#searchInput').val('');
		$('#startDate').val('');
		$('#endDate').val('');
		$('#input[name="dateSelect"]').prop('checked', false);
		$('.radioContainer label').css('color', 'white');
		loadTable();
	});

	// 테이블 데이터를 Ajax로 가져오기
	function loadTable() {
		var category = $('#searchCategory').val();
		var categoryDate = $('#dateCategory').val();
		var keyword = $('#searchInput').val();
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();

		$.ajax({
			url: "/heehee/admin/searchAllUser",
			method: 'GET',
			data: { 'category': category, 
					'categoryDate': categoryDate,
					'keyword': keyword, 
					'startDate': startDate, 
					'endDate': endDate 
					},
			success: function(data) {
				var tableBody = $('#tableBody');
				tableBody.empty();

				data.forEach(function(item) {
					var createDatePas = new Date(item.createDate).toLocaleDateString();
					var createDateRev = createDatePas.substring(0, createDatePas.length -1).replaceAll(". ", "-");
					
					var row = 
						"<tr>" + 
							"<td>" + item.name + "</td>" + 
							"<td>" + item.id + "</td>" + 
							"<td>" + item.email + "</td>" + 
							"<td>" + item.phoneNum + "</td>" + 
							"<td>" + item.address + "</td>" + 
							"<td>" + createDateRev + "</td>" + 
						"</tr>";
					tableBody.append(row);
				});
			},
			error: function(xhr, status, error) {
				console.log('AJAX request failed:', status, error);
				alert('데이터를 가져오는 중 오류가 발생했습니다.');
			}
		});
	};

	// 라디오 버튼 클릭 시 날짜 필터 설정
	$('input[name="dateSelect"]').click(function() {
		var today = new Date();
		var startDate, endDate;
		
	// label.radioLabel 인라인 스타일 제거
    $('.radioContainer label').each(function() {
	$(this).css('color', ''); // 인라인 스타일 제거
	});
		
		if (this.id === 'today') {
			startDate = endDate = today.toISOString().split('T')[0];
		} else if (this.id === 'week') {
			startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
			endDate = new Date().toISOString().split('T')[0];
		} else if (this.id === 'lastMonth') {
			var firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() -1, 2);
			var lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			startDate = firstDayLastMonth.toISOString().split('T')[0];
			endDate = lastDayLastMonth.toISOString().split('T')[0];
		} else if (this.id === 'oneMonth') {
			startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
			endDate = new Date().toISOString().split('T')[0];
		} else if (this.id === 'threeMonth') {
			startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
			endDate = new Date().toISOString().split('T')[0];
		}

		$('#startDate').val(startDate);
		$('#endDate').val(endDate);
			loadTable();
	});
 });
 
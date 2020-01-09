$(document).ready(function() {
	
	var qrcode = new QRCode("qrcode", {
		width: 90,
		height: 90
	});		

	var link;
	
	function getFeedExame() {
	
		$.getJSON('https://portfolio-mdb.herokuapp.com/api/exame/', function($data) {
	
			link = $data.link;			

			$("#titulo").html($data.title);
			$("#descricao").html($data.description);
			
			$('#loading').hide();
				
			makeCode();
			
			setTimeout(getFeedExame, 15000);
			
		}).done(function() {
		
			makeCode();
			$('#loading').hide();
		
		});	
		
	};

	function makeCode () {
	
		qrcode.makeCode(link);
		
	}

	getFeedExame();	
	
});
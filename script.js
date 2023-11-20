
let dchecker = document.getElementById('div_checker');
if (!dchecker){
	let div_checker = document.createElement('div');
	let btn_checker = document.createElement('button');
	let div_close = document.createElement('div');
	div_checker.id = "div_checker";
	div_close.id = "close";
	div_checker.style = "z-index: 1000;text-align: center;width: 300px;height: 50px;position: fixed;padding: 5px;background-color: rgb(238, 221, 255);border: 4px solid rgb(121, 34, 204);border-radius: 0px 50px;";
	div_close.style = "cursor: pointer;text-align: center;border: 4px solid rgb(121,34,204);left: 270px;width: 30px;height: 30px;position: fixed;top: 0px;background-color: rgb(238, 221, 255);border-radius: 20px;";
	div_close.innerHTML =  "<B>x</B>";
	btn_checker.innerHTML = "Перевірити ціни";
	btn_checker.id = "checkBtn";
	btn_checker.addEventListener('click',getPrice);	
	btn_checker.style = "text-align:center;padding: 5px;background-color:#ffffff;border:1px solid rgb(121, 34, 204);border-radius: 10px;";
	div_close.addEventListener('click',function (){document.getElementById('div_checker').remove();});	
	div_checker.append(div_close);
	div_checker.append(btn_checker); 
	document.body.prepend(div_checker);
}



function getPrice() {
    let warning = '⚠️';
	let linkarr = [['Монетки','?sourceType=620','🟡'],
				   ['Супер знижки','?sourceType=562','💰'],
				   ['Обмежені пропозиції','?sourceType=561','💸'],
				  ];
	const req = new XMLHttpRequest();	
	let url = window.location.href;
	let mainurl = /^(.*)\?/gm.exec(url);
	linkarr.forEach(function(data){
		req.open("GET", mainurl[1]+data[1], false);
		req.send();
		let strreg = /data: {([\s\S]*?)};/gm.exec(req.response);
		let	jstr = '{'+strreg[1];
		let jobj = JSON.parse(jstr);
		let foundprice = jobj['priceComponent']['discountPrice']['actCurrencyFormatPrice']; 
			if (foundprice === undefined) {foundprice = jobj['priceComponent']['origPrice']['multiCurrencyFormatPrice'];}
		data[3] = foundprice;
	
		let shippingFeeText =	jobj['webGeneralFreightCalculateComponent']['shippingFeeText']; //доставка
		let shipping =	jobj.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.formattedPreAmount
		let coinDiscount = 	jobj['priceComponent']['coinDiscountText']; //монетки скидка???
		let limitTips = jobj['promotionComponent']['limitTips']
		data[5] = (coinDiscount === undefined) ? '' : coinDiscount.replace(/\D/g, '');
		if(	data[5]!== '')
			{
				data[16] = ` (- ${data[5]}% монетками)`;
			}
		data[15] = (limitTips === undefined) ? '' : warning;
		data[6] = shippingFeeText;
	
			});

		let msgblock = '';
		linkarr.forEach(function(data){
		let	coinprice = (data[16] === undefined) ? '' : data[16]
			msgblock += `${data[2]} ${data[15]} <a href="${mainurl[1] + data[1]}" target="_blank" style="color:red;">${data[0]}</a><br> 
						<b><i>Ціна</i></b>: ${data[3]} 	${coinprice} <br>
						<b><i>Доставка</i></b>: ${data[6]}<br><br>`;
				});
		
        console.log(msgblock);	
        let dchecker = document.getElementById('div_checker');
        dchecker.style.height = '300px';
        dchecker.style.width = '450px';
        dchecker.style.textAlign = 'Left';
        dchecker.innerHTML = msgblock;
		let div_close = document.createElement('div');
		div_close.id = "close";
		div_close.style = "cursor: pointer;text-align: center;border: 4px solid rgb(121,34,204);left: 420px;width: 30px;height: 30px;position: fixed;top: 0px;background-color: rgb(238, 221, 255);border-radius: 20px;";
		div_close.innerHTML =  "<B>x</B>";
		div_close.addEventListener('click',function (){document.getElementById('div_checker').remove();});	
		dchecker.append(div_close);
	
	}